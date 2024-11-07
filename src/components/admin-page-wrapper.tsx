import { Fragment, ReactNode } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

type BreadcrumbItem = {
  label: string;
  href: string;
};

export function AdminPageWrapper({
  children,
  breadcrumbs,
  pageTitle,
  rightSideContent,
}: {
  children: ReactNode;
  pageTitle: string;
  breadcrumbs?: BreadcrumbItem[];
  rightSideContent?: ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 bg-background p-0 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.05)] backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" type="button" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs?.map((breadcrumb) => (
                <Fragment key={breadcrumb.href}>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={breadcrumb.href}>
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbSeparator className="hidden md:block" />
                </Fragment>
              ))}
              <BreadcrumbItem>
                <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="hidden items-center justify-center gap-2 md:flex">
          {rightSideContent}
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-4">{children}</div>
    </>
  );
}
