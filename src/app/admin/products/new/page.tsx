import { ensureAdmin } from "@/features/auth/server/auth.query";
import { ProductForm } from "@/features/products/components/product-form";
import {
  getAllCategories,
  getAllColors,
  getAllSizes,
} from "@/features/products/server/products.query";

export default async function AdminDashboardNewProduct() {
  await ensureAdmin({ redirect: true });

  const { categories } = await getAllCategories({
    page: 1,
    pageSize: 1000,
  });

  const { sizes } = await getAllSizes({
    page: 1,
    pageSize: 100,
  });

  const { colors } = await getAllColors({ page: 1, pageSize: 100 });

  return <ProductForm categories={categories} sizes={sizes} colors={colors} />;
}
