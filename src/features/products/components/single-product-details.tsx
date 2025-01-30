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

  function handleColorClicked(colorId: number) {
    const index = product.images.findIndex(
      (image) => image.color?.id === colorId,
    );
    if (index !== -1) {
      setActiveImageIndex(index);
    }
  }

  const host = window.location.origin;
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
              className="text-muted-foreground transition hover:text-primary"
            >
              {product.category.name}
            </Link>
          )}

          <h2 className="text-balance text-2xl font-semibold md:text-3xl">
            {product.name}
          </h2>
        </div>
        <Separator />
        <div className="text-xl text-gray-700">
          {product.salePrice ? (
            <s className="text-gray-500">
              Rs. {product.price.toLocaleString()}
            </s>
          ) : (
            <span>Rs. {product.price.toLocaleString()}</span>
          )}

          {product.salePrice && (
            <span className="ml-2 font-medium text-primary">
              Rs. {product.salePrice.toLocaleString()}
            </span>
          )}
        </div>
        {product.sizes.length > 0 && (
          <div className="flex gap-1">
            <h3 className="font-semibold">Sizes: </h3>
            <span className="text-muted-foreground">
              {product.sizes.map((size) => size.name).join(", ")}
            </span>
          </div>
        )}
        {colors.length > 0 && (
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Colors: </h3>
            <div className="flex gap-1">
              {colors.map((color) => (
                <Button
                  variant="ghost"
                  key={color.id}
                  className="h-6 w-6 rounded-full p-0 lg:h-8 lg:w-8"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => handleColorClicked(color.id)}
                ></Button>
              ))}
            </div>
          </div>
        )}
        <p>{product.description}</p>
        <div className="flex gap-2">
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
      </div>
    </>
  );
}
