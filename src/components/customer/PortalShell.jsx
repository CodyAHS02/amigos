import Link from "next/link";
import InitialAvatar from "@/components/InitialAvatar";
import styles from "./Portal.module.css";
import LogoutButton from "./LogoutButton";

const navItems = [
  { href: "/customer/dashboard", label: "Dashboard" },
  { href: "/customer/invoices", label: "Invoices" },
  { href: "/customer/appointments", label: "Appointments" }
];

export default function PortalShell({ children, title, eyebrow, activePath, customerProfile }) {
  return (
    <main className={styles.portalPage}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link href="/" className={styles.brand}>
            <img src="/New-Logo.png" alt="Amigos Maler" />
            <span>Client Portal</span>
          </Link>
        </div>

        <nav className={styles.nav} aria-label="Customer portal">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={item.href === activePath ? styles.navActive : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.accountCard}>
          <InitialAvatar className={styles.avatar} name={customerProfile.name} />
          <div>
            <span>Account</span>
            <strong>{customerProfile.name}</strong>
            <p>{customerProfile.property}</p>
          </div>
        </div>
      </aside>

      <section className={styles.mainPanel}>
        <header className={styles.topbar}>
          <div>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h1>{title}</h1>
          </div>
          <div className={styles.userTools}>
            <InitialAvatar className={styles.avatar} name={customerProfile.name} />
            <span>{customerProfile.name}</span>
            <LogoutButton />
          </div>
        </header>

        {children}
      </section>
    </main>
  );
}
