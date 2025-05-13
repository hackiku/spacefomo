
create table public.agent_research (
  id uuid not null default gen_random_uuid (),
  research_type text not null,
  submission_id bigint null,
  url text null,
  topic text null,
  timeframe text null,
  query text not null,
  provider text not null default 'perplexity'::text,
  results jsonb not null,
  status text not null default 'pending'::text,
  created_at timestamp with time zone null default now(),
  completed_at timestamp with time zone null,
  error text null,
  constraint agent_research_pkey primary key (id),
  constraint agent_research_submission_id_fkey foreign KEY (submission_id) references submissions (id)
) TABLESPACE pg_default;

create index IF not exists agent_research_research_type_idx on public.agent_research using btree (research_type) TABLESPACE pg_default;

create index IF not exists agent_research_submission_id_idx on public.agent_research using btree (submission_id) TABLESPACE pg_default;

create index IF not exists agent_research_status_idx on public.agent_research using btree (status) TABLESPACE pg_default;

create index IF not exists agent_research_created_at_idx on public.agent_research using btree (created_at) TABLESPACE pg_default;

------------------------------------

create table public.news_outlets (
  id uuid not null default gen_random_uuid (),
  name text not null,
  domain text null,
  logo_url text null,
  fomo_rating integer null default 0,
  created_at timestamp with time zone null default now(),
  constraint news_outlets_pkey primary key (id),
  constraint news_outlets_domain_key unique (domain),
  constraint news_outlets_name_key unique (name)
) TABLESPACE pg_default;

------------------------------------

create table public.processed_news (
  id uuid not null default gen_random_uuid (),
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

------------------------------------

create table public.raw_news (
  id uuid not null default gen_random_uuid (),
  url text not null,
  title text null,
  publication_date date null,
  source_name text null,
  source_type text not null,
  source_id text null,
  discovered_at timestamp with time zone null default now(),
  context jsonb null default '{}'::jsonb,
  plaintext text null,
  status text null default 'pending'::text,
  processed_news_id uuid null,
  process_attempts integer null default 0,
  last_attempt_at timestamp with time zone null,
  error text null,
  source_fomo integer null,
  editor_notes text null,
  constraint raw_news_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists raw_news_url_idx on public.raw_news using btree (url) TABLESPACE pg_default;

create index IF not exists raw_news_status_idx on public.raw_news using btree (status) TABLESPACE pg_default;

create index IF not exists raw_news_source_type_idx on public.raw_news using btree (source_type) TABLESPACE pg_default;

create index IF not exists raw_news_discovered_at_idx on public.raw_news using btree (discovered_at) TABLESPACE pg_default;

------------------------------------

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

------------------------------------

create table public.subscribers (
  id serial not null,
  email character varying(255) not null,
  status character varying(20) not null default 'active'::character varying,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  submission_id bigint null,
  constraint subscribers_pkey primary key (id),
  constraint subscribers_email_key unique (email),
  constraint subscribers_submission_id_fk foreign KEY (submission_id) references submissions (id)
) TABLESPACE pg_default;

create index IF not exists idx_subscribers_email on public.subscribers using btree (email) TABLESPACE pg_default;

create index IF not exists idx_subscribers_status on public.subscribers using btree (status) TABLESPACE pg_default;

------------------------------------

------------------------------------

------------------------------------

------------------------------------

------ !!! OLD BUT USED IN PROD !!! ------

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

------------------------------------

create table public.processed_news (
  id uuid not null default gen_random_uuid (),
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

------------------------------------

create table public.events (
  id uuid not null default gen_random_uuid (),
  title text not null,
  slug text null,
  summary text null,
  fomo_score integer null,
  impact_score integer null,
  tags jsonb null default '[]'::jsonb,
  entities jsonb null default '{}'::jsonb,
  context jsonb null default '{}'::jsonb,
  event_date date null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint events_pkey1 primary key (id),
  constraint events_slug_key1 unique (slug)
) TABLESPACE pg_default;

------------------------------------

create table public.event_sources (
  event_id uuid not null,
  news_id uuid not null,
  is_primary boolean null default false,
  created_at timestamp with time zone null default now(),
  constraint event_sources_pkey primary key (event_id, news_id),
  constraint event_sources_event_id_fkey foreign KEY (event_id) references events (id),
  constraint event_sources_news_id_fkey foreign KEY (news_id) references processed_news (id)
) TABLESPACE pg_default;

------------------------------------

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


------------------------------------



------------------------------------


------------------------------------


------------------------------------


------------------------------------