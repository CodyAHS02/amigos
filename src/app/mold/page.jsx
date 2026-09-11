import LegacyPage from "@/components/LegacyPage";

export const metadata = {
  title: "Mold Remediation & Moisture Treatment | Amigos Maler GmbH — Olten",
  description:
    "Professional mold remediation, moisture diagnostics, and mineral anti-mold surface restoration in Olten and surrounding regions. Certified Swiss craftsmanship for healthy indoor spaces."
};

const pageHtml = `<main class="mold-page">
  <!-- =========================================
       HERO SECTION
  ========================================= -->
  <section class="mold-hero" data-hero>
    <div class="mold-container">
      <div class="mold-hero-grid">
        <div class="mold-hero-content">
          <span class="mold-eyebrow">Service — Mold &amp; Moisture Remediation</span>
          <h1>Target The Root Cause. <br><span class="gradient-text">Restore Healthy Walls.</span></h1>
          <p class="mold-hero-p">
            Mold is never merely a cosmetic blemish—it compromises building structure and indoor health. Amigos Maler provides scientific moisture diagnostics, fungicidal substrate decontamination, and breathable mineral silicate finishes that prevent spore recurrence long-term.
          </p>
          <div class="mold-hero-actions">
            <a href="/contact" class="mold-btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Request Mold Inspection
            </a>
            <a href="#process" class="mold-btn-secondary">
              Explore Our Process &rarr;
            </a>
          </div>

          <div class="mold-hero-metrics">
            <div class="metric-item">
              <span class="metric-val">pH &gt; 11</span>
              <span class="metric-lbl">Alkaline Mineral Silicate</span>
            </div>
            <div class="metric-item">
              <span class="metric-val">100% Safe</span>
              <span class="metric-lbl">Chlorine &amp; Solvent Free</span>
            </div>
            <div class="metric-item">
              <span class="metric-val">SMGV Standard</span>
              <span class="metric-lbl">Certified Swiss Protocol</span>
            </div>
            <div class="metric-item">
              <span class="metric-val">Fast Response</span>
              <span class="metric-lbl">Olten &amp; Surrounding Areas</span>
            </div>
          </div>
        </div>

        <div class="mold-hero-visual">
          <img src="/assets/services/mold-hero.jpg" alt="Professional Swiss craftsman conducting mold remediation and substrate treatment">
          <div class="mold-visual-badge">
            <div class="badge-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div class="badge-text">
              <strong>Certified Substrate Sanitization</strong>
              <span>Non-destructive moisture diagnostics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- =========================================
       SCIENCE SECTION: WHY OVERPAINTING FAILS
  ========================================= -->
  <section class="mold-science">
    <div class="mold-container">
      <div class="mold-section-header reveal">
        <span class="mold-section-kicker">Scientific Remediation Principle</span>
        <h2>Why Superficial Overpainting Always Fails</h2>
        <p>Covering mold with conventional emulsion paint traps moisture and feeds fungal spores. Lasting remediation requires eliminating root dampness and altering substrate alkalinity.</p>
      </div>

      <div class="mold-science-grid">
        <div class="science-card bad reveal">
          <span class="science-tag">Conventional Cosmetic Quick-Fix</span>
          <h3>Standard Overpainting &amp; Bleach Sprays</h3>
          <p>Superficial spraying with household bleach only bleaches surface pigments without penetrating dense masonry, leaving the fungal mycelium alive beneath the surface.</p>
          <ul class="science-list">
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              <span><strong>Organic binder feeding:</strong> Dispersion paint resins contain synthetic polymers that provide nutrients for fungal spores.</span>
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              <span><strong>Film entrapment:</strong> Synthetic paint films block water vapor diffusion, sealing dampness inside the plaster.</span>
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              <span><strong>Recurrence cycle:</strong> Black mold breaks through new paint within 3 to 6 months, expanding spore emission.</span>
            </li>
          </ul>
        </div>

        <div class="science-card good reveal">
          <span class="science-tag">Amigos Swiss Remediation Standard</span>
          <h3>Mineral Silicate &amp; Calcium Sanitization</h3>
          <p>We treat the underlying plaster through deep spore neutralization, then apply mineral coatings that chemically bond with the wall to create a natural alkaline shield.</p>
          <ul class="science-list">
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span><strong>Natural high pH (&gt; 11):</strong> The permanent alkalinity of potassium silicate prevents fungal spore germination biologically.</span>
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span><strong>Vapor permeability (Diffusionsoffen):</strong> Breathable microporous structure lets trapped wall moisture evaporate freely.</span>
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span><strong>Odorless &amp; VOC-free:</strong> Safe for nurseries, bedrooms, and commercial food-prep areas with zero toxic emissions.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- =========================================
       CORE REMEDIATION SERVICES
  ========================================= -->
  <section class="mold-services">
    <div class="mold-container">
      <div class="mold-section-header reveal">
        <span class="mold-section-kicker">Professional Services</span>
        <h2>Comprehensive Remediation From Diagnosis To Finish</h2>
        <p>Every mold infestation has a unique trigger. We combine calibrated technical diagnostics with master craftsman execution to restore your walls permanently.</p>
      </div>

      <div class="mold-services-grid">
        <article class="mold-service-card reveal">
          <div class="mold-service-media">
            <img src="/assets/external/drywall/photo-1581578731548-c64695cc6952.jpg" alt="Moisture meter inspection of wall surface">
            <span class="mold-service-num">01</span>
          </div>
          <div class="mold-service-body">
            <h3>Moisture &amp; Thermal Diagnostics</h3>
            <h4>Precise root-cause analysis</h4>
            <p>We perform capacitive moisture profiling and thermal analysis to pinpoint condensation zones, thermal bridges (Wärmebrücken), and plumbing micro-leaks before any intervention.</p>
            <a href="/contact" class="mold-service-link">Schedule Diagnostic Inspection &rarr;</a>
          </div>
        </article>

        <article class="mold-service-card reveal">
          <div class="mold-service-media">
            <img src="/assets/Plastering/plaster-repair.jpeg" alt="Stripping and plaster repair on affected wall">
            <span class="mold-service-num">02</span>
          </div>
          <div class="mold-service-body">
            <h3>Plaster &amp; Substrate Rehabilitation</h3>
            <h4>Eliminating salt and deep mycelium</h4>
            <p>Contaminated wallpaper and decayed plaster layers are mechanically removed under dust-controlled containment. We apply porous renovation plaster (Sanierputz) or calcium silicate climate boards.</p>
            <a href="/Plastering" class="mold-service-link">Explore Plaster Restoration &rarr;</a>
          </div>
        </article>

        <article class="mold-service-card featured-gradient reveal">
          <div class="mold-service-media">
            <img src="/assets/Plastering/Surface-Finishes.jpeg" alt="Applying premium mineral anti-mold paint">
            <span class="mold-service-num">03</span>
          </div>
          <div class="mold-service-body">
            <h3>Mineral Silicate Coating</h3>
            <h4>Durable, anti-fungal architectural finish</h4>
            <p>We prime with sporicidal barrier compounds and finish with premium Sol-Silicate mineral paints that silicate directly into the mineral substrate, delivering a pristine, velvety matte appearance.</p>
            <a href="/interior-painting" class="mold-service-link">Explore Interior Painting &rarr;</a>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- =========================================
       INTERACTIVE BEFORE / AFTER SLIDER
  ========================================= -->
  <section class="mold-comparison">
    <div class="mold-container">
      <div class="mold-section-header reveal">
        <span class="mold-section-kicker">Interactive Comparison</span>
        <h2>See The Transformation In Real Time</h2>
        <p>Slide back and forth to examine the contrast between a mold-compromised surface and our clean, breathable, fully restored living space.</p>
      </div>

      <div class="ba-slider-container reveal" id="baSlider">
        <div class="ba-pane ba-before-pane" id="baBeforePane">
          <img src="/assets/services/mold-hero.jpg" alt="Active mold infestation on wall during containment">
          <span class="ba-label before-label" id="baBeforeLabel">Before Remediation</span>
        </div>
        <div class="ba-pane ba-after-pane" id="baAfterPane">
          <img src="/assets/services/mold-restored.jpg" alt="Pristine restored living room with clean mineral finish">
          <span class="ba-label after-label" id="baAfterLabel">Restored With Silicate</span>
        </div>
        <div class="ba-divider" id="baDivider">
          <div class="ba-handle" id="baHandle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline><polyline points="9 18 15 12 9 6" transform="rotate(180 12 12)"></polyline></svg>
          </div>
        </div>
      </div>
      <p class="ba-caption reveal">Drag the slider or click anywhere to compare substrate recovery.</p>
    </div>
  </section>

  <!-- =========================================
       4-STEP PROCESS SECTION
  ========================================= -->
  <section class="mold-process" id="process">
    <div class="mold-container">
      <div class="mold-section-header reveal">
        <span class="mold-section-kicker">Remediation Protocol</span>
        <h2>Our 4-Step Swiss Craftsmanship Standard</h2>
        <p>A rigorous, systematic methodology that guarantees safety, preserves property value, and ensures mold spores cannot return.</p>
      </div>

      <div class="mold-process-grid">
        <div class="mold-process-card reveal">
          <div class="mold-step-number">01</div>
          <h3>Inspect &amp; Measure</h3>
          <p>Calibrated electronic moisture testing, ambient hygrometry, and identifying structural causes like thermal bridges or facade leaks.</p>
        </div>

        <div class="mold-process-card reveal">
          <div class="mold-step-number">02</div>
          <h3>Contain &amp; Neutralize</h3>
          <p>Isolating the work area with dust barriers, deploying certified sporicidal agents, and neutralizing airborne spores safely without harsh fumes.</p>
        </div>

        <div class="mold-process-card reveal">
          <div class="mold-step-number">03</div>
          <h3>Restore Substrate</h3>
          <p>Stripping decayed coatings, salt-blocking primer application, and re-plastering with breathable mineral lime or calcium silicate systems.</p>
        </div>

        <div class="mold-process-card reveal">
          <div class="mold-step-number">04</div>
          <h3>Silicate Finish</h3>
          <p>Application of high-pH mineral paint, complete room cleanup, final moisture documentation, and personalized ventilation guidelines.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- =========================================
       REAL ESTATE & COMPLIANCE SECTION
  ========================================= -->
  <section class="mold-real-estate">
    <div class="mold-container">
      <div class="mold-re-banner reveal">
        <div class="mold-re-content">
          <span class="mold-eyebrow re-eyebrow">Property Management &amp; Real Estate</span>
          <h2>Protecting Asset Value &amp; Swiss Tenancy Standards</h2>
          <p>For landlords, property managers (Liegenschaftsverwaltungen), and institutional owners, unresolved moisture is the number one cause of rent reduction claims and structural depreciation.</p>
          <div class="mold-re-features">
            <div class="re-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Compliance with Swiss Tenancy Law (Mietrecht Art. 256 OR)</span>
            </div>
            <div class="re-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Objective cause documentation for insurance and tenant handovers</span>
            </div>
            <div class="re-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Long-term preservation of building fabric without recurring call-backs</span>
            </div>
          </div>
        </div>

        <div class="mold-re-card">
          <h3>Manage A Property Portfolio?</h3>
          <p>We provide rapid on-site inspection, clear photographic damage reports, and fixed-price offers for property managers across the Olten, Solothurn, and Aarau regions.</p>
          <a href="/contact" class="mold-btn-primary">Request Portfolio Consultation</a>
        </div>
      </div>
    </div>
  </section>

  <!-- =========================================
       FAQ ACCORDION
  ========================================= -->
  <section class="mold-faq">
    <div class="mold-container">
      <div class="mold-section-header reveal">
        <span class="mold-section-kicker">Frequently Asked Questions</span>
        <h2>Clear Answers On Mold Remediation</h2>
        <p>Everything you need to know regarding safety, costs, prevention, and technical solutions.</p>
      </div>

      <div class="faq-accordion reveal">
        <div class="faq-item active">
          <button class="faq-header" type="button">
            <h3>Can mold simply be treated with a stain-blocking paint?</h3>
            <span class="faq-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </span>
          </button>
          <div class="faq-body">
            <p>No. Stain-blocking primers and standard dispersion paints seal the surface without killing the deep mycelium. Within weeks, trapped moisture builds osmotic pressure, forcing the fungus to digest the organic paint binders and burst through the surface with renewed vigor.</p>
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-header" type="button">
            <h3>Are your remediation products safe for families and children?</h3>
            <span class="faq-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </span>
          </button>
          <div class="faq-body">
            <p>Yes. Unlike consumer bleach sprays that release corrosive chlorine fumes, Amigos Maler uses certified non-toxic, odorless, and VOC-free mineral solutions. Our mineral silicate paints contain zero biocides or solvents, making rooms fully safe to occupy immediately after curing.</p>
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-header" type="button">
            <h3>Who is responsible for the cost under Swiss tenancy law?</h3>
            <span class="faq-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </span>
          </button>
          <div class="faq-body">
            <p>Under Swiss tenancy law (Art. 256 OR), landlords are required to maintain the property in suitable condition. If mold stems from structural issues (such as cold thermal bridges, facade defects, or prior water damage), the landlord or building insurance typically covers the cost. Our diagnostic report provides clear, objective evidence.</p>
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-header" type="button">
            <h3>How do calcium silicate climate boards prevent condensation?</h3>
            <span class="faq-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </span>
          </button>
          <div class="faq-body">
            <p>Calcium silicate boards are micro-porous mineral boards installed on exterior wall corners. They act like a natural moisture buffer: absorbing excess room humidity when levels are high, and releasing it safely back into the room during regular ventilation, keeping the wall surface temperature warm and dry.</p>
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-header" type="button">
            <h3>How fast can Amigos Maler inspect the damage in Olten?</h3>
            <span class="faq-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </span>
          </button>
          <div class="faq-body">
            <p>Because moisture damage can deteriorate quickly, we prioritize urgent requests. We normally schedule on-site inspections within 24 to 48 hours throughout Olten, Trimbach, Aarburg, Dulliken, Aarau, and surrounding areas.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- =========================================
       FINAL CTA BANNER
  ========================================= -->
  <section class="mold-final-cta">
    <div class="mold-container">
      <div class="mold-cta-box reveal">
        <h2>Suspect Mold Or Persistent Dampness?</h2>
        <p>Do not wait for spores to spread. Contact Amigos Maler for an objective diagnostic inspection and lasting mineral wall restoration.</p>
        <div class="mold-cta-buttons">
          <a href="/contact" class="mold-btn-primary">
            Request Free Assessment
          </a>
          <a href="tel:+41622129012" class="mold-btn-secondary">
            Call 062 212 90 12
          </a>
        </div>
      </div>
    </div>
  </section>
</main>`;

export default function Page() {
  return (
    <LegacyPage
      css={["/mold.css", "/partial.css"]}
      html={pageHtml}
      scripts={["/mold.js", "/script.js"]}
      shell={true}
    />
  );
}
