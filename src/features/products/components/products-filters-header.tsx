"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

import { X } from "lucide-react";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Size = {
  id: number;
  name: string;
  slug: string;
};

type Color = {
  id: number;
  name: string;
  color: string;
  slug: string;
};

type ProductFiltersHeaderProps = {
  size: number;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
};

export function ProductsFiltersHeader(props: ProductFiltersHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const appliedCategories = searchParams.get("categories")?.split(".") || [];
  const appliedSizes = searchParams.get("sizes")?.split(".") || [];
  const appliedColors = searchParams.get("colors")?.split(".") || [];
  const appliedPrice = searchParams.get("price");

  const hasFilters =
    appliedCategories.length > 0 ||
    appliedSizes.length > 0 ||
    appliedColors.length > 0 ||
    appliedPrice;

  function getNameFromSlug(
    slug: string,
    items: Array<Category | Size | Color>,
  ) {
    return items.find((item) => item.slug === slug)?.name || slug;
  }

  function formatPriceRange(priceRange: string) {
    const [min, max] = priceRange.split(".");
    return `Rs. ${min} - Rs. ${max}`;
  }

  function removeFilter(type: string, value?: string) {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());

    if (value) {
      const currentValues = updatedSearchParams.get(type)?.split(".") || [];
      const newValues = currentValues.filter((v) => v !== value);

      if (newValues.length === 0) {
        updatedSearchParams.delete(type);
      } else {
        updatedSearchParams.set(type, newValues.join("."));
      }
    } else {
      updatedSearchParams.delete(type);
    }

    router.push(`/products?${updatedSearchParams.toString()}`, {
      scroll: false,
    });
  }

  function clearAllFilters() {
    router.push("/products", { scroll: false });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold md:text-3xl">
          {props.size} Product{props.size > 1 ? "s" : ""}
        </h2>
        {hasFilters && (
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            Clear all filters
          </Button>
        )}
      </div>

      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {appliedCategories.map((slug) => (
            <Button
              key={`category-${slug}`}
              variant="secondary"
              size="sm"
              onClick={() => removeFilter("categories", slug)}
              className="group gap-1"
            >
              {getNameFromSlug(slug, props.categories)}
              <X className="h-4 w-4" />
            </Button>
          ))}

          {appliedSizes.map((slug) => (
            <Button
              key={`size-${slug}`}
              variant="secondary"
              size="sm"
              onClick={() => removeFilter("sizes", slug)}
              className="group gap-1"
            >
              Size: {getNameFromSlug(slug, props.sizes)}
              <X className="h-4 w-4" />
            </Button>
          ))}

          {appliedColors.map((slug) => (
            <Button
              key={`color-${slug}`}
              variant="secondary"
              size="sm"
              onClick={() => removeFilter("colors", slug)}
              className="group gap-1"
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: props.colors.find((c) => c.slug === slug)
                      ?.color,
                  }}
                />
                {getNameFromSlug(slug, props.colors)}
              </span>
              <X className="h-4 w-4" />
            </Button>
          ))}

          {appliedPrice && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => removeFilter("price")}
              className="group gap-1"
            >
              Price: {formatPriceRange(appliedPrice)}
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
