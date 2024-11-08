import { notFound } from "next/navigation";

import { z } from "zod";

import { CategoryForm } from "@/features/products/components/category-form";
import { getCategory } from "@/features/products/server/products.query";

export default async function EditCategory({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const rawId = (await params).id;
  const { error, data: id } = z.coerce.number().int().safeParse(rawId);
  if (error) return notFound();

  const category = await getCategory(id);
  if (!category) return notFound();

  return (
    <CategoryForm
      id={category.id}
      defaultValues={{
        name: category.name,
        slug: category.slug,
      }}
    />
  );
}
