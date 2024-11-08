import { AdminPageWrapper } from "@/components/admin-page-wrapper";

import { ensureAdmin } from "@/features/auth/server/auth.query";

export default async function AdminDashboardCategories() {
  await ensureAdmin({ redirect: true });

  return (
    <AdminPageWrapper
      breadcrumbs={[{ label: "Products", href: "/admin/products" }]}
      pageTitle="Categories"
    >
      <div></div>
    </AdminPageWrapper>
  );
}
