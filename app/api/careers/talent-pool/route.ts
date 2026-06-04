import { NextResponse } from "next/server";

export const runtime = "nodejs";

const CV_TYPES = [".pdf", ".doc", ".docx"];
const CERT_TYPES = [".pdf", ".doc", ".docx"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

/** Form labels → API `DegreeClass` enum values. */
const DEGREE_CLASS_TO_API: Record<string, string> = {
  "First Class": "first_class",
  "Second Class Upper": "second_class_upper",
  "Second Class Lower": "second_class_lower",
};

function getExtension(name: string) {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot).toLowerCase() : "";
}

function isAllowed(file: File, allowed: string[]) {
  return allowed.includes(getExtension(file.name)) && file.size <= MAX_FILE_BYTES;
}

function getTracTracApiBase(): string {
  return (
    process.env.CAREERS_TALENT_POOL_API_URL?.trim() ||
    process.env.TRACTRAC_API_BASE_URL?.trim() ||
    "https://api.tractrac.co/api/v1"
  ).replace(/\/$/, "");
}

function mapDegreeClass(label: string): string | null {
  return DEGREE_CLASS_TO_API[label] ?? null;
}

async function parseApiErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) {
      const parts = data.detail
        .map((entry: { msg?: string; loc?: unknown[] }) => {
          const field = Array.isArray(entry.loc) ? entry.loc[entry.loc.length - 1] : "";
          return entry.msg ? `${field ? `${field}: ` : ""}${entry.msg}` : "";
        })
        .filter(Boolean);
      if (parts.length) return parts.join(" ");
    }
    if (typeof data.message === "string") return data.message;
  } catch {
    /* ignore */
  }
  return "Something went wrong. Please try again or email jobs@tractrac.co.";
}

type ValidatedTalentPoolPayload = {
  fullName: string;
  email: string;
  phone: string;
  degreeClassLabel: string;
  degreeClassApi: string;
  coverLetter: string;
  consent: boolean;
  resume: File;
  certificate: File;
};

function validateForm(form: FormData): ValidatedTalentPoolPayload | NextResponse {
  const fullName = String(form.get("fullName") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const degreeClassLabel = String(form.get("degreeClass") ?? "").trim();
  const coverLetter = String(form.get("coverLetter") ?? "").trim();
  const consent = form.get("consent") === "true";
  const resume = form.get("resume");
  const certificate = form.get("certificate");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (fullName.length < 2) {
    return NextResponse.json({ message: "Please enter a valid full name." }, { status: 400 });
  }
  if (!emailRegex.test(email)) {
    return NextResponse.json({ message: "Please enter a valid email." }, { status: 400 });
  }
  if (phone.length < 7) {
    return NextResponse.json({ message: "Please enter a valid phone number." }, { status: 400 });
  }

  const degreeClassApi = mapDegreeClass(degreeClassLabel);
  if (!degreeClassApi) {
    return NextResponse.json({ message: "Please select a class of degree." }, { status: 400 });
  }

  if (coverLetter.length < 30) {
    return NextResponse.json(
      { message: "Cover letter must be at least 30 characters." },
      { status: 400 }
    );
  }
  if (!consent) {
    return NextResponse.json({ message: "Consent is required." }, { status: 400 });
  }
  if (!(resume instanceof File) || !isAllowed(resume, CV_TYPES)) {
    return NextResponse.json(
      { message: "Please upload a valid CV (PDF, DOC, or DOCX, max 10 MB)." },
      { status: 400 }
    );
  }
  if (!(certificate instanceof File) || !isAllowed(certificate, CERT_TYPES)) {
    return NextResponse.json(
      {
        message:
          "Please upload a valid certificate (PDF, DOC, or DOCX, max 10 MB).",
      },
      { status: 400 }
    );
  }

  return {
    fullName,
    email,
    phone,
    degreeClassLabel,
    degreeClassApi,
    coverLetter,
    consent,
    resume,
    certificate,
  };
}

function buildTracTracFormData(payload: ValidatedTalentPoolPayload): FormData {
  const outbound = new FormData();
  outbound.append("full_name", payload.fullName);
  outbound.append("email", payload.email);
  outbound.append("phone", payload.phone);
  outbound.append("degree_class", payload.degreeClassApi);
  outbound.append("cover_letter", payload.coverLetter);
  outbound.append("privacy_consent", payload.consent ? "true" : "false");
  outbound.append("resume", payload.resume, payload.resume.name);
  outbound.append("certificate", payload.certificate, payload.certificate.name);
  return outbound;
}

async function forwardToTracTracTalentPool(payload: ValidatedTalentPoolPayload) {
  const url = `${getTracTracApiBase()}/careers/talent-pool`;
  return fetch(url, {
    method: "POST",
    body: buildTracTracFormData(payload),
  });
}

/** Optional legacy webhook; used only when `CAREERS_TALENT_POOL_WEBHOOK_URL` is set. */
async function forwardToWebhook(payload: ValidatedTalentPoolPayload) {
  const webhook = process.env.CAREERS_TALENT_POOL_WEBHOOK_URL?.trim();
  if (!webhook) return null;

  const outbound = new FormData();
  outbound.append("fullName", payload.fullName);
  outbound.append("email", payload.email);
  outbound.append("phone", payload.phone);
  outbound.append("degreeClass", payload.degreeClassLabel);
  outbound.append("coverLetter", payload.coverLetter);
  outbound.append("resume", payload.resume, payload.resume.name);
  outbound.append("certificate", payload.certificate, payload.certificate.name);
  outbound.append("source", "tractrac-careers-talent-pool");
  outbound.append("consent", payload.consent ? "true" : "false");

  return fetch(webhook, { method: "POST", body: outbound });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const validated = validateForm(form);
    if (validated instanceof NextResponse) return validated;

    const webhookRes = await forwardToWebhook(validated);
    if (webhookRes) {
      if (!webhookRes.ok) {
        return NextResponse.json(
          {
            message:
              "We could not process your upload. Please try again or email jobs@tractrac.co.",
          },
          { status: 502 }
        );
      }
      return NextResponse.json({
        status: "success",
        message:
          "Thank you! Your application has been submitted. Our team will be in touch.",
      });
    }

    const apiRes = await forwardToTracTracTalentPool(validated);
    if (!apiRes.ok) {
      const message = await parseApiErrorMessage(apiRes);
      const status = apiRes.status >= 400 && apiRes.status < 500 ? apiRes.status : 502;
      return NextResponse.json({ message }, { status });
    }

    let successMessage =
      "Thank you! Your application has been submitted. Our team will be in touch.";
    try {
      const data = await apiRes.json();
      if (typeof data.message === "string" && data.message.trim()) {
        successMessage = data.message.trim();
      }
    } catch {
      /* use default message */
    }

    return NextResponse.json({
      status: "success",
      message: successMessage,
    });
  } catch {
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
