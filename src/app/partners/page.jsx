import LegacyPage from "@/components/LegacyPage";

export const metadata = {
  title: "Partners | Amigos Maler",
  description:
    "Partner with Amigos Maler for coordinated painting, renovation, property care and real estate service projects."
};

const pageHtml = `
<main class="partners-page">
  <section class="partners-hero" data-hero>
    <div class="partners-shell partners-hero-grid">
      <div class="partners-hero-copy partners-reveal">
        <p class="partners-kicker">PARTNER NETWORK</p>
        <h1>Reliable work gets stronger when the right specialists connect.</h1>
        <p>
          Amigos Maler partners with selected companies, suppliers and real estate professionals to deliver clean,
          coordinated property solutions from first consultation to final handover.
        </p>
        <div class="partners-hero-actions">
          <a href="/contact" class="partners-btn partners-btn-primary">Become a Partner <span>↗</span></a>
          <a href="/customer/login" class="partners-btn partners-btn-outline">Partner Portal <span>→</span></a>
        </div>
      </div>

      <div class="partner-network" aria-label="Amigos partner network">
        <div class="network-rings"></div>
        <div class="network-core">
          <img src="/New-Logo.png" alt="Amigos Maler">
          <span>Coordination</span>
        </div>
        <article class="network-node network-node-one" data-depth="24">
          <span>01</span>
          <strong>Craft</strong>
          <small>Painting, plastering, drywall</small>
        </article>
        <article class="network-node network-node-two" data-depth="36">
          <span>02</span>
          <strong>Supply</strong>
          <small>Materials, coatings, tools</small>
        </article>
        <article class="network-node network-node-three" data-depth="18">
          <span>03</span>
          <strong>Property</strong>
          <small>Managers, investors, owners</small>
        </article>
        <article class="network-node network-node-four" data-depth="30">
          <span>04</span>
          <strong>Planning</strong>
          <small>Architecture, inspection, advice</small>
        </article>
      </div>
    </div>
  </section>

  <section class="partner-marquee" aria-label="Partner disciplines">
    <div>
      <span>Specialist Companies</span>
      <span>Material Suppliers</span>
      <span>Real Estate Partners</span>
      <span>Property Managers</span>
      <span>Design Consultants</span>
      <span>Facility Care</span>
    </div>
  </section>

  <section class="partner-imagery">
    <div class="partners-shell imagery-grid">
      <figure class="imagery-card imagery-card-large partners-reveal">
        <img src="https://www.siltek.ch/m1.png" alt="Professional painters working together inside a prepared room">
        <figcaption>
          <span>Trade Execution</span>
          <strong>Clean teams for careful surface work.</strong>
        </figcaption>
      </figure>
      <figure class="imagery-card partners-reveal">
        <img src="/assets/services/pexels-kindelmedia-7579138.jpg" alt="Renovation planning consultation with architectural plans">
        <figcaption>
          <span>Planning</span>
          <strong>Partners aligned before work begins.</strong>
        </figcaption>
      </figure>
      <figure class="imagery-card partners-reveal">
        <img src="https://ldmdirect.co.uk/cdn/shop/files/ldmdirect-homepage-image.webp?v=1772034053&width=1600" alt="Professional painting materials and tools">
        <figcaption>
          <span>Materials</span>
          <strong>Suppliers who understand durable finishes.</strong>
        </figcaption>
      </figure>
    </div>
  </section>

  <section class="partners-intro">
    <div class="partners-shell partners-split">
      <div class="partners-section-heading partners-reveal">
        <p class="partners-kicker">WHY PARTNER WITH AMIGOS</p>
        <h2>One standard. Many capabilities.</h2>
      </div>
      <div class="partners-lead partners-reveal">
        <p>
          Customers need confidence that every specialist works with the same care, timing and communication. Our
          partner network is built for coordinated projects where quality, reliability and property value matter.
        </p>
      </div>
    </div>
  </section>

  <section class="partner-types">
    <div class="partners-shell">
      <div class="partner-card-grid">
        <article class="partner-card partners-reveal">
          <span>01</span>
          <h3>Trade Partners</h3>
          <p>Specialist teams for plastering, drywall, facade work, flooring, cleaning and connected renovation tasks.</p>
        </article>
        <article class="partner-card partners-reveal">
          <span>02</span>
          <h3>Material Partners</h3>
          <p>Reliable suppliers for premium paints, coatings, tools and surface systems suited to each property.</p>
        </article>
        <article class="partner-card partners-reveal">
          <span>03</span>
          <h3>Property Partners</h3>
          <p>Real estate companies, property managers and investors who need dependable maintenance execution.</p>
        </article>
        <article class="partner-card partners-reveal">
          <span>04</span>
          <h3>Planning Partners</h3>
          <p>Architects, consultants and project planners who want clear communication from site visit to delivery.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="partner-flow">
    <div class="partners-shell">
      <div class="partners-section-heading centered partners-reveal">
        <p class="partners-kicker">HOW COLLABORATION WORKS</p>
        <h2>Simple enough to move fast. Structured enough to stay clean.</h2>
      </div>
      <div class="flow-track">
        <article class="flow-step partners-reveal">
          <span>01</span>
          <h3>Introduce</h3>
          <p>We understand your company, work standards and the type of projects you want to support.</p>
        </article>
        <article class="flow-step partners-reveal">
          <span>02</span>
          <h3>Align</h3>
          <p>We define responsibilities, communication rhythm, quality expectations and project handover points.</p>
        </article>
        <article class="flow-step partners-reveal">
          <span>03</span>
          <h3>Coordinate</h3>
          <p>For matching projects, Amigos manages the customer relationship and keeps delivery transparent.</p>
        </article>
        <article class="flow-step partners-reveal">
          <span>04</span>
          <h3>Improve</h3>
          <p>After delivery, we review outcomes so the next project becomes even smoother.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="partner-standards">
    <div class="partners-shell standards-layout">
      <div class="standards-copy partners-reveal">
        <p class="partners-kicker">PARTNER STANDARDS</p>
        <h2>The network grows only when quality stays visible.</h2>
        <p>
          We prefer a smaller group of reliable partners over a large list of random contacts. The goal is trust:
          for customers, for buildings and for everyone involved in the project.
        </p>
      </div>
      <div class="standards-list">
        <div class="standard-row partners-reveal"><span>Careful work</span><p>Clean execution, prepared surfaces and respect for occupied spaces.</p></div>
        <div class="standard-row partners-reveal"><span>Clear timing</span><p>Reliable availability, realistic schedules and early communication if something changes.</p></div>
        <div class="standard-row partners-reveal"><span>Premium materials</span><p>Products and systems chosen for durability, suitability and long-term value.</p></div>
        <div class="standard-row partners-reveal"><span>Direct communication</span><p>Simple updates, documented decisions and one aligned project standard.</p></div>
      </div>
    </div>
  </section>

  <section class="partner-cta">
    <div class="partners-shell partner-cta-inner partners-reveal">
      <p class="partners-kicker">BUILD WITH AMIGOS</p>
      <h2>Let’s create a stronger property network around Olten.</h2>
      <p>Tell us where your company fits and how we can collaborate on future painting, renovation and property care projects.</p>
      <div class="partners-hero-actions">
        <a href="/contact" class="partners-btn partners-btn-primary">Start Partnership Talk <span>↗</span></a>
        <a href="/customer/register" class="partners-btn partners-btn-outline">Create Portal Access <span>→</span></a>
      </div>
    </div>
  </section>
</main>
`;

const forcedPartnersThemeCss = `
:root {
  --partners-logo-mix: linear-gradient(120deg, #F6BE10 0%, #F39125 28%, #E62453 58%, #C73B8E 78%, #F6BE10 100%);
  --partners-logo-mix-soft: linear-gradient(120deg, rgba(246, 190, 16, .96) 0%, rgba(243, 145, 37, .94) 28%, rgba(230, 36, 83, .94) 58%, rgba(199, 59, 142, .90) 78%, rgba(246, 190, 16, .96) 100%);
  --partners-navy: #071A33;
  --partners-ink: #050505;
}

@keyframes homeMovingBrandGradient {
  0% { background-position: 0% 18%; }
  50% { background-position: 100% 62%; }
  100% { background-position: 18% 100%; }
}

body:has(.partners-page),
body[data-page="partners"] {
  background: var(--partners-navy) !important;
}

.partners-page {
  background: var(--partners-navy) !important;
  color: #fff !important;
}

.partners-kicker {
  color: #E62453 !important;
  -webkit-text-fill-color: #E62453 !important;
}

.partners-section-heading h2,
.standards-copy h2,
.partners-hero-copy h1,
.partner-cta h2 {
  background: var(--partners-logo-mix) !important;
  background-size: 320% 320% !important;
  color: transparent !important;
  -webkit-text-fill-color: transparent !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  animation: homeMovingBrandGradient 7s ease-in-out infinite alternate !important;
}

.partners-hero,
.partner-imagery,
.partners-intro,
.partner-types,
.partner-flow,
.partner-standards,
.partner-cta {
  background: var(--partners-navy) !important;
  color: #fff !important;
}

.partners-hero::before,
.partners-hero::after,
.partner-cta::before {
  opacity: 0 !important;
}

.partner-marquee,
.partner-cta,
.network-node::before,
.partner-card::before,
.flow-step::before {
  background: var(--partners-logo-mix) !important;
  background-size: 240% 240% !important;
  animation: homeMovingBrandGradient 7s ease-in-out infinite alternate !important;
}

.partner-network .network-core,
.imagery-card,
.partner-card-grid,
.partner-card,
.flow-track,
.flow-step,
.standards-list,
.standard-row {
  background: rgba(255, 255, 255, .055) !important;
  border-color: rgba(255, 255, 255, .18) !important;
}

.network-node:nth-of-type(1),
.network-node:nth-of-type(2),
.network-node:nth-of-type(3),
.network-node:nth-of-type(4),
.partner-card:nth-child(1),
.partner-card:nth-child(2),
.partner-card:nth-child(3),
.partner-card:nth-child(4) {
  background: var(--partners-logo-mix) !important;
  background-size: 240% 240% !important;
  animation: homeMovingBrandGradient 7s ease-in-out infinite alternate !important;
  color: #fff !important;
}

html[data-theme="amigos-dark"] .network-node *,
html[data-theme="amigos-dark"] .partner-card *,
html[data-theme="amigos-dark"] .flow-step:hover *,
html[data-theme="amigos-dark"] .partner-cta *,
html[data-theme="amigos-dark"] .partner-marquee *,
html[data-theme="amigos-dark"] .partner-flow *,
html[data-theme="amigos-dark"] .partners-page .partner-cta .partners-kicker {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}

html[data-theme="amigos-dark"] .partners-hero-copy > p,
html[data-theme="amigos-dark"] .partners-lead p,
html[data-theme="amigos-dark"] .standards-copy > p,
html[data-theme="amigos-dark"] .network-core span,
html[data-theme="amigos-dark"] .partner-cta-inner > p {
  color: rgba(255, 255, 255, .78) !important;
  -webkit-text-fill-color: rgba(255, 255, 255, .78) !important;
}

html[data-theme="amigos-dark"] .standard-row p,
html[data-theme="amigos-dark"] .partner-card p,
html[data-theme="amigos-dark"] .flow-step p {
  color: rgba(255, 255, 255, .86) !important;
  -webkit-text-fill-color: rgba(255, 255, 255, .86) !important;
}

html[data-theme="amigos-dark"] .partners-btn-primary {
  background: var(--partners-logo-mix) !important;
  background-size: 240% 240% !important;
  border-color: transparent !important;
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}

.partners-btn-outline {
  background:
    linear-gradient(var(--partners-navy), var(--partners-navy)) padding-box,
    var(--partners-logo-mix) border-box !important;
  background-size: 100% 100%, 240% 240% !important;
  border: 1px solid transparent !important;
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}

html:not([data-theme="amigos-dark"]) body:has(.partners-page),
html:not([data-theme="amigos-dark"]) body[data-page="partners"] {
  background: #fff !important;
}

html:not([data-theme="amigos-dark"]) .partners-page,
html:not([data-theme="amigos-dark"]) .partners-hero,
html:not([data-theme="amigos-dark"]) .partner-imagery,
html:not([data-theme="amigos-dark"]) .partners-intro,
html:not([data-theme="amigos-dark"]) .partner-types,
html:not([data-theme="amigos-dark"]) .partner-flow,
html:not([data-theme="amigos-dark"]) .partner-standards,
html:not([data-theme="amigos-dark"]) .partner-cta {
  background: #fff !important;
  color: #071A33 !important;
}

html:not([data-theme="amigos-dark"]) .partners-page,
html:not([data-theme="amigos-dark"]) .partners-hero,
html:not([data-theme="amigos-dark"]) .partner-imagery,
html:not([data-theme="amigos-dark"]) .partners-intro,
html:not([data-theme="amigos-dark"]) .partner-types,
html:not([data-theme="amigos-dark"]) .partner-flow,
html:not([data-theme="amigos-dark"]) .partner-standards,
html:not([data-theme="amigos-dark"]) .partner-cta {
  color: #050505 !important;
}

html:not([data-theme="amigos-dark"]) .partners-hero {
  min-height: 100vh !important;
  padding: clamp(124px, 12vh, 150px) 0 clamp(54px, 7vh, 84px) !important;
}

html:not([data-theme="amigos-dark"]) .partners-hero::before {
  opacity: .34 !important;
  background-image:
    linear-gradient(rgba(255, 122, 26, .20) 1px, transparent 1px),
    linear-gradient(90deg, rgba(230, 36, 83, .18) 1px, transparent 1px) !important;
}

html:not([data-theme="amigos-dark"]) .partners-hero::after {
  opacity: .20 !important;
  background: radial-gradient(circle, rgba(230, 36, 83, .30), transparent 68%) !important;
}

html:not([data-theme="amigos-dark"]) .partners-section-heading h2,
html:not([data-theme="amigos-dark"]) .standards-copy h2,
html:not([data-theme="amigos-dark"]) .partner-cta h2 {
  background: var(--partners-logo-mix) !important;
  background-size: 240% 240% !important;
  color: transparent !important;
  -webkit-text-fill-color: transparent !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
}

html:not([data-theme="amigos-dark"]) .partners-hero-copy > p,
html:not([data-theme="amigos-dark"]) .partners-lead p,
html:not([data-theme="amigos-dark"]) .standards-copy > p,
html:not([data-theme="amigos-dark"]) .standard-row p,
html:not([data-theme="amigos-dark"]) .partner-card p,
html:not([data-theme="amigos-dark"]) .flow-step p,
html:not([data-theme="amigos-dark"]) .network-core span,
html:not([data-theme="amigos-dark"]) .partner-cta-inner > p {
  color: #333 !important;
  -webkit-text-fill-color: #333 !important;
}

html:not([data-theme="amigos-dark"]) .partners-hero-copy h1,
html:not([data-theme="amigos-dark"]) .partners-hero-copy h1 * {
  background: none !important;
  color: #050505 !important;
  -webkit-text-fill-color: #050505 !important;
}

html:not([data-theme="amigos-dark"]) .partner-card-grid,
html:not([data-theme="amigos-dark"]) .partner-card,
html:not([data-theme="amigos-dark"]) .flow-track,
html:not([data-theme="amigos-dark"]) .flow-step,
html:not([data-theme="amigos-dark"]) .standard-row,
html:not([data-theme="amigos-dark"]) .standards-list,
html:not([data-theme="amigos-dark"]) .network-core {
  background: #fff !important;
  border-color: rgba(7, 26, 51, .14) !important;
}

html:not([data-theme="amigos-dark"]) .partner-card,
html:not([data-theme="amigos-dark"]) .flow-step,
html:not([data-theme="amigos-dark"]) .network-node {
  background: var(--partners-logo-mix) !important;
  background-size: 240% 240% !important;
  border-color: rgba(255, 122, 26, .58) !important;
  box-shadow: 0 24px 64px rgba(230, 36, 83, .12), 0 16px 42px rgba(255, 122, 26, .12) !important;
  animation: homeMovingBrandGradient 7s ease-in-out infinite alternate !important;
}

html:not([data-theme="amigos-dark"]) .network-node *,
html:not([data-theme="amigos-dark"]) .partner-card *,
html:not([data-theme="amigos-dark"]) .flow-step *,
html:not([data-theme="amigos-dark"]) .partner-card h3,
html:not([data-theme="amigos-dark"]) .flow-step h3,
html:not([data-theme="amigos-dark"]) .partner-card p,
html:not([data-theme="amigos-dark"]) .flow-step p {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}

html:not([data-theme="amigos-dark"]) .partner-card:hover,
html:not([data-theme="amigos-dark"]) .flow-step:hover {
  background: var(--partners-logo-mix) !important;
  background-size: 240% 240% !important;
  opacity: .82 !important;
  box-shadow: 0 0 0 1px rgba(255, 210, 31, .85), 0 24px 72px rgba(230, 36, 83, .24), 0 18px 52px rgba(255, 122, 26, .22) !important;
}

html:not([data-theme="amigos-dark"]) .partner-card:hover *,
html:not([data-theme="amigos-dark"]) .flow-step:hover * {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}

html:not([data-theme="amigos-dark"]) .partners-kicker,
html:not([data-theme="amigos-dark"]) .imagery-card figcaption span {
  color: #E62453 !important;
  -webkit-text-fill-color: #E62453 !important;
}

html:not([data-theme="amigos-dark"]) .partners-btn-primary {
  background: var(--partners-logo-mix) !important;
  background-size: 240% 240% !important;
  border-color: transparent !important;
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
  animation: homeMovingBrandGradient 7s ease-in-out infinite alternate !important;
}

html:not([data-theme="amigos-dark"]) .partners-btn-primary * {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}

html:not([data-theme="amigos-dark"]) .partners-btn-outline {
  background:
    linear-gradient(#fff, #fff) padding-box,
    var(--partners-logo-mix) border-box !important;
  background-size: 100% 100%, 240% 240% !important;
  border: 2px solid transparent !important;
  color: #050505 !important;
  -webkit-text-fill-color: #050505 !important;
}

html:not([data-theme="amigos-dark"]) .partners-btn-outline * {
  color: #050505 !important;
  -webkit-text-fill-color: #050505 !important;
}

html:not([data-theme="amigos-dark"]) .partner-network .network-rings,
html:not([data-theme="amigos-dark"]) .partner-network .network-rings::before,
html:not([data-theme="amigos-dark"]) .partner-network .network-rings::after {
  border-color: rgba(230, 36, 83, .34) !important;
}

html:not([data-theme="amigos-dark"]) .partner-network .network-core {
  background: rgba(255, 255, 255, .86) !important;
  border-color: rgba(230, 36, 83, .25) !important;
  box-shadow: 0 28px 80px rgba(5, 5, 5, .10) !important;
}

html:not([data-theme="amigos-dark"]) .partner-network .network-core span {
  color: #333 !important;
  -webkit-text-fill-color: #333 !important;
}

html:not([data-theme="amigos-dark"]) .partner-imagery {
  min-height: 100vh !important;
  padding: clamp(70px, 8vh, 96px) 0 !important;
}

html:not([data-theme="amigos-dark"]) .imagery-grid {
  height: min(680px, calc(100vh - 160px)) !important;
  grid-template-rows: repeat(2, minmax(0, 1fr)) !important;
}

html:not([data-theme="amigos-dark"]) .imagery-card,
html:not([data-theme="amigos-dark"]) .imagery-card-large {
  min-height: 0 !important;
  background: #F7F1E7 !important;
  box-shadow: 0 18px 54px rgba(5, 5, 5, .10) !important;
}

html:not([data-theme="amigos-dark"]) .imagery-card::after {
  background: linear-gradient(0deg, rgba(252, 248, 240, .92), rgba(252, 248, 240, .18) 62%) !important;
}

html:not([data-theme="amigos-dark"]) .imagery-card figcaption,
html:not([data-theme="amigos-dark"]) .imagery-card figcaption strong {
  color: #050505 !important;
  -webkit-text-fill-color: #050505 !important;
}

html:not([data-theme="amigos-dark"]) .standard-row {
  padding: 34px 28px !important;
  transition: background .35s ease, box-shadow .35s ease, opacity .35s ease, transform .35s ease !important;
}

html:not([data-theme="amigos-dark"]) .standard-row:hover {
  background: var(--partners-logo-mix) !important;
  background-size: 240% 240% !important;
  box-shadow: 0 18px 50px rgba(230, 36, 83, .16), 0 10px 32px rgba(255, 122, 26, .14) !important;
  transform: translateX(10px) !important;
}

html:not([data-theme="amigos-dark"]) .standard-row:hover *,
html:not([data-theme="amigos-dark"]) .standard-row:hover span,
html:not([data-theme="amigos-dark"]) .standard-row:hover p {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}

html:not([data-theme="amigos-dark"]) .partner-cta {
  background: var(--partners-logo-mix) !important;
  background-size: 240% 240% !important;
  animation: homeMovingBrandGradient 7s ease-in-out infinite alternate !important;
}

html:not([data-theme="amigos-dark"]) .partner-cta h2,
html:not([data-theme="amigos-dark"]) .partner-cta .partners-kicker,
html:not([data-theme="amigos-dark"]) .partner-cta p {
  background: none !important;
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}

html:not([data-theme="amigos-dark"]) .partners-page .site-header:not(.is-scrolled):not(.scrolled) .site-nav a,
html:not([data-theme="amigos-dark"]) body:has(.partners-page) .site-header:not(.is-scrolled):not(.scrolled) .site-nav a,
html:not([data-theme="amigos-dark"]) body[data-page="partners"] .site-header:not(.is-scrolled):not(.scrolled) .site-nav a,
html:not([data-theme="amigos-dark"]) body:has(.partners-page) .site-header:not(.is-scrolled):not(.scrolled) .dropdown-trigger,
html:not([data-theme="amigos-dark"]) body[data-page="partners"] .site-header:not(.is-scrolled):not(.scrolled) .dropdown-trigger,
html:not([data-theme="amigos-dark"]) body:has(.partners-page) .site-header:not(.is-scrolled):not(.scrolled) .nav-link,
html:not([data-theme="amigos-dark"]) body[data-page="partners"] .site-header:not(.is-scrolled):not(.scrolled) .nav-link {
  color: #050505 !important;
  -webkit-text-fill-color: #050505 !important;
}

html:not([data-theme="amigos-dark"]) body:has(.partners-page) .site-header:not(.is-scrolled):not(.scrolled) .site-nav a:hover,
html:not([data-theme="amigos-dark"]) body[data-page="partners"] .site-header:not(.is-scrolled):not(.scrolled) .site-nav a:hover {
  color: #FFD21F !important;
  -webkit-text-fill-color: #FFD21F !important;
}

html:not([data-theme="amigos-dark"]) body:has(.partners-page) .site-header:not(.is-scrolled):not(.scrolled) .customer-header-btn,
html:not([data-theme="amigos-dark"]) body[data-page="partners"] .site-header:not(.is-scrolled):not(.scrolled) .customer-header-btn {
  background: #FFD21F !important;
  border-color: #FFD21F !important;
  color: #050505 !important;
  -webkit-text-fill-color: #050505 !important;
}

html:not([data-theme="amigos-dark"]) body:has(.partners-page) .site-header:not(.is-scrolled):not(.scrolled) .header-btn,
html:not([data-theme="amigos-dark"]) body[data-page="partners"] .site-header:not(.is-scrolled):not(.scrolled) .header-btn {
  background: #E62453 !important;
  border-color: #E62453 !important;
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}

html:not([data-theme="amigos-dark"]) body:has(.partners-page) .site-header:not(.is-scrolled):not(.scrolled) .customer-header-btn:hover,
html:not([data-theme="amigos-dark"]) body:has(.partners-page) .site-header:not(.is-scrolled):not(.scrolled) .header-btn:hover,
html:not([data-theme="amigos-dark"]) body[data-page="partners"] .site-header:not(.is-scrolled):not(.scrolled) .customer-header-btn:hover,
html:not([data-theme="amigos-dark"]) body[data-page="partners"] .site-header:not(.is-scrolled):not(.scrolled) .header-btn:hover {
  opacity: .72 !important;
}

/* Final Partners correction: homepage calculator gradient, plain boxes until hover. */
html:not([data-theme="amigos-dark"]) .partner-card,
html:not([data-theme="amigos-dark"]) .flow-step {
  background: #fff !important;
  border-color: rgba(7, 26, 51, .14) !important;
  box-shadow: none !important;
  opacity: 1 !important;
  animation: none !important;
}

html:not([data-theme="amigos-dark"]) .partner-card::before,
html:not([data-theme="amigos-dark"]) .flow-step::before {
  background:
    radial-gradient(circle at 12% 18%, rgba(255, 255, 255, .26), transparent 25%),
    radial-gradient(circle at 86% 14%, rgba(255, 255, 255, .16), transparent 28%),
    var(--partners-logo-mix) !important;
  background-size: 240% 240% !important;
  animation: homeMovingBrandGradient 7s ease-in-out infinite alternate !important;
  opacity: 0 !important;
}

html:not([data-theme="amigos-dark"]) .partner-card *,
html:not([data-theme="amigos-dark"]) .flow-step *,
html:not([data-theme="amigos-dark"]) .partner-card h3,
html:not([data-theme="amigos-dark"]) .flow-step h3,
html:not([data-theme="amigos-dark"]) .partner-card p,
html:not([data-theme="amigos-dark"]) .flow-step p {
  color: #071A33 !important;
  -webkit-text-fill-color: #071A33 !important;
}

html:not([data-theme="amigos-dark"]) .partner-card span,
html:not([data-theme="amigos-dark"]) .flow-step span {
  color: #E62453 !important;
  -webkit-text-fill-color: #E62453 !important;
}

html:not([data-theme="amigos-dark"]) .partner-card:hover,
html:not([data-theme="amigos-dark"]) .flow-step:hover {
  opacity: .9 !important;
  box-shadow: 0 0 0 1px rgba(246, 190, 16, .58), 0 24px 72px rgba(230, 36, 83, .22), 0 18px 52px rgba(243, 145, 37, .20) !important;
}

html:not([data-theme="amigos-dark"]) .partner-card:hover::before,
html:not([data-theme="amigos-dark"]) .flow-step:hover::before {
  opacity: 1 !important;
  height: 100% !important;
}

html:not([data-theme="amigos-dark"]) .partner-card:hover *,
html:not([data-theme="amigos-dark"]) .flow-step:hover *,
html:not([data-theme="amigos-dark"]) .partner-card:hover h3,
html:not([data-theme="amigos-dark"]) .flow-step:hover h3,
html:not([data-theme="amigos-dark"]) .partner-card:hover p,
html:not([data-theme="amigos-dark"]) .flow-step:hover p,
html:not([data-theme="amigos-dark"]) .partner-card:hover span,
html:not([data-theme="amigos-dark"]) .flow-step:hover span {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}

html:not([data-theme="amigos-dark"]) .standard-row:hover {
  background:
    radial-gradient(circle at 12% 18%, rgba(255, 255, 255, .26), transparent 25%),
    radial-gradient(circle at 86% 14%, rgba(255, 255, 255, .16), transparent 28%),
    var(--partners-logo-mix) !important;
  background-size: 240% 240% !important;
  animation: homeMovingBrandGradient 7s ease-in-out infinite alternate !important;
  opacity: .92 !important;
}

html:not([data-theme="amigos-dark"]) .partner-cta {
  background:
    radial-gradient(circle at 12% 18%, rgba(255, 255, 255, .26), transparent 25%),
    radial-gradient(circle at 86% 14%, rgba(255, 255, 255, .16), transparent 28%),
    var(--partners-logo-mix) !important;
  background-size: 240% 240% !important;
  animation: homeMovingBrandGradient 7s ease-in-out infinite alternate !important;
}

html:not([data-theme="amigos-dark"]) .partner-cta .partners-btn-primary,
html:not([data-theme="amigos-dark"]) .partner-cta .partners-btn-outline {
  background: #fff !important;
  border: 1px solid rgba(255, 255, 255, .72) !important;
  color: #050505 !important;
  -webkit-text-fill-color: #050505 !important;
  box-shadow: 0 18px 44px rgba(230, 36, 83, .18), 0 12px 28px rgba(246, 190, 16, .14) !important;
  overflow: hidden !important;
}

html:not([data-theme="amigos-dark"]) .partner-cta .partners-btn-primary *,
html:not([data-theme="amigos-dark"]) .partner-cta .partners-btn-outline * {
  color: #050505 !important;
  -webkit-text-fill-color: #050505 !important;
}

html[data-theme="amigos-dark"] .network-node,
html[data-theme="amigos-dark"] .partner-card:hover,
html[data-theme="amigos-dark"] .flow-step:hover,
html[data-theme="amigos-dark"] .partner-cta {
  background:
    radial-gradient(circle at 12% 18%, rgba(255, 255, 255, .26), transparent 25%),
    radial-gradient(circle at 86% 14%, rgba(255, 255, 255, .16), transparent 28%),
    var(--partners-logo-mix) !important;
  background-size: 240% 240% !important;
  animation: homeMovingBrandGradient 7s ease-in-out infinite alternate !important;
}

/* Hard final pass: exact homepage calculator colors/layers, offset so pink/orange/yellow are visible immediately. */
html:not([data-theme="amigos-dark"]) .partner-cta,
html[data-theme="amigos-dark"] .partner-cta {
  background-color: #F39125 !important;
  background-image:
    radial-gradient(circle at 12% 18%, rgba(255, 255, 255, .28), transparent 25%),
    radial-gradient(circle at 86% 14%, rgba(255, 255, 255, .18), transparent 28%),
    linear-gradient(120deg, #F6BE10 0%, #F39125 28%, #E62453 58%, #C73B8E 78%, #F6BE10 100%) !important;
  background-size: 240% 240% !important;
  animation: homeMovingBrandGradient 7s ease-in-out infinite alternate !important;
  animation-delay: -3.5s !important;
  color: #fff !important;
}

html:not([data-theme="amigos-dark"]) .partner-card::before,
html:not([data-theme="amigos-dark"]) .flow-step::before,
html:not([data-theme="amigos-dark"]) .standard-row:hover,
html[data-theme="amigos-dark"] .network-node,
html[data-theme="amigos-dark"] .partner-card:hover,
html[data-theme="amigos-dark"] .flow-step:hover,
html[data-theme="amigos-dark"] .standard-row:hover {
  background-color: #F39125 !important;
  background-image:
    radial-gradient(circle at 12% 18%, rgba(255, 255, 255, .28), transparent 25%),
    radial-gradient(circle at 86% 14%, rgba(255, 255, 255, .18), transparent 28%),
    linear-gradient(120deg, #F6BE10 0%, #F39125 28%, #E62453 58%, #C73B8E 78%, #F6BE10 100%) !important;
  background-size: 160% 160% !important;
  animation: homeMovingBrandGradient 7s ease-in-out infinite alternate !important;
  animation-delay: -3.5s !important;
}

html:not([data-theme="amigos-dark"]) .partner-card,
html:not([data-theme="amigos-dark"]) .flow-step {
  background: #fff !important;
  border-color: rgba(7, 26, 51, .14) !important;
  color: #071A33 !important;
  box-shadow: none !important;
}

html:not([data-theme="amigos-dark"]) .partner-card:hover,
html:not([data-theme="amigos-dark"]) .flow-step:hover {
  border-color: rgba(230, 36, 83, .46) !important;
  box-shadow: 0 0 0 1px rgba(246, 190, 16, .42), 0 24px 76px rgba(230, 36, 83, .22), 0 16px 46px rgba(243, 145, 37, .20) !important;
  opacity: 1 !important;
}

html:not([data-theme="amigos-dark"]) .partner-card:hover::before,
html:not([data-theme="amigos-dark"]) .flow-step:hover::before {
  opacity: 1 !important;
  height: 100% !important;
}

html:not([data-theme="amigos-dark"]) .partner-cta .partners-btn-primary,
html:not([data-theme="amigos-dark"]) .partner-cta .partners-btn-outline,
html[data-theme="amigos-dark"] .partner-cta .partners-btn-primary,
html[data-theme="amigos-dark"] .partner-cta .partners-btn-outline {
  position: relative !important;
  isolation: isolate !important;
  overflow: hidden !important;
  background: #fff !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, .78) !important;
  color: #050505 !important;
  -webkit-text-fill-color: #050505 !important;
}

html:not([data-theme="amigos-dark"]) .partner-cta .partners-btn-primary::before,
html:not([data-theme="amigos-dark"]) .partner-cta .partners-btn-outline::before,
html[data-theme="amigos-dark"] .partner-cta .partners-btn-primary::before,
html[data-theme="amigos-dark"] .partner-cta .partners-btn-outline::before {
  content: none !important;
  display: none !important;
}

html:not([data-theme="amigos-dark"]) .partner-cta .partners-btn-primary *,
html:not([data-theme="amigos-dark"]) .partner-cta .partners-btn-outline *,
html[data-theme="amigos-dark"] .partner-cta .partners-btn-primary *,
html[data-theme="amigos-dark"] .partner-cta .partners-btn-outline * {
  color: #050505 !important;
  -webkit-text-fill-color: #050505 !important;
}

html[data-theme="amigos-dark"] .partners-btn-outline,
html[data-theme="amigos-dark"] .partners-hero .partners-hero-actions .partners-btn:nth-child(2),
html[data-theme="amigos-dark"] .partner-cta .partners-btn-outline,
html[data-theme="amigos-dark"] .partner-cta .partners-hero-actions .partners-btn:nth-child(2) {
  background:
    linear-gradient(var(--partners-navy), var(--partners-navy)) padding-box,
    linear-gradient(120deg, #F6BE10 0%, #F39125 28%, #E62453 58%, #C73B8E 78%, #F6BE10 100%) border-box !important;
  background-size: 100% 100%, 240% 240% !important;
  border: 2px solid transparent !important;
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
  box-shadow: none !important;
  animation: homeMovingBrandGradient 7s ease-in-out infinite alternate !important;
}

html[data-theme="amigos-dark"] .partners-btn-outline *,
html[data-theme="amigos-dark"] .partners-hero .partners-hero-actions .partners-btn:nth-child(2) *,
html[data-theme="amigos-dark"] .partner-cta .partners-btn-outline *,
html[data-theme="amigos-dark"] .partner-cta .partners-hero-actions .partners-btn:nth-child(2) * {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}

html[data-theme="amigos-dark"] .partners-btn-outline::before,
html[data-theme="amigos-dark"] .partners-hero .partners-hero-actions .partners-btn:nth-child(2)::before,
html[data-theme="amigos-dark"] .partner-cta .partners-btn-outline::before,
html[data-theme="amigos-dark"] .partner-cta .partners-hero-actions .partners-btn:nth-child(2)::before {
  content: none !important;
  display: none !important;
}

body[data-page="partners"] .partners-page .partners-hero .partners-hero-actions .partners-btn.partners-btn-outline,
.partners-page .partners-hero .partners-hero-actions .partners-btn.partners-btn-outline,
html[data-theme="amigos-dark"] body[data-page="partners"] .partners-page .partners-hero .partners-hero-actions .partners-btn.partners-btn-outline {
  background-color: transparent !important;
  background-image:
    linear-gradient(#071A33, #071A33),
    linear-gradient(120deg, #F6BE10 0%, #F39125 28%, #E62453 58%, #C73B8E 78%, #F6BE10 100%) !important;
  background-origin: border-box !important;
  background-clip: padding-box, border-box !important;
  background-size: 100% 100%, 240% 240% !important;
  border: 2px solid transparent !important;
  box-shadow: none !important;
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
  animation: homeMovingBrandGradient 7s ease-in-out infinite alternate !important;
}

body[data-page="partners"] .partners-page .partners-hero .partners-hero-actions .partners-btn.partners-btn-outline::before,
.partners-page .partners-hero .partners-hero-actions .partners-btn.partners-btn-outline::before,
html[data-theme="amigos-dark"] body[data-page="partners"] .partners-page .partners-hero .partners-hero-actions .partners-btn.partners-btn-outline::before {
  content: none !important;
  display: none !important;
}

body[data-page="partners"] .partners-page .partners-hero .partners-hero-actions .partners-btn.partners-btn-outline *,
.partners-page .partners-hero .partners-hero-actions .partners-btn.partners-btn-outline *,
html[data-theme="amigos-dark"] body[data-page="partners"] .partners-page .partners-hero .partners-hero-actions .partners-btn.partners-btn-outline * {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}

html:not([data-theme="amigos-dark"]) body[data-page="partners"] .partners-page .partners-hero .partners-hero-actions .partners-btn.partners-btn-outline,
html:not([data-theme="amigos-dark"]) .partners-page .partners-hero .partners-hero-actions .partners-btn.partners-btn-outline {
  background-image:
    linear-gradient(#fff, #fff),
    linear-gradient(120deg, #F6BE10 0%, #F39125 28%, #E62453 58%, #C73B8E 78%, #F6BE10 100%) !important;
  color: #050505 !important;
  -webkit-text-fill-color: #050505 !important;
}

html:not([data-theme="amigos-dark"]) body[data-page="partners"] .partners-page .partners-hero .partners-hero-actions .partners-btn.partners-btn-outline *,
html:not([data-theme="amigos-dark"]) .partners-page .partners-hero .partners-hero-actions .partners-btn.partners-btn-outline * {
  color: #050505 !important;
  -webkit-text-fill-color: #050505 !important;
}
`;

export default function PartnersPage() {
  return (
    <LegacyPage
      css={["/partners.css", "/partial.css"]}
      html={pageHtml}
      scripts={["/partners.js", "/script.js"]}
      shell={true}
    >
      <style dangerouslySetInnerHTML={{ __html: forcedPartnersThemeCss }} data-partners-theme-force />
    </LegacyPage>
  );
}
