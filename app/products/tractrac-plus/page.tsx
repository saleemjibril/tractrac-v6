import type { Metadata } from "next";
import { Chivo } from "next/font/google";
import TraxcelerateFooter from "../../traxcelerate-product-page/TraxcelerateFooter";
import ProductMarketingNav from "../ProductMarketingNav";
import ProductPage from "../ProductPage";
import { TRACTRAC_PLUS } from "../productPagesData";
import traxStyles from "../../traxcelerate-product-page/traxcelerateProduct.module.css";

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: TRACTRAC_PLUS.metadata.title,
  description: TRACTRAC_PLUS.metadata.description,
};

export default function TracTracPlusPage() {
  return (
    <div className={`${traxStyles.page} ${chivo.className}`}>
      <ProductMarketingNav variant="detail" ctaHref="#cta" ctaLabel="Partner With Us" />
      <main>
        <ProductPage config={TRACTRAC_PLUS} />
      </main>
      <TraxcelerateFooter />
    </div>
  );
}
