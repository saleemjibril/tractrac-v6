"use client";

import { useState } from "react";
import { useCollaborateMutation } from "@/redux/services/userApi";
import styles from "./contact.module.css";

type FormData = {
  name: string;
  email: string;
  message: string;
};

const initialForm: FormData = {
  name: "",
  email: "",
  message: "",
};

export default function ContactForm() {
  const [contact] = useCollaborateMutation();
  const [data, setData] = useState<FormData>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name as keyof FormData];
      return next;
    });
    setError(null);
  };

  const validate = () => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (data.name.trim().length < 3) errors.name = "Please enter a valid name.";
    if (!emailRegex.test(data.email.trim())) errors.email = "Please enter a valid email.";
    if (data.message.trim().length < 15)
      errors.message = "Message must be at least 15 characters.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (success) {
      setError("You have already contacted us. Please wait before trying again.");
      return;
    }

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await contact({
        name: data.name.trim(),
        email: data.email.trim(),
        message: data.message.trim(),
        type: "support",
      }).unwrap();

      if (response.status === "success") {
        setSuccess(true);
        setData(initialForm);
        setFieldErrors({});
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    } catch (err) {
      const apiError = err as { data?: { message?: string } };
      setError(apiError?.data?.message ?? "Unable to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Contact us</h2>

      {success && (
        <div className={`${styles.alert} ${styles.alertSuccess}`} role="status">
          Received—thanks for contacting us! We will get back to you soon.
        </div>
      )}
      {error && (
        <div className={`${styles.alert} ${styles.alertError}`} role="alert">
          {error}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            className={`${styles.input} ${fieldErrors.name ? styles.inputError : ""}`}
            value={data.name}
            onChange={handleChange}
            autoComplete="name"
            disabled={success}
          />
          {fieldErrors.name && <p className={styles.fieldError}>{fieldErrors.name}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-email">
            Email address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            className={`${styles.input} ${fieldErrors.email ? styles.inputError : ""}`}
            value={data.email}
            onChange={handleChange}
            autoComplete="email"
            disabled={success}
          />
          {fieldErrors.email && <p className={styles.fieldError}>{fieldErrors.email}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-message">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            className={`${styles.textarea} ${fieldErrors.message ? styles.textareaError : ""}`}
            value={data.message}
            onChange={handleChange}
            disabled={success}
          />
          {fieldErrors.message && (
            <p className={styles.fieldError}>{fieldErrors.message}</p>
          )}
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading || success}>
          {loading ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}
