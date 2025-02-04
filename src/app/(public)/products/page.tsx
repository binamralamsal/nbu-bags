import { z } from "zod";

import { MAX_PRICE_RANGE, MIN_PRICE_RANGE } from "@/configs/constants";
import { ProductCard } from "@/features/products/components/product-card";
import { ProductsFilters } from "@/features/products/components/products-filters";
import { ProductsPagination } from "@/features/products/components/products-pagination";
import {
  getAllCategories,
  getAllColors,
  getAllProducts,
  getAllSizes,
} from "@/features/products/server/products.query";
import { SearchParams } from "@/types";

export default async function ProductsPage({
  searchParams: rawSearchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { categories } = await getAllCategories({
    page: 1,
    pageSize: 9999,
  });

  const { sizes } = await getAllSizes({
    page: 1,
    pageSize: 200,
  });

  const { colors } = await getAllColors({ page: 1, pageSize: 200 });

  const searchParamsSchema = z.object({
    page: z.coerce.number().int().positive().optional().default(1).catch(1),
    categories: z
      .string()
      .optional()
      .default("")
      .transform((val) =>
        val
          .split(".")
          .filter((v) => categories.some((category) => category.slug === v)),
      )
      .catch([]),
    sizes: z
      .string()
      .optional()
      .default("")
      .transform((val) =>
        val.split(".").filter((v) => sizes.some((size) => size.slug === v)),
      )
      .catch([]),
    colors: z
      .string()
      .optional()
      .default("")
      .transform((val) =>
        val.split(".").filter((v) => colors.some((size) => size.slug === v)),
      )
      .catch([]),
    accordion: z
      .string()
      .optional()
      .default("category.price.size")
      .transform((val) => val.split("."))
      .catch(["category", "price", "size"]),
    price: z
      .string()
      .optional()
      .default(`${MIN_PRICE_RANGE}.${MAX_PRICE_RANGE}`)
      .transform((val) => {
        const [min, max] = val.split(".").map((v) => parseInt(v, 10));
        if (isNaN(min) || isNaN(max) || min >= max) {
          return [MIN_PRICE_RANGE, MAX_PRICE_RANGE];
        }
        return [min, max];
      })
      .refine(
        (val): val is [number, number] => val.length === 2 && val[0] < val[1],
        {
          message: "priceRange must be a tuple [number, number] with min < max",
        },
      )
      .catch([MIN_PRICE_RANGE, MAX_PRICE_RANGE]),
  });

  const searchParams = searchParamsSchema.parse(await rawSearchParams);

  const { products, pageCount, currentPage } = await getAllProducts({
    page: searchParams.page,
    pageSize: 8,
    status: ["active"],
    categoriesSlugs: searchParams.categories,
    sizesSlugs: searchParams.sizes,
    priceRange: searchParams.price,
    colorSlugs: searchParams.colors,
  });

  return (
    <section className="container my-4 grid gap-2 md:my-6 md:grid-cols-2 md:gap-6 lg:my-8 lg:grid-cols-[2fr,6fr] lg:gap-10">
      <div>
        <ProductsFilters
          categories={categories}
          sizes={sizes}
          accordion={searchParams.accordion}
          colors={colors}
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold md:text-3xl">Products</h2>

        <div className="mt-2 grid gap-6 md:mt-4 md:grid-cols-1 md:gap-8 lg:mt-8 lg:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              category={product.category}
              slug={product.slug}
              price={product.price}
              salePrice={product.salePrice}
              images={product.images}
            />
          ))}
        </div>

        <ProductsPagination currentPage={currentPage} pageCount={pageCount} />
      </div>
    </section>
  );
}
