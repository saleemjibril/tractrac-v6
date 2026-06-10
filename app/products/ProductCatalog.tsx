import Image from "next/image";
import Link from "next/link";
import TraxcelerateIcon from "../traxcelerate-product-page/TraxcelerateIcon";
import { PRODUCT_LISTING_ITEMS } from "./productsData";
import traxStyles from "../traxcelerate-product-page/traxcelerateProduct.module.css";
import extras from "./productsMarketingExtras.module.css";

export default function ProductCatalog() {
  const [featured, ...rest] = PRODUCT_LISTING_ITEMS;

  return (
    <section id="catalog" className={extras.catalog} aria-labelledby="catalog-heading">
      <div className={traxStyles.sectionInner}>
        <div className={extras.catalogHeader}>
          <div className={extras.catalogHeaderText}>
            <p className={traxStyles.eyebrow}>Product suite</p>
            <h2 id="catalog-heading" className={`${traxStyles.sectionTitle} ${extras.catalogTitle}`}>
              Smarter systems for modern mechanisation
            </h2>
            <p className={traxStyles.sectionLeadMuted}>
              Explore TracTrac&apos;s platforms, programmes, and financing models — each designed
              to work together across the value chain.
            </p>
          </div>
          <Link href="/traxcelerate-product-page" className={traxStyles.galleryLink}>
            View TRAxCelerate
            <TraxcelerateIcon name="arr" size={14} color="#060C15" strokeWidth={2.2} />
          </Link>
        </div>

        <div className={extras.catalogGrid}>
          {featured && (
            <article
              className={`${extras.catalogCard} ${extras.catalogFeatured}`}
              style={{ "--tag-color": "#FA9413" } as React.CSSProperties}
            >
              <Link href={featured.href} className={extras.catalogCardLink}>
                <div className={extras.catalogImageWrap}>
                  <Image
                    src={featured.image}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 60vw"
                    className={extras.catalogImage}
                    unoptimized
                  />
                  <div className={extras.catalogImageOverlay} aria-hidden />
                  <span className={extras.catalogBadge}>Flagship platform</span>
                </div>
                <div className={extras.catalogBody}>
                  <h3 className={extras.catalogCardTitle}>{featured.name}</h3>
                  <p className={extras.catalogCardDesc}>{featured.description}</p>
                  <span className={extras.catalogCta}>
                    Explore product
                    <TraxcelerateIcon name="arr" size={14} color="#060C15" strokeWidth={2.2} />
                  </span>
                </div>
              </Link>
            </article>
          )}

          {rest.map((product) => (
            <article
              key={product.id}
              className={extras.catalogCard}
              style={{ "--tag-color": "#64748b" } as React.CSSProperties}
            >
              <Link href={product.href} className={extras.catalogCardLink}>
                <div className={extras.catalogImageWrap}>
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={extras.catalogImage}
                    unoptimized
                  />
                  <div className={extras.catalogImageOverlay} aria-hidden />
                </div>
                <div className={extras.catalogBody}>
                  <h3 className={extras.catalogCardTitle}>{product.name}</h3>
                  <p className={extras.catalogCardDesc}>{product.description}</p>
                  <span className={extras.catalogCta}>
                    Learn more
                    <TraxcelerateIcon name="arr" size={14} color="#060C15" strokeWidth={2.2} />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
