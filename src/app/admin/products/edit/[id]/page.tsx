import { notFound } from "next/navigation";

import { z } from "zod";

import { ProductForm } from "@/features/products/components/product-form";
import {
  getAllCategories,
  getAllColors,
  getAllSizes,
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

  const { sizes } = await getAllSizes({
    page: 1,
    pageSize: 100,
  });

  const { colors } = await getAllColors({ page: 1, pageSize: 100 });

  return (
    <ProductForm
      id={product.id}
      categories={categories}
      images={product.images}
      sizes={sizes}
      defaultValues={{
        sizes: product.sizes.map((size) => size.id),
        slug: product.slug,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        categoryId: product.category?.id || null,
        description: product.description,
        status: product.status,
        images: product.images.map((image) => ({
          fileId: image.id,
          colorId: image.color?.id || null,
        })),
      }}
      colors={colors}
    />
  );
}
