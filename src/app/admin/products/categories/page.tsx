import { AdminSidebarPageWrapper } from "@/components/admin-sidebar-page-wrapper";

import { redirectIfUnauthorized } from "@/server/features/auth/auth.query";

export default async function AdminDashboardCategories() {
  await redirectIfUnauthorized();

  return (
    <AdminSidebarPageWrapper
      breadcrumbs={[{ label: "Products", href: "/admin/products" }]}
      pageTitle="Categories"
    >
      <div></div>
    </AdminSidebarPageWrapper>
  );
}
