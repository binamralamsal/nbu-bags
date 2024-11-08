import { AdminPageWrapper } from "@/components/admin-page-wrapper";

import { ensureAdmin } from "@/features/auth/server/auth.query";

export default async function AdminDashboard() {
  await ensureAdmin({ redirect: true });

  return (
    <AdminPageWrapper pageTitle="Home">
      <div></div>
    </AdminPageWrapper>
  );
}
