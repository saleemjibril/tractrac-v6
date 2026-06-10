import Image from "next/image";
import Link from "next/link";
import TraxcelerateIcon from "../traxcelerate-product-page/TraxcelerateIcon";
import type { ProductPageConfig } from "./productMarketing.types";
import styles from "../traxcelerate-product-page/traxcelerateProduct.module.css";

type HeroConfig = ProductPageConfig["hero"];

function TitleWithHighlight({
  title,
  highlight,
}: {
  title: string;
  highlight?: string;
}) {
  if (!highlight || !title.includes(highlight)) {
    return <>{title}</>;
  }
  const [before, after] = title.split(highlight);
  return (
    <>
      {before}
      <span className={styles.highlight}>{highlight}</span>
      {after}
    </>
  );
}

export default function ProductMarketingHero({ hero }: { hero: HeroConfig }) {
  return (
    <section className={styles.hero} aria-labelledby="product-hero-heading">
      <div className={styles.heroBackdrop} aria-hidden>
        <Image
          src={hero.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
          unoptimized
        />
        <div className={styles.heroGradientH} />
        <div className={styles.heroGradientV} />
      </div>

      <div className={styles.heroInner}>
        <div className={styles.heroBadgeRow}>
          <div className={styles.heroBadge}>
            {/* <span className={styles.pulseDot} aria-hidden /> */}
            <span className={styles.heroBadgeText}>{hero.badge}</span>
          </div>
        </div>

        <div className={styles.heroMain}>
          {hero.kicker && <p className={styles.heroKicker}>{hero.kicker}</p>}
          <h1 id="product-hero-heading" className={styles.heroTitle}>
            <TitleWithHighlight title={hero.title} highlight={hero.titleHighlight} />
          </h1>
          <p className={styles.heroLede}>{hero.lede}</p>
          <div className={styles.heroCtas}>
            <Link href={hero.primaryCta.href} className={styles.btnPrimary}>
              {hero.primaryCta.label}
              <span className={styles.btnPrimaryIcon}>
                <TraxcelerateIcon name="arr" size={11} color="#FA9413" strokeWidth={2.5} />
              </span>
            </Link>
            {hero.secondaryCta && (
              <Link href={hero.secondaryCta.href} className={styles.btnSecondary}>
                {hero.secondaryCta.label}
              </Link>
            )}
            {hero.ghostCta && (
              <Link href={hero.ghostCta.href} className={styles.btnGhost}>
                {hero.ghostCta.label}
                <TraxcelerateIcon name="arr" size={14} />
              </Link>
            )}
          </div>
        </div>

        {hero.stats && hero.stats.length > 0 && (
          <div className={styles.heroStatsWrap}>
            <div className={styles.heroStats}>
              {hero.stats.map((s) => (
                <div key={s.l} className={styles.heroStat}>
                  <span className={styles.heroStatValue}>{s.v}</span>
                  <span className={styles.heroStatLabel}>{s.l}</span>
                  <span className={styles.heroStatSub}>{s.sub}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.heroBottomPad} />
      </div>
    </section>
  );
}
