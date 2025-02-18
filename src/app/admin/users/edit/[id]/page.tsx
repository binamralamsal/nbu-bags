import { notFound } from "next/navigation";

import { z } from "zod";

import { UserForm } from "@/features/auth/components/user-form";
import { getUser } from "@/features/auth/server/auth.query";

export default async function AdminDashboardEditUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const rawId = (await params).id;
  const { error, data: id } = z.coerce.number().int().safeParse(rawId);
  if (error) return notFound();

  const user = await getUser(id);
  if (!user) return notFound();

  return (
    <UserForm
      id={user.id}
      defaultValues={{
        name: user.name,
        role: user.role,
        email: user.email,
        password: "",
        confirmPassword: "",
      }}
    />
  );
}
