import { AdminSidebarPageWrapper } from "@/components/admin-sidebar-page-wrapper";

import { redirectIfUnauthorized } from "@/server/features/auth/auth.query";

export default async function AdminDashboardNewProduct() {
  await redirectIfUnauthorized();

  return (
    <AdminSidebarPageWrapper
      breadcrumbs={[{ label: "Products", href: "/admin/products" }]}
      pageTitle="Add New Product"
    >
      <div></div>
    </AdminSidebarPageWrapper>
  );
}
