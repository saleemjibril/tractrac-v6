import Image from "next/image";
import type { ProductPageConfig } from "./productMarketing.types";
import { BoundTitleWithHighlight } from "@/app/components/marketing/BoundTitle";
import styles from "../traxcelerate-product-page/traxcelerateProduct.module.css";

export default function ProductMarketingOverview({
  overview,
}: {
  overview: ProductPageConfig["overview"];
}) {
  return (
    <section
      id="overview"
      className={styles.problem}
      aria-labelledby="product-overview-heading"
    >
      <div className={styles.problemGlow} aria-hidden />
      <div className={styles.sectionInner}>
        <div className={styles.problemGrid}>
          <div>
            <p className={styles.eyebrow}>{overview.eyebrow}</p>
            <BoundTitleWithHighlight
              as="h2"
              id="product-overview-heading"
              className={`${styles.sectionTitle} ${styles.problemTitle}`}
              title={
                overview.titleHighlight &&
                overview.title.includes(overview.titleHighlight)
                  ? overview.title
                  : overview.titleHighlight
                    ? `${overview.title} ${overview.titleHighlight}`
                    : overview.title
              }
              highlight={overview.titleHighlight}
              highlightClassName={styles.highlight}
            />
            <div className={styles.problemCopy}>
              {overview.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className={styles.sectionLead}>
                  {p}
                </p>
              ))}
            </div>
            <div className={styles.statCards}>
              {overview.sideStats.map((s) => (
                <div key={s.big} className={styles.statCard}>
                  <span
                    className={
                      s.variant === "orange"
                        ? styles.statCardBigOrange
                        : styles.statCardBigDark
                    }
                  >
                    {s.big}
                  </span>
                  <span className={styles.statCardSmall}>{s.small}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.problemImageWrap}>
            <Image
              src={overview.image}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className={styles.problemImage}
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}
