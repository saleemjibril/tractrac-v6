import Link from "next/link";
import styles from "./careers.module.css";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

export default function CareersMission() {
  return (
    <section className={styles.mission} aria-labelledby="careers-mission-heading">
      <div className={styles.missionInner}>
        <div className={styles.missionLead}>
          <span className={styles.sectionTag}>
            {/* <span className={styles.sectionTagDot} aria-hidden="true" /> */}
            <span>Our mission</span>
          </span>
          <h2 id="careers-mission-heading" className={styles.missionHeadline}>
            {bindTitleOrphans("All of us at TracTrac are on the same mission:")}
          </h2>
        </div>

        <div className={styles.missionBody}>
          <p className={styles.missionStatement}>
            to make mechanization accessible to smallholder farmers in Nigeria
            and Sub-Saharan Africa.
          </p>
          <p className={styles.missionCopy}>
            Currently, our work spans across Nigeria and we have offices in the
            FCT Abuja and Nasarawa State. The people are at the heart of this
            transforming work we do to improve productivity for farmers and
            secure Nigeria&apos;s food security.
          </p>
          <p className={styles.missionEmphasis}>
            Ready to do work you care about with people who care?
          </p>
          <Link href="#open-positions" className={styles.btnPrimary}>
            See open roles
          </Link>
        </div>
      </div>
    </section>
  );
}
