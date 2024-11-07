"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { site } from "@/configs/site";
import { cn } from "@/utils/cn";

import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";

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
        "border-b-2 border-gray-100 px-4 py-8",
        scrolled &&
          "animate-headerSticky sticky top-0 z-50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.05)] backdrop-blur supports-[backdrop-filter]:bg-background/85",
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/">
          {site.name}
          {/* <NexorithLogo className="h-8" /> */}
        </Link>

        <DesktopNav />
        <MobileNav />
      </div>
    </header>
  );
}
