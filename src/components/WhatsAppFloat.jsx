"use client";

import { usePathname } from "next/navigation";
import styles from "@/components/WhatsAppFloat.module.css";

export default function WhatsAppFloat() {
  const pathname = usePathname();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "41790000000";
  const isHiddenPage =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/customer") ||
    pathname?.startsWith("/offer-calculator");

  if (isHiddenPage || !whatsappNumber) return null;

  return (
    <a
      aria-label="Chat with Amigos Maler on WhatsApp"
      className={styles.whatsappFloat}
      href={`https://wa.me/${whatsappNumber}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <svg aria-hidden="true" viewBox="0 0 32 32">
        <path d="M16.04 3.2c-7.02 0-12.73 5.7-12.73 12.72 0 2.25.59 4.44 1.72 6.37L3.2 28.8l6.67-1.75a12.67 12.67 0 0 0 6.16 1.57h.01c7.02 0 12.73-5.7 12.73-12.72S23.06 3.2 16.04 3.2Zm0 23.27h-.01c-1.95 0-3.86-.52-5.53-1.5l-.4-.24-3.96 1.04 1.06-3.86-.26-.4a10.51 10.51 0 0 1-1.61-5.59c0-5.84 4.76-10.59 10.61-10.59 2.83 0 5.49 1.1 7.49 3.1a10.52 10.52 0 0 1 3.11 7.49c0 5.84-4.76 10.55-10.5 10.55Zm5.81-7.93c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.81 1.03-.99 1.24-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.61-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.23 3.4 5.4 4.77.75.32 1.34.52 1.8.66.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.15-1.51.26-.74.26-1.38.18-1.51-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    </a>
  );
}
