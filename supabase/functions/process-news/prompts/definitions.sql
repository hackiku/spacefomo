create table public.news (
  id bigserial not null,
  title text not null,
  url character varying(2048) not null,
  source character varying(255) null,
  read_time integer null,
  fomo_score integer null,
  tags jsonb null,
  week_id bigint null,
  created_at timestamp with time zone not null default now(),
  entities jsonb null,
  context jsonb null,
  impact_score integer null,
  publication_date date null,
  viral_title character varying(255) null,
  slug character varying(255) null,
  summary text null,
  seo jsonb null default '{"title": null, "keywords": [], "image_url": null, "description": null, "article_type": "NewsArticle", "canonical_url": null}'::jsonb,
  constraint space_news_pkey primary key (id),
  constraint space_news_slug_key unique (slug),
  constraint space_news_week_id_weeks_id_fk foreign KEY (week_id) references weeks (id)
) TABLESPACE pg_default;

create index IF not exists space_news_context_idx on public.news using gin (context) TABLESPACE pg_default;

create index IF not exists space_news_entities_idx on public.news using gin (entities) TABLESPACE pg_default;

create index IF not exists space_news_score_idx on public.news using btree (fomo_score) TABLESPACE pg_default;


--------------------------------------
--------------------------------------

create table public.processed_news (
  id uuid not null,
  submission_id bigint null,
  title text not null,
  url text not null,
  source text null,
  read_time integer null,
  fomo_score integer null,
  tags jsonb null default '[]'::jsonb,
  week_id integer null,
  entities jsonb null default '{}'::jsonb,
  context jsonb null default '{}'::jsonb,
  impact_score integer null,
  publication_date date null,
  viral_title text null,
  slug text null,
  summary text null,
  seo jsonb null default '{}'::jsonb,
  created_at timestamp with time zone null default now(),
  processed_at timestamp with time zone null,
  constraint processed_news_pkey primary key (id),
  constraint processed_news_slug_key unique (slug),
  constraint processed_news_submission_id_fkey foreign KEY (submission_id) references submissions (id),
  constraint processed_news_week_id_fkey foreign KEY (week_id) references weeks (id)
) TABLESPACE pg_default;

create index IF not exists processed_news_fomo_score_idx on public.processed_news using btree (fomo_score) TABLESPACE pg_default;

create index IF not exists processed_news_week_id_idx on public.processed_news using btree (week_id) TABLESPACE pg_default;

create index IF not exists processed_news_publication_date_idx on public.processed_news using btree (publication_date) TABLESPACE pg_default;

create index IF not exists processed_news_slug_idx on public.processed_news using btree (slug) TABLESPACE pg_default;



--------------------------------------
--------------------------------------


create table public.submissions (
  id bigint not null,
  url character varying(2048) not null,
  comment text null,
  fomo_score integer null,
  email character varying(255) null,
  published boolean not null default false,
  created_at timestamp with time zone not null default now(),
  week_id bigint null,
  constraint submissions_pkey primary key (id),
  constraint submissions_week_id_weeks_id_fk foreign KEY (week_id) references weeks (id)
) TABLESPACE pg_default;


--------------------------------------
--------------------------------------

create table public.news_entities_link (
  news_id bigint not null,
  entity_type text not null,
  entity_id bigint not null,
  role_in_news text null,
  constraint news_entities_link_pkey primary key (news_id, entity_type, entity_id),
  constraint news_entities_link_entity_type_check check (
    (
      entity_type = any (
        array[
          'organization'::text,
          'person'::text,
          'technology'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_news_entities_link_entity on public.news_entities_link using btree (entity_type, entity_id) TABLESPACE pg_default;



--------------------------------------
--------------------------------------

