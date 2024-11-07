import { AdminSidebarPageWrapper } from "@/components/admin-sidebar-page-wrapper";

import { redirectIfUnauthorized } from "@/server/features/auth/auth.query";

export default async function AdminDashboardProducts() {
  await redirectIfUnauthorized();

  return (
    <AdminSidebarPageWrapper pageTitle="Products">
      <div></div>
    </AdminSidebarPageWrapper>
  );
}
