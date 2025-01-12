import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { z } from "zod";

import { ProductImagesGallery } from "@/features/products/components/product-images-gallery";
import { getProductBySlug } from "@/features/products/server/products.query";

export default async function SingleProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const rawSlug = (await params).slug;
  const { error, data: slug } = z.coerce.string().safeParse(rawSlug);
  if (error) return notFound();

  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  return (
    <section className="container grid gap-8 py-4 md:grid-cols-2 md:py-6 lg:gap-16 lg:py-8">
      <ProductImagesGallery
        images={product.images}
        inSale={Boolean(product.salePrice)}
      />
      <div className="space-y-4 lg:space-y-6">
        <div className="space-y-2">
          {product.category && (
            <Link
              href={`/products?categories=${product.category.slug}`}
              className="text-muted-foreground transition hover:text-primary"
            >
              {product.category.name}
            </Link>
          )}

          <h2 className="text-balance text-2xl font-semibold md:text-3xl">
            {product.name}
          </h2>
        </div>

        <Separator />

        <div className="text-xl text-gray-700">
          {product.salePrice ? (
            <s className="text-gray-500">
              Rs. {product.price.toLocaleString()}
            </s>
          ) : (
            <span>Rs. {product.price.toLocaleString()}</span>
          )}

          {product.salePrice && (
            <span className="ml-2 font-medium text-primary">
              Rs. {product.salePrice.toLocaleString()}
            </span>
          )}
        </div>

        {product.sizes.length > 0 && (
          <div className="flex gap-1">
            <h3 className="font-semibold">Sizes: </h3>
            <span className="text-muted-foreground">
              {product.sizes.map((size) => size.name).join(", ")}
            </span>
          </div>
        )}

        <p>{product.description}</p>

        <Button size="lg">Contact for Buying</Button>
      </div>
    </section>
  );
}
