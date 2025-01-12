import { notFound } from "next/navigation";

import { z } from "zod";

import { ColorForm } from "@/features/products/components/color-form";
import { getColor } from "@/features/products/server/products.query";

export default async function EditColor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const rawId = (await params).id;
  const { error, data: id } = z.coerce.number().int().safeParse(rawId);
  if (error) return notFound();

  const color = await getColor(id);
  if (!color) return notFound();

  return (
    <ColorForm
      id={color.id}
      defaultValues={{
        name: color.name,
        slug: color.slug,
        color: color.color,
      }}
    />
  );
}
