import Image from "next/image";
import Link from "next/link";

import { PlaceholderImage } from "@/components/placeholder-image";

import { Product, WithContext } from "schema-dts";

import { site } from "@/configs/site";
import { cn } from "@/utils/cn";

type ProductCardProps = {
  name: string;
  price: number;
  salePrice: number | null;
  slug: string;
  category: string | null;
  images: Partial<{ url: string }[]>;
};

export function ProductCard(props: ProductCardProps) {
  const productUrl = `/products/${props.slug}`;

  const firstImage = props.images[0];
  const secondImage = props.images[1];
  const discount = props.salePrice
    ? Math.round(((props.price - props.salePrice) / props.price) * 100)
    : 0;

  const jsonLd: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: props.name,
    image: firstImage?.url || "/file.svg",
    description: `Buy ${props.name} at a great price!`,
    sku: props.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "NRS",
      price: props.salePrice || props.price,
      url: productUrl,
      seller: {
        "@type": "Organization",
        name: site.name,
      },
    },
    category: props.category || "General",
  };

  return (
    <div>
      <Link href={productUrl} className="group relative block">
        {firstImage ? (
          <Image
            src={firstImage?.url || "/file.svg"}
            alt={`${props.name}`}
            width={600}
            height={600}
            className={cn(
              "h-60 w-full object-cover transition duration-500 md:h-80",
              secondImage && "group-hover:opacity-0",
            )}
          />
        ) : (
          <PlaceholderImage className="h-60 w-full object-cover md:h-80" />
        )}

        {secondImage && (
          <Image
            src={secondImage.url}
            alt={`${props.name}`}
            width={600}
            height={600}
            className={cn(
              "absolute left-0 top-0 h-60 w-full object-cover opacity-0 transition duration-500 md:h-80",
              secondImage && "group-hover:opacity-100",
            )}
          />
        )}

        {props.salePrice && (
          <div className="absolute left-0 top-4 bg-primary px-4 py-1 text-sm uppercase text-primary-foreground">
            {discount}% off
          </div>
        )}
      </Link>

      <div className="mt-4 md:mt-6">
        {props.category && (
          <div className="text-sm text-muted-foreground">{props.category}</div>
        )}
        <Link href={productUrl} className="block font-semibold tracking-tight">
          {props.name}
        </Link>
        <div className="text-gray-700">
          {props.salePrice ? (
            <s className="text-gray-500">Rs. {props.price.toLocaleString()}</s>
          ) : (
            <span>Rs. {props.price.toLocaleString()}</span>
          )}

          {props.salePrice && (
            <span className="ml-2 text-primary">
              MRP Rs. {props.salePrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
