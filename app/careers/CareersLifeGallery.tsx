import Image from "next/image";
import styles from "./careers.module.css";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

const GALLERY_IMAGES = [
  "https://res.cloudinary.com/tractrac-global/image/upload/v1758235937/WhatsApp_Image_2025-09-18_at_23.50.39_fbbd4b.jpg",
  "https://res.cloudinary.com/tractrac-global/image/upload/v1758235938/WhatsApp_Image_2025-09-18_at_23.50.06_pthawc.jpg",
  "https://res.cloudinary.com/tractrac-global/image/upload/v1758235937/WhatsApp_Image_2025-09-18_at_23.50.40_1_elt91v.jpg",
  "https://res.cloudinary.com/tractrac-global/image/upload/v1758235941/WhatsApp_Image_2025-09-18_at_23.50.43_qkplde.jpg",
  "https://res.cloudinary.com/tractrac-global/image/upload/v1758235937/WhatsApp_Image_2025-09-18_at_23.50.40_fybud0.jpg",
  "https://res.cloudinary.com/tractrac-global/image/upload/v1758235942/WhatsApp_Image_2025-09-18_at_23.50.41_1_zr5zcu.jpg",
  "https://res.cloudinary.com/tractrac-global/image/upload/v1758235940/WhatsApp_Image_2025-09-18_at_23.50.42_1_gtic8y.jpg",
  "https://res.cloudinary.com/tractrac-global/image/upload/v1758235939/WhatsApp_Image_2025-09-18_at_23.50.42_lkzjfb.jpg",
  "https://res.cloudinary.com/tractrac-global/image/upload/v1758235938/WhatsApp_Image_2025-09-18_at_23.50.41_qqlw9u.jpg",
];

export default function CareersLifeGallery() {
  return (
    <section className={styles.gallery} aria-labelledby="careers-gallery-heading">
      <div className={styles.galleryInner}>
        <header className={styles.sectionHeaderCenter}>
          <span className={styles.sectionTag}>
            {/* <span className={styles.sectionTagDot} aria-hidden="true" /> */}
            <span>Culture</span>
          </span>
          <h2 id="careers-gallery-heading" className={styles.sectionTitle}>
            {bindTitleOrphans("Life at TracTrac")}
          </h2>
        </header>

        <div className={styles.galleryGrid}>
          {GALLERY_IMAGES.map((src, index) => (
            <div
              key={src}
              className={`${styles.galleryItem} ${
                index % 3 === 0 ? styles.galleryItemTall : ""
              }`}
            >
              <Image
                src={src}
                alt={`{bindTitleOrphans("Life at TracTrac")} ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, 280px"
                className={styles.galleryImage}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
