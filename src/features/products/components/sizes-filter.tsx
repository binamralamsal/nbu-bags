"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const CATEGORIES_QUERY_PARAM_KEY = "sizes";

export function SizesFilter({
  sizes,
}: {
  sizes: { id: number; name: string; slug: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getSelectedSizesFromURL = useCallback(() => {
    const urlCategories =
      searchParams.get(CATEGORIES_QUERY_PARAM_KEY)?.split(".") || [];
    return urlCategories.filter((slug) =>
      sizes.some((size) => size.slug === slug),
    );
  }, [searchParams, sizes]);

  const [selectedSizes, setSelectedSizes] = useState(getSelectedSizesFromURL());

  useEffect(() => {
    setSelectedSizes(getSelectedSizesFromURL());
  }, [getSelectedSizesFromURL]);

  function updateURLWithSizes(updatedSizes: string[]) {
    const updatedSearchParams = new URLSearchParams(searchParams);

    if (updatedSizes.length === 0) {
      updatedSearchParams.delete(CATEGORIES_QUERY_PARAM_KEY);
    } else {
      updatedSearchParams.set(
        CATEGORIES_QUERY_PARAM_KEY,
        updatedSizes.join("."),
      );
    }

    router.push(`/products?${updatedSearchParams.toString()}`, {
      scroll: false,
    });
  }

  function handleSizeToggle(categorySlug: string, isSelected: boolean) {
    const updatedCategories = isSelected
      ? [...selectedSizes, categorySlug]
      : selectedSizes.filter((slug) => slug !== categorySlug);

    setSelectedSizes(updatedCategories);
    updateURLWithSizes(updatedCategories);
  }

  function handleAllProductsToggle() {
    setSelectedSizes([]);
    updateURLWithSizes([]);
  }

  return (
    <AccordionItem value="size">
      <AccordionTrigger>Sizes</AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-6 gap-4">
          <Button
            variant={selectedSizes.length === 0 ? "default" : "outline"}
            size="sm"
            onClick={handleAllProductsToggle}
            className="min-w-[48px]"
          >
            All
          </Button>
          {sizes.map(({ id, name, slug }) => (
            <Button
              key={id}
              variant={selectedSizes.includes(slug) ? "default" : "outline"}
              size="sm"
              onClick={() =>
                handleSizeToggle(slug, !selectedSizes.includes(slug))
              }
              className="min-w-[48px]"
            >
              {name}
            </Button>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
