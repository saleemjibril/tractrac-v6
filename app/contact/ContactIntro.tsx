import { CONTACT_EMAIL, CONTACT_PHONE } from "./contactData";
import styles from "./contact.module.css";

function EmailIcon() {
  return (
    <svg className={styles.contactIcon} width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4-8 5L4 8V6l8 5 8-5z"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className={styles.contactIcon} width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M6.62 10.79a15.91 15.91 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1C10.29 22 2 13.71 2 3.5a1 1 0 0 1 1-1H6.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01z"
      />
    </svg>
  );
}

export default function ContactIntro() {
  return (
    <div>
      <h2 className={styles.introTitle}>Partnerships &amp; support</h2>
      <p className={styles.introCopy}>
        TracTrac is open to partnerships with organizations that share our
        vision of a more mechanized and sustainable Nigeria. Reach out by email,
        phone, or the form—we typically respond within a few business days.
      </p>
      <hr className={styles.introRule} />
      <div className={styles.contactMethods}>
        <div className={styles.contactMethod}>
          <p className={styles.contactMethodLabel}>Email</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className={styles.contactMethodValue}>
            <EmailIcon />
            {CONTACT_EMAIL}
          </a>
        </div>
        <div className={styles.contactMethod}>
          <p className={styles.contactMethodLabel}>Phone</p>
          <a href={`tel:${CONTACT_PHONE}`} className={styles.contactMethodValue}>
            <PhoneIcon />
            {CONTACT_PHONE}
          </a>
        </div>
      </div>
    </div>
  );
}
