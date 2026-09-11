"use client";

import OfferCalculator from "./OfferCalculator";
import styles from "./OfferCalculatorHomeCta.module.css";

export default function OfferCalculatorHomeCta() {
  return (
    <section id="offer-calculator" className={`${styles.section} home-calculator-cta`}>
      <div className={styles.homeCalculatorContainer}>
        <OfferCalculator embedded defaultFlow="SELECT" />
      </div>
    </section>
  );
}
