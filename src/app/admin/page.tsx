import { AdminSidebarPageWrapper } from "@/components/admin-sidebar-page-wrapper";

import { redirectIfUnauthorized } from "@/server/features/auth/auth.query";

export default async function AdminDashboard() {
  await redirectIfUnauthorized();

  return (
    <AdminSidebarPageWrapper pageTitle="Home">
      <div></div>
    </AdminSidebarPageWrapper>
  );
}
