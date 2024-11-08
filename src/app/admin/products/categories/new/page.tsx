import { redirectIfNotAdmin } from "@/features/auth/server/auth.query";
import { CategoryForm } from "@/features/products/components/category-form";

export default async function AdminDashboardNewCategory() {
  await redirectIfNotAdmin();

  return <CategoryForm />;
}
