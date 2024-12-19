import { ProductCard } from "@/features/products/components/product-card";
import { getAllProducts } from "@/features/products/server/products.query";

export default async function Home() {
  const { products } = await getAllProducts({
    page: 1,
    pageSize: 8,
    status: ["active"],
  });

  return (
    <main>
      <section className="container py-14 md:py-16 lg:py-20">
        <header className="grid place-items-center text-3xl font-bold tracking-tighter lg:text-4xl">
          <h2>Products</h2>
        </header>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:mt-10 md:grid-cols-2 md:gap-8 lg:mt-14 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              category={product.category}
              slug={product.slug}
              price={product.price}
              images={product.images}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
