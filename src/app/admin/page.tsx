import { redirectIfUnauthorized } from "@/server/features/auth/auth.query";

export default async function AdminDashboard() {
  await redirectIfUnauthorized();

  return <div></div>;
}
