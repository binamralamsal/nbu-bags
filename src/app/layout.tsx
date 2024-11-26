import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

import { site } from "@/configs/site";
import { ConfirmProvider } from "@/stores/confirm-alert";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { absolute: site.name, template: `%s | ${site.name}` },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader />
        <ConfirmProvider>{children}</ConfirmProvider>
        <Toaster />
      </body>
    </html>
  );
}
