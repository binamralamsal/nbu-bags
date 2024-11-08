import { AdminPageWrapper } from "@/components/admin-page-wrapper";

import { redirectIfNotAdmin } from "@/features/auth/server/auth.query";

export default async function AdminDashboardProducts() {
  await redirectIfNotAdmin();

  return (
    <AdminPageWrapper pageTitle="Products">
      <div></div>
    </AdminPageWrapper>
  );
}
