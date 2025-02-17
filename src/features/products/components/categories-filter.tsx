"use client";

import { useCallback, useEffect, useId, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

import { CheckedState } from "@radix-ui/react-checkbox";

const CATEGORIES_QUERY_PARAM_KEY = "categories";

export function CategoriesFilter({
  categories,
}: {
  categories: { id: number; name: string; slug: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = useId();

  const getSelectedCategoriesFromURL = useCallback(() => {
    const urlCategories =
      searchParams.get(CATEGORIES_QUERY_PARAM_KEY)?.split(".") || [];
    return urlCategories.filter((slug) =>
      categories.some((category) => category.slug === slug),
    );
  }, [searchParams, categories]);

  const [selectedCategories, setSelectedCategories] = useState(
    getSelectedCategoriesFromURL(),
  );

  useEffect(() => {
    setSelectedCategories(getSelectedCategoriesFromURL());
  }, [getSelectedCategoriesFromURL]);

  function updateURLWithCategories(updatedCategories: string[]) {
    const updatedSearchParams = new URLSearchParams(searchParams);

    if (updatedCategories.length === 0) {
      updatedSearchParams.delete(CATEGORIES_QUERY_PARAM_KEY);
    } else {
      updatedSearchParams.set(
        CATEGORIES_QUERY_PARAM_KEY,
        updatedCategories.join("."),
      );
    }

    router.push(`/products?${updatedSearchParams.toString()}`, {
      scroll: false,
    });
  }

  function handleCategoryToggle(categorySlug: string, isChecked: CheckedState) {
    if (typeof isChecked !== "boolean") return;

    const updatedCategories = isChecked
      ? [...selectedCategories, categorySlug]
      : selectedCategories.filter((slug) => slug !== categorySlug);

    setSelectedCategories(updatedCategories);
    updateURLWithCategories(updatedCategories);
  }

  function handleAllProductsToggle(isChecked: CheckedState) {
    if (isChecked !== true) return;

    setSelectedCategories([]);
    updateURLWithCategories([]);
  }

  return (
    <AccordionItem value="category">
      <AccordionTrigger>Category</AccordionTrigger>
      <AccordionContent>
        <ul>
          <li>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`${id}-all`}
                checked={selectedCategories.length === 0}
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

          {categories.map(({ id, name, slug }) => (
            <li key={id}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${id}-${slug}`}
                  checked={selectedCategories.includes(slug)}
                  onCheckedChange={(isChecked) =>
                    handleCategoryToggle(slug, isChecked)
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
  );
}
