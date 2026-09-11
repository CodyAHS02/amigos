import Link from "next/link";
import PortalShell from "@/components/customer/PortalShell";
import StatusBadge from "@/components/customer/StatusBadge";
import { getCurrentCustomerPortalData } from "@/lib/currentCustomer";
import styles from "@/components/customer/Portal.module.css";

export const metadata = {
  title: "Customer Dashboard | Amigos Maler",
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = "force-dynamic";

export default async function CustomerDashboardPage() {
  const { appointments, customerProfile, invoices, portalStats } = await getCurrentCustomerPortalData();

  return (
    <PortalShell
      title="Dashboard"
      eyebrow="Client-facing account area"
      activePath="/customer/dashboard"
      customerProfile={customerProfile}
    >
      <section className={styles.grid} aria-label="Account summary">
        {portalStats.map((stat) => (
          <article className={styles.card} key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <p>{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className={styles.contentGrid}>
        <article className={styles.highlightCard}>
          <span className={styles.eyebrow}>Current Project</span>
          <h2>{customerProfile.property}</h2>
          <p>
            Your portal keeps all project information in one secured place: appointment dates, open invoices, and
            project updates.
          </p>
          <Link className={styles.primaryButton} href="/customer/appointments">
            View Appointments
          </Link>
        </article>

        <article className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div>
              <h2>Latest Invoices</h2>
              <p>Recent billing activity</p>
            </div>
            <Link href="/customer/invoices">View all</Link>
          </div>
          <table className={styles.table}>
            <tbody>
              {invoices.slice(0, 2).map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.amount}</td>
                  <td><StatusBadge status={invoice.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>

      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h2>Upcoming Appointments</h2>
            <p>Next scheduled visits</p>
          </div>
        </div>
        <table className={styles.table}>
          <tbody>
            {appointments.slice(0, 3).map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.title}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td><StatusBadge status={appointment.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </PortalShell>
  );
}
