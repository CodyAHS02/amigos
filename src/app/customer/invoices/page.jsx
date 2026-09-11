import PortalShell from "@/components/customer/PortalShell";
import PayInvoiceButton from "@/components/customer/PayInvoiceButton";
import StatusBadge from "@/components/customer/StatusBadge";
import { getCurrentCustomerPortalData } from "@/lib/currentCustomer";
import styles from "@/components/customer/Portal.module.css";

export const metadata = {
  title: "Invoices | Amigos Maler",
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = "force-dynamic";

export default async function CustomerInvoicesPage() {
  const { customerProfile, invoices } = await getCurrentCustomerPortalData();

  return (
    <PortalShell title="Invoices" eyebrow="Billing" activePath="/customer/invoices" customerProfile={customerProfile}>
      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h2>Invoice History</h2>
            <p>Review paid and outstanding invoices.</p>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Service</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.service}</td>
                <td>{invoice.date}</td>
                <td>{invoice.amount}</td>
                <td><StatusBadge status={invoice.status} /></td>
                <td>{invoice.canPay ? <PayInvoiceButton invoiceId={invoice.id} /> : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </PortalShell>
  );
}
