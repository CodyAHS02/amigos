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
        <img src="https://livios-images.imgix.net/livios/umbracomedia/130303/gettyimages-verbouwend-koppel-bespreekt-plan-met-architect-1386844490.jpg?max-w=1200&s=9a3b8fe20efbd6984ddbacee0ad7c7c2" alt="Renovation planning consultation with architectural plans">
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

export default function PartnersPage() {
  return (
    <LegacyPage
      css={["/partners.css", "/partial.css"]}
      html={pageHtml}
      scripts={["/partners.js", "/script.js"]}
      shell={true}
    />
  );
}
