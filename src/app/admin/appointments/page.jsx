import AdminShell from "@/components/admin/AdminShell";
import AppointmentScheduler from "@/components/admin/AppointmentScheduler";
import AdminStatusSelect from "@/components/admin/AdminStatusSelect";
import { getAdminAppointments } from "@/lib/adminStore";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import styles from "@/components/admin/Admin.module.css";

export const metadata = {
  title: "Admin Appointments | Amigos Maler",
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage() {
  const admin = await getCurrentAdmin();
  const appointments = await getAdminAppointments();

  return (
    <AdminShell activePath="/admin/appointments" admin={admin} eyebrow="Scheduling" title="Appointments">
      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h2>Appointment Queue</h2>
            <p>Consultations, visits, approvals, and walkthroughs.</p>
          </div>
        </div>

        <table className={`${styles.table} ${styles.appointmentTable}`}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Appointment</th>
              <th>Date</th>
              <th>Time</th>
              <th>Schedule</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className={styles.personCell}>
                  <strong>{appointment.customerName}</strong>
                </td>
                <td className={styles.emailCell}>{appointment.email}</td>
                <td className={styles.titleCell}>{appointment.title}</td>
                <td className={styles.scheduledCell}>{appointment.scheduled}</td>
                <td className={styles.timeCell}>{appointment.time}</td>
                <td className={styles.scheduleCell}>
                  <AppointmentScheduler appointmentId={appointment.id} scheduledAt={appointment.scheduledAt?.toISOString()} />
                </td>
                <td className={styles.statusCell}>
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
      </section>
    </AdminShell>
  );
}
