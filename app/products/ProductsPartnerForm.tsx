"use client";

import { useState } from "react";
import { useCollaborateMutation } from "@/redux/services/userApi";
import TraxcelerateIcon from "../traxcelerate-product-page/TraxcelerateIcon";
import extras from "./productsMarketingExtras.module.css";

type FormData = {
  name: string;
  email: string;
  organization: string;
  positionInOrganization: string;
  phoneNumber: string;
  message: string;
};

const initialForm: FormData = {
  name: "",
  email: "",
  organization: "",
  positionInOrganization: "",
  phoneNumber: "",
  message: "",
};

type ProductsPartnerFormProps = {
  variant?: "join" | "partner";
};

export default function ProductsPartnerForm({ variant = "join" }: ProductsPartnerFormProps) {
  const [contact] = useCollaborateMutation();
  const [data, setData] = useState<FormData>(initialForm);
  const [countryCode, setCountryCode] = useState("234");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const title =
    variant === "partner" ? "Partner with TracTrac Plus" : "Join us to build the workforce";
  const subtitle =
    variant === "partner"
      ? "Tell us about your organisation and how you'd like to deploy or integrate TracTrac Plus."
      : "Governments, cooperatives, DFIs, and agribusinesses, share how you'd like to collaborate.";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    if (data.name.trim().length < 2) errors.name = "Please enter your name.";
    if (!emailRegex.test(data.email.trim())) errors.email = "Please enter a valid email.";
    if (data.organization.trim().length < 2) errors.organization = "Enter your organisation.";
    if (data.positionInOrganization.trim().length < 2) errors.positionInOrganization = "Enter your role.";
    if (data.phoneNumber.trim().length < 7) errors.phoneNumber = "Enter a valid phone number.";
    if (data.message.trim().length < 15) errors.message = "Please add at least 15 characters.";
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

    const composedMessage = [
      data.message.trim(),
      "",
      `Organization: ${data.organization.trim()}`,
      `Position: ${data.positionInOrganization.trim()}`,
      `Phone: +${countryCode}${data.phoneNumber.trim()}`,
      `Form: ${variant === "partner" ? "TracTrac Plus partner" : "Products partnership"}`,
    ].join("\n");

    setLoading(true);
    try {
      const response = await contact({
        name: data.name.trim(),
        email: data.email.trim(),
        message: composedMessage,
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
      setError(apiError?.data?.message ?? "Unable to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={extras.formSection} aria-labelledby="partner-form-heading">
      <div className={extras.formSectionInner}>
        <div className={extras.formCard}>
          <h2 id="partner-form-heading" className={extras.formTitle}>
            {title}
          </h2>
          <p className={extras.formSubtitle}>{subtitle}</p>

          {success && (
            <div className={`${extras.alert} ${extras.alertSuccess}`} role="status">
              Received. Thanks for reaching out. We will get back to you soon.
            </div>
          )}
          {error && (
            <div className={`${extras.alert} ${extras.alertError}`} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className={extras.formGrid}>
            <div className={extras.formGridTwo}>
              <div className={extras.field}>
                <label className={extras.label} htmlFor="partner-name">
                  Name
                </label>
                <input
                  id="partner-name"
                  name="name"
                  className={`${extras.input} ${fieldErrors.name ? extras.inputError : ""}`}
                  value={data.name}
                  onChange={handleChange}
                  disabled={success}
                />
                {fieldErrors.name && <p className={extras.fieldError}>{fieldErrors.name}</p>}
              </div>
              <div className={extras.field}>
                <label className={extras.label} htmlFor="partner-email">
                  Email
                </label>
                <input
                  id="partner-email"
                  name="email"
                  type="email"
                  className={`${extras.input} ${fieldErrors.email ? extras.inputError : ""}`}
                  value={data.email}
                  onChange={handleChange}
                  disabled={success}
                />
                {fieldErrors.email && <p className={extras.fieldError}>{fieldErrors.email}</p>}
              </div>
            </div>

            <div className={extras.formGridTwo}>
              <div className={extras.field}>
                <label className={extras.label} htmlFor="partner-org">
                  Organization
                </label>
                <input
                  id="partner-org"
                  name="organization"
                  className={`${extras.input} ${fieldErrors.organization ? extras.inputError : ""}`}
                  value={data.organization}
                  onChange={handleChange}
                  disabled={success}
                />
                {fieldErrors.organization && (
                  <p className={extras.fieldError}>{fieldErrors.organization}</p>
                )}
              </div>
              <div className={extras.field}>
                <label className={extras.label} htmlFor="partner-position">
                  Position
                </label>
                <input
                  id="partner-position"
                  name="positionInOrganization"
                  className={`${extras.input} ${fieldErrors.positionInOrganization ? extras.inputError : ""}`}
                  value={data.positionInOrganization}
                  onChange={handleChange}
                  disabled={success}
                />
                {fieldErrors.positionInOrganization && (
                  <p className={extras.fieldError}>{fieldErrors.positionInOrganization}</p>
                )}
              </div>
            </div>

            <div className={extras.field}>
              <label className={extras.label} htmlFor="partner-phone">
                Phone number
              </label>
              <div className={extras.phoneRow}>
                <select
                  className={extras.select}
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  aria-label="Country code"
                  disabled={success}
                >
                  <option value="234">+234</option>
                  <option value="233">+233</option>
                  <option value="254">+254</option>
                  <option value="27">+27</option>
                  <option value="1">+1</option>
                  <option value="44">+44</option>
                </select>
                <input
                  id="partner-phone"
                  name="phoneNumber"
                  className={`${extras.input} ${fieldErrors.phoneNumber ? extras.inputError : ""}`}
                  value={data.phoneNumber}
                  onChange={handleChange}
                  disabled={success}
                />
              </div>
              {fieldErrors.phoneNumber && (
                <p className={extras.fieldError}>{fieldErrors.phoneNumber}</p>
              )}
            </div>

            <div className={extras.field}>
              <label className={extras.label} htmlFor="partner-message">
                How do you want to support?
              </label>
              <textarea
                id="partner-message"
                name="message"
                className={`${extras.textarea} ${fieldErrors.message ? extras.textareaError : ""}`}
                value={data.message}
                onChange={handleChange}
                disabled={success}
              />
              {fieldErrors.message && (
                <p className={extras.fieldError}>{fieldErrors.message}</p>
              )}
            </div>

            <button type="submit" className={extras.submitBtn} disabled={loading || success}>
              {loading ? "Sending…" : "Submit"}
              {!loading && (
                <TraxcelerateIcon name="arr" size={16} color="#060C15" strokeWidth={2.2} />
              )}
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
