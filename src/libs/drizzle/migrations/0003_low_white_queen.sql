CREATE TABLE IF NOT EXISTS "uploaded_files" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "uploaded_files_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"url" text NOT NULL,
	"file_type" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
