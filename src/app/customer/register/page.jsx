import Link from "next/link";
import RegisterForm from "./RegisterForm";
import styles from "@/components/customer/Portal.module.css";

export const metadata = {
  title: "Create Account | Amigos Maler",
  robots: {
    index: false,
    follow: false
  }
};

export default function CustomerRegisterPage() {
  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <img src="/New-Logo.png" alt="Amigos Maler" />
        <h1>Create Account</h1>
        <p>Register to manage your project, invoices, and consultation appointments.</p>
        <RegisterForm />
        <p className={styles.authSwitch}>
          Already have an account? <Link href="/customer/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
