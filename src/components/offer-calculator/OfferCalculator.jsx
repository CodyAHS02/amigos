"use client";

import { useMemo, useRef, useState } from "react";
import styles from "./OfferCalculator.module.css";

const propertyTypes = [
  { id: "apartment", title: "Apartment / Flat", iconKey: "apartment" },
  { id: "house", title: "Single-Family House", iconKey: "house" },
  { id: "commercial", title: "Commercial / Business", iconKey: "commercial" },
  { id: "facade", title: "Facade / Exterior", iconKey: "facade" },
  { id: "room", title: "Single Room", iconKey: "room" },
  { id: "other", title: "Other", iconKey: "other" }
];

const roomTypes = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Hallway", "Other"];

const componentOptions = [
  { id: "ceilings", title: "Ceilings", iconKey: "ceilings", quantityKey: "ceilingArea", label: "Ceiling area", unit: "m²" },
  { id: "walls", title: "Walls", iconKey: "walls", quantityKey: "wallArea", label: "Wall area", unit: "m²" },
  { id: "doors", title: "Doors", iconKey: "doors", quantityKey: "doors", label: "Doors", unit: "pcs" },
  { id: "windows", title: "Windows", iconKey: "windows", quantityKey: "windows", label: "Windows", unit: "pcs" },
  { id: "radiators", title: "Radiators", iconKey: "radiators", quantityKey: "radiators", label: "Radiators", unit: "pcs" },
  { id: "baseboards", title: "Baseboards", iconKey: "baseboards", quantityKey: "baseboards", label: "Baseboards", unit: "lm" },
  { id: "other", title: "Other", iconKey: "other", quantityKey: "otherUnits", label: "Other items", unit: "qty" }
];

const facadeComponent = { id: "facade", title: "Facade / Exterior Surface", iconKey: "facade", quantityKey: "facadeArea", label: "Facade area", unit: "m²" };

const serviceOptions = [
  { id: "ceiling_paint_2_coats", title: "Paint ceilings – 2 coats", components: ["ceilings"] },
  { id: "wall_paint_2_coats", title: "Paint walls – 2 coats", components: ["walls", "facade"] },
  { id: "remove_wallpaper", title: "Remove wallpaper", components: ["walls"] },
  { id: "apply_wallpaper", title: "Apply wallpaper", components: ["walls"] },
  { id: "filling_spackling", title: "Filling / Spackling", components: ["walls", "ceilings", "facade"] },
  { id: "mold_treatment", title: "Mold treatment", components: ["walls", "ceilings", "facade"] },
  { id: "nicotine_treatment", title: "Nicotine treatment", components: ["walls", "ceilings"] },
  { id: "water_damage_repair", title: "Water damage repair", components: ["walls", "ceilings"] },
  { id: "priming_sealing", title: "Priming / Sealing", components: ["walls", "ceilings", "facade"] },
  { id: "covering_protection", title: "Covering / Protection", components: ["ceilings", "walls", "doors", "windows", "radiators", "baseboards", "facade"] }
];

const photoCategories = ["Room overview", "Walls", "Ceiling", "Damage", "Mold", "Water damage", "Facade", "Windows", "Doors", "Other"];

const stepMeta = [
  { number: "01", key: "type", title: "Project Type", icon: "⌂" },
  { number: "02", key: "components", title: "Components", icon: "▦" },
  { number: "03", key: "services", title: "Work & Services", icon: "✦" },
  { number: "04", key: "quantities", title: "Quantities", icon: "↕" },
  { number: "05", key: "result", title: "Result", icon: "◉" },
  { number: "06", key: "verify", title: "Verify E-Mail", icon: "@" },
  { number: "07", key: "price", title: "Price", icon: "✓" }
];

const customerRequiredFields = ["firstName", "lastName", "phone", "address", "postalCode", "city"];

const initialState = {
  mode: "CALCULATE",
  propertyType: "",
  roomType: "",
  components: [],
  services: [],
  quantities: {},
  projectNotes: "",
  email: "",
  code: ["", "", "", ""],
  customerInfo: {
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    company: "",
    propertyManagement: false
  }
};

function toggle(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ComponentIcon({ iconKey }) {
  const commonProps = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  };

  switch (iconKey) {
    case "apartment":
      return (
        <svg {...commonProps}>
          <path d="M15 25 24 16l9 9" />
          <path d="M18 23v11h12V23" />
          <path d="M22 34v-7h4v7" />
        </svg>
      );
    case "house":
      return (
        <svg {...commonProps}>
          <path d="M11 24 24 12l13 12" />
          <path d="M15 22v15h18V22" />
          <path d="M21 37v-9h6v9" />
        </svg>
      );
    case "commercial":
      return (
        <svg {...commonProps}>
          <path d="M14 18h20v18H14V18Z" />
          <path d="M18 18v-5h12v5" />
          <path d="M19 24h2M27 24h2M19 30h2M27 30h2" />
        </svg>
      );
    case "room":
      return (
        <svg {...commonProps}>
          <path d="M14 15h20v22H14V15Z" />
          <path d="M20 21h8v8h-8V21Z" />
          <path d="M18 37v-5h12v5" />
        </svg>
      );
    case "ceilings":
      return (
        <svg {...commonProps}>
          <path d="M14 13h20l-10 7 10 7H14l10-7-10-7Z" />
          <path d="M14 35h20l-10-8-10 8Z" />
        </svg>
      );
    case "walls":
      return (
        <svg {...commonProps}>
          <path d="M14 14h16a5 5 0 0 1 5 5v3a5 5 0 0 1-5 5H14V14Z" />
          <path d="M14 27v8" />
          <path d="M22 27v8" />
          <path d="M30 27v8" />
          <path d="M35 21h3v10" />
        </svg>
      );
    case "doors":
      return (
        <svg {...commonProps}>
          <path d="M14 10h20v28H14V10Z" />
          <path d="M23 10v28" />
          <path d="M29 24h1" />
        </svg>
      );
    case "windows":
      return (
        <svg {...commonProps}>
          <path d="M12 12h24v24H12V12Z" />
          <path d="M24 12v24" />
          <path d="M12 24h24" />
        </svg>
      );
    case "radiators":
      return (
        <svg {...commonProps}>
          <path d="M14 34V17a5 5 0 0 1 10 0v17" />
          <path d="M24 34V17a5 5 0 0 1 10 0v17" />
          <path d="M10 34h28" />
          <path d="M10 20h4" />
          <path d="M34 20h4" />
        </svg>
      );
    case "baseboards":
      return (
        <svg {...commonProps}>
          <path d="M10 34h24a6 6 0 0 0 0-12h-3" />
          <path d="M10 34c7-2 11-6 13-12l2-7 11 3-2 6" />
          <path d="M27 15l3-5" />
        </svg>
      );
    case "facade":
      return (
        <svg {...commonProps}>
          <path d="M12 36V16l12-6 12 6v20" />
          <path d="M18 36V24h12v12" />
          <path d="M18 18h.01M24 18h.01M30 18h.01" />
        </svg>
      );
    case "other":
      return (
        <svg {...commonProps}>
          <circle cx="16" cy="24" r="2" />
          <circle cx="24" cy="24" r="2" />
          <circle cx="32" cy="24" r="2" />
        </svg>
      );
    default:
      return optionIconFallback(iconKey);
  }
}

function optionIconFallback(icon) {
  return <span aria-hidden="true">{icon || "✦"}</span>;
}

function titlesFromIds(options, ids) {
  return ids
    .map((id) => options.find((option) => option.id === id)?.title || id)
    .filter(Boolean);
}

export default function OfferCalculator({ embedded = false }) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState(initialState);
  const [sessionId, setSessionId] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [photos, setPhotos] = useState([]);
  const codeRefs = useRef([]);

  const components = useMemo(() => {
    return state.propertyType === "facade"
      ? [facadeComponent, ...componentOptions.filter((item) => ["windows", "doors", "other"].includes(item.id))]
      : componentOptions;
  }, [state.propertyType]);

  const visibleServices = useMemo(() => {
    return serviceOptions.filter((service) => {
      if (!state.components.length) return true;
      return service.components.some((component) => state.components.includes(component));
    });
  }, [state.components]);

  const visibleQuantities = useMemo(() => {
    const impliedComponents = serviceOptions
      .filter((service) => state.services.includes(service.id))
      .flatMap((service) => service.components);
    const selectedComponents = new Set([...state.components, ...impliedComponents]);

    return components.filter((component) => selectedComponents.has(component.id));
  }, [components, state.components, state.services]);

  const selectedComponentTitles = useMemo(() => {
    return titlesFromIds(components, state.components);
  }, [components, state.components]);

  const selectedServiceTitles = useMemo(() => {
    return titlesFromIds(serviceOptions, state.services);
  }, [state.services]);

  const progress = ((step + 1) / stepMeta.length) * 100;

  function updateCustomerInfo(key, value) {
    setState((current) => ({
      ...current,
      customerInfo: { ...current.customerInfo, [key]: value }
    }));
  }

  function canContinue() {
    if (step === 0) return Boolean(state.propertyType);
    if (step === 1) return state.components.length > 0;
    if (step === 2) return state.services.length > 0;
    if (step === 3) return visibleQuantities.every((item) => Number(state.quantities[item.quantityKey]) > 0);
    return true;
  }

  async function calculate() {
    setBusy(true);
    setErrors({});
    setNotice("");

    const response = await fetch("/api/offer-calculator/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: state.mode,
        propertyType: state.propertyType,
        roomType: state.roomType,
        components: state.components,
        services: state.services,
        quantities: state.quantities,
        projectNotes: state.projectNotes
      })
    });
    const data = await response.json();

    setBusy(false);

    if (!response.ok) {
      setErrors(data.errors || { general: data.error || "Please check your project details." });
      return;
    }

    setSessionId(data.sessionId);
    setStep(4);
  }

  function next() {
    if (step === 3) {
      calculate();
      return;
    }

    if (canContinue()) setStep((current) => Math.min(current + 1, stepMeta.length - 1));
  }

  async function sendCode() {
    setBusy(true);
    setErrors({});
    setNotice("");

    const response = await fetch("/api/offer-calculator/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, email: state.email })
    });
    const data = await response.json();

    setBusy(false);

    if (!response.ok) {
      setErrors(data.errors || { general: data.error || "Could not send verification code." });
      return;
    }

    setCodeSent(true);
    setNotice(data.developmentCode ? `Development code: ${data.developmentCode}` : "Verification code sent. Please check your e-mail.");
  }

  async function verifyCode() {
    setBusy(true);
    setErrors({});
    setNotice("");

    const response = await fetch("/api/offer-calculator/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, code: state.code.join("") })
    });
    const data = await response.json();

    setBusy(false);

    if (!response.ok) {
      setErrors({ general: data.error || "Verification failed." });
      return;
    }

    setPriceRange(data.priceRange);
    setStep(6);
  }

  async function uploadPhoto(file, category) {
    if (!sessionId || !file) return;

    const formData = new FormData();
    formData.set("sessionId", sessionId);
    formData.set("category", category);
    formData.set("photo", file);

    const response = await fetch("/api/offer-calculator/photos", {
      method: "POST",
      body: formData
    });
    const data = await response.json();

    if (response.ok) {
      setPhotos((current) => [...current, data.photo]);
    } else {
      setErrors({ general: data.error || "Photo upload failed." });
    }
  }

  async function submitRequest(requestedAction) {
    const fieldErrors = {};

    for (const field of customerRequiredFields) {
      if (!String(state.customerInfo[field] || "").trim()) fieldErrors[field] = "Required";
    }

    if (Object.keys(fieldErrors).length) {
      setErrors({
        ...fieldErrors,
        general: "Please complete your contact and property details before submitting."
      });
      return;
    }

    setBusy(true);
    setErrors({});
    setNotice("");

    const response = await fetch("/api/offer-calculator/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        customerInfo: {
          ...state.customerInfo,
          email: state.email,
          requestedAction
        }
      })
    });
    const data = await response.json();

    setBusy(false);

    if (!response.ok) {
      setErrors(data.errors || { general: data.error || "Please complete the required details." });
      return;
    }

    setNotice(requestedAction === "CONSULTATION"
      ? "Consultation request received. It is now in the AMIGOS CRM."
      : "Offer request received. It is now in the AMIGOS CRM.");
  }

  function renderSelectionCard(option, selected, onClick) {
    return (
      <button type="button" className={cx(styles.selectionCard, selected && styles.selectedCard)} onClick={onClick}>
        <span className={styles.cardIcon}>{option.iconKey ? <ComponentIcon iconKey={option.iconKey} /> : option.icon || "✦"}</span>
        <span>{option.title}</span>
        <i>{selected ? "✓" : "›"}</i>
      </button>
    );
  }

  if (embedded) {
    return (
      <main className={cx(styles.page, styles.embedded, "offerCalculatorEmbedded")}>
        <aside className={styles.embeddedRail}>
          <div className={styles.heroCopy}>
            <span className={styles.brand}>AMIGOS MALER GMBH</span>
            <strong>Kompetenz verbindet</strong>
            <h1>OFFER CALCULATOR & REQUEST</h1>
            <p>Calculate, see your price – and request your offer.</p>
            <ul>
              <li>Calculate your estimated price in a few steps</li>
              <li>See your result after verifying your e-mail</li>
              <li>Request your personal offer or book a consultation</li>
            </ul>
          </div>
          <div className={styles.securityCard}>
            <span>🔒</span>
            <h2>PRICES ARE PROTECTED</h2>
            <p>The exact price is only visible after e-mail verification.</p>
          </div>
        </aside>

        <div className={styles.embeddedWorkspace}>
          <nav className={styles.progressNav} aria-label="Calculator progress">
            <span className={styles.progressFill} style={{ width: `${progress}%` }} />
            {stepMeta.map((item, index) => (
              <button
                key={item.key}
                className={cx(styles.progressStep, index === step && styles.currentStep, index < step && styles.doneStep)}
                type="button"
                onClick={() => index < step && setStep(index)}
              >
                <span>{item.number}</span>
                <i>{item.icon}</i>
                <b>{item.title}</b>
              </button>
            ))}
          </nav>

          <section className={styles.embeddedLayout}>
            <div className={cx(styles.consultationShell, styles.embeddedLeft)}>
              <div className={styles.entrySwitch}>
                <button type="button" className={state.mode === "CALCULATE" ? styles.activeEntry : ""} onClick={() => setState((current) => ({ ...current, mode: "CALCULATE" }))}>
                  <b>Calculate Price & Request Offer</b>
                  <span>For customers who want an approximate project price.</span>
                </button>
                <button type="button" className={state.mode === "REQUEST" ? styles.activeEntry : ""} onClick={() => setState((current) => ({ ...current, mode: "REQUEST" }))}>
                  <b>Request a Personal Offer</b>
                  <span>For customers who already know what they need.</span>
                </button>
              </div>

            {errors.general && <p className={styles.error}>{errors.general}</p>}
            {notice && <p className={styles.notice}>{notice}</p>}

            {step === 0 && (
              <div className={styles.stepPanel}>
                <span className={styles.stepKicker}>01 Project Type</span>
                <h2>What type of property is it?</h2>
                <p>Please select the type of property.</p>
                <div className={styles.cardGrid}>
                  {propertyTypes.map((option) => renderSelectionCard(option, state.propertyType === option.id, () => {
                    setState((current) => ({
                      ...current,
                      propertyType: option.id,
                      components: option.id === "facade" ? ["facade"] : current.components.filter((item) => item !== "facade"),
                      services: option.id === "facade" ? current.services.filter((service) => serviceOptions.find((item) => item.id === service)?.components.includes("facade")) : current.services,
                      quantities: option.id === "facade" ? current.quantities : { ...current.quantities, facadeArea: "" }
                    }));
                  }))}
                </div>
                {state.propertyType === "room" && (
                  <div className={styles.roomChips}>
                    {roomTypes.map((room) => (
                      <button key={room} type="button" className={state.roomType === room ? styles.activeChip : ""} onClick={() => setState((current) => ({ ...current, roomType: room }))}>{room}</button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div className={styles.stepPanel}>
                <span className={styles.stepKicker}>02 Components</span>
                <h2>Which components should be worked on?</h2>
                <p>Select all that apply.</p>
                <div className={styles.cardGrid}>
                  {components.map((option) => renderSelectionCard(option, state.components.includes(option.id), () => {
                    setState((current) => ({ ...current, components: toggle(current.components, option.id) }));
                  }))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={styles.stepPanel}>
                <span className={styles.stepKicker}>03 Work & Services</span>
                <h2>What work should we do?</h2>
                <p>Select multiple services. The catalogue is structured so it can grow with AMIGOS.</p>
                <div className={styles.serviceGrid}>
                  {visibleServices.map((option) => renderSelectionCard(option, state.services.includes(option.id), () => {
                    setState((current) => ({ ...current, services: toggle(current.services, option.id) }));
                  }))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={styles.stepPanel}>
                <span className={styles.stepKicker}>04 Quantities</span>
                <h2>Enter the quantities</h2>
                <p>Please enter the areas, lengths and quantities.</p>
                <div className={styles.quantityGrid}>
                  {visibleQuantities.map((item) => (
                    <label key={item.id} className={styles.quantityField}>
                      <span>{item.label}</span>
                      <div>
                        <input
                          type="number"
                          min="0"
                          inputMode="decimal"
                          value={state.quantities[item.quantityKey] || ""}
                          placeholder={item.unit === "m²" ? "120" : "5"}
                          onChange={(event) => setState((current) => ({
                            ...current,
                            quantities: { ...current.quantities, [item.quantityKey]: event.target.value }
                          }))}
                        />
                        <b>{item.unit}</b>
                      </div>
                    </label>
                  ))}
                </div>
                <label className={styles.notesField}>
                  <span>Project information</span>
                  <textarea value={state.projectNotes} placeholder="Tell us anything important about access, condition, damage or timing." onChange={(event) => setState((current) => ({ ...current, projectNotes: event.target.value }))} />
                </label>
              </div>
            )}

            {step >= 4 && (
              <div className={cx(styles.stepPanel, styles.embeddedComplete)}>
                <span className={styles.stepKicker}>Selections Complete</span>
                <h2>Your project details are ready.</h2>
                <p>Use the price panel to verify your e-mail and unlock the estimated project price.</p>
                <div className={styles.summaryPanel}>
                  <h3>Your selected project</h3>
                  <dl>
                    <div>
                      <dt>Property</dt>
                      <dd>{propertyTypes.find((option) => option.id === state.propertyType)?.title || "Not selected"}{state.roomType ? ` · ${state.roomType}` : ""}</dd>
                    </div>
                    <div>
                      <dt>Components</dt>
                      <dd>{selectedComponentTitles.length ? selectedComponentTitles.join(", ") : "Not selected"}</dd>
                    </div>
                    <div>
                      <dt>Services</dt>
                      <dd>{selectedServiceTitles.length ? selectedServiceTitles.join(", ") : "Not selected"}</dd>
                    </div>
                    <div>
                      <dt>Quantities</dt>
                      <dd>{visibleQuantities.map((item) => `${item.label}: ${state.quantities[item.quantityKey] || 0} ${item.unit}`).join(" · ")}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {step < 4 && (
              <div className={styles.navActions}>
                {step > 0 && <button type="button" className={styles.secondaryAction} onClick={() => setStep((current) => current - 1)}>← BACK</button>}
                <button type="button" className={styles.primaryAction} disabled={!canContinue() || busy} onClick={next}>{step === 3 ? "CALCULATE" : "CONTINUE →"}</button>
              </div>
            )}
            {step >= 4 && step < 6 && (
              <div className={styles.navActions}>
                <button type="button" className={styles.secondaryAction} onClick={() => setStep(3)}>← EDIT SELECTIONS</button>
              </div>
            )}
            </div>

            <aside className={cx(styles.consultationShell, styles.embeddedRight)}>
            {step < 4 && (
              <div className={styles.resultLocked}>
                <span className={styles.stepKicker}>Price</span>
                <h2>Estimated price locked</h2>
                <p>Complete the required selections on the left to calculate and unlock your price.</p>
                <div className={styles.lockedPrice}>
                  <span>Price:</span>
                  <strong>CHF ****.–</strong>
                </div>
                <button className={styles.primaryAction} type="button" disabled>COMPLETE SELECTIONS FIRST</button>
              </div>
            )}

            {step === 4 && (
              <div className={styles.resultLocked}>
                <span className={styles.stepKicker}>05 Result</span>
                <h2>Your calculation is ready!</h2>
                <p>To view your estimated project price, please verify your e-mail address.</p>
                <div className={styles.lockedPrice}>
                  <span>Price:</span>
                  <strong>CHF ••••.–</strong>
                </div>
                <button className={styles.primaryAction} type="button" onClick={() => setStep(5)} disabled={busy}>SHOW PRICE</button>
              </div>
            )}

            {step === 5 && (
              <div className={styles.verifyPanel}>
                <span className={styles.stepKicker}>06 Verify E-Mail</span>
                <h2>Verify your e-mail</h2>
                {!codeSent ? (
                  <>
                    <p>Enter your e-mail address and we will send you a 4-digit verification code.</p>
                    <label className={styles.emailField}>
                      <span>E-Mail</span>
                      <input type="email" value={state.email} placeholder="you@example.com" onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))} />
                    </label>
                    <button className={styles.primaryAction} type="button" onClick={sendCode} disabled={busy}>SEND CODE TO MY E-MAIL</button>
                  </>
                ) : (
                  <>
                    <p>Enter the 4-digit code we sent to {state.email}.</p>
                    <div className={styles.codeInputs}>
                      {state.code.map((digit, index) => (
                        <input
                          key={index}
                          ref={(node) => { codeRefs.current[index] = node; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(event) => {
                            const value = event.target.value.replace(/\D/g, "").slice(0, 1);
                            setState((current) => {
                              const code = [...current.code];
                              code[index] = value;
                              return { ...current, code };
                            });
                            if (value && codeRefs.current[index + 1]) codeRefs.current[index + 1].focus();
                          }}
                        />
                      ))}
                    </div>
                    <button className={styles.primaryAction} type="button" onClick={verifyCode} disabled={busy}>Unlock Estimated Price</button>
                    <button className={styles.textButton} type="button" onClick={sendCode}>Didn't receive a code? Resend code</button>
                  </>
                )}
              </div>
            )}

            {step === 6 && (
              <div className={styles.pricePanel}>
                <div className={styles.successMark}>✓</div>
                <span className={styles.stepKicker}>07 Estimated Project Price</span>
                <h2>Your estimated project price</h2>
                <strong className={styles.priceRange}>{priceRange}</strong>
                <p>This is an approximate price range based on the information provided. The final price may vary after review and/or an on-site inspection.</p>

                <div className={styles.customerGrid}>
                  {[
                    ["firstName", "First Name"],
                    ["lastName", "Last Name"],
                    ["phone", "Phone"],
                    ["address", "Street / Property Address"],
                    ["postalCode", "Postal Code"],
                    ["city", "City"],
                    ["company", "Company"]
                  ].map(([key, label]) => (
                    <label key={key}>
                      <span>{label}</span>
                      <input value={state.customerInfo[key]} onChange={(event) => updateCustomerInfo(key, event.target.value)} aria-invalid={Boolean(errors[key])} />
                      {errors[key] && <small>{errors[key]}</small>}
                    </label>
                  ))}
                  <label className={styles.checkboxLine}>
                    <input type="checkbox" checked={state.customerInfo.propertyManagement} onChange={(event) => updateCustomerInfo("propertyManagement", event.target.checked)} />
                    <span>Property Management</span>
                  </label>
                </div>

                <div className={styles.summaryPanel}>
                  <h3>Your selected project</h3>
                  <dl>
                    <div>
                      <dt>Property</dt>
                      <dd>{propertyTypes.find((option) => option.id === state.propertyType)?.title || "Not selected"}{state.roomType ? ` · ${state.roomType}` : ""}</dd>
                    </div>
                    <div>
                      <dt>Components</dt>
                      <dd>{selectedComponentTitles.length ? selectedComponentTitles.join(", ") : "Not selected"}</dd>
                    </div>
                    <div>
                      <dt>Services</dt>
                      <dd>{selectedServiceTitles.length ? selectedServiceTitles.join(", ") : "Not selected"}</dd>
                    </div>
                    <div>
                      <dt>Quantities</dt>
                      <dd>{visibleQuantities.map((item) => `${item.label}: ${state.quantities[item.quantityKey] || 0} ${item.unit}`).join(" · ")}</dd>
                    </div>
                  </dl>
                </div>

                <div className={styles.uploadPanel}>
                  <h3>Upload photos of your project</h3>
                  <div className={styles.photoGrid}>
                    {photoCategories.map((category) => (
                      <label key={category} className={styles.photoDrop}>
                        <span>{category}</span>
                        <small>Take Photo or Choose From Library</small>
                        <input type="file" accept="image/*" capture="environment" onChange={(event) => uploadPhoto(event.target.files?.[0], category)} />
                      </label>
                    ))}
                  </div>
                  {photos.length > 0 && <p className={styles.notice}>{photos.length} photo{photos.length === 1 ? "" : "s"} attached to this project.</p>}
                </div>

                <div className={styles.finalActions}>
                  <button className={styles.primaryAction} type="button" onClick={() => submitRequest("OFFER")} disabled={busy}>REQUEST A FREE OFFER</button>
                  <button className={styles.secondaryAction} type="button" onClick={() => submitRequest("CONSULTATION")} disabled={busy}>SCHEDULE A CONSULTATION</button>
                </div>
              </div>
            )}
            </aside>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.brand}>AMIGOS MALER GMBH</span>
          <strong>Kompetenz verbindet</strong>
          <h1>OFFER CALCULATOR & REQUEST</h1>
          <p>Calculate, see your price – and request your offer.</p>
          <ul>
            <li>Calculate your estimated price in a few steps</li>
            <li>See your result after verifying your e-mail</li>
            <li>Request your personal offer or book a consultation</li>
          </ul>
        </div>
        <aside className={styles.securityCard}>
          <span>🔒</span>
          <h2>PRICES ARE PROTECTED</h2>
          <p>The exact price is only visible after e-mail verification.</p>
        </aside>
      </section>

      <nav className={styles.progressNav} aria-label="Calculator progress">
        <span className={styles.progressFill} style={{ width: `${progress}%` }} />
        {stepMeta.map((item, index) => (
          <button
            key={item.key}
            className={cx(styles.progressStep, index === step && styles.currentStep, index < step && styles.doneStep)}
            type="button"
            onClick={() => index < step && setStep(index)}
          >
            <span>{item.number}</span>
            <i>{item.icon}</i>
            <b>{item.title}</b>
          </button>
        ))}
      </nav>

      <section className={styles.consultationShell}>
        <div className={styles.entrySwitch}>
          <button type="button" className={state.mode === "CALCULATE" ? styles.activeEntry : ""} onClick={() => setState((current) => ({ ...current, mode: "CALCULATE" }))}>
            <b>Calculate Price & Request Offer</b>
            <span>For customers who want an approximate project price.</span>
          </button>
          <button type="button" className={state.mode === "REQUEST" ? styles.activeEntry : ""} onClick={() => setState((current) => ({ ...current, mode: "REQUEST" }))}>
            <b>Request a Personal Offer</b>
            <span>For customers who already know what they need.</span>
          </button>
        </div>

        {errors.general && <p className={styles.error}>{errors.general}</p>}
        {notice && <p className={styles.notice}>{notice}</p>}

        {step === 0 && (
          <div className={styles.stepPanel}>
            <span className={styles.stepKicker}>01 Project Type</span>
            <h2>What type of property is it?</h2>
            <p>Please select the type of property.</p>
            <div className={styles.cardGrid}>
              {propertyTypes.map((option) => renderSelectionCard(option, state.propertyType === option.id, () => {
                setState((current) => ({
                  ...current,
                  propertyType: option.id,
                  components: option.id === "facade" ? ["facade"] : current.components.filter((item) => item !== "facade"),
                  services: option.id === "facade" ? current.services.filter((service) => serviceOptions.find((item) => item.id === service)?.components.includes("facade")) : current.services,
                  quantities: option.id === "facade" ? current.quantities : { ...current.quantities, facadeArea: "" }
                }));
              }))}
            </div>
            {state.propertyType === "room" && (
              <div className={styles.roomChips}>
                {roomTypes.map((room) => (
                  <button key={room} type="button" className={state.roomType === room ? styles.activeChip : ""} onClick={() => setState((current) => ({ ...current, roomType: room }))}>{room}</button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className={styles.stepPanel}>
            <span className={styles.stepKicker}>02 Components</span>
            <h2>Which components should be worked on?</h2>
            <p>Select all that apply.</p>
            <div className={styles.cardGrid}>
              {components.map((option) => renderSelectionCard(option, state.components.includes(option.id), () => {
                setState((current) => ({ ...current, components: toggle(current.components, option.id) }));
              }))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.stepPanel}>
            <span className={styles.stepKicker}>03 Work & Services</span>
            <h2>What work should we do?</h2>
            <p>Select multiple services. The catalogue is structured so it can grow with AMIGOS.</p>
            <div className={styles.serviceGrid}>
              {visibleServices.map((option) => renderSelectionCard(option, state.services.includes(option.id), () => {
                setState((current) => ({ ...current, services: toggle(current.services, option.id) }));
              }))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.stepPanel}>
            <span className={styles.stepKicker}>04 Quantities</span>
            <h2>Enter the quantities</h2>
            <p>Please enter the areas, lengths and quantities.</p>
            <div className={styles.quantityGrid}>
              {visibleQuantities.map((item) => (
                <label key={item.id} className={styles.quantityField}>
                  <span>{item.label}</span>
                  <div>
                    <input
                      type="number"
                      min="0"
                      inputMode="decimal"
                      value={state.quantities[item.quantityKey] || ""}
                      placeholder={item.unit === "m²" ? "120" : "5"}
                      onChange={(event) => setState((current) => ({
                        ...current,
                        quantities: { ...current.quantities, [item.quantityKey]: event.target.value }
                      }))}
                    />
                    <b>{item.unit}</b>
                  </div>
                </label>
              ))}
            </div>
            <label className={styles.notesField}>
              <span>Project information</span>
              <textarea value={state.projectNotes} placeholder="Tell us anything important about access, condition, damage or timing." onChange={(event) => setState((current) => ({ ...current, projectNotes: event.target.value }))} />
            </label>
          </div>
        )}

        {step === 4 && (
          <div className={styles.resultLocked}>
            <span className={styles.stepKicker}>05 Result</span>
            <h2>Your calculation is ready!</h2>
            <p>To view your estimated project price, please verify your e-mail address.</p>
            <div className={styles.lockedPrice}>
              <span>Price:</span>
              <strong>CHF ••••.–</strong>
            </div>
            <button className={styles.primaryAction} type="button" onClick={() => setStep(5)} disabled={busy}>SHOW PRICE</button>
          </div>
        )}

        {step === 5 && (
          <div className={styles.verifyPanel}>
            <span className={styles.stepKicker}>06 Verify E-Mail</span>
            <h2>Verify your e-mail</h2>
            {!codeSent ? (
              <>
                <p>Enter your e-mail address and we will send you a 4-digit verification code.</p>
                <label className={styles.emailField}>
                  <span>E-Mail</span>
                  <input type="email" value={state.email} placeholder="you@example.com" onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))} />
                </label>
                <button className={styles.primaryAction} type="button" onClick={sendCode} disabled={busy}>SEND CODE TO MY E-MAIL</button>
              </>
            ) : (
              <>
                <p>Enter the 4-digit code we sent to {state.email}.</p>
                <div className={styles.codeInputs}>
                  {state.code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(node) => { codeRefs.current[index] = node; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(event) => {
                        const value = event.target.value.replace(/\D/g, "").slice(0, 1);
                        setState((current) => {
                          const code = [...current.code];
                          code[index] = value;
                          return { ...current, code };
                        });
                        if (value && codeRefs.current[index + 1]) codeRefs.current[index + 1].focus();
                      }}
                    />
                  ))}
                </div>
                <button className={styles.primaryAction} type="button" onClick={verifyCode} disabled={busy}>Unlock Estimated Price</button>
                <button className={styles.textButton} type="button" onClick={sendCode}>Didn't receive a code? Resend code</button>
              </>
            )}
          </div>
        )}

        {step === 6 && (
          <div className={styles.pricePanel}>
            <div className={styles.successMark}>✓</div>
            <span className={styles.stepKicker}>07 Estimated Project Price</span>
            <h2>Your estimated project price</h2>
            <strong className={styles.priceRange}>{priceRange}</strong>
            <p>This is an approximate price range based on the information provided. The final price may vary after review and/or an on-site inspection.</p>

            <div className={styles.customerGrid}>
              {[
                ["firstName", "First Name"],
                ["lastName", "Last Name"],
                ["phone", "Phone"],
                ["address", "Street / Property Address"],
                ["postalCode", "Postal Code"],
                ["city", "City"],
                ["company", "Company"]
              ].map(([key, label]) => (
                <label key={key}>
                  <span>{label}</span>
                  <input value={state.customerInfo[key]} onChange={(event) => updateCustomerInfo(key, event.target.value)} aria-invalid={Boolean(errors[key])} />
                  {errors[key] && <small>{errors[key]}</small>}
                </label>
              ))}
              <label className={styles.checkboxLine}>
                <input type="checkbox" checked={state.customerInfo.propertyManagement} onChange={(event) => updateCustomerInfo("propertyManagement", event.target.checked)} />
                <span>Property Management</span>
              </label>
            </div>

            <div className={styles.summaryPanel}>
              <h3>Your selected project</h3>
              <dl>
                <div>
                  <dt>Property</dt>
                  <dd>{propertyTypes.find((option) => option.id === state.propertyType)?.title || "Not selected"}{state.roomType ? ` · ${state.roomType}` : ""}</dd>
                </div>
                <div>
                  <dt>Components</dt>
                  <dd>{selectedComponentTitles.length ? selectedComponentTitles.join(", ") : "Not selected"}</dd>
                </div>
                <div>
                  <dt>Services</dt>
                  <dd>{selectedServiceTitles.length ? selectedServiceTitles.join(", ") : "Not selected"}</dd>
                </div>
                <div>
                  <dt>Quantities</dt>
                  <dd>{visibleQuantities.map((item) => `${item.label}: ${state.quantities[item.quantityKey] || 0} ${item.unit}`).join(" · ")}</dd>
                </div>
              </dl>
            </div>

            <div className={styles.uploadPanel}>
              <h3>Upload photos of your project</h3>
              <div className={styles.photoGrid}>
                {photoCategories.map((category) => (
                  <label key={category} className={styles.photoDrop}>
                    <span>{category}</span>
                    <small>Take Photo or Choose From Library</small>
                    <input type="file" accept="image/*" capture="environment" onChange={(event) => uploadPhoto(event.target.files?.[0], category)} />
                  </label>
                ))}
              </div>
              {photos.length > 0 && <p className={styles.notice}>{photos.length} photo{photos.length === 1 ? "" : "s"} attached to this project.</p>}
            </div>

            <div className={styles.finalActions}>
              <button className={styles.primaryAction} type="button" onClick={() => submitRequest("OFFER")} disabled={busy}>REQUEST A FREE OFFER</button>
              <button className={styles.secondaryAction} type="button" onClick={() => submitRequest("CONSULTATION")} disabled={busy}>SCHEDULE A CONSULTATION</button>
            </div>
          </div>
        )}

        {step < 4 && (
          <div className={styles.navActions}>
            {step > 0 && <button type="button" className={styles.secondaryAction} onClick={() => setStep((current) => current - 1)}>← BACK</button>}
            <button type="button" className={styles.primaryAction} disabled={!canContinue() || busy} onClick={next}>{step === 3 ? "CALCULATE" : "CONTINUE →"}</button>
          </div>
        )}
      </section>
    </main>
  );
}
