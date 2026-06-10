import type { IconName } from "../traxcelerate-product-page/TraxcelerateIcon";

export type ProductHeroStat = {
  v: string;
  l: string;
  sub: string;
};

export type ProductStep = {
  n: string;
  t: string;
  i: IconName;
  d: string;
};

export type ProductProofStat = {
  v: string;
  l: string;
  icon: IconName;
  color: string;
};

export type ProductSideStat = {
  big: string;
  variant: "orange" | "dark";
  small: string;
};

export type ProductCtaLink = {
  label: string;
  href: string;
};

export type ProductPageConfig = {
  slug: string;
  metadata: { title: string; description: string };
  hero: {
    badge: string;
    kicker?: string;
    title: string;
    titleHighlight?: string;
    lede: string;
    image: string;
    stats?: ProductHeroStat[];
    primaryCta: ProductCtaLink;
    secondaryCta?: ProductCtaLink;
    ghostCta?: ProductCtaLink;
  };
  overview: {
    eyebrow: string;
    title: string;
    titleHighlight?: string;
    paragraphs: string[];
    sideStats: ProductSideStat[];
    image: string;
  };
  steps: {
    eyebrow: string;
    title: string;
    lead: string;
    items: ProductStep[];
  };
  proof: {
    eyebrow: string;
    title: string;
    lead: string;
    items: ProductProofStat[];
  };
  cta: {
    badge: string;
    title: string;
    titleHighlight?: string;
    lead: string;
    primary: ProductCtaLink;
    secondary?: ProductCtaLink;
    link?: ProductCtaLink;
  };
  partnerForm?: "join" | "partner";
};
