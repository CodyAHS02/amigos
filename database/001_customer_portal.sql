create table if not exists customers (
  id text primary key,
  name text not null,
  email text not null unique,
  password_hash text not null,
  password_salt text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists consultations (
  id text primary key,
  customer_id text references customers(id) on delete set null,
  name text not null,
  email text not null,
  project_type text not null,
  message text not null,
  status text not null default 'PENDING',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists appointments (
  id text primary key,
  customer_id text references customers(id) on delete set null,
  consultation_id text unique references consultations(id) on delete set null,
  title text not null,
  date text not null,
  time text not null,
  status text not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists invoices (
  id text primary key,
  customer_id text not null references customers(id) on delete cascade,
  invoice_no text not null unique,
  service text not null,
  amount_cents integer not null default 0,
  currency text not null default 'CHF',
  status text not null default 'PLANNED',
  due_date timestamptz,
  issued_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists consultations_customer_id_idx on consultations(customer_id);
create index if not exists consultations_email_idx on consultations(email);
create index if not exists consultations_status_idx on consultations(status);
create index if not exists consultations_created_at_idx on consultations(created_at);

create index if not exists appointments_customer_id_idx on appointments(customer_id);
create index if not exists appointments_status_idx on appointments(status);
create index if not exists appointments_created_at_idx on appointments(created_at);

create index if not exists invoices_customer_id_idx on invoices(customer_id);
create index if not exists invoices_status_idx on invoices(status);
create index if not exists invoices_created_at_idx on invoices(created_at);
