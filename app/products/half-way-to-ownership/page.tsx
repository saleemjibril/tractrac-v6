import type { Metadata } from "next";
import { Chivo } from "next/font/google";
import TraxcelerateFooter from "../../traxcelerate-product-page/TraxcelerateFooter";
import ProductMarketingNav from "../ProductMarketingNav";
import ProductPage from "../ProductPage";
import { HALF_WAY } from "../productPagesData";
import traxStyles from "../../traxcelerate-product-page/traxcelerateProduct.module.css";

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: HALF_WAY.metadata.title,
  description: HALF_WAY.metadata.description,
};

export default function HalfWayToOwnershipPage() {
  return (
    <div className={`${traxStyles.page} ${chivo.className}`}>
      <ProductMarketingNav variant="detail" />
      <main>
        <ProductPage config={HALF_WAY} />
      </main>
      <TraxcelerateFooter />
    </div>
  );
}
