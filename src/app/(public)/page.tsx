import { getCurrentUser } from "@/server/features/auth/auth.query";

export default async function Home() {
  const currentUser = await getCurrentUser();
  console.log(currentUser);
  return <div></div>;
}
