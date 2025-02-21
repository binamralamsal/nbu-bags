import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

import { Organization, WithContext } from "schema-dts";

import { site } from "@/configs/site";
import { ConfirmProvider } from "@/stores/confirm-alert";
import { cn } from "@/utils/cn";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  keywords: site.keywords,
  openGraph: {
    title: { absolute: site.name, template: `%s | ${site.name}` },
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  alternates: {
    canonical: site.url,
  },
};

const jsonLd: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/logo.svg`,
  description: site.description,
  foundingDate: site.foundingDate,
  founders: [
    {
      "@type": "Person",
      name: "Kisan prasad Timalsina",
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: site.streetAddress,
    addressLocality: site.addressLocality,
    addressRegion: site.addressRegion,
    postalCode: site.postalCode,
    addressCountry: site.addressCountry,
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: site.telephone,
      contactType: "customer service",
      areaServed: "NP",
      availableLanguage: ["English", "Nepali"],
    },
  ],
  sameAs: [site.facebook, site.instagram],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased")}>
        <NextTopLoader />
        <ConfirmProvider>{children}</ConfirmProvider>
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
