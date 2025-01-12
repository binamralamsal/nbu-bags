"use client";

import { useEffect, useId, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

import { CheckedState } from "@radix-ui/react-checkbox";

const CATEGORIES_QUERY_PARAM_KEY = "sizes";

export function SizesFilter({
  sizes: sizes,
}: {
  sizes: { id: number; name: string; slug: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = useId();

  function getSelectedSizesFromURL() {
    const urlCategories =
      searchParams.get(CATEGORIES_QUERY_PARAM_KEY)?.split(".") || [];
    return urlCategories.filter((slug) =>
      sizes.some((size) => size.slug === slug),
    );
  }

  const [selectedSizes, setSelectedSizes] = useState(getSelectedSizesFromURL());

  useEffect(() => {
    setSelectedSizes(getSelectedSizesFromURL());
  }, [searchParams]);

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

    router.push(`/products?${updatedSearchParams.toString()}`);
  }

  function handleSizeToggle(categorySlug: string, isChecked: CheckedState) {
    if (typeof isChecked !== "boolean") return;

    const updatedCategories = isChecked
      ? [...selectedSizes, categorySlug]
      : selectedSizes.filter((slug) => slug !== categorySlug);

    setSelectedSizes(updatedCategories);
    updateURLWithSizes(updatedCategories);
  }

  function handleAllProductsToggle(isChecked: CheckedState) {
    if (isChecked !== true) return;

    setSelectedSizes([]);
    updateURLWithSizes([]);
  }

  return (
    <Accordion type="single" collapsible defaultValue="category">
      <AccordionItem value="category">
        <AccordionTrigger>Sizes</AccordionTrigger>
        <AccordionContent>
          <ul>
            <li>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${id}-all`}
                  checked={selectedSizes.length === 0}
                  onCheckedChange={handleAllProductsToggle}
                />
                <label
                  htmlFor={`${id}-all`}
                  className="w-full py-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  All Products
                </label>
              </div>
            </li>

            {sizes.map(({ id, name, slug }) => (
              <li key={id}>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${id}-${slug}`}
                    checked={selectedSizes.includes(slug)}
                    onCheckedChange={(isChecked) =>
                      handleSizeToggle(slug, isChecked)
                    }
                  />
                  <label
                    htmlFor={`${id}-${slug}`}
                    className="w-full py-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {name}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
