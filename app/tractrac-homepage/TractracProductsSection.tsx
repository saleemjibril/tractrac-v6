import Link from "next/link";
import styles from "./tractracHomepage.module.css";

type ProductIcon = "phone" | "chart" | "money" | "key" | "sprout";

type Accent = "orange" | "indigo" | "green" | "sky" | "terracotta";

const PRODUCTS: {
  id: string;
  audience: string;
  accent: Accent;
  title: string;
  description: string;
  href: string;
  icon: ProductIcon;
}[] = [
  {
    id: "tractrac-plus",
    audience: "For Farmers",
    accent: "orange",
    title: "TracTrac Plus",
    description:
      "Book tractors and mechanization services directly from your mobile phone. 1,000+ bookings completed.",
    href: "/products/tractrac-plus",
    icon: "phone",
  },
  {
    id: "traxcelerate",
    audience: "For MSPs",
    accent: "indigo",
    title: "TraxCelerate",
    description:
      "Accelerate the growth of your mechanization service business with smart tools and market access.",
    href: "/products/traxcelerate",
    icon: "chart",
  },
  {
    id: "tracinvest",
    audience: "For Investors",
    accent: "green",
    title: "TracInvest",
    description:
      "Unlock investment opportunities in Nigeria's mechanization sector with data-driven insights.",
    href: "/products/tracinvest",
    icon: "money",
  },
  {
    id: "h2o",
    audience: "For Partners",
    accent: "sky",
    title: "H2O — Halfway to Ownership",
    description:
      "A structured pathway enabling smallholder farmers to own their mechanization equipment.",
    href: "/products/half-way-to-ownership",
    icon: "key",
  },
  {
    id: "rise7",
    audience: "For Ecosystem",
    accent: "terracotta",
    title: "Rise 7",
    description:
      "A transformative initiative expanding mechanization access for the most underserved farming communities.",
    href: "/products/rise7",
    icon: "sprout",
  },
];

function ProductIconSvg({ name, stroke }: { name: ProductIcon; stroke: string }) {
  const c = { width: 48, height: 48, viewBox: "0 0 48 48", fill: "none" as const, "aria-hidden": true as const };
  switch (name) {
    case "phone":
      return (
       
        <svg {...c}>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M24 0C22.6252 0 21.3756 0.33972 20.0394 0.89222C18.7594 1.42158 17.2818 2.1989 15.469 3.15252L9.2814 6.4076C7.3146 7.4422 5.7136 8.2844 4.4732 9.102C3.17906 9.9552 2.14726 10.8622 1.39258 12.0882C0.638101 13.314 0.306882 14.621 0.150182 16.124C-5.79096e-05 17.5652 -3.87111e-05 19.3234 1.28888e-06 21.4846V26.5154C-3.87111e-05 28.6766 -5.79096e-05 30.4348 0.150182 31.876C0.306882 33.379 0.638101 34.686 1.39258 35.9118C2.14726 37.1378 3.17906 38.0448 4.4732 38.898C5.7136 39.7156 7.3144 40.5578 9.2812 41.5924L15.469 44.8474C17.2818 45.801 18.7594 46.5784 20.0394 47.1078C21.3756 47.6602 22.6252 48 24 48C25.3748 48 26.6244 47.6602 27.9606 47.1078C29.2406 46.5784 30.7182 45.801 32.531 44.8474L38.7188 41.5922C40.6856 40.5576 42.2864 39.7156 43.5268 38.898C44.821 38.0448 45.8528 37.1378 46.6074 35.9118C47.3618 34.686 47.6932 33.379 47.8498 31.876C48 30.4348 48 28.6766 48 26.5154V21.4846C48 19.3234 48 17.5652 47.8498 16.124C47.6932 14.621 47.3618 13.314 46.6074 12.0882C45.8528 10.8622 44.821 9.9552 43.5268 9.102C42.3638 8.3356 40.8842 7.5474 39.0832 6.5994L38.7186 6.4076L32.531 3.15252C30.7182 2.19888 29.2406 1.42158 27.9606 0.89222C26.6244 0.33972 25.3748 0 24 0Z" fill="#FFF4E1"/>
        <path d="M29 14H19C17.8954 14 17 14.8954 17 16V32C17 33.1046 17.8954 34 19 34H29C30.1046 34 31 33.1046 31 32V16C31 14.8954 30.1046 14 29 14Z" stroke="black" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M24 30H24.01" stroke="black" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
      );
    case "chart":
      return (
        <svg {...c}>
<path fill-rule="evenodd" clip-rule="evenodd" d="M24 0C22.6252 0 21.3756 0.33972 20.0394 0.89222C18.7594 1.42158 17.2818 2.1989 15.469 3.15252L9.2814 6.4076C7.3146 7.4422 5.7136 8.2844 4.4732 9.102C3.17906 9.9552 2.14726 10.8622 1.39258 12.0882C0.638101 13.314 0.306882 14.621 0.150182 16.124C-5.79096e-05 17.5652 -3.87111e-05 19.3234 1.28888e-06 21.4846V26.5154C-3.87111e-05 28.6766 -5.79096e-05 30.4348 0.150182 31.876C0.306882 33.379 0.638101 34.686 1.39258 35.9118C2.14726 37.1378 3.17906 38.0448 4.4732 38.898C5.7136 39.7156 7.3144 40.5578 9.2812 41.5924L15.469 44.8474C17.2818 45.801 18.7594 46.5784 20.0394 47.1078C21.3756 47.6602 22.6252 48 24 48C25.3748 48 26.6244 47.6602 27.9606 47.1078C29.2406 46.5784 30.7182 45.801 32.531 44.8474L38.7188 41.5922C40.6856 40.5576 42.2864 39.7156 43.5268 38.898C44.821 38.0448 45.8528 37.1378 46.6074 35.9118C47.3618 34.686 47.6932 33.379 47.8498 31.876C48 30.4348 48 28.6766 48 26.5154V21.4846C48 19.3234 48 17.5652 47.8498 16.124C47.6932 14.621 47.3618 13.314 46.6074 12.0882C45.8528 10.8622 44.821 9.9552 43.5268 9.102C42.3638 8.3356 40.8842 7.5474 39.0832 6.5994L38.7186 6.4076L32.531 3.15252C30.7182 2.19888 29.2406 1.42158 27.9606 0.89222C26.6244 0.33972 25.3748 0 24 0Z" fill="#D7D8FF"/>
<path d="M16.1734 30.65L20.7484 24.25H25.7484L31.2984 17.775V30.65H16.1734ZM15.6984 26.675L15.1484 26.275L18.8734 21.05H23.8984L28.3484 15.825L28.8984 16.3L24.1984 21.75H19.2234L15.6984 26.675ZM17.5484 29.95H30.5984V19.65L26.0484 24.95H21.0984L17.5484 29.95Z" fill="black"/>
</svg>

      );
    case "money":
      return (
        <svg {...c}>
<path fill-rule="evenodd" clip-rule="evenodd" d="M24 0C22.6252 0 21.3756 0.33972 20.0394 0.89222C18.7594 1.42158 17.2818 2.1989 15.469 3.15252L9.2814 6.4076C7.3146 7.4422 5.7136 8.2844 4.4732 9.102C3.17906 9.9552 2.14726 10.8622 1.39258 12.0882C0.638101 13.314 0.306882 14.621 0.150182 16.124C-5.79096e-05 17.5652 -3.87111e-05 19.3234 1.28888e-06 21.4846V26.5154C-3.87111e-05 28.6766 -5.79096e-05 30.4348 0.150182 31.876C0.306882 33.379 0.638101 34.686 1.39258 35.9118C2.14726 37.1378 3.17906 38.0448 4.4732 38.898C5.7136 39.7156 7.3144 40.5578 9.2812 41.5924L15.469 44.8474C17.2818 45.801 18.7594 46.5784 20.0394 47.1078C21.3756 47.6602 22.6252 48 24 48C25.3748 48 26.6244 47.6602 27.9606 47.1078C29.2406 46.5784 30.7182 45.801 32.531 44.8474L38.7188 41.5922C40.6856 40.5576 42.2864 39.7156 43.5268 38.898C44.821 38.0448 45.8528 37.1378 46.6074 35.9118C47.3618 34.686 47.6932 33.379 47.8498 31.876C48 30.4348 48 28.6766 48 26.5154V21.4846C48 19.3234 48 17.5652 47.8498 16.124C47.6932 14.621 47.3618 13.314 46.6074 12.0882C45.8528 10.8622 44.821 9.9552 43.5268 9.102C42.3638 8.3356 40.8842 7.5474 39.0832 6.5994L38.7186 6.4076L32.531 3.15252C30.7182 2.19888 29.2406 1.42158 27.9606 0.89222C26.6244 0.33972 25.3748 0 24 0Z" fill="#DEFFEB"/>
<path d="M27.4008 27.6H30.6008V24.4H29.9008V26.9H27.4008V27.6ZM24.0008 26.2C24.6008 26.2 25.1174 25.9834 25.5508 25.55C25.9841 25.1167 26.2008 24.6 26.2008 24C26.2008 23.4 25.9841 22.8834 25.5508 22.45C25.1174 22.0167 24.6008 21.8 24.0008 21.8C23.4008 21.8 22.8841 22.0167 22.4508 22.45C22.0174 22.8834 21.8008 23.4 21.8008 24C21.8008 24.6 22.0174 25.1167 22.4508 25.55C22.8841 25.9834 23.4008 26.2 24.0008 26.2ZM17.4008 23.6H18.1008V21.1H20.6008V20.4H17.4008V23.6ZM15.3008 29.7V18.3H32.7008V29.7H15.3008ZM16.0008 29H32.0008V19H16.0008V29Z" fill="black"/>
</svg>

      );
    case "key":
      return (
        <svg {...c}>
<path fill-rule="evenodd" clip-rule="evenodd" d="M24 0C22.6252 0 21.3756 0.33972 20.0394 0.89222C18.7594 1.42158 17.2818 2.1989 15.469 3.15252L9.2814 6.4076C7.3146 7.4422 5.7136 8.2844 4.4732 9.102C3.17906 9.9552 2.14726 10.8622 1.39258 12.0882C0.638101 13.314 0.306882 14.621 0.150182 16.124C-5.79096e-05 17.5652 -3.87111e-05 19.3234 1.28888e-06 21.4846V26.5154C-3.87111e-05 28.6766 -5.79096e-05 30.4348 0.150182 31.876C0.306882 33.379 0.638101 34.686 1.39258 35.9118C2.14726 37.1378 3.17906 38.0448 4.4732 38.898C5.7136 39.7156 7.3144 40.5578 9.2812 41.5924L15.469 44.8474C17.2818 45.801 18.7594 46.5784 20.0394 47.1078C21.3756 47.6602 22.6252 48 24 48C25.3748 48 26.6244 47.6602 27.9606 47.1078C29.2406 46.5784 30.7182 45.801 32.531 44.8474L38.7188 41.5922C40.6856 40.5576 42.2864 39.7156 43.5268 38.898C44.821 38.0448 45.8528 37.1378 46.6074 35.9118C47.3618 34.686 47.6932 33.379 47.8498 31.876C48 30.4348 48 28.6766 48 26.5154V21.4846C48 19.3234 48 17.5652 47.8498 16.124C47.6932 14.621 47.3618 13.314 46.6074 12.0882C45.8528 10.8622 44.821 9.9552 43.5268 9.102C42.3638 8.3356 40.8842 7.5474 39.0832 6.5994L38.7186 6.4076L32.531 3.15252C30.7182 2.19888 29.2406 1.42158 27.9606 0.89222C26.6244 0.33972 25.3748 0 24 0Z" fill="#D6F2FF"/>
<path d="M27.5 19.5L29.8 21.8C29.9869 21.9832 30.2382 22.0859 30.5 22.0859C30.7618 22.0859 31.0131 21.9832 31.2 21.8L33.3 19.7C33.4832 19.5131 33.5859 19.2618 33.5859 19C33.5859 18.7382 33.4832 18.4869 33.3 18.3L31 16" stroke="black" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M32.9984 14L23.3984 23.6" stroke="black" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.5 33C22.5376 33 25 30.5376 25 27.5C25 24.4624 22.5376 22 19.5 22C16.4624 22 14 24.4624 14 27.5C14 30.5376 16.4624 33 19.5 33Z" stroke="black" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

      );
    case "sprout":
      return (
        <svg {...c}>
<path fill-rule="evenodd" clip-rule="evenodd" d="M24 0C22.6252 0 21.3756 0.33972 20.0394 0.89222C18.7594 1.42158 17.2818 2.1989 15.469 3.15252L9.2814 6.4076C7.3146 7.4422 5.7136 8.2844 4.4732 9.102C3.17906 9.9552 2.14726 10.8622 1.39258 12.0882C0.638101 13.314 0.306882 14.621 0.150182 16.124C-5.79096e-05 17.5652 -3.87111e-05 19.3234 1.28888e-06 21.4846V26.5154C-3.87111e-05 28.6766 -5.79096e-05 30.4348 0.150182 31.876C0.306882 33.379 0.638101 34.686 1.39258 35.9118C2.14726 37.1378 3.17906 38.0448 4.4732 38.898C5.7136 39.7156 7.3144 40.5578 9.2812 41.5924L15.469 44.8474C17.2818 45.801 18.7594 46.5784 20.0394 47.1078C21.3756 47.6602 22.6252 48 24 48C25.3748 48 26.6244 47.6602 27.9606 47.1078C29.2406 46.5784 30.7182 45.801 32.531 44.8474L38.7188 41.5922C40.6856 40.5576 42.2864 39.7156 43.5268 38.898C44.821 38.0448 45.8528 37.1378 46.6074 35.9118C47.3618 34.686 47.6932 33.379 47.8498 31.876C48 30.4348 48 28.6766 48 26.5154V21.4846C48 19.3234 48 17.5652 47.8498 16.124C47.6932 14.621 47.3618 13.314 46.6074 12.0882C45.8528 10.8622 44.821 9.9552 43.5268 9.102C42.3638 8.3356 40.8842 7.5474 39.0832 6.5994L38.7186 6.4076L32.531 3.15252C30.7182 2.19888 29.2406 1.42158 27.9606 0.89222C26.6244 0.33972 25.3748 0 24 0Z" fill="#F8E7DE"/>
<path d="M26 21.536V19C26 17.9391 26.4214 16.9217 27.1716 16.1716C27.9217 15.4214 28.9391 15 30 15H31.5C31.6326 15 31.7598 15.0527 31.8536 15.1464C31.9473 15.2402 32 15.3674 32 15.5V17C32 18.0609 31.5786 19.0783 30.8284 19.8284C30.0783 20.5786 29.0609 21 28 21C26.9391 21 25.9217 21.4214 25.1716 22.1716C24.4214 22.9217 24 23.9391 24 25C24 27 25 28 25 30C25 31.0819 24.6491 32.1345 24 33" stroke="black" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 21C16.7428 20.4429 17.6262 20.1036 18.551 20.0202C19.4758 19.9368 20.4055 20.1126 21.2361 20.5279C22.0666 20.9431 22.7651 21.5815 23.2533 22.3713C23.7414 23.1612 24 24.0714 24 25C23.2572 25.5571 22.3738 25.8964 21.449 25.9798C20.5242 26.0632 19.5945 25.8874 18.7639 25.4721C17.9334 25.0569 17.2349 24.4185 16.7467 23.6287C16.2586 22.8388 16 21.9286 16 21Z" stroke="black" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17 33H31" stroke="black" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

      );
    default:
      return null;
  }
}

const ACCENT_STROKE: Record<Accent, string> = {
  orange: "#FA9510",
  indigo: "#6366F1",
  green: "#16A34A",
  sky: "#0EA5E9",
  terracotta: "#EA580C",
};

const ACCENT_CARD_CLASS: Record<Accent, string> = {
  orange: styles.productThemeOrange,
  indigo: styles.productThemeIndigo,
  green: styles.productThemeGreen,
  sky: styles.productThemeSky,
  terracotta: styles.productThemeTerracotta,
};

export default function TractracProductsSection() {
  return (
    <section className={styles.products} aria-labelledby="tractrac-products-heading">
      <div className={styles.productsInner}>
        <header className={styles.productsHeader}>
          <p className={styles.productsTag}>
            <span className={styles.productsTagDot} aria-hidden />
            <span>Our Products</span>
          </p>
          <h2 id="tractrac-products-heading" className={styles.productsTitle}>
            Solutions Built for Every Stakeholder in the Ecosystem
          </h2>
          <p className={styles.productsSub}>
            TracTrac develops solutions that serve farmers, service providers, investors, and ecosystem
            partners
          </p>
        </header>

        <div className={styles.productsGrid}>
          {PRODUCTS.map((p) => (
            <article
              key={p.id}
              className={`${styles.productCard} ${ACCENT_CARD_CLASS[p.accent]}`}
            >
              {/* <div className={styles.productHex} aria-hidden> */}
                <ProductIconSvg name={p.icon} stroke={ACCENT_STROKE[p.accent]} />
              {/* </div> */}
              <p className={styles.productAudience}>{p.audience}</p>
              <h3 className={styles.productName}>{p.title}</h3>
              <p className={styles.productDesc}>{p.description}</p>
              <Link href={p.href} className={styles.productExplore}>
                Explore →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
