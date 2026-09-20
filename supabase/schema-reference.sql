-- ============================================================================
--  SCHEMA REFERENCE — DOCUMENTATION, NOT A MIGRATION
-- ============================================================================
--
--  This file describes the live schema of `yokgnzxwrbymarjdfyhk` so it can be
--  read and reviewed alongside the application code.
--
--  DO NOT RUN IT. It is not an export of the nine applied migrations and it is
--  not a replay of them. Column lists and constraints here are accurate;
--  policy *bodies* are summarised in comments rather than written as SQL,
--  because a policy reconstructed from prose is a guess, and a guess in an
--  executable file is the kind that eventually gets applied to a database.
--
--  To get the authoritative SQL into the repository, see `supabase/README.md`:
--      supabase link --project-ref yokgnzxwrbymarjdfyhk
--      supabase db pull
--
--  Every table below has RLS enabled.
-- ============================================================================


-- ─────────────────────────────── ADMIN ───────────────────────────────

-- Who may administer the portfolio. One active row today.
--
-- RLS: an authenticated user may read *their own* row. Anonymous users cannot
-- read it at all, and an ordinary authenticated user cannot insert their own
-- membership or promote themselves.
--
-- NOTE: the CMS policies check *active membership*, not the role. An active
-- `editor` currently has the same permissions as an `owner`. Do not add an
-- editor before role-specific permissions exist.
create table portfolio_admins (
  user_id    uuid primary key references auth.users (id),
  role       text default 'owner',            -- check: owner | editor
  is_active  boolean default true,
  created_at timestamptz default now()
);


-- ────────────────────────── PUBLISHED CONTENT ──────────────────────────
--
--  The seven tables below share one anonymous read rule:
--
--      is_published = true
--      AND published_at is not null
--      AND published_at <= now()
--
--  All three are required. `is_published` alone leaves a record invisible.

create table portfolio_projects (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,     -- check: lowercase, digits, internal hyphens
  title             text not null,
  summary           text default '',
  body              jsonb default '{}',       -- contract: validateProjectBody
  status            text default 'prototype', -- check: production | released | active-development
                                              --      | research | prototype | pre-alpha
                                              --      | completed | archived
  tier              text default 'secondary', -- check: flagship | secondary | current-fyp | archive
  domains           text[] default '{}',
  technologies      text[] default '{}',      -- mirrors project_technologies for cheap reads
  source_visibility text default 'unavailable', -- check: public | private | unavailable
  repository_url    text,                     -- check: must be NULL when source_visibility = 'private'
  demo_url          text,
  package_url       text,
  featured_rank     integer unique,           -- check: > 0 when present
  sort_order        integer default 0,
  seo               jsonb default '{}',       -- contract: validateSeo
  is_published      boolean default false,
  published_at      timestamptz,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now() -- maintained by trigger
);

create table technologies (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  category     text not null,
  description  text default '',
  evidence     jsonb default '[]',            -- contract: validateTechnologyEvidence
  sort_order   integer default 0,
  is_published boolean default false,
  published_at timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table research_projects (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  title            text not null,
  summary          text default '',
  status           text default 'research',   -- no DB constraint; validated in application code
  project_id       uuid references portfolio_projects (id),
  methodology      jsonb default '{}',        -- contract: validateResearchMethodology
  results          jsonb default '{}',        -- contract: validateResearchResults
  corrections      jsonb default '[]',        -- contract: validateResearchList
  limitations      jsonb default '[]',
  future_work      jsonb default '[]',
  disclosure_notes text default '',
  sort_order       integer default 0,
  seo              jsonb default '{}',
  is_published     boolean default false,
  published_at     timestamptz,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create table open_source_contributions (
  id                uuid primary key default gen_random_uuid(),
  repository        text not null,
  pr_number         integer not null,         -- check: > 0
  pr_url            text unique not null,
  title             text not null,
  summary           text default '',
  status            text not null,            -- check: merged | open | closed
  merged_at         timestamptz,
  contribution_date date,
  technical_areas   text[] default '{}',
  verification      jsonb default '{}',       -- contract: validateContributionVerification
  sort_order        integer default 0,
  is_published      boolean default false,
  published_at      timestamptz,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),
  unique (repository, pr_number)
);

create table credentials (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  title          text not null,
  issuer         text not null,
  issued_at      date,
  credential_url text,
  description    text default '',
  featured       boolean default false,
  sort_order     integer default 0,
  is_published   boolean default false,
  published_at   timestamptz,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table experience (
  id           uuid primary key default gen_random_uuid(),
  organization text not null,
  title        text not null,
  description  text default '',
  started_at   date,
  ended_at     date,
  location     text,
  evidence     jsonb default '[]',            -- contract: validateExperienceEvidence
  sort_order   integer default 0,
  is_published boolean default false,
  published_at timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table site_content (
  id           uuid primary key default gen_random_uuid(),
  content_key  text unique not null,
  page_slug    text default 'home',
  content      jsonb default '{}',            -- contract: validateSiteContent (closed block set)
  seo          jsonb default '{}',
  is_published boolean default false,
  published_at timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);


-- ─────────────────────── PROJECT-SCOPED CHILDREN ───────────────────────

-- Public read requires the parent project to be published.
create table project_technologies (
  project_id    uuid references portfolio_projects (id) on delete cascade,
  technology_id uuid references technologies (id)       on delete cascade,
  sort_order    integer default 0,
  primary key (project_id, technology_id)
);

-- Public read requires the record AND its parent project to be published.
--
-- A file already in the public storage bucket stays fetchable by URL even when
-- this row is unpublished. Keep drafts and restricted material in the private
-- bucket.
create table project_media (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid references portfolio_projects (id) on delete cascade,
  storage_bucket text default 'portfolio-public',
  storage_path   text not null,
  media_type     text not null,               -- check: image | video | diagram | document
  alt_text       text default '',
  caption        text default '',
  metadata       jsonb default '{}',
  sort_order     integer default 0,
  is_published   boolean default false,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now(),
  unique (storage_bucket, storage_path)
);

-- Public read requires verified = true AND the parent project published.
-- The flag is a publication safeguard, not evidence in itself.
create table project_metrics (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid references portfolio_projects (id) on delete cascade,
  label         text not null,
  value         text not null,
  evidence_type text not null,
  evidence_url  text,
  verified      boolean default false,
  as_of         date,
  details       text default '',
  sort_order    integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);


-- ─────────────────────────── SITE CONFIGURATION ───────────────────────────

-- NO anonymous read policy, deliberately. It mixes presentation settings with
-- operational ones, so a blanket policy would publish both — and everything
-- added later. Public pages read a named allowlist through /api/site-config.
create table site_settings (
  setting_key   text primary key,
  setting_value jsonb default '{}',
  updated_at    timestamptz default now()
);

-- Public read requires is_published only. No published_at column here.
create table portfolio_media (
  id             uuid primary key default gen_random_uuid(),
  storage_bucket text default 'portfolio-public',
  storage_path   text not null,
  media_type     text not null,               -- check: image | video | diagram | document
  alt_text       text default '',
  caption        text default '',
  metadata       jsonb default '{}',
  is_published   boolean default false,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now(),
  unique (storage_bucket, storage_path)
);


-- ─────────────────────────────────── CRM ───────────────────────────────────

-- Anonymous INSERT is allowed by ONE policy whose WITH CHECK pins
-- status = 'new' AND source = 'studio_request', and validates the intake
-- fields. No anonymous SELECT, UPDATE or DELETE.
--
-- The grant is table-wide, so the CRM columns below are not independently
-- constrained by that policy. /api/contact builds an explicit server-side
-- allowlist and never spreads the request body.
create table studio_leads (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz default now(),
  name                text not null,          -- check: length 1..120
  email               text not null,          -- check: length 3..254
  company             text,                   -- check: <= 160
  website             text,                   -- check: length 8..500 when present
  problem             text not null,          -- check: length 10..5000
  source              text default 'studio_request',  -- check: length 1..80
  status              text default 'new',     -- check: new | reviewing | contacted | qualified
                                              --      | proposal | negotiation | won | lost
                                              --      | archived | closed
  notified_at         timestamptz,
  service             text default 'not_sure',-- check: website_fix | new_website | web_app
                                              --      | chatbot | automation | not_sure
  timeline            text,                   -- check: asap | 1_2_weeks | this_month | flexible
  priority            text default 'normal',  -- check: low | normal | high | urgent
  estimated_value_usd numeric(12,2),          -- check: >= 0
  next_follow_up_at   timestamptz,
  last_contacted_at   timestamptz,
  internal_tags       text[] default '{}',
  updated_at          timestamptz default now()
);

-- Private. author_id must equal auth.uid() on insert.
create table lead_notes (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid references studio_leads (id) on delete cascade,
  author_id  uuid references auth.users (id),
  note       text not null,                   -- check: length 1..10000
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Append-only. Admins read and insert (actor_id = auth.uid()); nobody updates
-- or deletes.
create table lead_activity (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid references studio_leads (id) on delete cascade,
  actor_id   uuid references auth.users (id),
  action     text not null,
  detail     jsonb default '{}',
  created_at timestamptz default now()
);


-- ─────────────────────────────────── AUDIT ───────────────────────────────────

-- Append-only, same shape as lead_activity.
--
-- This records what the admin *client* did. It is not proof of every statement
-- the database saw — a direct SQL session writes nothing here. For stronger
-- guarantees, move it to triggers.
create table admin_audit_log (
  id          bigint primary key generated always as identity,
  actor_id    uuid references auth.users (id),
  action      text not null,
  entity_type text not null,
  entity_id   text not null,
  detail      jsonb default '{}',
  created_at  timestamptz default now()
);


-- ============================================================================
--  PROPOSED — NOT APPLIED
-- ============================================================================
--
--  Contact enquiries currently share `source = 'studio_request'` with Studio
--  requests, because that is what the intake policy accepts. The category is
--  preserved as the first line of the message and the CRM parses it back out,
--  so nothing is lost to a human reading the enquiry — but the two cannot be
--  separated in SQL.
--
--  The narrow fix is to widen the accepted `source` values by exactly the set
--  the contact form uses, and nothing else. Everything else about the policy —
--  the pinned status, the field validation — stays as it is.
--
--  Sketch only. The real change should be written against the actual policy
--  body from `supabase db pull`, not against this summary:
--
--    source = 'studio_request'
--    OR source in (
--      'contact:engineering_opportunity',
--      'contact:internship_job',
--      'contact:research_collaboration',
--      'contact:open_source',
--      'contact:client_project',
--      'contact:other'
--    )
--
--  A stronger version would drop the table-wide anonymous INSERT grant in
--  favour of column-level privileges, or a `security definer` intake function
--  that accepts only the public fields. That removes the need for the
--  application-side allowlist to be the only thing standing between a stranger
--  and the CRM columns.
-- ============================================================================
