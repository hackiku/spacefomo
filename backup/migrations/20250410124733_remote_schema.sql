create extension if not exists "wrappers" with schema "extensions";


create schema if not exists "knowledge_base";

create sequence "knowledge_base"."organizations_id_seq";

create sequence "knowledge_base"."people_id_seq";

create sequence "knowledge_base"."technologies_id_seq";

create table "knowledge_base"."chute_prospects" (
    "Name" text,
    "Logo" text,
    "URL" text,
    "TLDR" text,
    "Industry" text,
    "Rating" bigint,
    "Framework" text,
    "JavaScript" text,
    "CMS" text,
    "CSS" text,
    "Description" text,
    "Parent Company" text,
    "Country" text,
    "Year Founded" text,
    "Funding Type" text,
    "Total Funding" text,
    "Employees" text,
    "Social Links" text,
    "Team Members" text,
    "Domain" text,
    "News" text,
    "Chute Repack" text,
    "notes" text,
    "Download" text,
    "DL" text,
    "Linkedin" text,
    "Linkedin Followers" text,
    "YouTube" text,
    "YouTube Subscribers" text,
    "X" text,
    "X Followers" text,
    "Instagram" text,
    "Instagram Followers" text,
    "City" text,
    "Facebook" text,
    "Live" boolean
);


alter table "knowledge_base"."chute_prospects" enable row level security;

create table "knowledge_base"."organizations" (
    "id" bigint not null default nextval('knowledge_base.organizations_id_seq'::regclass),
    "name" text not null,
    "type" text,
    "description" text,
    "website" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "knowledge_base"."people" (
    "id" bigint not null default nextval('knowledge_base.people_id_seq'::regclass),
    "name" text not null,
    "title" text,
    "org_id" bigint,
    "description" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "knowledge_base"."technologies" (
    "id" bigint not null default nextval('knowledge_base.technologies_id_seq'::regclass),
    "name" text not null,
    "type" text,
    "status" text,
    "description" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter sequence "knowledge_base"."organizations_id_seq" owned by "knowledge_base"."organizations"."id";

alter sequence "knowledge_base"."people_id_seq" owned by "knowledge_base"."people"."id";

alter sequence "knowledge_base"."technologies_id_seq" owned by "knowledge_base"."technologies"."id";

CREATE UNIQUE INDEX organizations_name_key ON knowledge_base.organizations USING btree (name);

CREATE UNIQUE INDEX organizations_pkey ON knowledge_base.organizations USING btree (id);

CREATE UNIQUE INDEX people_name_key ON knowledge_base.people USING btree (name);

CREATE UNIQUE INDEX people_pkey ON knowledge_base.people USING btree (id);

CREATE UNIQUE INDEX technologies_name_key ON knowledge_base.technologies USING btree (name);

CREATE UNIQUE INDEX technologies_pkey ON knowledge_base.technologies USING btree (id);

alter table "knowledge_base"."organizations" add constraint "organizations_pkey" PRIMARY KEY using index "organizations_pkey";

alter table "knowledge_base"."people" add constraint "people_pkey" PRIMARY KEY using index "people_pkey";

alter table "knowledge_base"."technologies" add constraint "technologies_pkey" PRIMARY KEY using index "technologies_pkey";

alter table "knowledge_base"."organizations" add constraint "organizations_name_key" UNIQUE using index "organizations_name_key";

alter table "knowledge_base"."people" add constraint "people_name_key" UNIQUE using index "people_name_key";

alter table "knowledge_base"."people" add constraint "people_org_id_fkey" FOREIGN KEY (org_id) REFERENCES knowledge_base.organizations(id) ON DELETE SET NULL not valid;

alter table "knowledge_base"."people" validate constraint "people_org_id_fkey";

alter table "knowledge_base"."technologies" add constraint "technologies_name_key" UNIQUE using index "technologies_name_key";


create sequence "public"."space_news_id_seq";

revoke delete on table "public"."news_items" from "anon";

revoke insert on table "public"."news_items" from "anon";

revoke references on table "public"."news_items" from "anon";

revoke select on table "public"."news_items" from "anon";

revoke trigger on table "public"."news_items" from "anon";

revoke truncate on table "public"."news_items" from "anon";

revoke update on table "public"."news_items" from "anon";

revoke delete on table "public"."news_items" from "authenticated";

revoke insert on table "public"."news_items" from "authenticated";

revoke references on table "public"."news_items" from "authenticated";

revoke select on table "public"."news_items" from "authenticated";

revoke trigger on table "public"."news_items" from "authenticated";

revoke truncate on table "public"."news_items" from "authenticated";

revoke update on table "public"."news_items" from "authenticated";

revoke delete on table "public"."news_items" from "service_role";

revoke insert on table "public"."news_items" from "service_role";

revoke references on table "public"."news_items" from "service_role";

revoke select on table "public"."news_items" from "service_role";

revoke trigger on table "public"."news_items" from "service_role";

revoke truncate on table "public"."news_items" from "service_role";

revoke update on table "public"."news_items" from "service_role";

alter table "public"."news_items" drop constraint "news_items_week_id_weeks_id_fk";

alter table "public"."news_items" drop constraint "news_items_pkey";

drop index if exists "public"."news_items_pkey";

drop table "public"."news_items";

create table "public"."news" (
    "id" bigint not null default nextval('space_news_id_seq'::regclass),
    "title" text not null,
    "url" character varying(2048) not null,
    "source" character varying(255),
    "read_time" integer,
    "fomo_score" integer,
    "tags" jsonb,
    "week_id" bigint,
    "created_at" timestamp with time zone not null default now(),
    "entities" jsonb,
    "context" jsonb,
    "impact_score" integer,
    "publication_date" date,
    "viral_title" character varying(255),
    "slug" character varying(255),
    "summary" text,
    "seo" jsonb default '{"title": null, "keywords": [], "image_url": null, "description": null, "article_type": "NewsArticle", "canonical_url": null}'::jsonb
);


create table "public"."news_entities_link" (
    "news_id" bigint not null,
    "entity_type" text not null,
    "entity_id" bigint not null,
    "role_in_news" text
);


alter table "public"."subscribers" alter column "id" add generated by default as identity;

alter sequence "public"."space_news_id_seq" owned by "public"."news"."id";

CREATE INDEX idx_news_entities_link_entity ON public.news_entities_link USING btree (entity_type, entity_id);

CREATE UNIQUE INDEX news_entities_link_pkey ON public.news_entities_link USING btree (news_id, entity_type, entity_id);

CREATE INDEX space_news_context_idx ON public.news USING gin (context);

CREATE INDEX space_news_entities_idx ON public.news USING gin (entities);

CREATE UNIQUE INDEX space_news_pkey ON public.news USING btree (id);

CREATE INDEX space_news_score_idx ON public.news USING btree (fomo_score);

CREATE UNIQUE INDEX space_news_slug_key ON public.news USING btree (slug);

alter table "public"."news" add constraint "space_news_pkey" PRIMARY KEY using index "space_news_pkey";

alter table "public"."news_entities_link" add constraint "news_entities_link_pkey" PRIMARY KEY using index "news_entities_link_pkey";

alter table "public"."news" add constraint "space_news_slug_key" UNIQUE using index "space_news_slug_key";

alter table "public"."news" add constraint "space_news_week_id_weeks_id_fk" FOREIGN KEY (week_id) REFERENCES weeks(id) not valid;

alter table "public"."news" validate constraint "space_news_week_id_weeks_id_fk";

alter table "public"."news_entities_link" add constraint "news_entities_link_entity_type_check" CHECK ((entity_type = ANY (ARRAY['organization'::text, 'person'::text, 'technology'::text]))) not valid;

alter table "public"."news_entities_link" validate constraint "news_entities_link_entity_type_check";

grant delete on table "public"."news" to "anon";

grant insert on table "public"."news" to "anon";

grant references on table "public"."news" to "anon";

grant select on table "public"."news" to "anon";

grant trigger on table "public"."news" to "anon";

grant truncate on table "public"."news" to "anon";

grant update on table "public"."news" to "anon";

grant delete on table "public"."news" to "authenticated";

grant insert on table "public"."news" to "authenticated";

grant references on table "public"."news" to "authenticated";

grant select on table "public"."news" to "authenticated";

grant trigger on table "public"."news" to "authenticated";

grant truncate on table "public"."news" to "authenticated";

grant update on table "public"."news" to "authenticated";

grant delete on table "public"."news" to "service_role";

grant insert on table "public"."news" to "service_role";

grant references on table "public"."news" to "service_role";

grant select on table "public"."news" to "service_role";

grant trigger on table "public"."news" to "service_role";

grant truncate on table "public"."news" to "service_role";

grant update on table "public"."news" to "service_role";

grant delete on table "public"."news_entities_link" to "anon";

grant insert on table "public"."news_entities_link" to "anon";

grant references on table "public"."news_entities_link" to "anon";

grant select on table "public"."news_entities_link" to "anon";

grant trigger on table "public"."news_entities_link" to "anon";

grant truncate on table "public"."news_entities_link" to "anon";

grant update on table "public"."news_entities_link" to "anon";

grant delete on table "public"."news_entities_link" to "authenticated";

grant insert on table "public"."news_entities_link" to "authenticated";

grant references on table "public"."news_entities_link" to "authenticated";

grant select on table "public"."news_entities_link" to "authenticated";

grant trigger on table "public"."news_entities_link" to "authenticated";

grant truncate on table "public"."news_entities_link" to "authenticated";

grant update on table "public"."news_entities_link" to "authenticated";

grant delete on table "public"."news_entities_link" to "service_role";

grant insert on table "public"."news_entities_link" to "service_role";

grant references on table "public"."news_entities_link" to "service_role";

grant select on table "public"."news_entities_link" to "service_role";

grant trigger on table "public"."news_entities_link" to "service_role";

grant truncate on table "public"."news_entities_link" to "service_role";

grant update on table "public"."news_entities_link" to "service_role";


