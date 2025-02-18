import { UserForm } from "@/features/auth/components/user-form";
import { ensureAdmin } from "@/features/auth/server/auth.query";

export default async function AdminDashboardNewUser() {
  await ensureAdmin({ redirect: true });

  return <UserForm />;
}
