import Link from "next/link";
import TraxcelerateIcon from "./TraxcelerateIcon";
import type { IconName } from "./TraxcelerateIcon";
import styles from "./traxcelerateProduct.module.css";

type PartnerModel = {
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  cta: string;
  icon: IconName;
  note?: string;
};

const MODELS: PartnerModel[] = [
  {
    tag: "Policy alignment",
    tagColor: "#16A34A",
    title: "State government",
    description:
      "Provide enabling environment, venues, and participant mobilisation. We deliver training, certification, and deployment. You get measurable youth employment outcomes.",
    cta: "Get in touch",
    icon: "flag",
  },
  {
    tag: "Most engaged",
    tagColor: "#FA9413",
    title: "DFIs & donors",
    description:
      "Fund one state or a multi-state programme. Full SDG impact documentation, gender-disaggregated reporting, and TractracPlus real-time monitoring included.",
    cta: "Get in touch",
    icon: "glob",
    note: "SDG 2 · 8 · 9 · 17",
  },
  {
    tag: "ROI-driven",
    tagColor: "#3B82F6",
    title: "OEMs & agribusiness",
    description:
      "Sponsor trainees aligned to your equipment type. Co-brand the curriculum. Access a certified MSP talent pool and reduce after-sales costs.",
    cta: "Get in touch",
    icon: "build",
  },
  {
    tag: "Industry credential",
    tagColor: "#8B5CF6",
    title: "Universities & polytechnics",
    description:
      "Your agriculture students are learning the science of farming. TRAxCelerate teaches them the industry — with a certification they can use from day one.",
    cta: "Book a campus consultation",
    icon: "cap",
  },
];

export default function TraxceleratePartners() {
  return (
    <section id="partner" className={styles.partners} aria-labelledby="trax-partners-heading">
      <div className={styles.sectionInner}>
        <div className={styles.sectionCenter680}>
          <p className={styles.eyebrow}>Partnership Models</p>
          <h2 id="trax-partners-heading" className={styles.sectionTitlePartners}>
            How you can partner with TRAxCelerate
          </h2>
        </div>
        <div className={styles.partnersGrid}>
          {MODELS.map((m) => (
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
              {m.note ? <p className={styles.partnerNote}>{m.note}</p> : null}
              <Link href="#cta" className={styles.partnerCta}>
                {m.cta} <TraxcelerateIcon name="arr" size={14} color="#060C15" strokeWidth={2.2} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
