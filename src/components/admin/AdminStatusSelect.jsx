"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/admin/Admin.module.css";

export default function AdminStatusSelect({ endpoint, options, value }) {
  const router = useRouter();
  const [currentValue, setCurrentValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  async function handleChange(event) {
    const nextValue = event.target.value;
    setCurrentValue(nextValue);
    setIsSaving(true);

    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: nextValue })
    });

    setIsSaving(false);

    if (!response.ok) {
      setCurrentValue(value);
      return;
    }

    router.refresh();
  }

  return (
    <select
      aria-label="Update status"
      className={styles.statusSelect}
      disabled={isSaving}
      onChange={handleChange}
      value={currentValue}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())}
        </option>
      ))}
    </select>
  );
}
