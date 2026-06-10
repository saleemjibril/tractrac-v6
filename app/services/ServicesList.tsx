"use client";

import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { SERVICE_ITEMS } from "./servicesData";
import styles from "./services.module.css";

function serviceHref(buttonLink: string, isLoggedIn: boolean) {
  if (isLoggedIn) return buttonLink;
  return `/login?redirect=${encodeURIComponent(buttonLink)}`;
}

export default function ServicesList() {
  const userToken = useAppSelector((state) => state.auth.userToken);
  const isLoggedIn = Boolean(userToken);

  return (
    <section
      id="services-list"
      className={styles.services}
      aria-label="TracTrac services"
    >
      <div className={styles.servicesInner}>
        {SERVICE_ITEMS.map((item) => (
          <article key={item.id} className={styles.serviceCard}>
            <div className={styles.serviceCardHeader}>
              <h2 className={styles.serviceCardTitle}>{item.title}</h2>
              <Link
                href={serviceHref(item.buttonLink, isLoggedIn)}
                className={styles.serviceCardCta}
              >
                {item.buttonText}
                <span aria-hidden="true">+</span>
              </Link>
            </div>

            <div className={styles.serviceCardBody}>
              {item.paragraphs.map((paragraph, index) => (
                <p key={`${item.id}-p-${index}`} className={styles.serviceParagraph}>
                  {paragraph}
                </p>
              ))}
              {item.bulletsIntro && (
                <p className={styles.serviceBulletsIntro}>{item.bulletsIntro}</p>
              )}
              {item.bullets && item.bullets.length > 0 && (
                <ul className={styles.serviceBullets}>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
              {item.closingParagraphs?.map((paragraph, index) => (
                <p
                  key={`${item.id}-close-${index}`}
                  className={styles.serviceParagraph}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
