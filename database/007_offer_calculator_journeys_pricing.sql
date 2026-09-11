alter table offer_calculator_sessions add column if not exists quote_flow text not null default 'DETAILED';
alter table offer_calculator_sessions add column if not exists location jsonb not null default '{}'::jsonb;
alter table offer_calculator_sessions add column if not exists condition text;
alter table offer_calculator_sessions add column if not exists quick_work text;
alter table offer_calculator_sessions add column if not exists travel_cost_cents integer not null default 0;

create table if not exists offer_calculator_pricing_settings (
  id text primary key default 'default',
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into offer_calculator_pricing_settings (id, settings)
values ('default', '{}'::jsonb)
on conflict (id) do nothing;
