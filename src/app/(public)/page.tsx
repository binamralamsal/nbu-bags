import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
  LockIcon,
  MoveRightIcon,
  RefreshCcwIcon,
  TagIcon,
  TruckIcon,
} from "lucide-react";

import { ProductCard } from "@/features/products/components/product-card";
import { getAllProducts } from "@/features/products/server/products.query";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  const { products } = await getAllProducts({
    page: 1,
    pageSize: 8,
    status: ["active"],
  });

  return (
    <main>
      <section className="grid md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/products?categories=kids"
          className="group relative grid place-items-center gap-2 py-40 transition md:py-48 lg:py-52"
        >
          <div className="absolute bottom-0 left-0 right-0 top-0 -z-10 bg-[url('/kids.jpg')] bg-cover brightness-75 transition duration-300 group-hover:brightness-[0.6]"></div>
          <div className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Kids
          </div>

          <Button
            variant="secondary"
            size="lg"
            className="absolute bottom-10 font-semibold"
            asChild
          >
            <div>
              <span>Shop Kids</span>
              <MoveRightIcon className="transition duration-300 group-hover:translate-x-1" />
            </div>
          </Button>
        </Link>

        <Link
          href="/products?categories=fashion"
          className="group relative grid place-items-center gap-2 py-40 transition md:py-48 lg:py-52"
        >
          <div className="absolute bottom-0 left-0 right-0 top-0 -z-10 bg-[url('/fashion.jpg')] bg-cover brightness-75 transition duration-300 group-hover:brightness-[0.6]"></div>
          <div className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Fashion
          </div>

          <Button
            variant="secondary"
            size="lg"
            className="absolute bottom-10 font-semibold"
            asChild
          >
            <div>
              <span>Shop Fashion</span>
              <MoveRightIcon className="transition duration-300 group-hover:translate-x-1" />
            </div>
          </Button>
        </Link>

        <Link
          href="/products?categories=adventure"
          className="group relative grid place-items-center gap-2 py-40 transition md:py-48 lg:py-52"
        >
          <div className="absolute bottom-0 left-0 right-0 top-0 -z-10 bg-[url('/adventure.jpg')] bg-cover bg-bottom brightness-90 transition duration-300 group-hover:brightness-[0.8]"></div>
          <div className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Adventure
          </div>

          <Button
            variant="secondary"
            size="lg"
            className="absolute bottom-10 font-semibold"
            asChild
          >
            <div>
              <span>Shop Adventure</span>
              <MoveRightIcon className="transition duration-300 group-hover:translate-x-1" />
            </div>
          </Button>
        </Link>
      </section>

      <section>
        <div className="container grid gap-x-2 gap-y-4 border-b border-gray-300 py-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex gap-3">
            <TruckIcon className="h-5 w-5 text-primary" />
            <div className="text-sm">
              <h2 className="font-semibold capitalize">Free Shipping</h2>
              <p className="text-muted-foreground">Inside Kathmandu Valley</p>
            </div>
          </div>

          <div className="flex gap-3">
            <RefreshCcwIcon className="h-5 w-5 text-primary" />
            <div className="text-sm">
              <h2 className="font-semibold capitalize">Easy Exchange</h2>
              <p className="text-muted-foreground">
                Exchange your item within 7 days
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <LockIcon className="h-5 w-5 text-primary" />
            <div className="text-sm">
              <h2 className="font-semibold capitalize">Easy Repair</h2>
              <p className="text-muted-foreground">
                Get 1 year free repair service
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <TagIcon className="h-5 w-5 text-primary" />
            <div className="text-sm">
              <h2 className="font-semibold capitalize">Over 1,000 Styles</h2>
              <p className="text-muted-foreground">
                We have everything you need
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-16 lg:py-20">
        <header className="grid place-items-center text-3xl font-bold tracking-tighter lg:text-4xl">
          <h2>Products</h2>
        </header>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:mt-10 md:grid-cols-2 md:gap-8 lg:mt-14 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              category={product.category}
              slug={product.slug}
              price={product.price}
              salePrice={product.salePrice}
              images={product.images}
            />
          ))}
        </div>
      </section>

      <section className="bg-[url('/cover-4.png')] bg-center md:bg-cover">
        <div className="container grid py-14 md:grid-cols-2 md:py-24 lg:py-32">
          <div></div>
          <div className="grid gap-4 md:gap-6 lg:gap-8">
            <h2 className="max-w-[15ch] text-3xl font-bold leading-tight tracking-tighter lg:text-4xl">
              Get 10% to 50% off on all products
            </h2>
            <div className="flex flex-wrap gap-2 lg:gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary lg:text-4xl">
                  371
                </div>
                <div className="text-sm capitalize text-muted-foreground">
                  Days
                </div>
              </div>
              <div className="text-3xl font-bold">:</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary lg:text-4xl">
                  23
                </div>
                <div className="text-sm capitalize text-muted-foreground">
                  Hours
                </div>
              </div>
              <div className="text-3xl font-bold">:</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary lg:text-4xl">
                  58
                </div>
                <div className="text-sm capitalize text-muted-foreground">
                  Minutes
                </div>
              </div>
              <div className="text-3xl font-bold">:</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary lg:text-4xl">
                  20
                </div>
                <div className="text-sm capitalize text-muted-foreground">
                  Seconds
                </div>
              </div>
            </div>

            <Button className="group justify-self-start" size="lg">
              <span>Shop Now</span>
              <MoveRightIcon className="transition duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
