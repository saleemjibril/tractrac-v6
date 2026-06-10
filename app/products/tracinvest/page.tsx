import type { Metadata } from "next";
import { Chivo } from "next/font/google";
import TraxcelerateFooter from "../../traxcelerate-product-page/TraxcelerateFooter";
import ProductMarketingNav from "../ProductMarketingNav";
import ProductPage from "../ProductPage";
import { TRACINVEST } from "../productPagesData";
import traxStyles from "../../traxcelerate-product-page/traxcelerateProduct.module.css";

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: TRACINVEST.metadata.title,
  description: TRACINVEST.metadata.description,
};

export default function TracInvestPage() {
  return (
    <div className={`${traxStyles.page} ${chivo.className}`}>
      <ProductMarketingNav variant="detail" />
      <main>
        <ProductPage config={TRACINVEST} />
      </main>
      <TraxcelerateFooter />
    </div>
  );
}
