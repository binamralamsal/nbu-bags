"use client";

import { useState } from "react";

import Image from "next/image";

import { PlaceholderImage } from "@/components/placeholder-image";

import { cn } from "@/utils/cn";

type Image = {
  id: number;
  url: string;
  name: string;
};

export function ProductImagesGallery({
  images,
  inSale,
}: {
  images: Image[];
  inSale: boolean;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const activeImage = images[activeImageIndex];

  if (!activeImage)
    return <PlaceholderImage className="h-[30rem] w-full md:h-[40rem]" />;

  return (
    <div>
      <div className="relative">
        {images.map((image, index) => (
          <Image
            key={image.id}
            src={image.url}
            alt={image.name}
            width={600}
            height={600}
            className={cn(
              "h-[30rem] w-full bg-gray-100 object-contain opacity-0 transition duration-500 md:h-[40rem]",
              index > 0 && "absolute bottom-0 left-0",
              activeImageIndex === index && "opacity-100",
            )}
          />
        ))}

        {inSale && (
          <div className="absolute left-0 top-4 bg-primary px-4 py-1 text-sm uppercase text-primary-foreground">
            Sale
          </div>
        )}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {images.map((image, index) => (
          <button key={image.id} onClick={() => setActiveImageIndex(index)}>
            <Image
              src={image.url}
              alt={image.name}
              width={30}
              height={30}
              className={cn(
                "h-32 w-full border-b-2 border-transparent bg-gray-100 object-contain transition",
                activeImageIndex === index && "border-primary",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
