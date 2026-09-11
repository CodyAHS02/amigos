import styles from "./Portal.module.css";

export default function StatusBadge({ status }) {
  const statusClass = {
    Paid: styles.statusPaid,
    Due: styles.statusDue,
    Confirmed: styles.statusPaid,
    Pending: styles.statusPending,
    Planned: styles.statusPlanned
  }[status] || styles.statusPlanned;

  return <span className={`${styles.statusBadge} ${statusClass}`}>{status}</span>;
}
