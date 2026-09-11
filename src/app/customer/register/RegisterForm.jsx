"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/customer/Portal.module.css";
import { validateRegistrationInput } from "@/lib/validation";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    const form = event.currentTarget;
    const validation = validateRegistrationInput({
      name: form.elements.name.value,
      email: form.elements.email.value,
      password: form.elements.password.value
    });

    if (!validation.valid) {
      setFieldErrors(validation.errors);
      setError("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/customer/register", {
        method: "POST",
        body: new FormData(event.currentTarget)
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to create account.");
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
        Full Name
        <input name="name" type="text" autoComplete="name" required />
        {fieldErrors.name && <span className={styles.fieldError}>{fieldErrors.name}</span>}
      </label>

      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
        {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
      </label>

      <label>
        Password
        <input name="password" type="password" autoComplete="new-password" minLength={8} required />
        {fieldErrors.password && <span className={styles.fieldError}>{fieldErrors.password}</span>}
      </label>

      <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
