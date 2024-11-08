import { ensureAdmin } from "@/features/auth/server/auth.query";
import { CategoryForm } from "@/features/products/components/category-form";

export default async function AdminDashboardNewCategory() {
  await ensureAdmin({ redirect: true });

  return <CategoryForm />;
}
