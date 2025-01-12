CREATE TABLE "sizes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sizes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "sizes_slug_unique" UNIQUE("slug")
);
