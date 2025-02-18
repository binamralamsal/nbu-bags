"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { ColorsFilter } from "./colors-filter";

import { Accordion } from "@/components/ui/accordion";

import { CategoriesFilter } from "@/features/products/components/categories-filter";
import { PriceRangeFilter } from "@/features/products/components/price-range-filter";
import { SizesFilter } from "@/features/products/components/sizes-filter";

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

export function ProductsFilters({
  categories,
  sizes,
  accordion,
  colors,
}: {
  categories: Category[];
  sizes: Size[];
  accordion: string[];
  colors: Color[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState(accordion);

  const handleChange = (newOpenItems: string[]) => {
    setValues(newOpenItems);

    const query = new URLSearchParams(searchParams.toString());
    query.set("accordion", newOpenItems.join("."));
    router.push(`?${query.toString()}`, { scroll: false });
  };

  return (
    <Accordion type="multiple" value={values} onValueChange={handleChange}>
      <CategoriesFilter categories={categories} />
      <PriceRangeFilter />
      <SizesFilter sizes={sizes} />
      <ColorsFilter colors={colors} />
    </Accordion>
  );
}
