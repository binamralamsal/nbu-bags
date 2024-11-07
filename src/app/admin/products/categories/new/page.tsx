import { CategoryForm } from "@/features/products/components/category-form";
import { redirectIfNotAdmin } from "@/server/features/auth/auth.query";

export default async function AdminDashboardNewCategory() {
  await redirectIfNotAdmin();

  return <CategoryForm />;
}
