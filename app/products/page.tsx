import type { Metadata } from "next";
import { Chivo } from "next/font/google";
import TraxcelerateFooter from "../traxcelerate-product-page/TraxcelerateFooter";
import ProductCatalog from "./ProductCatalog";
import ProductListingPartners from "./ProductListingPartners";
import ProductMarketingCta from "./ProductMarketingCta";
import ProductMarketingHero from "./ProductMarketingHero";
import ProductMarketingNav from "./ProductMarketingNav";
import ProductMarketingOverview from "./ProductMarketingOverview";
import ProductMarketingProof from "./ProductMarketingProof";
import ProductsPartnerForm from "./ProductsPartnerForm";
import {
  LISTING_CTA,
  LISTING_HERO,
  LISTING_OVERVIEW,
  LISTING_PROOF,
} from "./productsListingData";
import traxStyles from "../traxcelerate-product-page/traxcelerateProduct.module.css";

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Products — TracTrac Mechanisation Suite",
  description: "Powering the future of mechanisation in Africa.",
};

export default function ProductsPage() {
  return (
    <div className={`${traxStyles.page} ${chivo.className}`}>
      <ProductMarketingNav variant="listing" />
      <main>
        <ProductMarketingHero hero={LISTING_HERO} />
        <ProductCatalog />
        <ProductMarketingOverview overview={LISTING_OVERVIEW} />
        <ProductMarketingProof
          proof={{
            eyebrow: "Our impact",
            title: "Proven at programme scale",
            lead: "TracTrac products have delivered measurable mechanisation outcomes across Nigeria.",
            items: LISTING_PROOF,
          }}
        />
        <ProductListingPartners />
        <ProductMarketingCta cta={LISTING_CTA} />
        <ProductsPartnerForm variant="join" />
      </main>
      <TraxcelerateFooter />
    </div>
  );
}
