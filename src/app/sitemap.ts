import { MetadataRoute } from "next";

import { site } from "@/configs/site";
import { getAllProducts } from "@/features/products/server/products.query";
import { getAllCategories } from "@/features/products/server/products.query";

const staticPages = [
  { url: "/", lastModified: new Date() },
  { url: "/about", lastModified: new Date() },
  { url: "/contact", lastModified: new Date() },
  { url: "/products", lastModified: new Date() },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products } = await getAllProducts({
    page: 1,
    pageSize: 1000,
  });

  const { categories } = await getAllCategories({
    page: 1,
    pageSize: 9999,
  });

  const productPages = products.map((product) => ({
    url: `/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
  }));

  const categoryPages = categories.map((category) => ({
    url: `/products?categories=${category.slug}`,
    lastModified: new Date(category.updatedAt),
  }));

  const allPages = [...staticPages, ...productPages, ...categoryPages];

  return allPages.map((page) => ({
    url: `${site.url}${page.url}`,
    lastModified: page.lastModified,
  }));
}
