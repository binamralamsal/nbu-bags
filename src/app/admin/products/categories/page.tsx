import { AdminPageWrapper } from "@/components/admin-page-wrapper";

import { redirectIfNotAdmin } from "@/server/features/auth/auth.query";

export default async function AdminDashboardCategories() {
  await redirectIfNotAdmin();

  return (
    <AdminPageWrapper
      breadcrumbs={[{ label: "Products", href: "/admin/products" }]}
      pageTitle="Categories"
    >
      <div></div>
    </AdminPageWrapper>
  );
}
