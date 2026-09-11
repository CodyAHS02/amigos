alter table consultations add column if not exists phone text;
alter table appointments add column if not exists scheduled_at timestamptz;

create table if not exists properties (
  id text primary key,
  customer_id text references customers(id) on delete set null,
  label text not null,
  address text,
  property_type text not null default 'Residential',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id text primary key,
  customer_id text references customers(id) on delete set null,
  consultation_id text references consultations(id) on delete set null,
  property_id text references properties(id) on delete set null,
  title text not null,
  service text not null,
  stage text not null default 'NEW_LEAD',
  priority text not null default 'NORMAL',
  estimated_value_cents integer not null default 0,
  currency text not null default 'CHF',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm_notes (
  id text primary key,
  project_id text references projects(id) on delete cascade,
  customer_id text references customers(id) on delete set null,
  author_type text not null default 'ADMIN',
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists crm_tasks (
  id text primary key,
  project_id text references projects(id) on delete cascade,
  title text not null,
  due_date date,
  status text not null default 'OPEN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_customer_id_idx on properties(customer_id);
create index if not exists projects_customer_id_idx on projects(customer_id);
create index if not exists projects_consultation_id_idx on projects(consultation_id);
create index if not exists projects_stage_idx on projects(stage);
create index if not exists crm_notes_project_id_idx on crm_notes(project_id);
create index if not exists crm_tasks_project_id_idx on crm_tasks(project_id);
create index if not exists crm_tasks_status_idx on crm_tasks(status);
