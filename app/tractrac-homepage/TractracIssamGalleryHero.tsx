"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./tractracHomepage.module.css";

const DEFAULT_SLIDES = [
  {
    src: "https://api.tractrac.co/media/images/28228686-af3f-48b1-9a17-502f1002b007.webp",
    alt: "ISSAM participants in a training hall with laptops",
  },
  {
    src: "https://api.tractrac.co/media/images/77a1af4d-f998-4af0-ab01-9bf6de22eb4e.webp",
    alt: "Farmer with tractor in the field",
  },
  {
    src: "https://api.tractrac.co/media/images/28228686-af3f-48b1-9a17-502f1002b007.webp",
    alt: "TracTrac Plus mobile app in use",
  },
] as const;

const AUTOPLAY_MS = 6000;

export default function TractracIssamGalleryHero() {
  const [active, setActive] = useState(0);
  const count = DEFAULT_SLIDES.length;

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [count]);

  return (
    <section
      className={styles.issamGallery}
      aria-roledescription="carousel"
      aria-label="ISSAM program gallery"
    >
      <div className={styles.issamGalleryViewport}>
        {DEFAULT_SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className={`${styles.issamGallerySlide} ${i === active ? styles.issamGallerySlideActive : ""}`}
            aria-hidden={i !== active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className={styles.issamGalleryImg}
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        ))}

        <div className={styles.issamGalleryOverlay}>
          <div className={styles.issamGalleryDots} role="tablist" aria-label="Choose slide">
            {DEFAULT_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Slide ${i + 1} of ${count}`}
                className={i === active ? styles.issamGalleryDotActive : styles.issamGalleryDot}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
          <Link href="/special-programs/issam" className={styles.issamGalleryCta}>
            View ISSAM Gallery →
          </Link>
        </div>
      </div>
    </section>
  );
}
