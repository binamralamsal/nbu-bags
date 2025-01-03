import Image from "next/image";
import Link from "next/link";

import { cn } from "@/utils/cn";

type ProductCardProps = {
  name: string;
  price: number;
  salePrice: number | null;
  slug: string;
  category: string | null;
  images: Partial<{ url: string }[]>;
};

export function ProductCard(props: ProductCardProps) {
  const productUrl = `/products/${props.slug}`;

  const firstImage = props.images[0];
  const secondImage = props.images[1];

  return (
    <div>
      <Link href={productUrl} className="group relative block">
        <Image
          src={firstImage?.url || "/file.svg"}
          alt={`${props.name}`}
          width={600}
          height={600}
          className={cn(
            "h-60 w-full object-cover transition duration-500 md:h-80",
            secondImage && "group-hover:opacity-0",
          )}
        />

        {secondImage && (
          <Image
            src={secondImage.url}
            alt={`${props.name}`}
            width={600}
            height={600}
            className={cn(
              "absolute left-0 top-0 h-60 w-full object-cover opacity-0 transition duration-500 md:h-80",
              secondImage && "group-hover:opacity-100",
            )}
          />
        )}
      </Link>

      <div className="mt-4 md:mt-6">
        {props.category && (
          <div className="text-sm text-muted-foreground">{props.category}</div>
        )}
        <Link href={productUrl} className="block font-semibold tracking-tight">
          {props.name}
        </Link>
        <div className="text-gray-700">
          {props.salePrice ? (
            <s className="text-gray-500">Rs. {props.price.toLocaleString()}</s>
          ) : (
            <span>Rs. {props.price.toLocaleString()}</span>
          )}

          {props.salePrice && (
            <span className="ml-2 text-primary">
              Rs. {props.salePrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
