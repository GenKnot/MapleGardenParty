-- 枫华雅集 schema. Run in the Supabase SQL editor.
-- All access goes through server routes using the service-role key,
-- so RLS is enabled with no public policies (anon/auth keys can read nothing).

create table if not exists participants (
  id uuid primary key,
  nickname text not null check (char_length(nickname) between 1 and 40),
  locale text not null check (locale in ('zh-CN','zh-TW','en','fr-CA')),
  kiosk_mode boolean not null default false,
  short_code text not null unique,
  created_at timestamptz not null default now(),
  last_active_at timestamptz not null default now()
);

create table if not exists game_progress (
  participant_id uuid not null references participants(id) on delete cascade,
  game_id text not null,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (participant_id, game_id)
);

create table if not exists stamp_awards (
  id bigint generated always as identity primary key,
  participant_id uuid not null references participants(id) on delete cascade,
  game_id text not null,
  confirmed_by text,
  awarded_at timestamptz not null default now(),
  unique (participant_id, game_id)
);

create table if not exists redemptions (
  id bigint generated always as identity primary key,
  participant_id uuid not null unique references participants(id) on delete cascade,
  token_hash text not null unique,
  status text not null default 'issued' check (status in ('issued','redeemed')),
  issued_at timestamptz not null default now(),
  redeemed_at timestamptz,
  staff_id text
);

create table if not exists wishes (
  id bigint generated always as identity primary key,
  participant_id uuid not null references participants(id) on delete cascade,
  categories text[] not null default '{}',
  message text not null default '' check (char_length(message) <= 280),
  is_public boolean not null default false,
  moderation_status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table participants enable row level security;
alter table game_progress enable row level security;
alter table stamp_awards enable row level security;
alter table redemptions enable row level security;
alter table wishes enable row level security;
