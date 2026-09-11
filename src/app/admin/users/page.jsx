import AdminShell from "@/components/admin/AdminShell";
import { getAdminCustomers } from "@/lib/adminStore";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import styles from "@/components/admin/Admin.module.css";

export const metadata = {
  title: "Admin Users | Amigos Maler",
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const admin = await getCurrentAdmin();
  const customers = await getAdminCustomers();

  return (
    <AdminShell activePath="/admin/users" admin={admin} eyebrow="Customers" title="Users">
      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h2>Customer Accounts</h2>
            <p>Registered users and their account activity.</p>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Enquiries</th>
              <th>Appointments</th>
              <th>Invoices</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.joined}</td>
                <td>{customer.enquiries}</td>
                <td>{customer.appointments}</td>
                <td>{customer.invoices}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AdminShell>
  );
}
