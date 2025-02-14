import { ComponentProps } from "react";

import Link from "next/link";

import { NavUser } from "./admin-nav-user";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  ChevronRightIcon,
  CommandIcon,
  ContactRoundIcon,
  FileIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";

import { site } from "@/configs/site";
import { redirectIfUnauthorized } from "@/features/auth/server/auth.query";

const nav = [
  {
    title: "Products",
    url: "/admin/products",
    isActive: true,
    icon: ShoppingCartIcon,
    items: [
      {
        title: "Add new",
        url: "/admin/products/new",
      },
      {
        title: "Categories",
        url: "/admin/products/categories",
      },
      {
        title: "Sizes",
        url: "/admin/products/sizes",
      },
      {
        title: "Colors",
        url: "/admin/products/colors",
      },
    ],
  },
  {
    title: "Media",
    url: "/admin/media",
    icon: FileIcon,
  },
  {
    title: "Contact Entries",
    url: "/admin/contact-entries",
    icon: ContactRoundIcon,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: UsersIcon,
    isActive: true,
    items: [
      {
        title: "Add New",
        url: "/admin/users/new",
      },
    ],
  },
];

export async function AdminSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  const currentUser = await redirectIfUnauthorized();

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <CommandIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{site.name}</span>
                  <span className="truncate text-xs">v{site.version}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {nav.map((item) => (
              <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRightIcon />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: currentUser.name,
            email: currentUser.email,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
