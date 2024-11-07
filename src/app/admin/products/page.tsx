import { AdminPageWrapper } from "@/components/admin-page-wrapper";

import { redirectIfNotAdmin } from "@/server/features/auth/auth.query";

export default async function AdminDashboardProducts() {
  await redirectIfNotAdmin();

  return (
    <AdminPageWrapper pageTitle="Products">
      <div></div>
    </AdminPageWrapper>
  );
}
