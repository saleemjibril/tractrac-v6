import Image from "next/image";
import styles from "./careers.module.css";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

const OFFICES = [
  {
    id: "abuja",
    name: "FCT Abuja Office",
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1758235395/WhatsApp_Image_2025-09-18_at_23.42.29_cpq5j0.jpg",
  },
  {
    id: "nasarawa",
    name: "Nasarawa State Office",
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1758235940/WhatsApp_Image_2025-09-18_at_23.49.47_bpvtav.jpg",
  },
];

export default function CareersLocations() {
  return (
    <section className={styles.locations} aria-labelledby="careers-locations-heading">
      <div className={styles.locationsInner}>
        <header className={styles.sectionHeaderCenter}>
          <span className={styles.sectionTag}>
            {/* <span className={styles.sectionTagDot} aria-hidden="true" /> */}
            <span>Our offices</span>
          </span>
          <h2 id="careers-locations-heading" className={styles.sectionTitle}>
            {bindTitleOrphans("Where are we located?")}
          </h2>
          <p className={styles.sectionSubtitle}>
            Along with our two offices, we have team members spread throughout
            the country.
          </p>
        </header>

        <div className={styles.locationsGrid}>
          {OFFICES.map((office) => (
            <figure key={office.id} className={styles.locationCard}>
              <div className={styles.locationImageWrap}>
                <Image
                  src={office.image}
                  alt={office.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.locationImage}
                />
              </div>
              <figcaption className={styles.locationCaption}>{office.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
