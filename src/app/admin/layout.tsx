import type { Metadata } from "next";
import { cookies } from "next/headers";

import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { ensureAdmin } from "@/features/auth/server/auth.query";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await ensureAdmin({ redirect: true });

  const cookieStore = await cookies();
  const sidebarStateCookie = cookieStore.get("sidebar:state")?.value;
  const isSidebarDefaultOpen = sidebarStateCookie
    ? sidebarStateCookie === "true"
    : true;

  return (
    <SidebarProvider defaultOpen={isSidebarDefaultOpen}>
      <AdminSidebar />
      <SidebarInset className="overflow-x-scroll">{children}</SidebarInset>
    </SidebarProvider>
  );
}
