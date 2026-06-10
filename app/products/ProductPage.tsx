import type { ProductPageConfig } from "./productMarketing.types";
import ProductMarketingCta from "./ProductMarketingCta";
import ProductMarketingHero from "./ProductMarketingHero";
import ProductMarketingOverview from "./ProductMarketingOverview";
import ProductMarketingProof from "./ProductMarketingProof";
import ProductMarketingSteps from "./ProductMarketingSteps";
import ProductsPartnerForm from "./ProductsPartnerForm";

export default function ProductPage({ config }: { config: ProductPageConfig }) {
  return (
    <>
      <ProductMarketingHero hero={config.hero} />
      <ProductMarketingOverview overview={config.overview} />
      <ProductMarketingSteps steps={config.steps} />
      <ProductMarketingProof proof={config.proof} />
      <ProductMarketingCta cta={config.cta} />
      <ProductsPartnerForm variant={config.partnerForm ?? "join"} />
    </>
  );
}
