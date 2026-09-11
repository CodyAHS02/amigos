import crypto from "node:crypto";
import { sql } from "@/lib/db";
import { normalizeEmail } from "@/lib/validation";

const PASSWORD_ITERATIONS = 210000;
const PASSWORD_KEY_LENGTH = 32;
const PASSWORD_DIGEST = "sha256";

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST).toString("hex");

  return { salt, hash };
}

function passwordMatches(password, customer) {
  const { hash } = hashPassword(password, customer.passwordSalt);
  const hashBuffer = Buffer.from(hash, "hex");
  const storedBuffer = Buffer.from(customer.passwordHash, "hex");

  return hashBuffer.length === storedBuffer.length && crypto.timingSafeEqual(hashBuffer, storedBuffer);
}

function formatDate(date) {
  if (!date) return "Not issued";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function formatScheduledDate(value) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(value);
}

function formatMoney(amountCents, currency) {
  if (!amountCents) return "Pending";

  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency
  }).format(amountCents / 100);
}

function readableStatus(status) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function invoiceNumber(customerId, index) {
  return `INV-${customerId.slice(0, 6).toUpperCase()}-${String(index).padStart(3, "0")}`;
}

export async function createCustomerAccount({ name, email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const [existingCustomer] = await sql`select id from customers where email = ${normalizedEmail}`;

  if (existingCustomer) {
    return { error: "An account with this email already exists." };
  }

  const { salt, hash } = hashPassword(password);
  const customerId = crypto.randomUUID();

  const [customer] = await sql.begin(async (transaction) => {
    const [createdCustomer] = await transaction`
      insert into customers (id, name, email, password_salt, password_hash)
      values (${customerId}, ${name.trim()}, ${normalizedEmail}, ${salt}, ${hash})
      returning id, name, email
    `;

    await transaction`
      update consultations
      set customer_id = ${createdCustomer.id}, updated_at = now()
      where email = ${normalizedEmail} and customer_id is null
    `;

    await transaction`
      update appointments
      set customer_id = ${createdCustomer.id}, updated_at = now()
      where customer_id is null
      and consultation_id in (
        select id from consultations where email = ${normalizedEmail}
      )
    `;

    await transaction`
      update projects
      set customer_id = ${createdCustomer.id}, updated_at = now()
      where customer_id is null
      and consultation_id in (
        select id from consultations where email = ${normalizedEmail}
      )
    `;

    return [createdCustomer];
  });

  return { customer: publicCustomer(customer) };
}

export async function authenticateCustomer(email, password) {
  const normalizedEmail = normalizeEmail(email);
  const [customer] = await sql`
    select id, name, email, password_hash as "passwordHash", password_salt as "passwordSalt"
    from customers
    where email = ${normalizedEmail}
  `;

  if (!customer || !passwordMatches(password, customer)) return null;

  return publicCustomer(customer);
}

export async function createConsultationRequest({ customerEmail, name, email, projectType, message }) {
  const submittedEmail = normalizeEmail(email);
  const sessionEmail = normalizeEmail(customerEmail);
  const [customer] = await sql`
    select id from customers
    where email = ${sessionEmail || submittedEmail}
    limit 1
  `;
  const consultationId = crypto.randomUUID();
  const appointmentId = crypto.randomUUID();
  const projectId = crypto.randomUUID();

  const [consultation] = await sql.begin(async (transaction) => {
    const [createdConsultation] = await transaction`
      insert into consultations (id, customer_id, name, email, project_type, message)
      values (${consultationId}, ${customer?.id || null}, ${name.trim()}, ${submittedEmail}, ${projectType}, ${message.trim()})
      returning id, status
    `;

    const [createdAppointment] = await transaction`
      insert into appointments (id, customer_id, consultation_id, title, date, time, status)
      values (${appointmentId}, ${customer?.id || null}, ${createdConsultation.id}, ${`Consultation: ${projectType}`}, ${"To be scheduled"}, ${"Pending"}, ${"PENDING"})
      returning id
    `;

    await transaction`
      insert into projects (id, customer_id, consultation_id, title, service, stage)
      values (${projectId}, ${customer?.id || null}, ${createdConsultation.id}, ${`${projectType} Request`}, ${projectType}, ${"NEW_LEAD"})
    `;

    return [{ ...createdConsultation, appointment: createdAppointment }];
  });

  return {
    consultation: {
      id: consultation.id,
      status: readableStatus(consultation.status),
      appointmentId: consultation.appointment?.id
    }
  };
}

export async function getCustomerPortalData(email) {
  const normalizedEmail = normalizeEmail(email);
  const [customer] = await sql`
    select id, name, email
    from customers
    where email = ${normalizedEmail}
  `;

  if (!customer) return null;

  const customerAppointments = await sql`
    select id, title, date, time, status, scheduled_at as "scheduledAt"
    from appointments
    where customer_id = ${customer.id}
    order by created_at desc
  `;
  const looseAppointments = await sql`
    select appointments.id, appointments.title, appointments.date, appointments.time, appointments.status,
      appointments.scheduled_at as "scheduledAt"
    from appointments
    join consultations on consultations.id = appointments.consultation_id
    where consultations.email = ${normalizedEmail}
    and appointments.customer_id is null
    order by appointments.created_at desc
  `;
  const consultations = await sql`
    select id, project_type as "projectType", status
    from consultations
    where customer_id = ${customer.id}
    or (email = ${normalizedEmail} and customer_id is null)
    order by created_at desc
  `;
  const customerInvoices = await sql`
    select id, customer_id as "customerId", invoice_no as "invoiceNo", service, amount_cents as "amountCents",
      currency, status, due_date as "dueDate", issued_at as "issuedAt", created_at as "createdAt"
    from invoices
    where customer_id = ${customer.id}
    order by created_at desc
  `;

  const attachedAppointments = customerAppointments.map(formatAppointment);
  const pendingLooseAppointments = looseAppointments.map(formatAppointment);
  const appointments = [...attachedAppointments, ...pendingLooseAppointments];
  const invoices = customerInvoices.map(formatInvoice);
  const openInvoices = customerInvoices.filter((invoice) => invoice.status !== "PAID");
  const upcomingAppointments = appointments.filter((appointment) => appointment.status !== "Completed");
  const activeProjects = consultations.filter(
    (consultation) => !["COMPLETED", "CANCELLED"].includes(consultation.status)
  );

  return {
    customerProfile: {
      name: customer.name,
      email: customer.email,
      property: activeProjects[0]?.projectType || "New Project Consultation",
      accountId: `AMG-${customer.id.slice(0, 8).toUpperCase()}`,
      nextAppointment: upcomingAppointments[0]?.date || "Not scheduled"
    },
    portalStats: [
      { label: "Open Invoices", value: String(openInvoices.length), detail: openInvoices.length ? "Action may be needed" : "Nothing due" },
      { label: "Upcoming Visits", value: String(upcomingAppointments.length), detail: upcomingAppointments[0]?.date || "No appointment set" },
      { label: "Active Projects", value: String(activeProjects.length), detail: activeProjects.length ? "Consultation phase" : "No active project" },
      { label: "Documents", value: String(invoices.length), detail: "Invoices and project records" }
    ],
    invoices,
    appointments
  };
}

export async function getCustomerInvoiceForPayment({ email, invoiceNo }) {
  const normalizedEmail = normalizeEmail(email);
  const [invoice] = await sql`
    select invoices.invoice_no as "invoiceNo", invoices.service, invoices.amount_cents as "amountCents",
      invoices.currency, invoices.status
    from invoices
    join customers on customers.id = invoices.customer_id
    where customers.email = ${normalizedEmail}
    and invoices.invoice_no = ${invoiceNo}
    and invoices.status in ('PLANNED', 'DUE')
    and invoices.amount_cents > 0
  `;

  return invoice || null;
}

function formatAppointment(appointment) {
  const scheduledDate = formatScheduledDate(appointment.scheduledAt);
  const scheduledTime = appointment.scheduledAt
    ? new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
      }).format(appointment.scheduledAt)
    : null;

  return {
    id: appointment.id,
    title: appointment.title,
    date: scheduledDate || appointment.date,
    time: scheduledTime || appointment.time,
    scheduledAt: appointment.scheduledAt,
    notice: scheduledDate ? `Your appointment is scheduled for ${scheduledDate}${scheduledTime ? ` at ${scheduledTime}` : ""}.` : "",
    status: readableStatus(appointment.status)
  };
}

function formatInvoice(invoice) {
  return {
    id: invoice.invoiceNo || invoiceNumber(invoice.customerId, 1),
    service: invoice.service,
    date: formatDate(invoice.issuedAt || invoice.dueDate || invoice.createdAt),
    amount: formatMoney(invoice.amountCents, invoice.currency),
    status: readableStatus(invoice.status),
    canPay: invoice.amountCents > 0 && ["PLANNED", "DUE"].includes(invoice.status)
  };
}

function publicCustomer(customer) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email
  };
}
