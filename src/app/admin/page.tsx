import { AdminPageWrapper } from "@/components/admin-page-wrapper";

import { redirectIfNotAdmin } from "@/server/features/auth/auth.query";

export default async function AdminDashboard() {
  await redirectIfNotAdmin();

  return (
    <AdminPageWrapper pageTitle="Home">
      <div></div>
    </AdminPageWrapper>
  );
}
