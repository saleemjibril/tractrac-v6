import Link from "next/link";
import TraxcelerateIcon from "../traxcelerate-product-page/TraxcelerateIcon";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";
import { LISTING_PARTNER_MODELS } from "./productsListingData";
import styles from "../traxcelerate-product-page/traxcelerateProduct.module.css";

export default function ProductListingPartners() {
  return (
    <section
      id="partner"
      className={styles.partners}
      aria-labelledby="listing-partners-heading"
    >
      <div className={styles.sectionInner}>
        <div className={styles.sectionCenter680}>
          <p className={styles.eyebrow}>How to engage</p>
          <h2 id="listing-partners-heading" className={styles.sectionTitlePartners}>
            {bindTitleOrphans("Partnership paths across our product suite")}
          </h2>
        </div>
        <div className={styles.partnersGrid}>
          {LISTING_PARTNER_MODELS.map((m) => (
            <article
              key={m.title}
              className={styles.partnerCard}
              style={{ "--tag-color": m.tagColor } as React.CSSProperties}
            >
              <div className={styles.partnerTop}>
                <span className={styles.partnerTag}>{m.tag}</span>
                <div className={styles.partnerIconWrap}>
                  <TraxcelerateIcon name={m.icon} size={22} color={m.tagColor} />
                </div>
              </div>
              <h3 className={styles.partnerTitle}>{m.title}</h3>
              <p className={styles.partnerDesc}>{m.description}</p>
              <Link href={m.href} className={styles.partnerCta}>
                {m.cta}{" "}
                <TraxcelerateIcon name="arr" size={14} color="#060C15" strokeWidth={2.2} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
