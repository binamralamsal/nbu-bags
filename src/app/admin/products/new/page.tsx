import { ensureAdmin } from "@/features/auth/server/auth.query";
import { ProductForm } from "@/features/products/components/product-form";
import { getAllCategories } from "@/features/products/server/products.query";

export default async function AdminDashboardNewProduct() {
  await ensureAdmin({ redirect: true });

  const { categories } = await getAllCategories({
    page: 1,
    pageSize: 1000,
  });

  return <ProductForm categories={categories} />;
}
