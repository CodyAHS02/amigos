"use client";

import { useRouter } from "next/navigation";
import styles from "./Portal.module.css";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/customer/logout", { method: "POST" });
    router.push("/customer/login");
    router.refresh();
  }

  return (
    <button className={styles.logoutButton} type="button" onClick={handleLogout}>
      Logout
    </button>
  );
}
