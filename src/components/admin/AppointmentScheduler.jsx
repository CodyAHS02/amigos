"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/admin/Admin.module.css";

export default function AppointmentScheduler({ appointmentId, scheduledAt }) {
  const router = useRouter();
  const [value, setValue] = useState(scheduledAt ? scheduledAt.slice(0, 16) : "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!value) return;

    setIsSaving(true);

    const response = await fetch(`/api/admin/appointments/${appointmentId}/schedule`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ scheduledAt: value })
    });

    setIsSaving(false);

    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <form className={styles.scheduleForm} onSubmit={handleSubmit}>
      <input
        aria-label="Appointment date and time"
        className={styles.dateInput}
        onChange={(event) => setValue(event.target.value)}
        type="datetime-local"
        value={value}
      />
      <button className={styles.miniButton} disabled={isSaving || !value} type="submit">
        {isSaving ? "Saving" : "Schedule"}
      </button>
    </form>
  );
}
