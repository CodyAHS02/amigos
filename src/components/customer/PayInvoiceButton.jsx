"use client";

import { useState } from "react";
import styles from "@/components/customer/Portal.module.css";

export default function PayInvoiceButton({ invoiceId }) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handlePayment() {
    setError("");
    setIsLoading(true);

    const response = await fetch(`/api/customer/invoices/${invoiceId}/checkout`, {
      method: "POST"
    });
    const result = await response.json();

    setIsLoading(false);

    if (!response.ok) {
      setError(result.error || "Unable to start payment.");
      return;
    }

    window.location.href = result.url;
  }

  return (
    <div>
      <button className={styles.primaryButton} disabled={isLoading} onClick={handlePayment} type="button">
        {isLoading ? "Opening..." : "Pay"}
      </button>
      {error && <p className={styles.fieldError}>{error}</p>}
    </div>
  );
}
