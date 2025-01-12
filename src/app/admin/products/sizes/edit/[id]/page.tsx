import { notFound } from "next/navigation";

import { z } from "zod";

import { SizeForm } from "@/features/products/components/size-form";
import { getSize } from "@/features/products/server/products.query";

export default async function EditSize({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const rawId = (await params).id;
  const { error, data: id } = z.coerce.number().int().safeParse(rawId);
  if (error) return notFound();

  const size = await getSize(id);
  if (!size) return notFound();

  return (
    <SizeForm
      id={size.id}
      defaultValues={{
        name: size.name,
        slug: size.slug,
      }}
    />
  );
}
