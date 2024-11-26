import { notFound } from "next/navigation";

import { z } from "zod";

import { ProductForm } from "@/features/products/components/product-form";
import {
  getAllCategories,
  getProduct,
} from "@/features/products/server/products.query";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const rawId = (await params).id;
  const { error, data: id } = z.coerce.number().int().safeParse(rawId);
  if (error) return notFound();

  const product = await getProduct(id);
  if (!product) return notFound();

  const { categories } = await getAllCategories({
    page: 1,
    pageSize: 1000,
  });

  return (
    <ProductForm
      id={product.id}
      categories={categories}
      images={product.images}
      defaultValues={{
        slug: product.slug,
        name: product.name,
        categoryId: product.categoryId,
        description: product.description,
        status: product.status,
        images: product.images.map((image) => image.id),
      }}
    />
  );
}
