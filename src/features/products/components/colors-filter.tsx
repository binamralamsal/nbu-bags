"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Check } from "lucide-react";

import { getContrastColor } from "@/utils/color-utils";

const COLORS_QUERY_PARAM_KEY = "colors";

export function ColorsFilter({
  colors,
}: {
  colors: { id: number; name: string; color: string; slug: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getSelectedColorsFromURL = useCallback(() => {
    const urlColors =
      searchParams.get(COLORS_QUERY_PARAM_KEY)?.split(".") || [];
    return urlColors.filter((slug) =>
      colors.some((color) => color.slug === slug),
    );
  }, [colors, searchParams]);

  const [selectedColors, setSelectedColors] = useState(
    getSelectedColorsFromURL(),
  );

  useEffect(() => {
    setSelectedColors(getSelectedColorsFromURL());
  }, [getSelectedColorsFromURL]);

  function updateURLWithColors(updatedColors: string[]) {
    const updatedSearchParams = new URLSearchParams(searchParams);

    if (updatedColors.length === 0) {
      updatedSearchParams.delete(COLORS_QUERY_PARAM_KEY);
    } else {
      updatedSearchParams.set(COLORS_QUERY_PARAM_KEY, updatedColors.join("."));
    }

    router.push(`/products?${updatedSearchParams.toString()}`, {
      scroll: false,
    });
  }

  function handleColorToggle(colorSlug: string) {
    const updatedColors = selectedColors.includes(colorSlug)
      ? selectedColors.filter((slug) => slug !== colorSlug)
      : [...selectedColors, colorSlug];

    setSelectedColors(updatedColors);
    updateURLWithColors(updatedColors);
  }

  return (
    <AccordionItem value="color">
      <AccordionTrigger>Color</AccordionTrigger>
      <AccordionContent className="pl-1 pt-1">
        <ul className="space-y-2">
          {colors.map(({ id, name, slug, color }) => {
            const checkColor = getContrastColor(color);
            return (
              <li key={id}>
                <label className="flex cursor-pointer items-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleColorToggle(slug);
                    }}
                    aria-label={`Select ${name} color`}
                    className={`flex h-6 w-6 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColors.includes(slug) && (
                      <Check
                        className="h-4 w-4"
                        style={{ color: checkColor }}
                      />
                    )}
                  </button>
                  <span className="text-sm font-medium leading-none">
                    {name}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}
