import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <div className="container grid max-w-[60ch] place-items-center space-y-8 py-16 text-center md:py-20 lg:py-24">
        <div className="text-5xl">🙁</div>
        <h2 className="text-4xl font-semibold">404. Page not found.</h2>
        <p className="text-gray-600">
          Sorry, we couldn&apos;t find the page you where looking for. We
          suggest that you return to home page.
        </p>

        <Button asChild size="lg">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>

      <SiteFooter />
    </>
  );
}
