"use client";

import { useMemo, useState } from "react";
import styles from "./InstantQuoteCalculator.module.css";

const PRICING = {
  ceilingPerSqm: 12,
  wallsPerSqm: 18,
  doorEach: 120,
  doorFrameEach: 60,
  windowSashEach: 90,
  curtainBoardEach: 40,
  radiatorEach: 80
};

const ROOM_TYPES = ["Living room", "Bedroom", "Nursery", "Corridor", "Kitchen", "Wet room"];

function emptyDraft() {
  return {
    type: "Living room",
    size: "",
    items: {
      ceiling: true,
      walls: false,
      doors: false,
      doorCount: 1,
      doorFrameCount: 1,
      windows: false,
      windowSashCount: 1,
      curtainBoardCount: 1,
      radiators: false
    }
  };
}

function money(value) {
  return value.toFixed(2);
}

function positiveNumber(value) {
  return Math.max(0, Number.parseFloat(value) || 0);
}

function positiveInteger(value) {
  return Math.max(0, Number.parseInt(value, 10) || 0);
}

function calculateRoomPrice(room) {
  const size = positiveNumber(room.size);
  const { items } = room;
  let total = 0;

  if (items.ceiling) total += size * PRICING.ceilingPerSqm;
  if (items.walls) total += size * PRICING.wallsPerSqm;

  if (items.doors) {
    total += positiveInteger(items.doorCount) * PRICING.doorEach;
    total += positiveInteger(items.doorFrameCount) * PRICING.doorFrameEach;
  }

  if (items.windows) {
    total += positiveInteger(items.windowSashCount) * PRICING.windowSashEach;
    total += positiveInteger(items.curtainBoardCount) * PRICING.curtainBoardEach;
  }

  if (items.radiators) total += PRICING.radiatorEach;

  return total;
}

function roomSummary(room) {
  const { items } = room;
  const parts = [];

  if (items.ceiling) parts.push("Ceiling");
  if (items.walls) parts.push("Walls");
  if (items.doors) {
    parts.push(`${positiveInteger(items.doorCount)} x door`);
    parts.push(`${positiveInteger(items.doorFrameCount)} x door frame`);
  }
  if (items.windows) {
    parts.push(`${positiveInteger(items.windowSashCount)} x window`);
    parts.push(`${positiveInteger(items.curtainBoardCount)} x curtain board`);
  }
  if (items.radiators) parts.push("Radiator");

  return parts.length ? parts.join(", ") : "No work selected yet";
}

function bilerp(corners, u, v) {
  const [x0, y0] = corners.innerTop;
  const [x1, y1] = corners.outerTop;
  const [x2, y2] = corners.outerBottom;
  const [x3, y3] = corners.innerBottom;

  return [
    (1 - u) * (1 - v) * x0 + u * (1 - v) * x1 + u * v * x2 + (1 - u) * v * x3,
    (1 - u) * (1 - v) * y0 + u * (1 - v) * y1 + u * v * y2 + (1 - u) * v * y3
  ];
}

function pointList(points) {
  return points.map((point) => point.join(",")).join(" ");
}

function rectPoints(corners, u0, u1, v0, v1) {
  return pointList([bilerp(corners, u0, v0), bilerp(corners, u1, v0), bilerp(corners, u1, v1), bilerp(corners, u0, v1)]);
}

function RoomSketch({ items, compact = false }) {
  const width = compact ? 150 : 340;
  const height = compact ? 119 : 270;
  const backTopOuter = [170, 15];
  const backTopInner = [170, 40];
  const lCeilOuter = [20, 55];
  const rCeilOuter = [320, 55];
  const lWallTop = [20, 80];
  const rWallTop = [320, 80];
  const lBottomOuter = [20, 195];
  const rBottomOuter = [320, 195];
  const backBottom = [170, 150];
  const frontBottom = [170, 255];
  const leftWall = { innerTop: backTopInner, outerTop: lWallTop, outerBottom: lBottomOuter, innerBottom: backBottom };
  const rightWall = { innerTop: backTopInner, outerTop: rWallTop, outerBottom: rBottomOuter, innerBottom: backBottom };
  const accent = "#f6be10";
  const ink = "#1f2937";
  const activeFill = "#e7ece2";
  const windowPts = rectPoints(leftWall, 0.14, 0.58, 0.22, 0.68);
  const radiatorPts = rectPoints(leftWall, 0.14, 0.58, 0.72, 0.85);
  const doorPts = rectPoints(rightWall, 0.58, 0.86, 0.2, 0.96);
  const mullionTop = bilerp(leftWall, 0.36, 0.22);
  const mullionBottom = bilerp(leftWall, 0.36, 0.68);
  const knob = bilerp(rightWall, 0.8, 0.55);

  return (
    <svg viewBox="0 0 340 270" width={width} height={height} aria-hidden="true">
      <polygon points={pointList([backBottom, lBottomOuter, frontBottom, rBottomOuter])} fill="#3a3a3a" />
      <polygon points={pointList([backTopOuter, lCeilOuter, lWallTop, backTopInner])} fill={items.ceiling ? activeFill : "#fbfbfb"} stroke={items.ceiling ? accent : ink} strokeWidth={items.ceiling ? 2 : 1} />
      <polygon points={pointList([backTopOuter, rCeilOuter, rWallTop, backTopInner])} fill={items.ceiling ? activeFill : "#f5f5f5"} stroke={items.ceiling ? accent : ink} strokeWidth={items.ceiling ? 2 : 1} />
      <polygon points={pointList([backTopInner, lWallTop, lBottomOuter, backBottom])} fill={items.walls ? activeFill : "#e8e8e8"} stroke={items.walls ? accent : ink} strokeWidth={items.walls ? 2 : 1.5} />
      <polygon points={pointList([backTopInner, rWallTop, rBottomOuter, backBottom])} fill={items.walls ? activeFill : "#f2f2f2"} stroke={items.walls ? accent : ink} strokeWidth={items.walls ? 2 : 1.5} />
      <line x1={backTopInner[0]} y1={backTopInner[1]} x2={backBottom[0]} y2={backBottom[1]} stroke={ink} strokeWidth="1" opacity=".45" />
      <polygon points={windowPts} fill="#fff" stroke={items.windows ? accent : ink} strokeWidth={items.windows ? 2.5 : 1.5} />
      <line x1={mullionTop[0]} y1={mullionTop[1]} x2={mullionBottom[0]} y2={mullionBottom[1]} stroke={items.windows ? accent : ink} strokeWidth="1.2" />
      {items.radiators && <polygon points={radiatorPts} fill="#d1d5db" stroke={accent} strokeWidth="2" />}
      <polygon points={doorPts} fill="#fff" stroke={items.doors ? accent : ink} strokeWidth={items.doors ? 2.5 : 1.5} />
      <circle cx={knob[0]} cy={knob[1]} r="2.5" fill={items.doors ? accent : ink} />
      <polyline points={pointList([backTopOuter, lCeilOuter, lBottomOuter, frontBottom, rBottomOuter, rCeilOuter, backTopOuter])} fill="none" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

function Option({ checked, children, name, type = "checkbox", value, onChange }) {
  return (
    <label className={styles.option}>
      <input checked={checked} name={name} type={type} value={value} onChange={onChange} />
      <span className={styles.optionCheck}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>{children}</span>
    </label>
  );
}

export default function InstantQuoteCalculator() {
  const [rooms, setRooms] = useState([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const draftTotal = modalOpen ? calculateRoomPrice(draft) : 0;
  const grandTotal = useMemo(() => rooms.reduce((sum, room) => sum + calculateRoomPrice(room), 0) + draftTotal, [rooms, draftTotal]);
  const canContinue = positiveNumber(draft.size) > 0;
  const canBook = rooms.length > 0;

  function openAdd() {
    setDraft(emptyDraft());
    setEditingId(null);
    setModalStep(1);
    setModalOpen(true);
  }

  function openEdit(room) {
    setDraft(JSON.parse(JSON.stringify(room)));
    setEditingId(room.id);
    setModalStep(1);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function updateItem(key, value) {
    setDraft((current) => ({ ...current, items: { ...current.items, [key]: value } }));
  }

  function saveDraft() {
    if (!canContinue) return;

    if (editingId) {
      setRooms((current) => current.map((room) => (room.id === editingId ? { ...draft, id: editingId } : room)));
    } else {
      setRooms((current) => [...current, { ...draft, id: crypto.randomUUID() }]);
    }

    closeModal();
  }

  function removeRoom(roomId) {
    setRooms((current) => current.filter((room) => room.id !== roomId));
  }

  function bookInspection() {
    if (!canBook) return;
    setSuccessOpen(true);
  }

  return (
    <section className={styles.section} id="instant-quote-calculator">
      <video className={styles.bgVideo} autoPlay muted loop playsInline preload="metadata">
        <source src="/assets/bg-video.mp4" type="video/mp4" />
      </video>

      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.heading}>
            <span>AI QUOTATION CALCULATOR</span>
            <h2>
              Instant Price
              <em>Calculator</em>
            </h2>
          </div>

          <p className={styles.sideCopy}>
            Customize your project, choose materials and finishes, and receive an instant estimated price, duration and
            recommended package before booking an inspection.
          </p>
        </div>

        <div className={styles.workspace}>
          <div className={styles.roomsPanel}>
            <div className={styles.roomsList}>
              {rooms.length === 0 ? (
                <div className={styles.empty}>No rooms added yet - click "Add Space" to start your quote.</div>
              ) : (
                rooms.map((room) => (
                  <article className={styles.roomRow} key={room.id}>
                    <div className={styles.roomSketch}>
                      <RoomSketch items={room.items} compact />
                    </div>
                    <div className={styles.roomInfo}>
                      <h3>
                        {room.type} <span>{room.size} m²</span>
                      </h3>
                      <p>{roomSummary(room)}</p>
                    </div>
                    <div className={styles.rowActions}>
                      <button type="button" onClick={() => openEdit(room)} aria-label={`Edit ${room.type}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button type="button" onClick={() => removeRoom(room.id)} aria-label={`Remove ${room.type}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                    <strong className={styles.roomPrice}>CHF {money(calculateRoomPrice(room))}</strong>
                  </article>
                ))
              )}
            </div>

            <button className={styles.addButton} type="button" onClick={openAdd}>
              Add Space
              <span>+</span>
            </button>
          </div>

          <aside className={styles.estimateCard}>
            <span className={styles.estimateTag}>LIVE ESTIMATE</span>
            <div className={styles.estimateItem}>
              <small>Estimated Price</small>
              <h3>
                CHF <span>{money(grandTotal)}</span>
              </h3>
            </div>
            <div className={styles.estimateItem}>
              <small>Rooms Added</small>
              <h4>{rooms.length} Rooms</h4>
            </div>

            <div className={styles.summary}>
              <h5>Included Work</h5>
              <ul>
                {rooms.length === 0 ? (
                  <li>No rooms added yet</li>
                ) : (
                  rooms.map((room) => (
                    <li key={room.id}>
                      {room.type} - {roomSummary(room)} - CHF {money(calculateRoomPrice(room))}
                    </li>
                  ))
                )}
              </ul>
            </div>

            <button className={styles.quoteButton} type="button" onClick={bookInspection} disabled={!canBook}>
              Book Free Inspection
            </button>
          </aside>
        </div>
      </div>

      {modalOpen && (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="quote-modal-title">
          <div className={styles.modalInner}>
            <button className={styles.modalClose} type="button" onClick={closeModal} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {modalStep === 1 ? (
              <>
                <span className={styles.modalTag}>Step 1 / 2 - The space</span>
                <h3 className={styles.modalTitle} id="quote-modal-title">Tell us about the room</h3>
                <p className={styles.modalSub}>Room type and size are used to calculate ceiling and wall coverage.</p>

                <div className={styles.stepGrid}>
                  <div className={styles.fieldGroup}>
                    <span className={styles.groupLabel}>Room type</span>
                    <div className={styles.radioGrid}>
                      {ROOM_TYPES.map((type) => (
                        <Option
                          checked={draft.type === type}
                          key={type}
                          name="roomType"
                          type="radio"
                          value={type}
                          onChange={() => setDraft((current) => ({ ...current, type }))}
                        >
                          {type}
                        </Option>
                      ))}
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <span className={styles.groupLabel}>Room size (m²)</span>
                    <input
                      className={styles.sizeInput}
                      min="0"
                      inputMode="decimal"
                      type="number"
                      placeholder="e.g. 24"
                      value={draft.size}
                      onChange={(event) => setDraft((current) => ({ ...current, size: event.target.value }))}
                    />
                  </div>
                </div>

                <div className={styles.stepActions}>
                  <button className={styles.primaryButton} type="button" disabled={!canContinue} onClick={() => setModalStep(2)}>
                    Continue
                  </button>
                </div>
              </>
            ) : (
              <>
                <button className={styles.backButton} type="button" onClick={() => setModalStep(1)}>
                  &larr; Back
                </button>
                <span className={styles.modalTag}>Step 2 / 2 - The work</span>
                <h3 className={styles.modalTitle} id="quote-modal-title">What needs painting?</h3>

                <div className={styles.stepTwoGrid}>
                  <div className={styles.checklist}>
                    <div className={styles.checkGroup}>
                      <span className={styles.groupLabel}>Ceiling / Walls</span>
                      <div className={styles.checkGrid}>
                        <Option checked={draft.items.ceiling} onChange={(event) => updateItem("ceiling", event.target.checked)}>Painting the ceiling</Option>
                        <Option checked={draft.items.walls} onChange={(event) => updateItem("walls", event.target.checked)}>Painting walls</Option>
                      </div>
                    </div>

                    <div className={styles.checkGroup}>
                      <span className={styles.groupLabel}>Woodworking</span>
                      <div className={styles.checkGrid}>
                        <Option checked={draft.items.doors} onChange={(event) => updateItem("doors", event.target.checked)}>Painting doors</Option>
                        <Option checked={draft.items.windows} onChange={(event) => updateItem("windows", event.target.checked)}>Painting windows</Option>
                      </div>

                      {draft.items.doors && (
                        <div className={styles.subfields}>
                          <NumberField label="Number of doors" value={draft.items.doorCount} onChange={(value) => updateItem("doorCount", value)} />
                          <NumberField label="Number of door frames" value={draft.items.doorFrameCount} onChange={(value) => updateItem("doorFrameCount", value)} />
                        </div>
                      )}

                      {draft.items.windows && (
                        <div className={styles.subfields}>
                          <NumberField label="Number of window sashes" value={draft.items.windowSashCount} onChange={(value) => updateItem("windowSashCount", value)} />
                          <NumberField label="Number of curtain boards" value={draft.items.curtainBoardCount} onChange={(value) => updateItem("curtainBoardCount", value)} />
                        </div>
                      )}
                    </div>

                    <div className={styles.checkGroup}>
                      <span className={styles.groupLabel}>Metal</span>
                      <div className={styles.checkGrid}>
                        <Option checked={draft.items.radiators} onChange={(event) => updateItem("radiators", event.target.checked)}>Painting radiators</Option>
                      </div>
                    </div>
                  </div>

                  <div className={styles.illustrationCol}>
                    <div className={styles.illustrationCard}>
                      <RoomSketch items={draft.items} />
                    </div>
                    <button className={styles.quoteButton} type="button" onClick={saveDraft}>
                      {editingId ? "Save changes" : "Add to offer"}
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className={styles.stickyBar}>
              <span>Total (excl. VAT)</span>
              <strong>CHF {money(grandTotal)}</strong>
            </div>
          </div>
        </div>
      )}

      {successOpen && (
        <div className={styles.successModal} role="dialog" aria-modal="true" aria-labelledby="quote-success-title">
          <div className={styles.successInner}>
            <button className={styles.modalClose} type="button" onClick={() => setSuccessOpen(false)} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className={styles.successBadge}>
              <span></span>
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" />
                <path d="M30 52 L44 66 L72 36" />
              </svg>
            </div>
            <h3 id="quote-success-title">Request Received!</h3>
            <p>Thanks - your free inspection request is ready. Our team will reach out within 24 hours to confirm a time that works for you.</p>
            <button className={styles.primaryButton} type="button" onClick={() => setSuccessOpen(false)}>Done</button>
          </div>
        </div>
      )}
    </section>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <label className={styles.subfieldRow}>
      <span>{label}</span>
      <input min="0" type="number" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
