import { ensureAdmin } from "@/features/auth/server/auth.query";
import { ColorForm } from "@/features/products/components/color-form";

export default async function AdminDashboardNewColor() {
  await ensureAdmin({ redirect: true });

  return <ColorForm />;
}
