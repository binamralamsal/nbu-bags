import { AdminPageWrapper } from "@/components/admin-page-wrapper";

import { ensureAdmin } from "@/features/auth/server/auth.query";

export default async function AdminDashboardProducts() {
  await ensureAdmin({ redirect: true });

  return (
    <AdminPageWrapper pageTitle="Products">
      <div></div>
    </AdminPageWrapper>
  );
}
