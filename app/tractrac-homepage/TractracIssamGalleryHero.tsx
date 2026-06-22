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
    src: "https://api.tractrac.co/media/images/f8a89931-f61d-4f85-8389-0e05e9a97c43.webp",
    alt: "ISSAM program field activity",
  },
  {
    src: "https://api.tractrac.co/media/images/48e60ba3-1bce-4f24-abe6-85979bcdf8e1.webp",
    alt: "ISSAM mechanisation training session",
  },
  {
    src: "https://api.tractrac.co/media/images/935087dd-3726-4160-b39f-9c12ea2fd42c.webp",
    alt: "ISSAM cohort participants at work",
  },
  {
    src: "https://api.tractrac.co/media/images/fdc98508-4732-4635-8cc6-e9ba6a2db882.webp",
    alt: "ISSAM agricultural mechanisation in the field",
  },
  {
    src: "https://api.tractrac.co/media/images/6c77258b-7eab-4bf8-8b61-94a4c215ce34.webp",
    alt: "ISSAM youth training on farm equipment",
  },
  {
    src: "https://api.tractrac.co/media/images/b4823569-8751-4c48-b856-66459b9478e0.webp",
    alt: "ISSAM program community engagement",
  },
  {
    src: "https://api.tractrac.co/media/images/01a7ceba-8bfd-4d44-a051-73dd869acd0c.webp",
    alt: "ISSAM mechanisation services deployment",
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
            key={`${slide.src}-${i}`}
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
