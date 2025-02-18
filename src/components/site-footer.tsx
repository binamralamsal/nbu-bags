import Link from "next/link";

import { Button } from "./ui/button";

import { FacebookIcon, InstagramIcon } from "lucide-react";

import { getAllCategories } from "@/features/products/server/products.query";

export async function SiteFooter() {
  const { categories } = await getAllCategories({ page: 1, pageSize: 10 });

  return (
    <footer className="bg-secondary pt-16 text-secondary-foreground md:pt-20 lg:pt-24">
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-[2fr,1fr,1fr,1fr]">
        <div className="space-y-4 md:max-w-[30ch] lg:space-y-6">
          <h2 className="text-3xl font-bold">NBU Bags</h2>
          <p className="text-secondary-foreground/80">
            Where quality meets innovation. We design durable, stylish bags for
            every lifestyle, including backpacks, travel bags, and laptop bags.
          </p>
        </div>
        <div className="space-y-4 lg:space-y-6">
          <h2 className="text-xl font-bold">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4 lg:space-y-6">
          <h2 className="text-xl font-bold">Categories</h2>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/products?categories=${category.slug}`}
                  className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4 lg:space-y-6">
          <h2 className="text-xl font-bold">Follow us on</h2>
          <ul className="flex flex-wrap gap-1">
            <li>
              <Button
                variant="secondary"
                size="icon"
                className="brightness-125 transition hover:brightness-200"
                asChild
              >
                <Link
                  href="https://www.facebook.com/people/NBU-BAGS/61567289293320/"
                  target="_blank"
                >
                  <FacebookIcon className="h-4 w-4 fill-secondary-foreground" />
                </Link>
              </Button>
            </li>
            <li>
              <Button
                variant="secondary"
                size="icon"
                className="brightness-125 transition hover:brightness-200"
                asChild
              >
                <Link href="https://www.instagram.com/nbu_bags" target="_blank">
                  <InstagramIcon className="h-4 w-4" />
                </Link>
              </Button>
            </li>
            {/* <li>
              <Button
                variant="secondary"
                size="icon"
                className="brightness-125 transition hover:brightness-200"
              >
                <TwitterIcon className="h-4 w-4 fill-secondary-foreground" />
              </Button>
            </li>
            <li>
              <Button
                variant="secondary"
                size="icon"
                className="brightness-125 transition hover:brightness-200"
              >
                <LinkedinIcon className="h-4 w-4 fill-secondary-foreground" />
              </Button>
            </li> */}
          </ul>
        </div>
      </div>

      <hr className="container my-8 border-secondary-foreground/10" />

      <div className="container pb-8 text-secondary-foreground/90">
        Copyrights © {new Date().getFullYear()} NBU
      </div>
    </footer>
  );
}
