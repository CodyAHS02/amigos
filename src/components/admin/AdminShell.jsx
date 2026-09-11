import Link from "next/link";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import InitialAvatar from "@/components/InitialAvatar";
import styles from "@/components/admin/Admin.module.css";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/crm", label: "CRM" },
  { href: "/admin/chat", label: "Live Chat" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/users", label: "Users" }
];

export default function AdminShell({ activePath, admin, children, eyebrow, title }) {
  return (
    <div className={styles.adminPage}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link className={styles.brand} href="/admin/dashboard">
            <img src="/New-Logo.png" alt="Amigos Maler" />
            <span>Amigos Admin</span>
          </Link>
        </div>

        <nav className={styles.nav} aria-label="Admin navigation">
          {navItems.map((item) => (
            <Link className={activePath === item.href ? styles.navActive : ""} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.adminCard}>
          <InitialAvatar className={styles.avatar} name={admin.email} />
          <div>
            <span>Signed In</span>
            <strong>{admin.email}</strong>
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h1>{title}</h1>
          </div>
          <div className={styles.headerTools}>
            <InitialAvatar className={styles.avatar} name={admin.email} />
            <AdminLogoutButton />
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
