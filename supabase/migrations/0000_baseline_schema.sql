

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "knowledge_base";


ALTER SCHEMA "knowledge_base" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "wrappers" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "knowledge_base"."chute_prospects" (
    "Name" "text",
    "Logo" "text",
    "URL" "text",
    "TLDR" "text",
    "Industry" "text",
    "Rating" bigint,
    "Framework" "text",
    "JavaScript" "text",
    "CMS" "text",
    "CSS" "text",
    "Description" "text",
    "Parent Company" "text",
    "Country" "text",
    "Year Founded" "text",
    "Funding Type" "text",
    "Total Funding" "text",
    "Employees" "text",
    "Social Links" "text",
    "Team Members" "text",
    "Domain" "text",
    "News" "text",
    "Chute Repack" "text",
    "notes" "text",
    "Download" "text",
    "DL" "text",
    "Linkedin" "text",
    "Linkedin Followers" "text",
    "YouTube" "text",
    "YouTube Subscribers" "text",
    "X" "text",
    "X Followers" "text",
    "Instagram" "text",
    "Instagram Followers" "text",
    "City" "text",
    "Facebook" "text",
    "Live" boolean
);


ALTER TABLE "knowledge_base"."chute_prospects" OWNER TO "postgres";


COMMENT ON TABLE "knowledge_base"."chute_prospects" IS 'Companies for Chute Repack service';



CREATE TABLE IF NOT EXISTS "knowledge_base"."organizations" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "type" "text",
    "description" "text",
    "website" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "knowledge_base"."organizations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "knowledge_base"."organizations_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "knowledge_base"."organizations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "knowledge_base"."organizations_id_seq" OWNED BY "knowledge_base"."organizations"."id";



CREATE TABLE IF NOT EXISTS "knowledge_base"."people" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "title" "text",
    "org_id" bigint,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "knowledge_base"."people" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "knowledge_base"."people_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "knowledge_base"."people_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "knowledge_base"."people_id_seq" OWNED BY "knowledge_base"."people"."id";



CREATE TABLE IF NOT EXISTS "knowledge_base"."technologies" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "type" "text",
    "status" "text",
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "knowledge_base"."technologies" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "knowledge_base"."technologies_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "knowledge_base"."technologies_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "knowledge_base"."technologies_id_seq" OWNED BY "knowledge_base"."technologies"."id";



CREATE TABLE IF NOT EXISTS "public"."news" (
    "id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "url" character varying(2048) NOT NULL,
    "source" character varying(255),
    "read_time" integer,
    "fomo_score" integer,
    "tags" "jsonb",
    "week_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "entities" "jsonb",
    "context" "jsonb",
    "impact_score" integer,
    "publication_date" "date",
    "viral_title" character varying(255),
    "slug" character varying(255),
    "summary" "text",
    "seo" "jsonb" DEFAULT '{"title": null, "keywords": [], "image_url": null, "description": null, "article_type": "NewsArticle", "canonical_url": null}'::"jsonb"
);


ALTER TABLE "public"."news" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."news_entities_link" (
    "news_id" bigint NOT NULL,
    "entity_type" "text" NOT NULL,
    "entity_id" bigint NOT NULL,
    "role_in_news" "text",
    CONSTRAINT "news_entities_link_entity_type_check" CHECK (("entity_type" = ANY (ARRAY['organization'::"text", 'person'::"text", 'technology'::"text"])))
);


ALTER TABLE "public"."news_entities_link" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."space_news_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."space_news_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."space_news_id_seq" OWNED BY "public"."news"."id";



CREATE TABLE IF NOT EXISTS "public"."submissions" (
    "id" bigint NOT NULL,
    "url" character varying(2048) NOT NULL,
    "comment" "text",
    "fomo_score" integer,
    "email" character varying(255),
    "published" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "week_id" bigint
);


ALTER TABLE "public"."submissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscribers" (
    "id" bigint NOT NULL,
    "email" character varying(255) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "confirmed_at" timestamp with time zone,
    "source" character varying(50) NOT NULL
);


ALTER TABLE "public"."subscribers" OWNER TO "postgres";


ALTER TABLE "public"."subscribers" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."subscribers_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."weeks" (
    "id" bigint NOT NULL,
    "week_number" integer NOT NULL,
    "score" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone NOT NULL,
    "summary" "text" NOT NULL,
    "stats" "jsonb" NOT NULL
);


ALTER TABLE "public"."weeks" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."weeks_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."weeks_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."weeks_id_seq" OWNED BY "public"."weeks"."id";



ALTER TABLE ONLY "knowledge_base"."organizations" ALTER COLUMN "id" SET DEFAULT "nextval"('"knowledge_base"."organizations_id_seq"'::"regclass");



ALTER TABLE ONLY "knowledge_base"."people" ALTER COLUMN "id" SET DEFAULT "nextval"('"knowledge_base"."people_id_seq"'::"regclass");



ALTER TABLE ONLY "knowledge_base"."technologies" ALTER COLUMN "id" SET DEFAULT "nextval"('"knowledge_base"."technologies_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."news" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."space_news_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."weeks" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."weeks_id_seq"'::"regclass");



ALTER TABLE ONLY "knowledge_base"."organizations"
    ADD CONSTRAINT "organizations_name_key" UNIQUE ("name");



ALTER TABLE ONLY "knowledge_base"."organizations"
    ADD CONSTRAINT "organizations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "knowledge_base"."people"
    ADD CONSTRAINT "people_name_key" UNIQUE ("name");



ALTER TABLE ONLY "knowledge_base"."people"
    ADD CONSTRAINT "people_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "knowledge_base"."technologies"
    ADD CONSTRAINT "technologies_name_key" UNIQUE ("name");



ALTER TABLE ONLY "knowledge_base"."technologies"
    ADD CONSTRAINT "technologies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."news_entities_link"
    ADD CONSTRAINT "news_entities_link_pkey" PRIMARY KEY ("news_id", "entity_type", "entity_id");



ALTER TABLE ONLY "public"."news"
    ADD CONSTRAINT "space_news_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."news"
    ADD CONSTRAINT "space_news_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."submissions"
    ADD CONSTRAINT "submissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscribers"
    ADD CONSTRAINT "subscribers_email_unique" UNIQUE ("email");



ALTER TABLE ONLY "public"."subscribers"
    ADD CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."weeks"
    ADD CONSTRAINT "weeks_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_news_entities_link_entity" ON "public"."news_entities_link" USING "btree" ("entity_type", "entity_id");



CREATE INDEX "space_news_context_idx" ON "public"."news" USING "gin" ("context");



CREATE INDEX "space_news_entities_idx" ON "public"."news" USING "gin" ("entities");



CREATE INDEX "space_news_score_idx" ON "public"."news" USING "btree" ("fomo_score");



ALTER TABLE ONLY "knowledge_base"."people"
    ADD CONSTRAINT "people_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "knowledge_base"."organizations"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."news"
    ADD CONSTRAINT "space_news_week_id_weeks_id_fk" FOREIGN KEY ("week_id") REFERENCES "public"."weeks"("id");



ALTER TABLE ONLY "public"."submissions"
    ADD CONSTRAINT "submissions_week_id_weeks_id_fk" FOREIGN KEY ("week_id") REFERENCES "public"."weeks"("id");



ALTER TABLE "knowledge_base"."chute_prospects" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



























































































































































































































































































































GRANT ALL ON TABLE "public"."news" TO "anon";
GRANT ALL ON TABLE "public"."news" TO "authenticated";
GRANT ALL ON TABLE "public"."news" TO "service_role";



GRANT ALL ON TABLE "public"."news_entities_link" TO "anon";
GRANT ALL ON TABLE "public"."news_entities_link" TO "authenticated";
GRANT ALL ON TABLE "public"."news_entities_link" TO "service_role";



GRANT ALL ON SEQUENCE "public"."space_news_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."space_news_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."space_news_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."submissions" TO "anon";
GRANT ALL ON TABLE "public"."submissions" TO "authenticated";
GRANT ALL ON TABLE "public"."submissions" TO "service_role";



GRANT ALL ON TABLE "public"."subscribers" TO "anon";
GRANT ALL ON TABLE "public"."subscribers" TO "authenticated";
GRANT ALL ON TABLE "public"."subscribers" TO "service_role";



GRANT ALL ON SEQUENCE "public"."subscribers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."subscribers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."subscribers_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."weeks" TO "anon";
GRANT ALL ON TABLE "public"."weeks" TO "authenticated";
GRANT ALL ON TABLE "public"."weeks" TO "service_role";



GRANT ALL ON SEQUENCE "public"."weeks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."weeks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."weeks_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
