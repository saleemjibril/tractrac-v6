import styles from "./aboutUs.module.css";

type Testimonial = {
  id: string;
  initials: string;
  name: string;
  role: string;
  quote: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "adewale",
    initials: "AW",
    name: "Adewale",
    role: "Smallholder Farmer, Kaduna State",
    quote:
      "Before TracTrac\u2019s mechanization services, farming was backbreaking labour with limited returns. Since gaining access to a tractor through the ISSAM program, my workload has reduced by half and my crop yield has increased by 50%. Today I can support my family and invest in better seeds for the next planting season.",
  },
  {
    id: "jane-okoro",
    initials: "JO",
    name: "Dr. Jane Okoro",
    role: "WIMA Representative",
    quote:
      "Collaborating with TracTrac has enabled us to reach underserved farming communities with meaningful solutions. Their mechanization model is helping transform agricultural productivity while creating new economic opportunities for rural farmers.",
  },
];

function QuoteIcon() {
  return (
    <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M34 6.375C32.8728 6.375 31.7918 6.82277 30.9948 7.6198C30.1978 8.41683 29.75 9.49783 29.75 10.625V23.375C29.75 24.5022 30.1978 25.5832 30.9948 26.3802C31.7918 27.1772 32.8728 27.625 34 27.625C34.5636 27.625 35.1041 27.8489 35.5026 28.2474C35.9011 28.6459 36.125 29.1864 36.125 29.75V31.875C36.125 33.0022 35.6772 34.0832 34.8802 34.8802C34.0832 35.6772 33.0022 36.125 31.875 36.125C31.3114 36.125 30.7709 36.3489 30.3724 36.7474C29.9739 37.1459 29.75 37.6864 29.75 38.25V42.5C29.75 43.0636 29.9739 43.6041 30.3724 44.0026C30.7709 44.4011 31.3114 44.625 31.875 44.625C35.2565 44.625 38.4995 43.2817 40.8906 40.8906C43.2817 38.4995 44.625 35.2565 44.625 31.875V10.625C44.625 9.49783 44.1772 8.41683 43.3802 7.6198C42.5832 6.82277 41.5022 6.375 40.375 6.375H34Z" stroke="#FA9411" stroke-width="4.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.625 6.375C9.49783 6.375 8.41683 6.82277 7.6198 7.6198C6.82277 8.41683 6.375 9.49783 6.375 10.625V23.375C6.375 24.5022 6.82277 25.5832 7.6198 26.3802C8.41683 27.1772 9.49783 27.625 10.625 27.625C11.1886 27.625 11.7291 27.8489 12.1276 28.2474C12.5261 28.6459 12.75 29.1864 12.75 29.75V31.875C12.75 33.0022 12.3022 34.0832 11.5052 34.8802C10.7082 35.6772 9.62717 36.125 8.5 36.125C7.93641 36.125 7.39591 36.3489 6.9974 36.7474C6.59888 37.1459 6.375 37.6864 6.375 38.25V42.5C6.375 43.0636 6.59888 43.6041 6.9974 44.0026C7.39591 44.4011 7.93641 44.625 8.5 44.625C11.8815 44.625 15.1245 43.2817 17.5156 40.8906C19.9067 38.4995 21.25 35.2565 21.25 31.875V10.625C21.25 9.49783 20.8022 8.41683 20.0052 7.6198C19.2082 6.82277 18.1272 6.375 17 6.375H10.625Z" stroke="#FA9411" stroke-width="4.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  );
}

export default function AboutTestimonials() {
  return (
    <section
      className={styles.testimonials}
      aria-labelledby="about-testimonials-heading"
    >
      <div className={styles.testimonialsInner}>
        <header className={styles.testimonialsHeader}>
          <span className={styles.testimonialsTag}>
            <span className={styles.testimonialsTagDot} aria-hidden="true" />
            <span>Testimonials</span>
          </span>
          <h2
            id="about-testimonials-heading"
            className={styles.testimonialsTitle}
          >
            What Our Partners &amp; Farmers Say
          </h2>
        </header>

        <div className={styles.testimonialsCards}>
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.id}
              className={styles.testimonialCard}
              aria-labelledby={`testimonial-${t.id}-name`}
            >
              <QuoteIcon />
              <blockquote className={styles.testimonialQuote}>
                {t.quote}
              </blockquote>
              <figcaption className={styles.testimonialAuthor}>
                <span className={styles.testimonialAvatar} aria-hidden="true">
                  {t.initials}
                </span>
                <span className={styles.testimonialMeta}>
                  <span
                    id={`testimonial-${t.id}-name`}
                    className={styles.testimonialName}
                  >
                    {t.name}
                  </span>
                  <span className={styles.testimonialRole}>{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
