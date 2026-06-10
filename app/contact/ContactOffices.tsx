import { OFFICES } from "./contactData";
import styles from "./contact.module.css";

function PinIcon() {
  return (
    <svg className={styles.contactIcon} width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
      />
    </svg>
  );
}

export default function ContactOffices() {
  return (
    <div className={styles.officeList}>
      {OFFICES.map((office) => (
        <article key={office.id} className={styles.officeCard}>
          <div className={styles.officeCardHeader}>
            <PinIcon />
            <h3 className={styles.officeName}>
              {office.name}
              {office.placeholder ? " (Coming soon)" : ""}
            </h3>
          </div>
          <p className={styles.officeAddress}>{office.address}</p>
        </article>
      ))}
    </div>
  );
}
