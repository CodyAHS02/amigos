insert into projects (id, customer_id, consultation_id, title, service, stage, created_at, updated_at)
select
  gen_random_uuid()::text,
  consultations.customer_id,
  consultations.id,
  consultations.project_type || ' Request',
  consultations.project_type,
  'NEW_LEAD',
  consultations.created_at,
  now()
from consultations
where not exists (
  select 1 from projects where projects.consultation_id = consultations.id
);
