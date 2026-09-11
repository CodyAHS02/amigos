import AdminShell from "@/components/admin/AdminShell";
import AdminStatusSelect from "@/components/admin/AdminStatusSelect";
import { getAdminEnquiries } from "@/lib/adminStore";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import styles from "@/components/admin/Admin.module.css";

export const metadata = {
  title: "Admin Enquiries | Amigos Maler",
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const admin = await getCurrentAdmin();
  const enquiries = await getAdminEnquiries();

  return (
    <AdminShell activePath="/admin/enquiries" admin={admin} eyebrow="Requests" title="Enquiries">
      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h2>Customer Requests</h2>
            <p>Every contact form submission and consultation request.</p>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Project</th>
              <th>Message</th>
              <th>Created</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id}>
                <td>{enquiry.customerName || enquiry.name}</td>
                <td>{enquiry.email}</td>
                <td>{enquiry.projectType}</td>
                <td className={styles.messageCell}>{enquiry.message}</td>
                <td>{enquiry.created}</td>
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
      </section>
    </AdminShell>
  );
}
