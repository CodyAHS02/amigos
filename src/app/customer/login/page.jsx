import Link from "next/link";
import LoginForm from "./LoginForm";
import styles from "@/components/customer/Portal.module.css";

export const metadata = {
  title: "Customer Login | Amigos Maler",
  robots: {
    index: false,
    follow: false
  }
};

export default async function CustomerLoginPage({ searchParams }) {
  const params = await searchParams;
  const nextPath = typeof params?.next === "string" ? params.next : "/customer/dashboard";

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <img src="/New-Logo.png" alt="Amigos Maler" />
        <h1>Customer Login</h1>
        <p>Access your project dashboard, invoices, and upcoming appointments.</p>
        <LoginForm nextPath={nextPath} />
        <p className={styles.authSwitch}>
          New client? <Link href="/customer/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
