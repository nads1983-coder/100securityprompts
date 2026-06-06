create extension if not exists pgcrypto;

create table if not exists public.agent_runs (
  id text primary key,
  status text not null check (status in ('running', 'completed', 'failed', 'skipped')),
  brand text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  summary jsonb not null default '{}'::jsonb,
  failure_reason text
);

create table if not exists public.generated_content (
  id text primary key,
  run_id text references public.agent_runs(id) on delete set null,
  brand text not null,
  platform text,
  content_type text not null,
  title text not null,
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  quality_score integer not null default 0,
  safety_status text not null,
  safety_reasons text[] not null default '{}',
  content_hash text not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.publishing_queue (
  id text primary key,
  run_id text references public.agent_runs(id) on delete set null,
  content_id text references public.generated_content(id) on delete cascade,
  brand text not null,
  platform text,
  content_type text not null,
  status text not null,
  queue_reason text,
  retry_count integer not null default 0,
  scheduled_for timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.published_posts (
  id text primary key,
  run_id text references public.agent_runs(id) on delete set null,
  content_id text references public.generated_content(id) on delete set null,
  brand text not null,
  platform text not null,
  content_type text not null,
  published_url text,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.platform_credentials (
  id text primary key default gen_random_uuid()::text,
  platform text not null unique,
  configured boolean not null default false,
  enabled boolean not null default true,
  missing_keys text[] not null default '{}',
  last_checked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seo_opportunities (
  id text primary key,
  run_id text references public.agent_runs(id) on delete set null,
  brand text not null,
  opportunity_type text not null,
  title text not null,
  target text not null,
  rationale text not null,
  priority_score integer not null default 0,
  status text not null default 'queued',
  created_at timestamptz not null default now()
);

create table if not exists public.backlink_opportunities (
  id text primary key,
  run_id text references public.agent_runs(id) on delete set null,
  brand text not null,
  opportunity_type text not null default 'backlink',
  title text not null,
  target text not null,
  rationale text not null,
  priority_score integer not null default 0,
  status text not null default 'queued',
  created_at timestamptz not null default now()
);

create table if not exists public.brand_mentions (
  id text primary key,
  run_id text references public.agent_runs(id) on delete set null,
  brand text not null,
  opportunity_type text not null default 'brand_mention',
  title text not null,
  target text not null,
  rationale text not null,
  priority_score integer not null default 0,
  status text not null default 'queued',
  created_at timestamptz not null default now()
);

create table if not exists public.weekly_reports (
  id text primary key,
  week_start timestamptz not null,
  week_end timestamptz not null,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_logs (
  id text primary key,
  run_id text references public.agent_runs(id) on delete set null,
  level text not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.safety_logs (
  id text primary key,
  run_id text references public.agent_runs(id) on delete set null,
  content_id text references public.generated_content(id) on delete cascade,
  brand text not null,
  platform text,
  status text not null,
  quality_score integer not null,
  reasons text[] not null default '{}',
  blocked_phrases text[] not null default '{}',
  duplicate_risk numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.failed_publications (
  id text primary key,
  run_id text references public.agent_runs(id) on delete set null,
  content_id text references public.generated_content(id) on delete set null,
  brand text not null,
  platform text not null,
  content_type text not null,
  status text not null,
  failure_reason text not null,
  retry_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.brand_settings (
  brand text primary key,
  enabled boolean not null default true,
  cadence jsonb not null default '{}'::jsonb,
  topic_weights jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.automation_settings (
  id text primary key default 'global',
  emergency_paused boolean not null default false,
  autopublish_enabled boolean not null default false,
  max_posts_per_day integer not null default 4,
  max_posts_per_platform_per_day integer not null default 2,
  retry_limit integer not null default 2,
  blocked_phrases text[] not null default array[
    'guaranteed ranking',
    'fake testimonial',
    'buy backlinks',
    'black hat',
    'mass comment',
    'private data'
  ],
  platform_enabled jsonb not null default '{}'::jsonb,
  brand_enabled jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blocked_phrases (
  id text primary key default gen_random_uuid()::text,
  phrase text not null unique,
  reason text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists generated_content_created_at_idx on public.generated_content (created_at desc);
create index if not exists generated_content_brand_idx on public.generated_content (brand);
create index if not exists generated_content_hash_idx on public.generated_content (content_hash);
create index if not exists publishing_queue_status_idx on public.publishing_queue (status, scheduled_for);
create index if not exists published_posts_created_at_idx on public.published_posts (created_at desc);
create index if not exists seo_opportunities_brand_idx on public.seo_opportunities (brand, created_at desc);
create index if not exists backlink_opportunities_brand_idx on public.backlink_opportunities (brand, created_at desc);
create index if not exists brand_mentions_brand_idx on public.brand_mentions (brand, created_at desc);
create index if not exists agent_logs_created_at_idx on public.agent_logs (created_at desc);
create index if not exists safety_logs_content_id_idx on public.safety_logs (content_id);

insert into public.automation_settings (
  id,
  emergency_paused,
  autopublish_enabled,
  max_posts_per_day,
  max_posts_per_platform_per_day,
  retry_limit,
  platform_enabled,
  brand_enabled
) values (
  'global',
  false,
  false,
  4,
  2,
  2,
  '{"linkedin": true, "medium": true, "kit": true, "instagram": true, "tiktok": true, "x": true, "youtube": true, "internal_blog": false}'::jsonb,
  '{"nadinepierre.com": true, "leadwithnadine.com": true, "getstratiq.co": true, "getcontentos.co": true, "calmauthority.co": true}'::jsonb
) on conflict (id) do nothing;

insert into public.brand_settings (brand, enabled, cadence) values
  ('nadinepierre.com', true, '{"weekly": ["3 founder authority posts", "1 podcast visibility opportunity"]}'::jsonb),
  ('leadwithnadine.com', true, '{"daily": ["1 LinkedIn post", "1 TikTok or Instagram caption"], "weekly": ["1 authority article"]}'::jsonb),
  ('getstratiq.co', true, '{"weekly": ["3 strategic thinking posts", "1 AI-search article"]}'::jsonb),
  ('getcontentos.co', true, '{"weekly": ["3 creator growth posts", "1 repurposing article"]}'::jsonb),
  ('calmauthority.co', true, '{"weekly": ["3 communication posts", "1 script or template post"]}'::jsonb)
on conflict (brand) do nothing;

alter table public.agent_runs enable row level security;
alter table public.generated_content enable row level security;
alter table public.publishing_queue enable row level security;
alter table public.published_posts enable row level security;
alter table public.platform_credentials enable row level security;
alter table public.seo_opportunities enable row level security;
alter table public.backlink_opportunities enable row level security;
alter table public.brand_mentions enable row level security;
alter table public.weekly_reports enable row level security;
alter table public.agent_logs enable row level security;
alter table public.safety_logs enable row level security;
alter table public.failed_publications enable row level security;
alter table public.brand_settings enable row level security;
alter table public.automation_settings enable row level security;
alter table public.blocked_phrases enable row level security;
