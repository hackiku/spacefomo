-- supabase/migrations/0000_create_weeks_table.sql

-- Create an enum for storing different types of stats
create type stat_category as enum ('launchActivity', 'industryBuzz', 'techImpact');

-- Create the weeks table with all the fields from your mock data
create table weeks (
    id bigint generated by default as identity primary key,
    week_number integer not null,
    score integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    start_date timestamp with time zone not null,
    end_date timestamp with time zone not null,
    summary text not null,
    -- Using JSONB for flexible stats storage
    stats jsonb not null
);

-- Add some constraints to ensure data quality
alter table weeks add constraint week_number_positive check (week_number > 0);
alter table weeks add constraint score_range check (score >= 0 and score <= 100);