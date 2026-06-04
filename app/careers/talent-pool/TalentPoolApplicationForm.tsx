"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import styles from "./talentPool.module.css";

const DEGREE_OPTIONS = [
  "First Class",
  "Second Class Upper",
  "Second Class Lower",
] as const;

const CV_TYPES = [".pdf", ".doc", ".docx"];
const CERT_TYPES = [".pdf", ".doc", ".docx"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

function getExtension(name: string) {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot).toLowerCase() : "";
}

function isAllowedType(file: File, allowed: string[]) {
  return allowed.includes(getExtension(file.name));
}

type DropzoneProps = {
  id: string;
  label: string;
  hint: string;
  allowedLabel: string;
  file: File | null;
  error?: string;
  onSelect: (file: File | null) => void;
  onInvalid?: (message: string) => void;
  allowedExtensions: string[];
};

function FileDropzone({
  id,
  label,
  hint,
  allowedLabel,
  file,
  error,
  onSelect,
  onInvalid,
  allowedExtensions,
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const pickFile = useCallback(
    (picked: File | null) => {
      if (!picked) {
        onSelect(null);
        return;
      }
      if (picked.size > MAX_FILE_BYTES) {
        onInvalid?.("File must be 10 MB or less.");
        onSelect(null);
        return;
      }
      if (!isAllowedType(picked, allowedExtensions)) {
        onInvalid?.(`Allowed type(s): ${allowedExtensions.join(", ")}`);
        onSelect(null);
        return;
      }
      onSelect(picked);
    },
    [allowedExtensions, onInvalid, onSelect]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0] ?? null;
    pickFile(dropped);
  };

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label} <span className={styles.required}>*</span>
      </label>
      <div
        role="button"
        tabIndex={0}
        className={`${styles.dropzone} ${dragOver ? styles.dropzoneActive : ""} ${
          file ? styles.dropzoneHasFile : ""
        }`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <p className={styles.dropzoneTitle}>Drop files here or click to upload</p>
        <p className={styles.dropzoneHint}>{hint}</p>
        <p className={styles.dropzoneMeta}>{allowedLabel}</p>
        {file && <p className={styles.fileName}>{file.name}</p>}
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        className={styles.hiddenInput}
        accept={allowedExtensions.join(",")}
        onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
      />
      {error && <p className={styles.fieldError}>{error}</p>}
    </div>
  );
}

export default function TalentPoolApplicationForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [degreeClass, setDegreeClass] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [certificate, setCertificate] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const validate = () => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (fullName.trim().length < 2) errors.fullName = "Please enter your full name.";
    if (!emailRegex.test(email.trim())) errors.email = "Please enter a valid email.";
    if (phone.trim().length < 7) errors.phone = "Please enter a valid phone number.";
    if (!degreeClass) errors.degreeClass = "Please select your class of degree.";
    if (coverLetter.trim().length < 30)
      errors.coverLetter = "Cover letter must be at least 30 characters.";
    if (!resume) errors.resume = "Please upload your CV or resume.";
    else if (!isAllowedType(resume, CV_TYPES)) errors.resume = "CV must be PDF, DOC, or DOCX.";
    else if (resume.size > MAX_FILE_BYTES) errors.resume = "CV must be 10 MB or less.";
    if (!certificate) errors.certificate = "Please upload your certificate or statement of result.";
    else if (!isAllowedType(certificate, CERT_TYPES))
      errors.certificate = "Certificate must be PDF, DOC, or DOCX.";
    else if (certificate.size > MAX_FILE_BYTES)
      errors.certificate = "Certificate must be 10 MB or less.";
    if (!consent) errors.consent = "You must agree before submitting.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setStatusMessage("");
    if (!validate() || !resume || !certificate) return;

    const body = new FormData();
    body.append("fullName", fullName.trim());
    body.append("email", email.trim());
    body.append("phone", phone.trim());
    body.append("degreeClass", degreeClass);
    body.append("coverLetter", coverLetter.trim());
    body.append("resume", resume);
    body.append("certificate", certificate);
    body.append("consent", "true");

    setSubmitting(true);
    try {
      const res = await fetch("/api/careers/talent-pool", {
        method: "POST",
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setStatusMessage(
          data.message ?? "Something went wrong. Please try again or email jobs@tractrac.co."
        );
        return;
      }
      setStatus("success");
      setStatusMessage(
        data.message ??
          "Thank you! Your application has been submitted. Our team will be in touch."
      );
      setFullName("");
      setEmail("");
      setPhone("");
      setDegreeClass("");
      setCoverLetter("");
      setResume(null);
      setCertificate(null);
      setConsent(false);
      setFieldErrors({});
    } catch {
      setStatus("error");
      setStatusMessage(
        "Unable to submit right now. Please try again or email jobs@tractrac.co."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Apply to join our talent pool</h2>

      {status === "success" && (
        <div className={`${styles.alert} ${styles.alertSuccess}`} role="status">
          {statusMessage}
        </div>
      )}
      {status === "error" && (
        <div className={`${styles.alert} ${styles.alertError}`} role="alert">
          {statusMessage}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="fullName">
            Full Name <span className={styles.required}>*</span>
          </label>
          <input
            id="fullName"
            className={`${styles.input} ${fieldErrors.fullName ? styles.inputError : ""}`}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />
          {fieldErrors.fullName && (
            <p className={styles.fieldError}>{fieldErrors.fullName}</p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            Email <span className={styles.required}>*</span>
          </label>
          <input
            id="email"
            type="email"
            className={`${styles.input} ${fieldErrors.email ? styles.inputError : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {fieldErrors.email && <p className={styles.fieldError}>{fieldErrors.email}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">
            Phone <span className={styles.required}>*</span>
          </label>
          <input
            id="phone"
            type="tel"
            className={`${styles.input} ${fieldErrors.phone ? styles.inputError : ""}`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
          {fieldErrors.phone && <p className={styles.fieldError}>{fieldErrors.phone}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="degreeClass">
            Class of degree <span className={styles.required}>*</span>
          </label>
          <select
            id="degreeClass"
            className={`${styles.select} ${fieldErrors.degreeClass ? styles.selectError : ""}`}
            value={degreeClass}
            onChange={(e) => setDegreeClass(e.target.value)}
          >
            <option value="">Select class of degree</option>
            {DEGREE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {fieldErrors.degreeClass && (
            <p className={styles.fieldError}>{fieldErrors.degreeClass}</p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="coverLetter">
            Cover Letter <span className={styles.required}>*</span>
          </label>
          <textarea
            id="coverLetter"
            className={`${styles.textarea} ${fieldErrors.coverLetter ? styles.textareaError : ""}`}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          {fieldErrors.coverLetter && (
            <p className={styles.fieldError}>{fieldErrors.coverLetter}</p>
          )}
        </div>

        <FileDropzone
          id="resume"
          label="Upload CV / Resume"
          hint="Maximum allowed file size is 10 MB."
          allowedLabel={`Allowed type(s): ${CV_TYPES.join(", ")}`}
          file={resume}
          error={fieldErrors.resume}
          onSelect={(f) => {
            setResume(f);
            setFieldErrors((prev) => {
              const next = { ...prev };
              delete next.resume;
              return next;
            });
          }}
          onInvalid={(msg) => setFieldErrors((prev) => ({ ...prev, resume: msg }))}
          allowedExtensions={CV_TYPES}
        />

        <FileDropzone
          id="certificate"
          label="Upload Certificate / Statement of result"
          hint="Maximum allowed file size is 10 MB."
          allowedLabel={`Allowed type(s): ${CERT_TYPES.join(", ")}`}
          file={certificate}
          error={fieldErrors.certificate}
          onSelect={(f) => {
            setCertificate(f);
            setFieldErrors((prev) => {
              const next = { ...prev };
              delete next.certificate;
              return next;
            });
          }}
          onInvalid={(msg) =>
            setFieldErrors((prev) => ({ ...prev, certificate: msg }))
          }
          allowedExtensions={CERT_TYPES}
        />

        <label className={styles.consent}>
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            By using this form you agree with the storage and handling of your data
            by TracTrac. See our{" "}
            <Link href="/privacy-policy">Privacy Policy</Link>.{" "}
            <span className={styles.required}>*</span>
          </span>
        </label>
        {fieldErrors.consent && <p className={styles.fieldError}>{fieldErrors.consent}</p>}

        <button type="submit" className={styles.submitBtn} disabled={submitting}>
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </form>
    </div>
  );
}
