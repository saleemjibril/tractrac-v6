import Image from "next/image";
import Link from "next/link";
import TraxcelerateIcon from "./TraxcelerateIcon";
import { TRAX_IMAGES } from "./images";
import styles from "./traxcelerateProduct.module.css";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

const PHOTOS: {
  src: string;
  title: string;
  sub: string;
  featured?: boolean;
}[] = [
  {
    src: TRAX_IMAGES.cohortCertified,
    title: "Cohort 18 graduation",
    sub: "320 MSPs certified · Feb 2026",
    featured: true,
  },
  {
    src: TRAX_IMAGES.mspTrainee,
    title: "MSP training day",
    sub: "Training materials in hand",
  },
  {
    src: TRAX_IMAGES.trainingTryctor,
    title: "Tryctor 300 walkthrough",
    sub: "OEM-led equipment training",
  },
  {
    src: TRAX_IMAGES.certifiedWomen,
    title: "Women-led mechanisation",
    sub: "40% women representation",
  },
  {
    src: TRAX_IMAGES.tryctorField,
    title: "Field deployment",
    sub: "Doma LGA, Nasarawa",
  },
  {
    src: TRAX_IMAGES.operatorTrainer,
    title: "AMTA Operators' trainers",
    sub: "Pairing trainees with masters",
  },
];

export default function TraxcelerateGallery() {
  return (
    <section className={styles.gallery} aria-labelledby="trax-gallery-heading">
      <div className={styles.sectionInnerWide}>
        <div className={styles.galleryHeader}>
          <div className={styles.galleryHeaderText}>
            <p className={styles.eyebrow}>From the field</p>
            <h2
              id="trax-gallery-heading"
              className={`${styles.sectionTitleSm} ${styles.galleryTitle}`}
            >
              {bindTitleOrphans("Real cohorts, real outcomes")}
            </h2>
            <p className={styles.sectionLeadMuted}>
              Every photo here is from an active ISSAM cohort across Nasarawa and Kaduna. No stock
              imagery, this is the workforce TRAxCelerate is building, week after week.
            </p>
          </div>
          <Link href="/special-programs/issam" className={styles.galleryLink}>
            View full ISSAM gallery <TraxcelerateIcon name="arr" size={14} />
          </Link>
        </div>
        <div className={styles.galleryGrid}>
          {PHOTOS.map((p) => (
            <div
              key={p.title}
              className={`${styles.galleryItem} ${p.featured ? styles.galleryItemFeatured : styles.galleryItemNormal}`}
            >
              <Image
                src={p.src}
                alt={p.title}
                fill
                sizes={p.featured ? "(max-width: 900px) 100vw, 66vw" : "(max-width: 900px) 50vw, 33vw"}
              />
              <div className={styles.galleryOverlay} aria-hidden />
              <div className={styles.galleryCaption}>
                <p className={styles.galleryCaptionTitle}>{p.title}</p>
                <p className={styles.galleryCaptionSub}>{p.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
