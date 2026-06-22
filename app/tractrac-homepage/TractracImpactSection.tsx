"use client";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import styles from "./tractracHomepage.module.css";

type ImpactIconName = "briefcase" | "farmers" | "tractor" | "tiller";

const IMPACT_CARDS: {
  id: string;
  stat: string;
  label: string;
  description: string;
  icon: ImpactIconName;
}[] = [
  {
    id: "investment",
    stat: "$2B+",
    label: "Investment Generated",
    description: "for Nigeria's mechanization sector",
    icon: "briefcase",
  },
  {
    id: "farmers",
    stat: "100,000+",
    label: "Farmers Accessed",
    description: "mechanization services through TracTrac platforms",
    icon: "farmers",
  },
  {
    id: "tractors",
    stat: "800+",
    label: "Tractors Delivered",
    description: "handed over to farmers and service providers",
    icon: "tractor",
  },
  {
    id: "tillers",
    stat: "350+",
    label: "Power Tillers",
    description: "deployed to farms across multiple states",
    icon: "tiller",
  },
];

function ImpactIcon({ name }: { name: ImpactIconName }) {
  const common = { width: 48, height: 48, viewBox: "0 0 48 48", "aria-hidden": true as const };

  switch (name) {
    case "briefcase":
      return (
        <svg {...common} fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M24 0C22.6252 0 21.3756 0.33972 20.0394 0.89222C18.7594 1.42158 17.2818 2.1989 15.469 3.15252L9.2814 6.4076C7.3146 7.4422 5.7136 8.2844 4.4732 9.102C3.17906 9.9552 2.14726 10.8622 1.39258 12.0882C0.638101 13.314 0.306882 14.621 0.150182 16.124C-5.79096e-05 17.5652 -3.87111e-05 19.3234 1.28888e-06 21.4846V26.5154C-3.87111e-05 28.6766 -5.79096e-05 30.4348 0.150182 31.876C0.306882 33.379 0.638101 34.686 1.39258 35.9118C2.14726 37.1378 3.17906 38.0448 4.4732 38.898C5.7136 39.7156 7.3144 40.5578 9.2812 41.5924L15.469 44.8474C17.2818 45.801 18.7594 46.5784 20.0394 47.1078C21.3756 47.6602 22.6252 48 24 48C25.3748 48 26.6244 47.6602 27.9606 47.1078C29.2406 46.5784 30.7182 45.801 32.531 44.8474L38.7188 41.5922C40.6856 40.5576 42.2864 39.7156 43.5268 38.898C44.821 38.0448 45.8528 37.1378 46.6074 35.9118C47.3618 34.686 47.6932 33.379 47.8498 31.876C48 30.4348 48 28.6766 48 26.5154V21.4846C48 19.3234 48 17.5652 47.8498 16.124C47.6932 14.621 47.3618 13.314 46.6074 12.0882C45.8528 10.8622 44.821 9.9552 43.5268 9.102C42.3638 8.3356 40.8842 7.5474 39.0832 6.5994L38.7186 6.4076L32.531 3.15252C30.7182 2.19888 29.2406 1.42158 27.9606 0.89222C26.6244 0.33972 25.3748 0 24 0Z" fill="#FFF4E1"/>
<path d="M23.75 23.75H23.7604" stroke="#F09A05" stroke-width="0.734375" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M27.6693 17.8747V15.9163C27.6693 15.397 27.4629 14.8988 27.0957 14.5316C26.7284 14.1643 26.2303 13.958 25.7109 13.958H21.7943C21.2749 13.958 20.7768 14.1643 20.4095 14.5316C20.0423 14.8988 19.8359 15.397 19.8359 15.9163V17.8747" stroke="#F09A05" stroke-width="0.734375" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M33.5443 24.7295C30.6389 26.6477 27.2341 27.6702 23.7526 27.6702C20.2711 27.6702 16.8663 26.6477 13.9609 24.7295" stroke="#F09A05" stroke-width="0.734375" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M31.5859 17.875H15.9193C14.8377 17.875 13.9609 18.7518 13.9609 19.8333V29.625C13.9609 30.7066 14.8377 31.5833 15.9193 31.5833H31.5859C32.6675 31.5833 33.5443 30.7066 33.5443 29.625V19.8333C33.5443 18.7518 32.6675 17.875 31.5859 17.875Z" stroke="#F09A05" stroke-width="0.734375" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
      );
    case "farmers":
      return (
        <svg  {...common} fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M24 0C22.6252 0 21.3756 0.33972 20.0394 0.89222C18.7594 1.42158 17.2818 2.1989 15.469 3.15252L9.2814 6.4076C7.3146 7.4422 5.7136 8.2844 4.4732 9.102C3.17906 9.9552 2.14726 10.8622 1.39258 12.0882C0.638101 13.314 0.306882 14.621 0.150182 16.124C-5.79096e-05 17.5652 -3.87111e-05 19.3234 1.28888e-06 21.4846V26.5154C-3.87111e-05 28.6766 -5.79096e-05 30.4348 0.150182 31.876C0.306882 33.379 0.638101 34.686 1.39258 35.9118C2.14726 37.1378 3.17906 38.0448 4.4732 38.898C5.7136 39.7156 7.3144 40.5578 9.2812 41.5924L15.469 44.8474C17.2818 45.801 18.7594 46.5784 20.0394 47.1078C21.3756 47.6602 22.6252 48 24 48C25.3748 48 26.6244 47.6602 27.9606 47.1078C29.2406 46.5784 30.7182 45.801 32.531 44.8474L38.7188 41.5922C40.6856 40.5576 42.2864 39.7156 43.5268 38.898C44.821 38.0448 45.8528 37.1378 46.6074 35.9118C47.3618 34.686 47.6932 33.379 47.8498 31.876C48 30.4348 48 28.6766 48 26.5154V21.4846C48 19.3234 48 17.5652 47.8498 16.124C47.6932 14.621 47.3618 13.314 46.6074 12.0882C45.8528 10.8622 44.821 9.9552 43.5268 9.102C42.3638 8.3356 40.8842 7.5474 39.0832 6.5994L38.7186 6.4076L32.531 3.15252C30.7182 2.19888 29.2406 1.42158 27.9606 0.89222C26.6244 0.33972 25.3748 0 24 0Z" fill="#DCFCE7"/>
        <path d="M28 33V31C28 29.9391 27.5786 28.9217 26.8284 28.1716C26.0783 27.4214 25.0609 27 24 27H18C16.9391 27 15.9217 27.4214 15.1716 28.1716C14.4214 28.9217 14 29.9391 14 31V33" stroke="#16A34A" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M28 15.1279C28.8578 15.3503 29.6174 15.8512 30.1597 16.552C30.702 17.2528 30.9962 18.1138 30.9962 18.9999C30.9962 19.886 30.702 20.7471 30.1597 21.4479C29.6174 22.1487 28.8578 22.6496 28 22.8719" stroke="#16A34A" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M34 32.9999V30.9999C33.9993 30.1136 33.7044 29.2527 33.1614 28.5522C32.6184 27.8517 31.8581 27.3515 31 27.1299" stroke="#16A34A" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M21 23C23.2091 23 25 21.2091 25 19C25 16.7909 23.2091 15 21 15C18.7909 15 17 16.7909 17 19C17 21.2091 18.7909 23 21 23Z" stroke="#16A34A" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
      );
    case "tractor":
      return (
        <svg {...common} fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M24 0C22.6252 0 21.3756 0.33972 20.0394 0.89222C18.7594 1.42158 17.2818 2.1989 15.469 3.15252L9.2814 6.4076C7.3146 7.4422 5.7136 8.2844 4.4732 9.102C3.17906 9.9552 2.14726 10.8622 1.39258 12.0882C0.638101 13.314 0.306882 14.621 0.150182 16.124C-5.79096e-05 17.5652 -3.87111e-05 19.3234 1.28888e-06 21.4846V26.5154C-3.87111e-05 28.6766 -5.79096e-05 30.4348 0.150182 31.876C0.306882 33.379 0.638101 34.686 1.39258 35.9118C2.14726 37.1378 3.17906 38.0448 4.4732 38.898C5.7136 39.7156 7.3144 40.5578 9.2812 41.5924L15.469 44.8474C17.2818 45.801 18.7594 46.5784 20.0394 47.1078C21.3756 47.6602 22.6252 48 24 48C25.3748 48 26.6244 47.6602 27.9606 47.1078C29.2406 46.5784 30.7182 45.801 32.531 44.8474L38.7188 41.5922C40.6856 40.5576 42.2864 39.7156 43.5268 38.898C44.821 38.0448 45.8528 37.1378 46.6074 35.9118C47.3618 34.686 47.6932 33.379 47.8498 31.876C48 30.4348 48 28.6766 48 26.5154V21.4846C48 19.3234 48 17.5652 47.8498 16.124C47.6932 14.621 47.3618 13.314 46.6074 12.0882C45.8528 10.8622 44.821 9.9552 43.5268 9.102C42.3638 8.3356 40.8842 7.5474 39.0832 6.5994L38.7186 6.4076L32.531 3.15252C30.7182 2.19888 29.2406 1.42158 27.9606 0.89222C26.6244 0.33972 25.3748 0 24 0Z" fill="#EEF2FF"/>
<path d="M21.082 22.2915L34.3737 23.379C34.6728 23.4378 34.9385 23.6074 35.1178 23.8539C35.2971 24.1004 35.3766 24.4055 35.3404 24.7082L34.5368 29.7324C34.4914 30.0163 34.3462 30.2747 34.1274 30.4612C33.9086 30.6476 33.6305 30.75 33.343 30.7498H33.1654" stroke="#6366F1" stroke-width="0.90625" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M28.3346 30.75H22.293" stroke="#6366F1" stroke-width="0.90625" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30.7513 15.0415C30.4308 15.0415 30.1235 15.1688 29.8969 15.3954C29.6703 15.622 29.543 15.9294 29.543 16.2498V22.9839" stroke="#6366F1" stroke-width="0.90625" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.625 13.8335H22.4475C22.7392 13.8337 23.021 13.9393 23.2408 14.131C23.4607 14.3226 23.6038 14.5874 23.6438 14.8763L24.7083 22.5891" stroke="#6366F1" stroke-width="0.90625" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.832 22.2918V13.8335" stroke="#6366F1" stroke-width="0.90625" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.457 27.125H17.4699" stroke="#6366F1" stroke-width="0.90625" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.668 21.2043V13.8335" stroke="#6366F1" stroke-width="0.90625" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30.7487 33.1668C32.0834 33.1668 33.1654 32.0849 33.1654 30.7502C33.1654 29.4155 32.0834 28.3335 30.7487 28.3335C29.414 28.3335 28.332 29.4155 28.332 30.7502C28.332 32.0849 29.414 33.1668 30.7487 33.1668Z" stroke="#6366F1" stroke-width="0.90625" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.4596 33.1668C20.7964 33.1668 23.5013 30.4619 23.5013 27.1252C23.5013 23.7884 20.7964 21.0835 17.4596 21.0835C14.1229 21.0835 11.418 23.7884 11.418 27.1252C11.418 30.4619 14.1229 33.1668 17.4596 33.1668Z" stroke="#6366F1" stroke-width="0.90625" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
      );
    case "tiller":
      return (
        <svg {...common} fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M24 0C22.6252 0 21.3756 0.33972 20.0394 0.89222C18.7594 1.42158 17.2818 2.1989 15.469 3.15252L9.2814 6.4076C7.3146 7.4422 5.7136 8.2844 4.4732 9.102C3.17906 9.9552 2.14726 10.8622 1.39258 12.0882C0.638101 13.314 0.306882 14.621 0.150182 16.124C-5.79096e-05 17.5652 -3.87111e-05 19.3234 1.28888e-06 21.4846V26.5154C-3.87111e-05 28.6766 -5.79096e-05 30.4348 0.150182 31.876C0.306882 33.379 0.638101 34.686 1.39258 35.9118C2.14726 37.1378 3.17906 38.0448 4.4732 38.898C5.7136 39.7156 7.3144 40.5578 9.2812 41.5924L15.469 44.8474C17.2818 45.801 18.7594 46.5784 20.0394 47.1078C21.3756 47.6602 22.6252 48 24 48C25.3748 48 26.6244 47.6602 27.9606 47.1078C29.2406 46.5784 30.7182 45.801 32.531 44.8474L38.7188 41.5922C40.6856 40.5576 42.2864 39.7156 43.5268 38.898C44.821 38.0448 45.8528 37.1378 46.6074 35.9118C47.3618 34.686 47.6932 33.379 47.8498 31.876C48 30.4348 48 28.6766 48 26.5154V21.4846C48 19.3234 48 17.5652 47.8498 16.124C47.6932 14.621 47.3618 13.314 46.6074 12.0882C45.8528 10.8622 44.821 9.9552 43.5268 9.102C42.3638 8.3356 40.8842 7.5474 39.0832 6.5994L38.7186 6.4076L32.531 3.15252C30.7182 2.19888 29.2406 1.42158 27.9606 0.89222C26.6244 0.33972 25.3748 0 24 0Z" fill="#FFEDD5"/>
<g clip-path="url(#clip0_146_30443)">
<path d="M25.2734 29.25C25.2734 30.6067 24.1692 31.7109 22.8125 31.7109C21.4558 31.7109 20.3516 30.6067 20.3516 29.25C20.3516 27.8933 21.4558 26.7891 22.8125 26.7891C24.1692 26.7891 25.2734 27.8933 25.2734 29.25ZM21.3359 29.25C21.3359 30.0639 21.9986 30.7266 22.8125 30.7266C23.6264 30.7266 24.2891 30.0639 24.2891 29.25C24.2891 28.4361 23.6264 27.7734 22.8125 27.7734C21.9986 27.7734 21.3359 28.4361 21.3359 29.25Z" fill="#FA8F00"/>
<path d="M11.6562 13.6641H12.9688C14.3079 13.6641 15.3968 14.2163 15.9794 15.1719C15.9864 15.1811 15.9968 15.186 16.0033 15.1957L20.717 22.2664C21.0465 21.8275 21.5663 21.5391 22.1562 21.5391H22.9766V19.8216C22.2215 19.6058 21.6641 18.9173 21.6641 18.0938C21.6641 17.0985 22.4735 16.2891 23.4688 16.2891H27.4062C29.1251 16.2891 30.5234 17.6874 30.5234 19.4062C30.5234 19.678 30.303 19.8984 30.0312 19.8984H29.2109V21.5391H30.0312C31.0265 21.5391 31.8359 22.3485 31.8359 23.3438V28.5938C31.8359 28.8059 31.7001 28.9937 31.4995 29.0609L27.7872 30.2984C27.3023 32.6011 25.2573 34.3359 22.8125 34.3359C20.0081 34.3359 17.7266 32.0544 17.7266 29.25C17.7266 27.3428 18.7943 25.6973 20.3516 24.827V23.4928L15.1842 15.7418C15.1806 15.7363 15.1805 15.7298 15.1771 15.7243C15.1748 15.7206 15.1704 15.7193 15.1682 15.7155C14.7747 15.0374 13.9736 14.6484 12.9688 14.6484H11.6562C11.3845 14.6484 11.1641 14.428 11.1641 14.1562C11.1641 13.8845 11.3845 13.6641 11.6562 13.6641ZM27.4062 17.2734H23.4688C23.0163 17.2734 22.6484 17.6413 22.6484 18.0938C22.6484 18.5462 23.0163 18.9141 23.4688 18.9141H29.482C29.259 17.9745 28.4131 17.2734 27.4062 17.2734ZM28.2266 19.8984H23.9609V21.5391H28.2266V19.8984ZM18.7109 29.25C18.7109 31.5116 20.5509 33.3516 22.8125 33.3516C25.0741 33.3516 26.9141 31.5116 26.9141 29.25C26.9141 26.9884 25.0741 25.1484 22.8125 25.1484C20.5509 25.1484 18.7109 26.9884 18.7109 29.25ZM22.8125 24.1641C24.4138 24.1641 25.8271 24.9228 26.7601 26.083C26.7862 25.8359 26.9882 25.6406 27.2422 25.6406H28.8828C29.1545 25.6406 29.375 25.8611 29.375 26.1328C29.375 26.4045 29.1545 26.625 28.8828 26.625H27.2422C27.2041 26.625 27.1702 26.6115 27.1346 26.6033C27.6057 27.3696 27.8908 28.2614 27.8958 29.224L30.8516 28.2387V23.3438C30.8516 22.8913 30.4837 22.5234 30.0312 22.5234H22.1562C21.7038 22.5234 21.3359 22.8913 21.3359 23.3438V24.4085C21.8063 24.2644 22.2956 24.1641 22.8125 24.1641Z" fill="#FA8F00"/>
<path d="M27.2422 24H28.8828C29.1545 24 29.375 24.2205 29.375 24.4922C29.375 24.7639 29.1545 24.9844 28.8828 24.9844H27.2422C26.9705 24.9844 26.75 24.7639 26.75 24.4922C26.75 24.2205 26.9705 24 27.2422 24Z" fill="#FA8F00"/>
</g>
<defs>
<clipPath id="clip0_146_30443">
<rect width="21" height="21" fill="white" transform="matrix(-1 0 0 1 32 13.5)"/>
</clipPath>
</defs>
</svg>

      );
    default:
      return null;
  }
}

export default function TractracImpactSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [navState, setNavState] = useState({ left: false, right: false });

  const updateNav = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const max = scrollWidth - clientWidth;
    setNavState({
      left: scrollLeft > 4,
      right: max > 4 && scrollLeft < max - 4,
    });
  }, []);

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateNav();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => updateNav()) : null;
    ro?.observe(el);
    el.addEventListener("scroll", updateNav, { passive: true });
    return () => {
      ro?.disconnect();
      el.removeEventListener("scroll", updateNav);
    };
  }, [updateNav]);

  const scrollByDir = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-impact-card]");
    const delta = card ? card.getBoundingClientRect().width + 16 : 280;
    el.scrollBy({ left: dir * delta, behavior: "smooth" });
  };

  return (
    <section className={styles.impact} aria-labelledby="tractrac-impact-heading">
      <div className={styles.impactInner}>
        <div className={styles.impactHeader}>
          <div className={styles.impactBadge}>
            {/* <span className={styles.impactBadgeDot} aria-hidden /> */}
            <span>Our Impact</span>
          </div>
          <h2 id="tractrac-impact-heading" className={styles.impactTitle}>
            {bindTitleOrphans("Transforming Mechanization Across Nigeria")}
          </h2>
          <p className={styles.impactSub}>
            Our work is already transforming mechanization access across Nigeria. These numbers
            represent farms cultivated, incomes increased, and food systems strengthened.
          </p>
        </div>

        <div ref={scrollerRef} className={styles.impactCarousel}>
          <div className={styles.impactTrack}>
            {IMPACT_CARDS.map((card) => (
              <article key={card.id} className={styles.impactCard} data-impact-card>
                <div className={styles.impactHex} aria-hidden>
                  <ImpactIcon name={card.icon} />
                </div>
                <div className={styles.impactCardBody}>
                  <p className={styles.impactStat}>{card.stat}</p>
                  <h3 className={styles.impactLabel}>{card.label}</h3>
                  <p className={styles.impactDesc}>{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* <div className={styles.impactNav}>
          <div className={styles.impactNavPill}>
            <button
              type="button"
              className={styles.impactNavBtn}
              aria-label="Scroll impact cards left"
              disabled={!navState.left}
              onClick={() => scrollByDir(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              className={styles.impactNavBtn}
              aria-label="Scroll impact cards right"
              disabled={!navState.right}
              onClick={() => scrollByDir(1)}
            >
              ›
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
}
