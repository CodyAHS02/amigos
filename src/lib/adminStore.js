import crypto from "node:crypto";
import { sql } from "@/lib/db";
import { sendWhatsAppAppointmentMessage } from "@/lib/integrations";
import { normalizeEmail } from "@/lib/validation";

const PASSWORD_ITERATIONS = 210000;
const PASSWORD_KEY_LENGTH = 32;
const PASSWORD_DIGEST = "sha256";

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST).toString("hex");

  return { salt, hash };
}

function passwordMatches(password, admin) {
  const { hash } = hashPassword(password, admin.passwordSalt);
  const hashBuffer = Buffer.from(hash, "hex");
  const storedBuffer = Buffer.from(admin.passwordHash, "hex");

  return hashBuffer.length === storedBuffer.length && crypto.timingSafeEqual(hashBuffer, storedBuffer);
}

function readableStatus(status) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(value);
}

function formatScheduledDateTime(value) {
  if (!value) return "Not scheduled";

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(value);
}

function formatEstimateRange(project) {
  const min = Number(project.estimatedMinCents || 0);
  const max = Number(project.estimatedMaxCents || project.estimatedValueCents || 0);

  if (!min && !max) return "Not estimated";

  const formatter = new Intl.NumberFormat("de-CH");

  if (!min || min === max) return `${project.currency || "CHF"} ${formatter.format(Math.round(max / 100))}.–`;

  return `${project.currency || "CHF"} ${formatter.format(Math.round(min / 100))}.– – ${formatter.format(Math.round(max / 100))}.–`;
}

export async function authenticateAdmin(email, password) {
  const normalizedEmail = normalizeEmail(email);
  const [admin] = await sql`
    select id, name, email, password_hash as "passwordHash", password_salt as "passwordSalt"
    from admins
    where email = ${normalizedEmail}
  `;

  if (admin) {
    return passwordMatches(password, admin) ? publicAdmin(admin) : null;
  }

  return bootstrapAdmin(normalizedEmail, password);
}

async function bootstrapAdmin(email, password) {
  const bootstrapEmail = normalizeEmail(process.env.ADMIN_EMAIL);
  const bootstrapPassword = process.env.ADMIN_PASSWORD || "";

  if (!bootstrapEmail || !bootstrapPassword || email !== bootstrapEmail || password !== bootstrapPassword) {
    return null;
  }

  const { salt, hash } = hashPassword(password);
  const [admin] = await sql`
    insert into admins (id, name, email, password_salt, password_hash)
    values (${crypto.randomUUID()}, ${"Amigos Admin"}, ${email}, ${salt}, ${hash})
    on conflict (email) do nothing
    returning id, name, email
  `;

  if (admin) return publicAdmin(admin);

  const [existingAdmin] = await sql`
    select id, name, email, password_hash as "passwordHash", password_salt as "passwordSalt"
    from admins
    where email = ${email}
  `;

  return existingAdmin && passwordMatches(password, existingAdmin) ? publicAdmin(existingAdmin) : null;
}

export async function getAdminDashboardData() {
  const [stats] = await sql`
    select
      (select count(*)::int from customers) as customers,
      (select count(*)::int from consultations where status in ('PENDING', 'REVIEWING')) as open_enquiries,
      (select count(*)::int from appointments where status in ('PENDING', 'CONFIRMED')) as active_appointments,
      (select count(*)::int from invoices where status in ('PLANNED', 'DUE')) as open_invoices,
      (select count(*)::int from projects where stage not in ('COMPLETED', 'LOST')) as active_projects,
      (select count(*)::int from chat_conversations where status = 'OPEN') as open_chats
  `;
  const latestEnquiries = await getAdminEnquiries({ limit: 5 });
  const latestAppointments = await getAdminAppointments({ limit: 5 });

  return {
    stats: [
      { label: "Customers", value: String(stats.customers), detail: "Registered portal accounts" },
      { label: "Open Enquiries", value: String(stats.open_enquiries), detail: "Pending or in review" },
      { label: "Active Appointments", value: String(stats.active_appointments), detail: "Pending or confirmed" },
      { label: "Open Invoices", value: String(stats.open_invoices), detail: "Planned or due" },
      { label: "Active Projects", value: String(stats.active_projects), detail: "CRM pipeline" },
      { label: "Live Chats", value: String(stats.open_chats), detail: "Open website conversations" }
    ],
    latestEnquiries,
    latestAppointments
  };
}

export async function getAdminCustomers() {
  const customers = await sql`
    select customers.id, customers.name, customers.email, customers.created_at as "createdAt",
      count(distinct consultations.id)::int as enquiries,
      count(distinct appointments.id)::int as appointments,
      count(distinct invoices.id)::int as invoices
    from customers
    left join consultations on consultations.customer_id = customers.id
    left join appointments on appointments.customer_id = customers.id
    left join invoices on invoices.customer_id = customers.id
    group by customers.id
    order by customers.created_at desc
  `;

  return customers.map((customer) => ({
    ...customer,
    joined: formatDate(customer.createdAt)
  }));
}

export async function getAdminEnquiries({ limit } = {}) {
  const rows = limit
    ? await sql`
      select consultations.id, consultations.name, consultations.email, consultations.project_type as "projectType",
        consultations.message, consultations.status, consultations.created_at as "createdAt",
        customers.name as "customerName"
      from consultations
      left join customers on customers.id = consultations.customer_id
      order by consultations.created_at desc
      limit ${limit}
    `
    : await sql`
      select consultations.id, consultations.name, consultations.email, consultations.project_type as "projectType",
        consultations.message, consultations.status, consultations.created_at as "createdAt",
        customers.name as "customerName"
      from consultations
      left join customers on customers.id = consultations.customer_id
      order by consultations.created_at desc
    `;

  return rows.map((row) => ({
    ...row,
    statusLabel: readableStatus(row.status),
    created: formatDate(row.createdAt)
  }));
}

export async function getAdminAppointments({ limit } = {}) {
  const rows = limit
    ? await sql`
      select appointments.id, appointments.title, appointments.date, appointments.time, appointments.status,
        appointments.scheduled_at as "scheduledAt",
        appointments.created_at as "createdAt", consultations.project_type as "projectType",
        coalesce(customers.name, consultations.name) as "customerName",
        coalesce(customers.email, consultations.email) as email
      from appointments
      left join customers on customers.id = appointments.customer_id
      left join consultations on consultations.id = appointments.consultation_id
      order by appointments.created_at desc
      limit ${limit}
    `
    : await sql`
      select appointments.id, appointments.title, appointments.date, appointments.time, appointments.status,
        appointments.scheduled_at as "scheduledAt",
        appointments.created_at as "createdAt", consultations.project_type as "projectType",
        coalesce(customers.name, consultations.name) as "customerName",
        coalesce(customers.email, consultations.email) as email
      from appointments
      left join customers on customers.id = appointments.customer_id
      left join consultations on consultations.id = appointments.consultation_id
      order by appointments.created_at desc
    `;

  return rows.map((row) => ({
    ...row,
    statusLabel: readableStatus(row.status),
    created: formatDate(row.createdAt),
    scheduled: formatScheduledDateTime(row.scheduledAt)
  }));
}

export async function getAdminCrmData() {
  const projects = await sql`
    select projects.id, projects.title, projects.service, projects.stage, projects.priority,
      projects.estimated_value_cents as "estimatedValueCents", projects.currency,
      projects.estimated_min_cents as "estimatedMinCents", projects.estimated_max_cents as "estimatedMaxCents",
      projects.source, projects.workflow,
      projects.created_at as "createdAt",
      coalesce(customers.name, consultations.name) as "customerName",
      coalesce(customers.email, consultations.email) as email,
      consultations.message,
      coalesce(photo_counts.photos, 0)::int as "photoCount"
    from projects
    left join customers on customers.id = projects.customer_id
    left join consultations on consultations.id = projects.consultation_id
    left join offer_calculator_sessions on offer_calculator_sessions.project_id = projects.id
    left join (
      select session_id, count(*)::int as photos
      from offer_calculator_photos
      group by session_id
    ) photo_counts on photo_counts.session_id = offer_calculator_sessions.id
    order by projects.created_at desc
  `;
  const tasks = await sql`
    select crm_tasks.id, crm_tasks.title, crm_tasks.status, crm_tasks.due_date as "dueDate",
      projects.title as "projectTitle"
    from crm_tasks
    left join projects on projects.id = crm_tasks.project_id
    order by crm_tasks.created_at desc
    limit 12
  `;
  const notes = await sql`
    select crm_notes.id, crm_notes.body, crm_notes.created_at as "createdAt",
      projects.title as "projectTitle"
    from crm_notes
    left join projects on projects.id = crm_notes.project_id
    order by crm_notes.created_at desc
    limit 12
  `;

  return {
    projects: projects.map((project) => ({
      ...project,
      stageLabel: readableStatus(project.stage),
      estimateRange: formatEstimateRange(project),
      created: formatDate(project.createdAt)
    })),
    tasks: tasks.map((task) => ({
      ...task,
      statusLabel: readableStatus(task.status),
      due: task.dueDate ? formatDate(task.dueDate) : "No due date"
    })),
    notes: notes.map((note) => ({
      ...note,
      created: formatDate(note.createdAt)
    }))
  };
}

export async function scheduleAppointment({ id, scheduledAt }) {
  const date = new Date(scheduledAt);

  if (Number.isNaN(date.getTime())) {
    return { error: "Select a valid appointment date and time." };
  }

  const [appointment] = await sql`
    update appointments
    set scheduled_at = ${date}, date = ${formatDate(date)}, time = ${new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(date)},
      status = 'CONFIRMED', updated_at = now()
    where id = ${id}
    returning id, title, scheduled_at as "scheduledAt", status
  `;

  if (!appointment) return { error: "Appointment not found." };

  const [recipient] = await sql`
    select coalesce(customers.name, consultations.name) as name, consultations.phone
    from appointments
    left join customers on customers.id = appointments.customer_id
    left join consultations on consultations.id = appointments.consultation_id
    where appointments.id = ${id}
  `;

  const scheduledText = formatScheduledDateTime(appointment.scheduledAt);
  const whatsapp = await sendWhatsAppAppointmentMessage({
    phone: recipient?.phone,
    customerName: recipient?.name || "Customer",
    scheduledText
  });

  return { appointment, whatsapp };
}

export async function updateConsultationStatus(id, status) {
  const allowed = ["PENDING", "REVIEWING", "SCHEDULED", "COMPLETED", "CANCELLED"];

  if (!allowed.includes(status)) return { error: "Invalid enquiry status." };

  const [consultation] = await sql`
    update consultations
    set status = ${status}, updated_at = now()
    where id = ${id}
    returning id, status
  `;

  return consultation ? { consultation } : { error: "Enquiry not found." };
}

export async function updateAppointmentStatus(id, status) {
  const allowed = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

  if (!allowed.includes(status)) return { error: "Invalid appointment status." };

  const [appointment] = await sql`
    update appointments
    set status = ${status}, updated_at = now()
    where id = ${id}
    returning id, status
  `;

  return appointment ? { appointment } : { error: "Appointment not found." };
}

function publicAdmin(admin) {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email
  };
}
