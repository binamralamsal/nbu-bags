CREATE TABLE "product_sizes" (
	"product_id" integer NOT NULL,
	"size_id" integer NOT NULL,
	CONSTRAINT "product_sizes_product_id_size_id_pk" PRIMARY KEY("product_id","size_id")
);
--> statement-breakpoint
ALTER TABLE "product_sizes" ADD CONSTRAINT "product_sizes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_sizes" ADD CONSTRAINT "product_sizes_size_id_sizes_id_fk" FOREIGN KEY ("size_id") REFERENCES "public"."sizes"("id") ON DELETE cascade ON UPDATE cascade;