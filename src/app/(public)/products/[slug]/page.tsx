import { notFound } from "next/navigation";

import { z } from "zod";

import { SingleProductDetails } from "@/features/products/components/single-product-details";
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
      <SingleProductDetails product={product} />
    </section>
  );
}
