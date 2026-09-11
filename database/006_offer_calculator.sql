alter table consultations add column if not exists source text not null default 'CONTACT_FORM';
alter table consultations add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table projects add column if not exists source text not null default 'MANUAL';
alter table projects add column if not exists workflow text not null default 'Review';
alter table projects add column if not exists estimated_min_cents integer not null default 0;
alter table projects add column if not exists estimated_max_cents integer not null default 0;
alter table projects add column if not exists metadata jsonb not null default '{}'::jsonb;

create table if not exists offer_calculator_sessions (
  id text primary key,
  mode text not null default 'CALCULATE',
  status text not null default 'DRAFT',
  email text,
  email_verified_at timestamptz,
  verification_code_hash text,
  verification_expires_at timestamptz,
  verification_attempts integer not null default 0,
  property_type text,
  room_type text,
  components jsonb not null default '[]'::jsonb,
  services jsonb not null default '[]'::jsonb,
  quantities jsonb not null default '{}'::jsonb,
  project_notes text,
  customer_info jsonb not null default '{}'::jsonb,
  estimated_min_cents integer not null default 0,
  estimated_max_cents integer not null default 0,
  currency text not null default 'CHF',
  consultation_id text references consultations(id) on delete set null,
  project_id text references projects(id) on delete set null,
  requested_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists offer_calculator_photos (
  id text primary key,
  session_id text not null references offer_calculator_sessions(id) on delete cascade,
  category text not null,
  file_name text not null,
  file_type text,
  file_size integer,
  data_url text,
  created_at timestamptz not null default now()
);

create index if not exists offer_calculator_sessions_email_idx on offer_calculator_sessions(email);
create index if not exists offer_calculator_sessions_status_idx on offer_calculator_sessions(status);
create index if not exists offer_calculator_sessions_project_id_idx on offer_calculator_sessions(project_id);
create index if not exists offer_calculator_photos_session_id_idx on offer_calculator_photos(session_id);
