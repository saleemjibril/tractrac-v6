import { NextResponse } from "next/server";

export const runtime = "nodejs";

const CV_TYPES = [".pdf", ".doc", ".docx"];
const CERT_TYPES = [".pdf", ".doc", ".docx"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const UPLOAD_FOLDER = "careers";
const TALENT_POOL_SOURCE = "tractrac-careers-talent-pool";
const TALENT_POOL_POSITION = "Talent Pool";

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

function isBlobLike(value: unknown): value is Blob & { name?: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "size" in value &&
    typeof (value as Blob).arrayBuffer === "function"
  );
}

function getUploadName(entry: Blob & { name?: string }): string {
  if ("name" in entry && typeof entry.name === "string" && entry.name.trim()) {
    return entry.name;
  }
  return "upload";
}

type UploadPart = {
  name: string;
  type: string;
  size: number;
  buffer: ArrayBuffer;
};

async function parseUpload(
  entry: FormDataEntryValue | null,
  allowed: string[]
): Promise<UploadPart | null> {
  if (!entry || typeof entry === "string" || !isBlobLike(entry)) return null;
  const name = getUploadName(entry);
  if (!allowed.includes(getExtension(name)) || entry.size > MAX_FILE_BYTES) {
    return null;
  }
  return {
    name,
    type: entry.type || "application/octet-stream",
    size: entry.size,
    buffer: await entry.arrayBuffer(),
  };
}

function getTracTracApiBase(): string {
  return (
    process.env.CAREERS_TALENT_POOL_API_URL?.trim() ||
    process.env.TRACTRAC_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_URL?.trim() ||
    "https://api.tractrac.co/api/v1"
  ).replace(/\/$/, "");
}

function mapDegreeClass(label: string): string | null {
  return DEGREE_CLASS_TO_API[label] ?? null;
}

/** Response shape from POST /api/v1/uploads/files */
type TracTracFileUploadResponse = {
  success?: boolean;
  message?: string;
  url?: string;
  filename?: string;
  folder?: string;
};

type UploadedFileRef = {
  url: string;
  filename: string;
};

function parseFileUploadResponse(data: unknown): UploadedFileRef | null {
  if (!data || typeof data !== "object") return null;

  const record = data as TracTracFileUploadResponse;
  if (record.success === false) return null;

  const url = typeof record.url === "string" ? record.url.trim() : "";
  if (!url) return null;

  const filename =
    typeof record.filename === "string" && record.filename.trim()
      ? record.filename.trim()
      : url.split("/").pop() || "upload";

  return { url, filename };
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
  resume: UploadPart;
  certificate: UploadPart;
};

async function validateForm(
  form: FormData
): Promise<ValidatedTalentPoolPayload | NextResponse> {
  const fullName = String(form.get("fullName") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const degreeClassLabel = String(form.get("degreeClass") ?? "").trim();
  const coverLetter = String(form.get("coverLetter") ?? "").trim();
  const consent = form.get("consent") === "true";

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

  const resume = await parseUpload(form.get("resume"), CV_TYPES);
  if (!resume) {
    return NextResponse.json(
      { message: "Please upload a valid CV (PDF, DOC, or DOCX, max 10 MB)." },
      { status: 400 }
    );
  }

  const certificate = await parseUpload(form.get("certificate"), CERT_TYPES);
  if (!certificate) {
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

function buildFileUploadFormData(file: UploadPart, folder: string): FormData {
  const outbound = new FormData();
  outbound.append("file", new Blob([file.buffer], { type: file.type }), file.name);
  outbound.append("folder", folder);
  return outbound;
}

/**
 * Upload a document via POST /uploads/files (see api.tractrac.co docs).
 * Same endpoint pattern as admin-v6 mediaUploadService / asset-management file upload proxy.
 */
async function uploadFileToTracTrac(
  file: UploadPart,
  folder: string = UPLOAD_FOLDER
): Promise<UploadedFileRef | null> {
  const uploadEndpoint = `${getTracTracApiBase()}/uploads/files`;
  const res = await fetch(uploadEndpoint, {
    method: "POST",
    body: buildFileUploadFormData(file, folder),
  });

  const bodyText = await res.text();
  if (!res.ok) {
    console.error("[careers/talent-pool] file upload failed", res.status, bodyText);
    return null;
  }

  try {
    return parseFileUploadResponse(JSON.parse(bodyText));
  } catch {
    console.error("[careers/talent-pool] invalid upload response", bodyText);
    return null;
  }
}

function buildJobApplicationBody(
  payload: ValidatedTalentPoolPayload,
  resume: UploadedFileRef,
  certificate: UploadedFileRef
) {
  return {
    full_name: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    position_applied_for: TALENT_POOL_POSITION,
    degree_class: payload.degreeClassApi,
    job_posting_id: null,
    cover_letter: payload.coverLetter,
    resume_url: resume.url,
    resume_filename: resume.filename,
    certificate_url: certificate.url,
    certificate_filename: certificate.filename,
    privacy_consent: payload.consent,
    source: TALENT_POOL_SOURCE,
  };
}

async function submitJobApplication(
  payload: ValidatedTalentPoolPayload,
  resume: UploadedFileRef,
  certificate: UploadedFileRef
) {
  const url = `${getTracTracApiBase()}/job-applications`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(buildJobApplicationBody(payload, resume, certificate)),
  });
}

function buildWebhookFormData(
  payload: ValidatedTalentPoolPayload,
  resumeUrl: string,
  certificateUrl: string
): FormData {
  const outbound = new FormData();
  outbound.append("fullName", payload.fullName);
  outbound.append("email", payload.email);
  outbound.append("phone", payload.phone);
  outbound.append("degreeClass", payload.degreeClassLabel);
  outbound.append("coverLetter", payload.coverLetter);
  outbound.append("resumeUrl", resumeUrl);
  outbound.append("certificateUrl", certificateUrl);
  outbound.append("source", TALENT_POOL_SOURCE);
  outbound.append("consent", payload.consent ? "true" : "false");
  return outbound;
}

/** Optional legacy webhook; used only when `CAREERS_TALENT_POOL_WEBHOOK_URL` is set. */
async function forwardToWebhook(
  payload: ValidatedTalentPoolPayload,
  resumeUrl: string,
  certificateUrl: string
) {
  const webhook = process.env.CAREERS_TALENT_POOL_WEBHOOK_URL?.trim();
  if (!webhook) return null;

  return fetch(webhook, {
    method: "POST",
    body: buildWebhookFormData(payload, resumeUrl, certificateUrl),
  });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const validated = await validateForm(form);
    if (validated instanceof NextResponse) return validated;

    const resume = await uploadFileToTracTrac(validated.resume);
    if (!resume) {
      return NextResponse.json(
        {
          message:
            "We could not upload your CV. Please try again or email jobs@tractrac.co.",
        },
        { status: 502 }
      );
    }

    const certificate = await uploadFileToTracTrac(validated.certificate);
    if (!certificate) {
      return NextResponse.json(
        {
          message:
            "We could not upload your certificate. Please try again or email jobs@tractrac.co.",
        },
        { status: 502 }
      );
    }

    const webhookRes = await forwardToWebhook(validated, resume.url, certificate.url);
    if (webhookRes) {
      if (!webhookRes.ok) {
        return NextResponse.json(
          {
            message:
              "We could not process your application. Please try again or email jobs@tractrac.co.",
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

    const apiRes = await submitJobApplication(validated, resume, certificate);
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
  } catch (error) {
    console.error("[careers/talent-pool]", error);
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
