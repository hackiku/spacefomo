CREATE TABLE "news_items" (
	"id" bigint PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"url" varchar(2048) NOT NULL,
	"source" varchar(255),
	"read_time" integer,
	"score" integer,
	"tags" jsonb,
	"week_id" bigint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "news_items" ADD CONSTRAINT "news_items_week_id_weeks_id_fk" FOREIGN KEY ("week_id") REFERENCES "public"."weeks"("id") ON DELETE no action ON UPDATE no action;