import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Product, WithContext } from "schema-dts";
import { z } from "zod";

import { site } from "@/configs/site";
import { SingleProductDetails } from "@/features/products/components/single-product-details";
import { getProductBySlug } from "@/features/products/server/products.query";

type SingleProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SingleProductPage({
  params,
}: SingleProductPageProps) {
  const rawSlug = (await params).slug;
  const { error, data: slug } = z.coerce.string().safeParse(rawSlug);
  if (error) return notFound();

  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  const jsonLd: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images[0]?.url || "/file.svg",
    description: product.description,
    sku: product.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "NPR",
      price: product.salePrice || product.price,
      availability: "InStock",
      url: `${site.name}/products/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: site.name,
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        merchantReturnDays: 7,
      },
    },
    category: product.category?.name || "General",
    brand: {
      "@type": "Brand",
      name: site.name,
    },
    size: product.sizes.map((size) => size.name),
  };

  return (
    <section className="container grid gap-8 py-4 md:grid-cols-2 md:py-6 lg:gap-16 lg:py-8">
      <SingleProductDetails product={product} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

export async function generateMetadata({
  params,
}: SingleProductPageProps): Promise<Metadata> {
  const rawSlug = (await params).slug;
  const { error, data: slug } = z.coerce.string().safeParse(rawSlug);
  if (error) return notFound();

  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  return {
    title: product.name,
    description: product.description,
    keywords: [product.name, product.category?.name ?? "", "bags", "fashion"],
    openGraph: {
      title: product.name,
      description: product.description,
      url: `${site.url}/products/${product.slug}`,
      images: product.images.map((image) => `${site.url}${image.url}`),
    },
    alternates: {
      canonical: `${site.url}/products/${product.slug}`,
    },
  };
}
