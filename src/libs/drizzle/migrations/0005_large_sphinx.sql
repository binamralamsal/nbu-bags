ALTER TABLE "product_files" DROP CONSTRAINT "product_files_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "product_files" DROP CONSTRAINT "product_files_file_id_uploaded_files_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_files" ADD CONSTRAINT "product_files_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_files" ADD CONSTRAINT "product_files_file_id_uploaded_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."uploaded_files"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
