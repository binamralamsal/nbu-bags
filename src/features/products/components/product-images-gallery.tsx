"use client";

import { useState } from "react";

import Image from "next/image";

import { PlaceholderImage } from "@/components/placeholder-image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel";

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

        <div className="absolute bottom-4 right-4 bg-background px-4 py-1 text-sm uppercase text-foreground">
          {activeImageIndex + 1} / {images.length}
        </div>
      </div>

      <Carousel className="mt-4 max-w-[92vw]">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className="basis-1/3 md:basis-1/4 lg:basis-1/6"
            >
              <button key={image.id} onClick={() => setActiveImageIndex(index)}>
                <Image
                  src={image.url}
                  alt={image.name}
                  width={30}
                  height={30}
                  className={cn(
                    "h-20 w-full border-b-2 border-transparent bg-gray-100 object-contain p-3 transition",
                    activeImageIndex === index && "border-primary",
                  )}
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <ProductImagesNavigationButtons />
      </Carousel>
    </div>
  );
}

function ProductImagesNavigationButtons() {
  const { canScrollNext, canScrollPrev } = useCarousel();

  return (
    <>
      {canScrollPrev && (
        <CarouselPrevious
          variant="default"
          className="left-0 h-full rounded-none border-0 opacity-0 transition duration-500 hover:opacity-80"
        />
      )}
      {canScrollNext && (
        <CarouselNext
          variant="default"
          className="right-0 h-full rounded-none border-0 opacity-0 transition duration-500 hover:opacity-80"
        />
      )}
    </>
  );
}
