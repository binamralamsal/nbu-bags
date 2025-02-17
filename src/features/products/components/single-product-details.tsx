"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { InstagramIcon } from "@/components/icons/instagram-icon";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { ProductImagesGallery } from "@/features/products/components/product-images-gallery";

type Color = {
  id: number;
  name: string;
  hex: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  salePrice: number | null;
  slug: string;
  status: "draft" | "active" | "archived";
  description: string;
  category: {
    id: number;
    slug: string;
    name: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
  images: {
    id: number;
    name: string;
    url: string;
    fileType: string;
    color: Color | null;
  }[];
  sizes: {
    id: number;
    name: string;
    slug: string;
  }[];
};

export function SingleProductDetails({ product }: { product: Product }) {
  const colors = useMemo(
    () =>
      Array.from(
        new Map(
          product.images
            .filter((item) => item.color !== null)
            .map((item) => item.color as Color)
            .map((color) => [color.id, color]),
        ).values(),
      ),
    [product.images],
  );

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  function handleColorClick(colorId: number) {
    const index = product.images.findIndex(
      (image) => image.color?.id === colorId,
    );
    if (index !== -1) {
      setActiveImageIndex(index);
    }
  }

  const host = window?.location.origin;
  const messageToBeShared = encodeURIComponent(
    `I am interested to buy ${product.name}\n\n${host}/${product.slug}`,
  );

  return (
    <>
      <ProductImagesGallery
        images={product.images}
        inSale={Boolean(product.salePrice)}
        activeImageIndex={activeImageIndex}
        onActiveImageChange={setActiveImageIndex}
      />
      <div className="space-y-4 lg:space-y-6">
        <div className="space-y-2">
          {product.category && (
            <Link
              href={`/products?categories=${product.category.slug}`}
              className="text-sm font-medium text-primary transition hover:text-primary/80"
            >
              {product.category.name}
            </Link>
          )}

          <h2 className="text-balance text-2xl font-semibold md:text-3xl">
            {product.name}
          </h2>
        </div>
        <Separator />

        <div className="flex items-center gap-4">
          {product.salePrice ? (
            <>
              <p className="text-3xl font-bold text-gray-900">
                MRP Rs. {product.salePrice.toLocaleString()}
              </p>
              <p className="text-xl text-gray-500 line-through">
                Rs. {product.price.toLocaleString()}
              </p>
              <span className="rounded-full bg-green-100 px-2 py-1 text-sm font-semibold text-green-700">
                {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
              </span>
            </>
          ) : (
            <p className="text-3xl font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </p>
          )}
        </div>

        {colors.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Color</h3>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorClick(color.id)}
                  className={`h-8 w-8 rounded-full border-2 ${
                    product.images[activeImageIndex].color?.id === color.id
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {product.sizes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Size</h3>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.id}
                  className="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:border-black"
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <p>{product.description}</p>
        <div className="grid gap-1">
          <div className="grid gap-2 lg:grid-cols-2">
            <Button
              size="lg"
              asChild
              className="bg-green-500 transition duration-200 hover:bg-green-600"
            >
              <Link
                href={`https://wa.me/9779767489387?text=${messageToBeShared}`}
                target="_blank"
              >
                <WhatsappIcon className="fill-white" />
                <span>WhatsApp for Buying</span>
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              className="bg-red-500 transition duration-200 hover:bg-red-600"
            >
              <Link
                href={`https://ig.me/m/carry.karma?text=${messageToBeShared}`}
                target="_blank"
              >
                <InstagramIcon className="fill-white" />
                <span>Instagram for Buying</span>
              </Link>
            </Button>
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">
            Distributed by Carry Karma
          </p>
        </div>
      </div>
    </>
  );
}
