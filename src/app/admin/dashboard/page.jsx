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

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  const { latestAppointments, latestEnquiries, stats } = await getAdminDashboardData();

  return (
    <AdminShell activePath="/admin/dashboard" admin={admin} eyebrow="Operations" title="Dashboard">
      <section className={styles.statsGrid} aria-label="Admin summary">
        {stats.map((stat) => (
          <article className={styles.card} key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <p>{stat.detail}</p>
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
