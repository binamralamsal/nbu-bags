import { ensureAdmin } from "@/features/auth/server/auth.query";
import { SizeForm } from "@/features/products/components/size-form";

export default async function AdminDashboardNewSize() {
  await ensureAdmin({ redirect: true });

  return <SizeForm />;
}
