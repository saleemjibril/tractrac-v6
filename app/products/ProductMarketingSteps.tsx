import TraxcelerateIcon from "../traxcelerate-product-page/TraxcelerateIcon";
import type { ProductPageConfig } from "./productMarketing.types";
import traxStyles from "../traxcelerate-product-page/traxcelerateProduct.module.css";
import extras from "./productsMarketingExtras.module.css";

export default function ProductMarketingSteps({
  steps,
}: {
  steps: ProductPageConfig["steps"];
}) {
  const useFlex = steps.items.length !== 5;

  return (
    <section
      id="features"
      className={traxStyles.how}
      aria-labelledby="product-features-heading"
    >
      <div className={traxStyles.sectionInner}>
        <div className={traxStyles.sectionCenterHow}>
          <p className={traxStyles.eyebrow}>{steps.eyebrow}</p>
          <h2
            id="product-features-heading"
            className={`${traxStyles.sectionTitle} ${traxStyles.howTitle}`}
          >
            {steps.title}
          </h2>
          <p className={traxStyles.howLead}>{steps.lead}</p>
        </div>
        <div className={useFlex ? extras.stepsGridFlex : traxStyles.stepsGrid}>
          {steps.items.map((s) => (
            <article key={s.n} className={traxStyles.stepCard}>
              <div className={traxStyles.stepTop}>
                <div className={traxStyles.stepIconWrap}>
                  <TraxcelerateIcon name={s.i} size={22} color="#FA9413" />
                </div>
                <span className={traxStyles.stepNum}>{s.n}</span>
              </div>
              <h3 className={traxStyles.stepTitle}>{s.t}</h3>
              <p className={traxStyles.stepDesc}>{s.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
