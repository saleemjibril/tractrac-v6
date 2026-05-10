"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./tractracHomepage.module.css";

type Slide = { src: string; alt: string };

const SLIDES: Slide[] = [
  {
    src: "https://api.tractrac.co/media/images/5e9f88cf-d3c2-4d96-a9ff-48e049e6edd6.webp",
    alt: "Farmer with tractor in the field",
  },
  // TODO: Replace these placeholders with the next two hero images.
  {
    src: "https://api.tractrac.co/media/images/60942239-748e-4df0-9fc1-ccca0a399681.webp",
    alt: "Mechanization service provider operating equipment",
  },
  {
    src: "https://api.tractrac.co/media/images/5e9f88cf-d3c2-4d96-a9ff-48e049e6edd6.webp",
    alt: "Smallholder farmers benefiting from mechanization services",
  },
];

const AUTOPLAY_MS = 6000;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export default function TractracHeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const slideCount = SLIDES.length;

  const goTo = useCallback(
    (next: number) => {
      if (slideCount <= 1) return;
      const wrapped = ((next % slideCount) + slideCount) % slideCount;
      setActive(wrapped);
    },
    [slideCount]
  );

  useEffect(() => {
    if (paused || slideCount <= 1 || prefersReducedMotion()) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % slideCount),
      AUTOPLAY_MS
    );
    return () => window.clearInterval(id);
  }, [paused, slideCount]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(active + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active - 1);
    }
  };

  return (
    <div
      className={styles.heroVisual}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className={styles.heroImageShell}
        role="region"
        aria-roledescription="carousel"
        aria-label="TracTrac highlights"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {SLIDES.map((slide, idx) => (
          <Image
            key={`${slide.src}-${idx}`}
            src={slide.src}
            alt={idx === active ? slide.alt : ""}
            fill
            sizes="(max-width: 1024px) 100vw, 616px"
            className={`${styles.heroImage} ${
              idx === active ? styles.heroImageActive : ""
            }`}
            priority={idx === 0}
            aria-hidden={idx !== active}
          />
        ))}

        {slideCount > 1 && (
          <div
            className={styles.heroDots}
            role="tablist"
            aria-label="Hero slide controls"
          >
            {SLIDES.map((slide, idx) => (
              <button
                key={`${slide.src}-dot-${idx}`}
                type="button"
                role="tab"
                aria-selected={idx === active}
                aria-label={`Show slide ${idx + 1} of ${slideCount}`}
                tabIndex={idx === active ? 0 : -1}
                className={idx === active ? styles.dotActive : styles.dot}
                onClick={() => goTo(idx)}
              />
            ))}
          </div>
        )}
      </div>

      <div className={`${styles.statCard} ${styles.statCardTractors}`}>
        <div className={`${styles.statIcon} ${styles.statIconOrange}`}>
          <span
            className={`${styles.statIconDot} ${styles.statIconDotOrange}`}
            aria-hidden
          />
        </div>
        <div className={styles.statText}>
          <span className={styles.statTitle}>Tractors Deployed</span>
          <span className={styles.statSubtitle}>Across Nigeria</span>
        </div>
        <span className={`${styles.statBadge} ${styles.statBadgeOrange}`}>
          800+
        </span>
      </div>

      <div className={`${styles.statCard} ${styles.statCardFarmers}`}>
        <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
          <span
            className={`${styles.statIconDot} ${styles.statIconDotGreen}`}
            aria-hidden
          />
        </div>
        <div className={styles.statText}>
          <span className={styles.statTitle}>Farmers Reached</span>
          <span className={styles.statSubtitle}>ISSAM Project</span>
        </div>
        <span className={`${styles.statBadge} ${styles.statBadgeGreen}`}>
          100,000+
        </span>
      </div>

      <div className={`${styles.statCard} ${styles.statCardInvest}`}>
        <div className={`${styles.statIcon} ${styles.statIconIndigo}`}>
          <span
            className={`${styles.statIconDot} ${styles.statIconDotIndigo}`}
            aria-hidden
          />
        </div>
        <div className={styles.statText}>
          <span className={styles.statTitle}>Investment Generated</span>
          <span className={styles.statSubtitle}>Private Sector</span>
        </div>
        <span className={`${styles.statBadge} ${styles.statBadgeIndigo}`}>
          $2B+
        </span>
      </div>
    </div>
  );
}
