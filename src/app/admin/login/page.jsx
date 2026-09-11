import Link from "next/link";
import AdminLoginForm from "@/app/admin/login/AdminLoginForm";
import styles from "@/components/admin/Admin.module.css";

export const metadata = {
  title: "Admin Login | Amigos Maler",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLoginPage() {
  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <Link className={styles.brand} href="/">
          <img src="/New-Logo.png" alt="Amigos Maler" />
          <span>Amigos Maler</span>
        </Link>
        <h1>Admin Login</h1>
        <p>Manage customers, enquiries, appointments, and future client operations.</p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
