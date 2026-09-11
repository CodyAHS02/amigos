"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/customer/Portal.module.css";
import { validateLoginInput } from "@/lib/validation";

export default function LoginForm({ nextPath }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    const form = event.currentTarget;
    const validation = validateLoginInput({
      email: form.elements.email.value,
      password: form.elements.password.value
    });

    if (!validation.valid) {
      setFieldErrors(validation.errors);
      setError("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.set("next", nextPath);

    try {
      const response = await fetch("/api/customer/login", {
        method: "POST",
        body: formData
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to sign in.");
        setFieldErrors(result.errors || {});
        return;
      }

      router.push(result.next || "/customer/dashboard");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      {error && <div className={styles.error}>{error}</div>}

      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
        {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
      </label>

      <label>
        Password
        <input name="password" type="password" autoComplete="current-password" required />
        {fieldErrors.password && <span className={styles.fieldError}>{fieldErrors.password}</span>}
      </label>

      <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
