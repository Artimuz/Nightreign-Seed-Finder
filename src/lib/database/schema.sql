-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.seedfinder_logs (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  seed_id text NOT NULL,
  timezone text,
  bug_report boolean DEFAULT false,
  path_taken jsonb NOT NULL,
  additional_info jsonb,
  session_duration integer,
  created_at timestamp with time zone DEFAULT now(),
  Nightlord text,
  CONSTRAINT seedfinder_logs_pkey PRIMARY KEY (id)
);

CREATE TABLE public.user_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id text NOT NULL UNIQUE,
  page_path text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  last_heartbeat timestamp with time zone DEFAULT now(),
  is_localhost boolean DEFAULT false,
  nightlord character varying DEFAULT NULL::character varying,
  CONSTRAINT user_sessions_pkey PRIMARY KEY (id)
);