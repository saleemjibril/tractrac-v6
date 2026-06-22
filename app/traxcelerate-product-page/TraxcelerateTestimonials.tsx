import styles from "./traxcelerateProduct.module.css";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

const TESTIMONIALS = [
  {
    q: "The programme empowered me to become a mechanisation service provider. My cooperative and I plan to establish a big agricultural business. My life will change financially.",
    n: "Abigail Francis, 26",
    r: "Cooperative Manager, Doma LGA · ISSAM Project MSP Graduate",
    initials: "AF",
    color: "#FA9413",
  },
  {
    q: "I believe that whatever someone with two legs can do, I can do just as well, if not better. TracTrac changed me, and now I'm ready to do the same for others.",
    n: "Timothy Samuel, 21",
    r: "Cooperative Manager, Doma LGA (PWD) · ISSAM Project MSP Graduate",
    initials: "TS",
    color: "#16A34A",
  },
];

function QuoteMark({ color }: { color: string }) {
  return (
    <svg width="40" height="32" viewBox="0 0 40 32" fill="none" aria-hidden style={{ marginBottom: 20 }}>
      <path
        d="M0 32V18C0 8.06 6.06 0 16 0v6C10 6 4 11 4 18h12v14H0zm24 0V18C24 8.06 30.06 0 40 0v6C34 6 28 11 28 18h12v14H24z"
        fill={color}
        opacity={0.25}
      />
    </svg>
  );
}

export default function TraxcelerateTestimonials() {
  return (
    <section className={styles.testimonials} aria-labelledby="trax-testimonials-heading">
      <div className={styles.sectionInnerNarrow}>
        <div className={styles.sectionCenter680Sm}>
          <p className={styles.eyebrow}>Real outcomes, real people</p>
          <h2 id="trax-testimonials-heading" className={styles.sectionTitleSm}>
            {bindTitleOrphans("Voices from TRAxCelerate")}
          </h2>
        </div>
        <div className={styles.testimonialsGrid}>
          {TESTIMONIALS.map((x) => (
            <blockquote key={x.n} className={styles.testimonialCard}>
              <QuoteMark color={x.color} />
              <p className={styles.testimonialQuote}>&ldquo;{x.q}&rdquo;</p>
              <footer className={styles.testimonialAuthor}>
                <div
                  className={styles.testimonialAvatar}
                  style={{
                    background: `${x.color}20`,
                    border: `2px solid ${x.color}40`,
                    color: x.color,
                  }}
                >
                  {x.initials}
                </div>
                <div>
                  <cite className={styles.testimonialName}>{x.n}</cite>
                  <p className={styles.testimonialRole}>{x.r}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
