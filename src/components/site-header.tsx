"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { DesktopNav } from "./desktop-nav";
import { Logo } from "./icons/logo";
import { MobileNav } from "./mobile-nav";

import { site } from "@/configs/site";
import { cn } from "@/utils/cn";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        return setScrolled(true);
      }

      return setScrolled(false);
    };

    document.addEventListener("scroll", handleScroll);

    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "border-gray-10 border-b-2 py-6",
        scrolled &&
          "sticky top-0 z-50 animate-headerSticky py-4 shadow-[0_8px_30px_rgb(0,0,0,0.05)] backdrop-blur supports-[backdrop-filter]:bg-background/85",
      )}
    >
      <div className="container flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1 text-xl font-bold text-secondary lg:text-2xl"
        >
          <Logo className={cn("h-10 lg:h-12", scrolled && "lg:h-10")} />
          <span>{site.name}</span>
        </Link>

        <DesktopNav />
        <MobileNav />
      </div>
    </header>
  );
}
