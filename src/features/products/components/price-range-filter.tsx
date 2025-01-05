"use client";

import { useRef } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

import { MAX_PRICE_RANGE, MIN_PRICE_RANGE } from "@/configs/constants";
import { useSliderWithInput } from "@/hooks/use-slider-with-input";

const PRICE_QUERY_PARAM_KEY = "price";

function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  delay: number,
) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function PriceRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialValue = [MIN_PRICE_RANGE, MAX_PRICE_RANGE];

  const getPriceRangeFromURL = () => {
    const urlPriceRange = searchParams.get(PRICE_QUERY_PARAM_KEY)?.split(".");
    if (!urlPriceRange || urlPriceRange.length !== 2) return initialValue;

    const [min, max] = urlPriceRange.map((val) => parseInt(val, 10));
    return [
      Math.max(MIN_PRICE_RANGE, min || MIN_PRICE_RANGE),
      Math.min(MAX_PRICE_RANGE, max || MAX_PRICE_RANGE),
    ];
  };

  const {
    sliderValue,
    inputValues,
    validateAndUpdateValue,
    handleInputChange,
    handleSliderChange,
  } = useSliderWithInput({
    minValue: MIN_PRICE_RANGE,
    maxValue: MAX_PRICE_RANGE,
    initialValue: getPriceRangeFromURL(),
  });

  const updateURLWithPriceRange = (updatedPriceRange: number[]) => {
    const updatedSearchParams = new URLSearchParams(searchParams);

    if (updatedPriceRange.length !== 2) return;

    if (
      updatedPriceRange[0] === MIN_PRICE_RANGE &&
      updatedPriceRange[1] === MAX_PRICE_RANGE
    ) {
      updatedSearchParams.delete(PRICE_QUERY_PARAM_KEY);
    } else {
      updatedSearchParams.set(
        PRICE_QUERY_PARAM_KEY,
        updatedPriceRange.join("."),
      );
    }

    router.push(`/products?${updatedSearchParams.toString()}`);
  };

  const debouncedUpdateURL = useRef(
    debounce(updateURLWithPriceRange, 500),
  ).current;

  const handleSliderChangeWithURLUpdate = (newValue: number[]) => {
    handleSliderChange(newValue);
    debouncedUpdateURL(newValue);
  };

  const handleInputBlurWithURLUpdate = (value: string, index: number) => {
    validateAndUpdateValue(value, index);
    debouncedUpdateURL(sliderValue);
  };

  return (
    <Accordion type="single" collapsible defaultValue="price">
      <AccordionItem value="price">
        <AccordionTrigger>Price</AccordionTrigger>
        <AccordionContent>
          <div className="py-2">
            <Slider
              className="grow"
              value={sliderValue}
              onValueChange={handleSliderChangeWithURLUpdate}
              min={MIN_PRICE_RANGE}
              max={MAX_PRICE_RANGE}
            />
          </div>
          <div className="mt-4 flex items-center gap-4 px-1">
            <Input
              className="h-8 px-2 py-1"
              type="text"
              inputMode="decimal"
              value={inputValues[0]}
              onChange={(e) => handleInputChange(e, 0)}
              onBlur={() => handleInputBlurWithURLUpdate(inputValues[0], 0)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleInputBlurWithURLUpdate(inputValues[0], 0);
                }
              }}
              aria-label="Enter minimum price"
            />

            <Input
              className="h-8 px-2 py-1"
              type="text"
              inputMode="decimal"
              value={inputValues[1]}
              onChange={(e) => handleInputChange(e, 1)}
              onBlur={() => handleInputBlurWithURLUpdate(inputValues[1], 1)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleInputBlurWithURLUpdate(inputValues[1], 1);
                }
              }}
              aria-label="Enter maximum price"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
