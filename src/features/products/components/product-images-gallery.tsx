import { useEffect, useMemo } from "react";

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

interface Color {
  id: number;
  name: string;
  hex: string;
}

interface ProductImage {
  id: number;
  url: string;
  name: string;
  color: Color | null;
}

interface GalleryProps {
  images: ProductImage[];
  inSale?: boolean;
  activeImageIndex: number;
  onActiveImageChange: (index: number) => void;
}

interface ThumbnailProps {
  image: ProductImage;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const THUMBNAIL_DIMENSIONS = {
  width: 30,
  height: 30,
};

const MAIN_IMAGE_DIMENSIONS = {
  width: 600,
  height: 600,
};

function ImageThumbnail({
  image,
  isActive,
  onClick,
  className,
}: ThumbnailProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`View ${image.name}`}
      className="w-full"
    >
      <Image
        src={image.url}
        alt={image.name}
        width={THUMBNAIL_DIMENSIONS.width}
        height={THUMBNAIL_DIMENSIONS.height}
        className={cn(
          "h-20 w-full border-b-2 border-transparent bg-gray-100 object-contain p-3 transition",
          isActive && "border-primary",
          className,
        )}
        loading="lazy"
      />
    </button>
  );
}

function NavigationButtons() {
  const { canScrollNext, canScrollPrev } = useCarousel();

  if (!canScrollNext && !canScrollPrev) return null;

  return (
    <>
      {canScrollPrev && (
        <CarouselPrevious
          variant="default"
          className="left-0 h-full rounded-none border-0 bg-black/20 opacity-0 transition duration-500 hover:opacity-80"
        />
      )}
      {canScrollNext && (
        <CarouselNext
          variant="default"
          className="right-0 h-full rounded-none border-0 bg-black/20 opacity-0 transition duration-500 hover:opacity-80"
        />
      )}
    </>
  );
}

export function ProductImagesGallery({
  images,
  inSale = false,
  activeImageIndex,
  onActiveImageChange,
}: GalleryProps) {
  const activeImage = useMemo(
    () => images[activeImageIndex],
    [images, activeImageIndex],
  );

  if (!activeImage) {
    return <PlaceholderImage className="h-[30rem] w-full md:h-[40rem]" />;
  }

  return (
    <div className="product-gallery">
      <div className="relative">
        {images.map((image, index) => (
          <Image
            key={image.id}
            src={image.url}
            alt={image.name}
            width={MAIN_IMAGE_DIMENSIONS.width}
            height={MAIN_IMAGE_DIMENSIONS.height}
            priority={index === activeImageIndex}
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
        <div className="absolute bottom-4 right-4 bg-background/80 px-4 py-1 text-sm backdrop-blur-sm">
          {activeImageIndex + 1} / {images.length}
        </div>
      </div>

      <Carousel className="mt-4 max-w-[92vw]">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.id} className="basis-auto">
              <ThumbnailCarousel
                image={image}
                index={index}
                activeImageIndex={activeImageIndex}
                onActiveImageChange={onActiveImageChange}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <NavigationButtons />
      </Carousel>
    </div>
  );
}

function ThumbnailCarousel({
  image,
  index,
  activeImageIndex,
  onActiveImageChange,
}: {
  image: ProductImage;
  index: number;
  activeImageIndex: number;
  onActiveImageChange: (index: number) => void;
}) {
  const { api } = useCarousel();

  useEffect(() => {
    if (!api) return;

    const timeoutId = setTimeout(() => {
      api.scrollTo(activeImageIndex);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [api, activeImageIndex]);

  return (
    <ImageThumbnail
      image={image}
      isActive={activeImageIndex === index}
      onClick={() => onActiveImageChange(index)}
    />
  );
}
