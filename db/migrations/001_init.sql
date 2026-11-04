-- Money Machine — migration 001: accounts, creator profiles, settings, blocks, consent, audit.
-- Auth users live in Neon Auth (neon_auth."user"); app_user.id is the same uuid.
-- Money is NOT stored here yet (record-only financial tables come in a later migration).

create table if not exists app_user (
  id            uuid primary key,
  email         text not null,
  display_name  text not null,
  account_type  text check (account_type in ('creator','business','agency')),
  is_staff      boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists organisation (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (length(name) between 1 and 120),
  kind        text not null check (kind in ('business','agency')),
  created_by  uuid not null references app_user(id),
  created_at  timestamptz not null default now()
);

create table if not exists membership (
  user_id     uuid not null references app_user(id) on delete cascade,
  org_id      uuid not null references organisation(id) on delete cascade,
  role        text not null check (role in ('owner','member')),
  created_at  timestamptz not null default now(),
  primary key (user_id, org_id)
);

create table if not exists creator_profile (
  user_id         uuid primary key references app_user(id) on delete cascade,
  headline        text not null default '' check (length(headline) <= 140),
  bio             text not null default '' check (length(bio) <= 1000),
  city            text not null default '' check (length(city) <= 80),
  categories      text[] not null default '{}',
  languages       text[] not null default '{}',
  discoverable    boolean not null default false,   -- opt-in: hidden from search until switched on
  showcase_public boolean not null default false,
  updated_at      timestamptz not null default now()
);
create index if not exists creator_profile_discoverable_idx
  on creator_profile (discoverable) where discoverable;

create table if not exists user_settings (
  user_id           uuid primary key references app_user(id) on delete cascade,
  notify_offers     boolean not null default true,
  notify_messages   boolean not null default true,
  notify_reminders  boolean not null default false,
  updated_at        timestamptz not null default now()
);

create table if not exists block (
  blocker     uuid not null references app_user(id) on delete cascade,
  blocked     uuid not null references app_user(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (blocker, blocked),
  check (blocker <> blocked)
);
create index if not exists block_blocked_idx on block (blocked);

create table if not exists consent_record (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references app_user(id) on delete cascade,
  scope         text not null check (scope in ('discoverability','showcase','data_use')),
  granted_at    timestamptz not null default now(),
  withdrawn_at  timestamptz
);
create index if not exists consent_user_idx on consent_record (user_id, scope);

create table if not exists audit_log (
  id      bigserial primary key,
  actor   uuid,
  action  text not null,
  detail  jsonb not null default '{}'::jsonb,
  at      timestamptz not null default now()
);
create index if not exists audit_actor_idx on audit_log (actor, at desc);
