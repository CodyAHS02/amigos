import { Fragment } from "react";
import PortalShell from "@/components/customer/PortalShell";
import StatusBadge from "@/components/customer/StatusBadge";
import { getCurrentCustomerPortalData } from "@/lib/currentCustomer";
import styles from "@/components/customer/Portal.module.css";

export const metadata = {
  title: "Appointments | Amigos Maler",
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = "force-dynamic";

export default async function CustomerAppointmentsPage() {
  const { appointments, customerProfile } = await getCurrentCustomerPortalData();

  return (
    <PortalShell
      title="Appointments"
      eyebrow="Scheduling"
      activePath="/customer/appointments"
      customerProfile={customerProfile}
    >
      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h2>Scheduled Visits</h2>
            <p>Track inspections, approvals, and walkthroughs.</p>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Appointment</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <Fragment key={appointment.id}>
                <tr>
                  <td>{appointment.id}</td>
                  <td>{appointment.title}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td><StatusBadge status={appointment.status} /></td>
                </tr>
                {appointment.notice && (
                  <tr>
                    <td colSpan={5}>{appointment.notice}</td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </section>
    </PortalShell>
  );
}
