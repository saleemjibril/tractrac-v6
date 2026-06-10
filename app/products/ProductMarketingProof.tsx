import TraxcelerateIcon from "../traxcelerate-product-page/TraxcelerateIcon";
import type { ProductPageConfig } from "./productMarketing.types";
import styles from "../traxcelerate-product-page/traxcelerateProduct.module.css";

export default function ProductMarketingProof({
  proof,
}: {
  proof: ProductPageConfig["proof"];
}) {
  return (
    <section id="proof" className={styles.proof} aria-labelledby="product-proof-heading">
      <div className={styles.proofGlow} aria-hidden />
      <div className={styles.sectionInner}>
        <div className={styles.sectionCenter}>
          <p className={styles.eyebrow}>{proof.eyebrow}</p>
          <h2 id="product-proof-heading" className={styles.sectionTitleLight}>
            {proof.title}
          </h2>
          <p className={styles.sectionLeadLight}>{proof.lead}</p>
        </div>
        <div className={styles.proofGrid}>
          {proof.items.map((s) => (
            <article
              key={s.l}
              className={styles.proofCard}
              style={{ "--proof-color": s.color } as React.CSSProperties}
            >
              <div
                className={styles.proofIconWrap}
                style={{ background: `${s.color}20` }}
              >
                <TraxcelerateIcon name={s.icon} size={24} color={s.color} />
              </div>
              <div className={styles.proofValue} style={{ color: s.color }}>
                {s.v}
              </div>
              <div className={styles.proofLabel}>{s.l}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
