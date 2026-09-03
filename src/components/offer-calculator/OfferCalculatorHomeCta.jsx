import Link from "next/link";
import styles from "./OfferCalculatorHomeCta.module.css";

export default function OfferCalculatorHomeCta() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span>Quick Price Calculation</span>
          <h2>
            We paint more than walls
            we create value.
          </h2>
          <p>Calculate your project price in just a few minutes and request your personal offer.</p>
          <div className={styles.actions}>
            <Link href="/offer-calculator">CALCULATE PRICE & REQUEST OFFER →</Link>
            <Link href="/services">LEARN MORE</Link>
          </div>
        </div>
        <div className={styles.trust}>
          {["Swiss Quality", "Clean & Reliable", "Transparent Pricing", "On-Time Service"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
