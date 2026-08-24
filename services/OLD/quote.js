/*==================================================
    NEW: SCROLL REVEAL
==================================================*/

function qcObserve(selector, className = "in-view", threshold = .15) {
    document.querySelectorAll(selector).forEach(el => {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(className);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold });
        io.observe(el);
    });
}

qcObserve(".qc-reveal");
qcObserve(".qc-factor-grid");

/*==================================================
    NEW: LIVE RECEIPT HERO ANIMATION
==================================================*/

(() => {

    const linesHost = document.getElementById("qcReceiptLines");
    const totalEl = document.getElementById("qcReceiptTotal");

    if (!linesHost) return;

    const RECEIPT_ITEMS = [
        { label: "Living Room — Walls", price: 324 },
        { label: "Living Room — Ceiling", price: 216 },
        { label: "Bedroom — Doors x2", price: 240 },
        { label: "Premium Material +35%", price: 273 },
        { label: "Final Cleaning +8%", price: 84 }
    ];

    function fmt(n) {
        return "CHF " + n.toFixed(2);
    }

    function playReceipt() {

        linesHost.innerHTML = "";
        totalEl.textContent = fmt(0);

        let running = 0;

        RECEIPT_ITEMS.forEach((item, i) => {

            setTimeout(() => {

                const row = document.createElement("div");
                row.className = "qc-receipt-line";
                row.style.animationDelay = "0s";
                row.innerHTML = `<span>${item.label}</span><span>${fmt(item.price)}</span>`;
                linesHost.appendChild(row);

                running += item.price;
                totalEl.textContent = fmt(running);

            }, i * 650);

        });

        // Restart the loop after the last line plays + a pause
        setTimeout(playReceipt, RECEIPT_ITEMS.length * 650 + 2600);

    }

    playReceipt();

})();

/*==================================================
    NEW: FAQ ACCORDION
==================================================*/

document.querySelectorAll(".qc-faq-trigger").forEach(trigger => {

    trigger.addEventListener("click", () => {

        const item = trigger.closest(".qc-faq-item");
        const wasActive = item.classList.contains("active");

        document.querySelectorAll(".qc-faq-item").forEach(i => i.classList.remove("active"));

        if (!wasActive) item.classList.add("active");

    });

});


/*====================================================================
    THE CALCULATOR — original logic, unchanged
====================================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const section = document.querySelector(".quote-section");
    if (!section) return;

    const PRICING = {
        ceilingPerSqm: 12,
        wallsPerSqm: 18,
        doorEach: 120,
        doorFrameEach: 60,
        windowSashEach: 90,
        curtainBoardEach: 40,
        radiatorEach: 80,
        materialMultiplier: { standard: 1, premium: 1.35 },
        addonExpressPercent: 0.20,
        addonCleaningPercent: 0.08
    };

    const MATERIAL_CLASSES = [
        { value: "standard", label: "Standard · 5-yr warranty" },
        { value: "premium", label: "Premium +35% · 12-yr warranty" }
    ];

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
                radiators: false,
                materialClass: "standard",
                addonExpress: false,
                addonCleaning: false
            }
        };
    }

    function calcPrice(room) {

        const size = parseFloat(room.size) || 0;
        const it = room.items;
        let total = 0;

        if (it.ceiling) total += size * PRICING.ceilingPerSqm;
        if (it.walls) total += size * PRICING.wallsPerSqm;

        if (it.doors) {
            total += (parseInt(it.doorCount) || 0) * PRICING.doorEach;
            total += (parseInt(it.doorFrameCount) || 0) * PRICING.doorFrameEach;
        }

        if (it.windows) {
            total += (parseInt(it.windowSashCount) || 0) * PRICING.windowSashEach;
            total += (parseInt(it.curtainBoardCount) || 0) * PRICING.curtainBoardEach;
        }

        if (it.radiators) total += PRICING.radiatorEach;

        const rawTotal = total;
        const multiplier = PRICING.materialMultiplier[it.materialClass] || 1;
        total = rawTotal * multiplier;

        if (it.addonExpress) total += rawTotal * PRICING.addonExpressPercent;
        if (it.addonCleaning) total += rawTotal * PRICING.addonCleaningPercent;

        return total;

    }

    function summaryFor(room) {

        const it = room.items;
        const parts = [];

        if (it.ceiling) parts.push("Ceiling");
        if (it.walls) parts.push("Walls");

        if (it.doors) {
            parts.push(`${parseInt(it.doorCount) || 0} x door`);
            parts.push(`${parseInt(it.doorFrameCount) || 0} x door frame`);
        }

        if (it.windows) {
            parts.push(`${parseInt(it.windowSashCount) || 0} x window`);
            parts.push(`${parseInt(it.curtainBoardCount) || 0} x curtain board`);
        }

        if (it.radiators) parts.push("Radiator");
        if (it.materialClass === "premium") parts.push("Premium materials");
        if (it.addonExpress) parts.push("Express 24h");
        if (it.addonCleaning) parts.push("Final cleaning");

        return parts.length ? parts.join(", ") : "No work selected yet";

    }

    function fmt(n) { return n.toFixed(2); }

    function bilerp(c, u, v) {
        const [x0, y0] = c.innerTop;
        const [x1, y1] = c.outerTop;
        const [x2, y2] = c.outerBottom;
        const [x3, y3] = c.innerBottom;
        const x = (1 - u) * (1 - v) * x0 + u * (1 - v) * x1 + u * v * x2 + (1 - u) * v * x3;
        const y = (1 - u) * (1 - v) * y0 + u * (1 - v) * y1 + u * v * y2 + (1 - u) * v * y3;
        return [x, y];
    }

    function rectPoints(c, u0, u1, v0, v1) {
        return [bilerp(c, u0, v0), bilerp(c, u1, v0), bilerp(c, u1, v1), bilerp(c, u0, v1)]
            .map(p => p.join(",")).join(" ");
    }

    function poly(points) { return points.map(p => p.join(",")).join(" "); }

    function buildRoomSVG(items, sizeKey) {

        const dims = sizeKey === "large" ? { w: 340, h: 270 } : { w: 150, h: 119 };

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

        const leftWallCorners = { innerTop: backTopInner, outerTop: lWallTop, outerBottom: lBottomOuter, innerBottom: backBottom };
        const rightWallCorners = { innerTop: backTopInner, outerTop: rWallTop, outerBottom: rBottomOuter, innerBottom: backBottom };

        const ceilingOn = !!items.ceiling;
        const wallsOn = !!items.walls;
        const doorOn = !!items.doors;
        const windowOn = !!items.windows;
        const radiatorOn = !!items.radiators;

        const ACTIVE_FILL = "#E7ECE2";
        const ACTIVE_STROKE = "#ffc400ff";
        const INK = "#1f2937";

        const windowPts = rectPoints(leftWallCorners, 0.14, 0.58, 0.22, 0.68);
        const radiatorPts = rectPoints(leftWallCorners, 0.14, 0.58, 0.72, 0.85);
        const doorPts = rectPoints(rightWallCorners, 0.58, 0.86, 0.2, 0.96);
        const mullionTop = bilerp(leftWallCorners, 0.36, 0.22);
        const mullionBottom = bilerp(leftWallCorners, 0.36, 0.68);
        const knob = bilerp(rightWallCorners, 0.8, 0.55);

        return `
            <svg viewBox="0 0 340 270" width="${dims.w}" height="${dims.h}">
                <polygon points="${poly([backBottom, lBottomOuter, frontBottom, rBottomOuter])}" fill="#3a3a3a" />

                <polygon points="${poly([backTopOuter, lCeilOuter, lWallTop, backTopInner])}"
                    fill="${ceilingOn ? ACTIVE_FILL : "#fbfbfb"}"
                    stroke="${ceilingOn ? ACTIVE_STROKE : INK}"
                    stroke-width="${ceilingOn ? 2 : 1}" />
                <polygon points="${poly([backTopOuter, rCeilOuter, rWallTop, backTopInner])}"
                    fill="${ceilingOn ? ACTIVE_FILL : "#f5f5f5"}"
                    stroke="${ceilingOn ? ACTIVE_STROKE : INK}"
                    stroke-width="${ceilingOn ? 2 : 1}" />

                <polygon points="${poly([backTopInner, lWallTop, lBottomOuter, backBottom])}"
                    fill="${wallsOn ? ACTIVE_FILL : "#e8e8e8"}"
                    stroke="${wallsOn ? ACTIVE_STROKE : INK}"
                    stroke-width="${wallsOn ? 2 : 1.5}" />
                <polygon points="${poly([backTopInner, rWallTop, rBottomOuter, backBottom])}"
                    fill="${wallsOn ? ACTIVE_FILL : "#f2f2f2"}"
                    stroke="${wallsOn ? ACTIVE_STROKE : INK}"
                    stroke-width="${wallsOn ? 2 : 1.5}" />

                <line x1="${backTopInner[0]}" y1="${backTopInner[1]}" x2="${backBottom[0]}" y2="${backBottom[1]}"
                    stroke="${INK}" stroke-width="1" opacity="0.45" />

                <polygon points="${windowPts}" fill="#ffffff"
                    stroke="${windowOn ? ACTIVE_STROKE : INK}" stroke-width="${windowOn ? 2.5 : 1.5}" />
                <line x1="${mullionTop[0]}" y1="${mullionTop[1]}" x2="${mullionBottom[0]}" y2="${mullionBottom[1]}"
                    stroke="${windowOn ? ACTIVE_STROKE : INK}" stroke-width="1.2" />

                ${radiatorOn ? `<polygon points="${radiatorPts}" fill="#d1d5db" stroke="${ACTIVE_STROKE}" stroke-width="2" />` : ""}

                <polygon points="${doorPts}" fill="#ffffff"
                    stroke="${doorOn ? ACTIVE_STROKE : INK}" stroke-width="${doorOn ? 2.5 : 1.5}" />
                <circle cx="${knob[0]}" cy="${knob[1]}" r="2.5" fill="${doorOn ? ACTIVE_STROKE : INK}" />

                <polyline points="${poly([backTopOuter, lCeilOuter, lBottomOuter, frontBottom, rBottomOuter, rCeilOuter, backTopOuter])}"
                    fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round" />

                <line x1="${backTopInner[0] + 20}" y1="${backTopInner[1] + 5}" x2="${backTopInner[0] + 20}" y2="95"
                    stroke="${INK}" stroke-width="1.5" />
                <path d="M${backTopInner[0] + 8},95 L${backTopInner[0] + 32},95 L${backTopInner[0] + 27},108 L${backTopInner[0] + 13},108 Z"
                    fill="${INK}" />
            </svg>
        `;

    }

    const editIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const xIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
    const checkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    let rooms = [];
    let modalOpen = false;
    let modalStep = 1;
    let editingId = null;
    let draft = emptyDraft();

    const roomsListEl = document.getElementById("roomsList");
    const addSpaceBtn = document.getElementById("addSpaceBtn");
    const estimatedPriceEl = document.getElementById("estimatedPrice");
    const estimatedRoomsEl = document.getElementById("estimatedRooms");
    const summaryListEl = document.getElementById("summaryList");
    const modalEl = document.getElementById("quoteModal");
    const modalBodyEl = document.getElementById("modalBody");
    const modalCloseBtn = document.getElementById("modalClose");
    const modalTotalValueEl = document.getElementById("modalTotalValue");

    if (!roomsListEl || !modalEl) return;

    function grandTotal() {
        let sum = rooms.reduce((s, r) => s + calcPrice(r), 0);
        if (modalOpen) sum += calcPrice(draft);
        return sum;
    }

    function renderRoomsList() {

        if (!rooms.length) {
            roomsListEl.innerHTML = `<div class="rooms-empty">No rooms added yet — click "Add Space" to start your quote.</div>`;
            return;
        }

        roomsListEl.innerHTML = rooms.map(room => `
            <div class="room-row" data-id="${room.id}">
                <div class="room-row-illustration">${buildRoomSVG(room.items, "small")}</div>
                <div class="room-row-info">
                    <div class="room-row-title">${room.type} <span class="room-row-size">${room.size} m&sup2;</span></div>
                    <div class="room-row-summary">${summaryFor(room)}</div>
                </div>
                <div class="room-row-actions">
                    <button class="room-action-btn edit-room-btn" data-id="${room.id}" aria-label="Edit room">${editIcon}</button>
                    <button class="room-action-btn delete-room-btn" data-id="${room.id}" aria-label="Remove room">${xIcon}</button>
                </div>
                <div class="room-row-price">CHF ${fmt(calcPrice(room))}</div>
            </div>
        `).join("");

        roomsListEl.querySelectorAll(".edit-room-btn").forEach(btn => {
            btn.addEventListener("click", () => openEdit(btn.dataset.id));
        });

        roomsListEl.querySelectorAll(".delete-room-btn").forEach(btn => {
            btn.addEventListener("click", () => removeRoom(btn.dataset.id));
        });

    }

    function renderEstimate() {

        estimatedPriceEl.textContent = fmt(grandTotal());
        estimatedRoomsEl.textContent = rooms.length;

        if (!rooms.length) {
            summaryListEl.innerHTML = `<li>No rooms added yet</li>`;
        } else {
            summaryListEl.innerHTML = rooms.map(room =>
                `<li>${room.type} — ${summaryFor(room)} — CHF ${fmt(calcPrice(room))}</li>`
            ).join("");
        }

    }

    function renderAll() {
        renderRoomsList();
        renderEstimate();
        if (modalOpen) renderModal();
    }

    function openAdd() {
        draft = emptyDraft();
        editingId = null;
        modalStep = 1;
        openModal();
    }

    function openEdit(id) {
        const room = rooms.find(r => String(r.id) === String(id));
        if (!room) return;
        draft = JSON.parse(JSON.stringify(room));
        editingId = id;
        modalStep = 1;
        openModal();
    }

    function openModal() {
        modalOpen = true;
        modalEl.classList.add("open");
        document.body.style.overflow = "hidden";
        renderModal();
    }

    function closeModal() {
        modalOpen = false;
        modalEl.classList.remove("open");
        document.body.style.overflow = "";
        renderEstimate();
    }

    function goFurther() {
        if (!draft.size || parseFloat(draft.size) <= 0) return;
        modalStep = 2;
        renderModal();
    }

    function goBack() {
        modalStep = 1;
        renderModal();
    }

    function saveDraft() {

        if (editingId) {
            rooms = rooms.map(r => String(r.id) === String(editingId) ? { ...draft, id: editingId } : r);
        } else {
            rooms = [...rooms, { ...draft, id: Date.now() + "-" + Math.random().toString(36).slice(2) }];
        }

        closeModal();
        renderAll();

    }

    function removeRoom(id) {
        rooms = rooms.filter(r => String(r.id) !== String(id));
        renderAll();
    }

    function updateDraftField(key, value) {
        draft = { ...draft, [key]: value };
        renderModal();
    }

    function updateItem(key, value) {
        draft = { ...draft, items: { ...draft.items, [key]: value } };
        renderModal();
    }

    function renderModal() {

        modalTotalValueEl.textContent = fmt(grandTotal());
        modalBodyEl.innerHTML = modalStep === 1 ? step1HTML() : step2HTML();

        if (modalStep === 1) bindStep1();
        else bindStep2();

    }

    function step1HTML() {

        const canContinue = draft.size && parseFloat(draft.size) > 0;

        return `
            <span class="section-tag">Step 1 / 2 — The space</span>
            <h3 class="quote-modal-title">Tell us about the room</h3>
            <p class="quote-modal-sub">Room type and size are used to calculate ceiling and wall coverage.</p>

            <div class="quote-step-grid">

                <div class="quote-field-group">
                    <span class="quote-group-label">Room type</span>
                    <div class="option-grid quote-radio-grid">
                        ${ROOM_TYPES.map(t => `
                            <label class="option">
                                <input type="radio" name="roomType" value="${t}" ${draft.type === t ? "checked" : ""}>
                                <span class="option-check">${checkIcon}</span>
                                <span>${t}</span>
                            </label>
                        `).join("")}
                    </div>
                </div>

                <div class="quote-field-group">
                    <span class="quote-group-label">Room size (m&sup2;)</span>
                    <input type="number" min="0" id="draftSizeInput" class="quote-size-input" placeholder="e.g. 24" value="${draft.size}">
                </div>

            </div>

            <div class="quote-step-actions">
                <button class="quote-btn-primary" id="goFurtherBtn" ${canContinue ? "" : "disabled"}>Continue</button>
            </div>
        `;

    }

    function bindStep1() {

        modalBodyEl.querySelectorAll('input[name="roomType"]').forEach(input => {
            input.addEventListener("change", () => updateDraftField("type", input.value));
        });

        const sizeInput = document.getElementById("draftSizeInput");
        sizeInput.addEventListener("input", () => updateDraftField("size", sizeInput.value));

        document.getElementById("goFurtherBtn").addEventListener("click", goFurther);

    }

    function optionRow(key, label, checked) {
        return `
            <label class="option">
                <input type="checkbox" data-key="${key}" ${checked ? "checked" : ""}>
                <span class="option-check">${checkIcon}</span>
                <span>${label}</span>
            </label>
        `;
    }

    function subfieldRow(key, label, value) {
        return `
            <div class="quote-subfield-row">
                <span>${label}</span>
                <input type="number" min="0" class="quote-number-input" data-key="${key}" value="${value}">
            </div>
        `;
    }

    function materialPill(cls, checked) {
        return `
            <label class="quote-pill">
                <input type="radio" name="materialClass" value="${cls.value}" ${checked ? "checked" : ""}>
                <span>${cls.label}</span>
            </label>
        `;
    }

    function addonPill(key, label, checked) {
        return `
            <label class="quote-pill">
                <input type="checkbox" data-key="${key}" ${checked ? "checked" : ""}>
                <span>${label}</span>
            </label>
        `;
    }

    function step2HTML() {

        const it = draft.items;

        return `
            <button class="quote-back-btn" id="modalBackBtn">&larr; Back</button>
            <span class="section-tag">Step 2 / 2 — The work</span>
            <h3 class="quote-modal-title">What needs painting?</h3>

            <div class="quote-step2-grid">

                <div class="quote-checklist">

                    <div class="quote-check-group">
                        <div class="quote-group-label">Ceiling / Walls</div>
                        <div class="option-grid quote-check-grid">
                            ${optionRow("ceiling", "Painting the ceiling", it.ceiling)}
                            ${optionRow("walls", "Painting walls", it.walls)}
                        </div>
                    </div>

                    <div class="quote-check-group">
                        <div class="quote-group-label">Woodworking</div>
                        <div class="option-grid quote-check-grid">
                            ${optionRow("doors", "Painting doors", it.doors)}
                            ${optionRow("windows", "Painting windows", it.windows)}
                        </div>
                        ${it.doors ? `
                            <div class="quote-subfield-box">
                                ${subfieldRow("doorCount", "Number of doors", it.doorCount)}
                                ${subfieldRow("doorFrameCount", "Number of door frames", it.doorFrameCount)}
                            </div>
                        ` : ""}
                        ${it.windows ? `
                            <div class="quote-subfield-box">
                                ${subfieldRow("windowSashCount", "Number of window sashes", it.windowSashCount)}
                                ${subfieldRow("curtainBoardCount", "Number of curtain boards", it.curtainBoardCount)}
                            </div>
                        ` : ""}
                    </div>

                    <div class="quote-check-group">
                        <div class="quote-group-label">Metal</div>
                        <div class="option-grid quote-check-grid">
                            ${optionRow("radiators", "Painting radiators", it.radiators)}
                        </div>
                    </div>

                    <div class="quote-check-group">
                        <div class="quote-group-label">Material Class</div>
                        <div class="quote-pill-group">
                            ${MATERIAL_CLASSES.map(cls => materialPill(cls, it.materialClass === cls.value)).join("")}
                        </div>
                    </div>

                    <div class="quote-check-group">
                        <div class="quote-group-label">Add-Ons</div>
                        <div class="quote-pill-group">
                            ${addonPill("addonExpress", "Express 24h +20%", it.addonExpress)}
                            ${addonPill("addonCleaning", "Final cleaning +8%", it.addonCleaning)}
                        </div>
                    </div>

                </div>

                <div class="quote-illustration-col">
                    <div class="quote-illustration-card">${buildRoomSVG(it, "large")}</div>
                    <button class="quote-btn quote-save-btn" id="saveDraftBtn">${editingId ? "Save changes" : "Add to offer"}</button>
                </div>

            </div>
        `;

    }

    function bindStep2() {

        document.getElementById("modalBackBtn").addEventListener("click", goBack);
        document.getElementById("saveDraftBtn").addEventListener("click", saveDraft);

        modalBodyEl.querySelectorAll(".quote-checklist input[type='checkbox']").forEach(input => {
            input.addEventListener("change", () => updateItem(input.dataset.key, input.checked));
        });

        modalBodyEl.querySelectorAll('input[name="materialClass"]').forEach(input => {
            input.addEventListener("change", () => updateItem("materialClass", input.value));
        });

        modalBodyEl.querySelectorAll(".quote-number-input").forEach(input => {
            input.addEventListener("input", () => updateItem(input.dataset.key, input.value));
        });

    }

    addSpaceBtn.addEventListener("click", openAdd);
    modalCloseBtn.addEventListener("click", closeModal);

    modalEl.addEventListener("click", (e) => {
        if (e.target === modalEl) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalOpen) closeModal();
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                section.classList.add("show");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: .18 });

    revealObserver.observe(section);

    renderAll();

});

// SUCCESS MODAL

document.addEventListener("DOMContentLoaded", () => {

    const bookBtn = document.getElementById("bookInspectionBtn");
    const successModal = document.getElementById("successModal");
    const successClose = document.getElementById("successModalClose");
    const successDone = document.getElementById("successDoneBtn");
    const particlesHost = document.getElementById("successParticles");

    if (!bookBtn || !successModal) return;

    const PARTICLE_COLORS = ["#A6B09A", "#ffffff", "#D8CCB4", "#8D98A4"];

    function spawnParticles(count = 14) {

        particlesHost.innerHTML = "";

        for (let i = 0; i < count; i++) {

            const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
            const distance = 60 + Math.random() * 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            const dot = document.createElement("span");
            dot.className = "success-particle";
            dot.style.setProperty("--tx", `${tx}px`);
            dot.style.setProperty("--ty", `${ty}px`);
            dot.style.setProperty("--size", `${4 + Math.random() * 5}px`);
            dot.style.setProperty("--delay", `${0.15 + Math.random() * 0.25}s`);
            dot.style.setProperty("--color", PARTICLE_COLORS[i % PARTICLE_COLORS.length]);

            particlesHost.appendChild(dot);

        }

    }

    function openSuccess() {

        successModal.classList.remove("open");
        spawnParticles();

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                successModal.classList.add("open");
            });
        });

        document.body.style.overflow = "hidden";

    }

    function closeSuccess() {
        successModal.classList.remove("open");
        document.body.style.overflow = "";
    }

    bookBtn.addEventListener("click", (e) => {

        e.preventDefault();

        // ------------------------------------------------------------
        // HOOK YOUR BACKEND CALL HERE.
        //   fetch("/api/quotes", {
        //       method: "POST",
        //       headers: { "Content-Type": "application/json" },
        //       body: JSON.stringify({ rooms, total: grandTotal() })
        //   })
        //   .then(res => res.json())
        //   .then(() => openSuccess())
        //   .catch(err => { /* show an error state instead */ });
        // ------------------------------------------------------------

        openSuccess();

    });

    successClose.addEventListener("click", closeSuccess);
    successDone.addEventListener("click", closeSuccess);

    successModal.addEventListener("click", (e) => {
        if (e.target === successModal) closeSuccess();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && successModal.classList.contains("open")) closeSuccess();
    });

}); Ï