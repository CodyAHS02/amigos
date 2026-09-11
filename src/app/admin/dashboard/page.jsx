import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import AdminStatusSelect from "@/components/admin/AdminStatusSelect";
import { getAdminDashboardData } from "@/lib/adminStore";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import styles from "@/components/admin/Admin.module.css";

export const metadata = {
  title: "Admin Dashboard | Amigos Maler",
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = "force-dynamic";

const statIcons = {
  Customers: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  "Open Enquiries": (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  "Active Appointments": (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m9 15 2 2 4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "Open Invoices": (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  "Active Projects": (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-7h6v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9h.01M15 9h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  "Live Chats": (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M7.5 18H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-4.5L8 21v-3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 8h8M7 12h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
};

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  const { latestAppointments, latestEnquiries, stats } = await getAdminDashboardData();

  return (
    <AdminShell activePath="/admin/dashboard" admin={admin} eyebrow="Operations" title="Dashboard">
      <section className={styles.statsGrid} aria-label="Admin summary">
        {stats.map((stat) => (
          <article className={styles.card} key={stat.label}>
            <div className={styles.statIcon}>{statIcons[stat.label] || statIcons["Active Projects"]}</div>
            <div>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <p>{stat.detail}</p>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.contentGrid}>
        <article className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div>
              <h2>Latest Enquiries</h2>
              <p>Newest customer requests</p>
            </div>
            <Link href="/admin/enquiries">View all</Link>
          </div>
          <table className={styles.table}>
            <tbody>
              {latestEnquiries.map((enquiry) => (
                <tr key={enquiry.id}>
                  <td>{enquiry.name}</td>
                  <td>{enquiry.projectType}</td>
                  <td>
                    <AdminStatusSelect
                      endpoint={`/api/admin/enquiries/${enquiry.id}`}
                      options={["PENDING", "REVIEWING", "SCHEDULED", "COMPLETED", "CANCELLED"]}
                      value={enquiry.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div>
              <h2>Latest Appointments</h2>
              <p>Consultations and visits</p>
            </div>
            <Link href="/admin/appointments">View all</Link>
          </div>
          <table className={styles.table}>
            <tbody>
              {latestAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.customerName}</td>
                  <td>{appointment.title}</td>
                  <td>
                    <AdminStatusSelect
                      endpoint={`/api/admin/appointments/${appointment.id}`}
                      options={["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]}
                      value={appointment.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </AdminShell>
  );
}
