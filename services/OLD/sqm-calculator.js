/*==================================================
    SCROLL REVEAL
==================================================*/

function sqObserve(selector, className = "in-view", threshold = .15) {
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

sqObserve(".sq-reveal");
sqObserve(".sq-mini-card");
sqObserve(".sq-photo-card");

/*==================================================
    CALCULATOR
==================================================*/

(() => {

    const shapeToggle = document.getElementById("sqShapeToggle");
    const shapeIndicator = document.getElementById("sqShapeIndicator");
    const fieldsRect = document.getElementById("sqFieldsRect");
    const fieldsL = document.getElementById("sqFieldsL");

    const lengthInput = document.getElementById("sqLength");
    const widthInput = document.getElementById("sqWidth");
    const lLengthInput = document.getElementById("sqLLength");
    const lWidthInput = document.getElementById("sqLWidth");
    const cutLengthInput = document.getElementById("sqCutLength");
    const cutWidthInput = document.getElementById("sqCutWidth");

    const areaNumEl = document.getElementById("sqAreaNum");
    const unitToggle = document.getElementById("sqUnitToggle");

    const svg = document.getElementById("sqRoomSvg");
    const shapeEl = document.getElementById("sqRoomShape");
    const dimLabelsEl = document.getElementById("sqDimLabels");

    const addRoomBtn = document.getElementById("sqAddRoomBtn");

    if (!shapeToggle || !shapeEl) return;

    /*----- STATE -----*/

    let currentShape = "rect";
    let currentUnit = "m2"; // "m2" | "ft2"
    let currentAreaM2 = 0;
    let currentPts = null;   // for the morph animation
    let animId = null;

    const M2_TO_FT2 = 10.7639;

    /*----- SHAPE TOGGLE -----*/

    function moveShapeIndicator(btn) {
        shapeIndicator.style.width = btn.offsetWidth + "px";
        shapeIndicator.style.transform = `translateX(${btn.offsetLeft - 5}px)`;
    }

    shapeToggle.querySelectorAll(".sq-shape-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            shapeToggle.querySelectorAll(".sq-shape-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            moveShapeIndicator(btn);

            currentShape = btn.dataset.shape;
            fieldsRect.hidden = currentShape !== "rect";
            fieldsL.hidden = currentShape !== "lshape";

            currentPts = null; // force a hard redraw, no morph across shape types
            recalculate();

        });

    });

    window.addEventListener("load", () => moveShapeIndicator(shapeToggle.querySelector(".sq-shape-btn.active")));
    window.addEventListener("resize", () => moveShapeIndicator(shapeToggle.querySelector(".sq-shape-btn.active")));
    requestAnimationFrame(() => moveShapeIndicator(shapeToggle.querySelector(".sq-shape-btn.active")));

    /*----- UNIT TOGGLE -----*/

    unitToggle.querySelectorAll(".sq-unit-btn").forEach(btn => {

        btn.addEventListener("click", () => {
            unitToggle.querySelectorAll(".sq-unit-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentUnit = btn.dataset.unit;
            updateAreaDisplay();
        });

    });

    function formatArea(areaM2) {
        if (currentUnit === "ft2") {
            return (areaM2 * M2_TO_FT2).toFixed(1);
        }
        return areaM2.toFixed(2);
    }

    function updateAreaDisplay() {
        areaNumEl.textContent = formatArea(currentAreaM2);
    }

    /*----- GEOMETRY -----*/

    const VB_W = 400, VB_H = 320;
    const PAD_X = 70, PAD_Y = 50;
    const AVAIL_W = VB_W - PAD_X * 2;
    const AVAIL_H = VB_H - PAD_Y * 2;

    function clamp(n, min, max) {
        return Math.max(min, Math.min(max, n));
    }

    function computeRect(length, width) {

        const scale = clamp(Math.min(AVAIL_W / length, AVAIL_H / width), 6, 55);

        const w = length * scale;
        const h = width * scale;
        const x0 = (VB_W - w) / 2;
        const y0 = (VB_H - h) / 2;
        const x1 = x0 + w;
        const y1 = y0 + h;

        const pts = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
        const area = length * width;

        return { pts, area, box: { x0, y0, x1, y1, scale } };

    }

    function computeLShape(length, width, cutLength, cutWidth) {

        const safeCutL = clamp(cutLength, 0, length - 0.2);
        const safeCutW = clamp(cutWidth, 0, width - 0.2);

        const scale = clamp(Math.min(AVAIL_W / length, AVAIL_H / width), 6, 55);

        const w = length * scale;
        const h = width * scale;
        const x0 = (VB_W - w) / 2;
        const y0 = (VB_H - h) / 2;
        const x1 = x0 + w;
        const y1 = y0 + h;

        const cutX = x1 - safeCutL * scale;
        const cutY = y0 + safeCutW * scale;

        // hexagon, clockwise from bottom-left, cutout removed from top-right
        const pts = [
            [x0, y1],
            [x0, y0],
            [cutX, y0],
            [cutX, cutY],
            [x1, cutY],
            [x1, y1]
        ];

        const area = (length * width) - (safeCutL * safeCutW);

        return { pts, area, box: { x0, y0, x1, y1, cutX, cutY, scale } };

    }

    /*----- DIMENSION LABELS -----*/

    function setDimLabels(html) {
        dimLabelsEl.innerHTML = html;
    }

    function rectLabels(box, length, width) {
        const midX = (box.x0 + box.x1) / 2;
        const midY = (box.y0 + box.y1) / 2;
        return `
            <line class="sq-dim-line" x1="${box.x0}" y1="${box.y0 - 16}" x2="${box.x1}" y2="${box.y0 - 16}"></line>
            <text class="sq-dim-label" x="${midX}" y="${box.y0 - 22}" text-anchor="middle">${length.toFixed(1)} m</text>
            <line class="sq-dim-line" x1="${box.x0 - 16}" y1="${box.y0}" x2="${box.x0 - 16}" y2="${box.y1}"></line>
            <text class="sq-dim-label" x="${box.x0 - 24}" y="${midY}" text-anchor="middle" transform="rotate(-90 ${box.x0 - 24} ${midY})">${width.toFixed(1)} m</text>
        `;
    }

    function lShapeLabels(box, length, width, cutLength, cutWidth) {
        const midX = (box.x0 + box.x1) / 2;
        const midY = (box.y0 + box.y1) / 2;
        return `
            <line class="sq-dim-line" x1="${box.x0}" y1="${box.y0 - 16}" x2="${box.x1}" y2="${box.y0 - 16}"></line>
            <text class="sq-dim-label" x="${midX}" y="${box.y0 - 22}" text-anchor="middle">${length.toFixed(1)} m</text>
            <line class="sq-dim-line" x1="${box.x0 - 16}" y1="${box.y0}" x2="${box.x0 - 16}" y2="${box.y1}"></line>
            <text class="sq-dim-label" x="${box.x0 - 24}" y="${midY}" text-anchor="middle" transform="rotate(-90 ${box.x0 - 24} ${midY})">${width.toFixed(1)} m</text>
            <text class="sq-dim-label" x="${(box.cutX + box.x1) / 2}" y="${box.cutY - 10}" text-anchor="middle" font-size="10">${cutLength.toFixed(1)}×${cutWidth.toFixed(1)} m cut</text>
        `;
    }

    /*----- MORPH ANIMATION -----*/

    function setPolygon(pts) {
        currentPts = pts;
        shapeEl.setAttribute("points", pts.map(p => p.join(",")).join(" "));
    }

    function animateTo(newPts) {

        if (!currentPts || currentPts.length !== newPts.length) {
            setPolygon(newPts);
            return;
        }

        cancelAnimationFrame(animId);

        const startPts = currentPts.map(p => [...p]);
        const duration = 320;
        let startTime = null;

        function frame(ts) {

            if (!startTime) startTime = ts;
            const t = Math.min((ts - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);

            const interp = startPts.map((p, i) => [
                p[0] + (newPts[i][0] - p[0]) * eased,
                p[1] + (newPts[i][1] - p[1]) * eased
            ]);

            shapeEl.setAttribute("points", interp.map(p => p.join(",")).join(" "));
            currentPts = interp;

            if (t < 1) {
                animId = requestAnimationFrame(frame);
            } else {
                setPolygon(newPts);
            }

        }

        animId = requestAnimationFrame(frame);

    }

    /*----- RECALCULATE -----*/

    function recalculate() {

        let result;

        if (currentShape === "rect") {

            const length = Math.max(0.1, parseFloat(lengthInput.value) || 0);
            const width = Math.max(0.1, parseFloat(widthInput.value) || 0);

            result = computeRect(length, width);
            setDimLabels(rectLabels(result.box, length, width));

        } else {

            const length = Math.max(0.5, parseFloat(lLengthInput.value) || 0);
            const width = Math.max(0.5, parseFloat(lWidthInput.value) || 0);
            const cutLength = Math.max(0.1, parseFloat(cutLengthInput.value) || 0);
            const cutWidth = Math.max(0.1, parseFloat(cutWidthInput.value) || 0);

            result = computeLShape(length, width, cutLength, cutWidth);
            setDimLabels(lShapeLabels(result.box, length, width, cutLength, cutWidth));

        }

        animateTo(result.pts);

        currentAreaM2 = Math.max(0, result.area);
        updateAreaDisplay();

    }

    [lengthInput, widthInput, lLengthInput, lWidthInput, cutLengthInput, cutWidthInput].forEach(input => {
        input.addEventListener("input", recalculate);
    });

    /*==================================================
        PROJECT BUILDER
    ==================================================*/

    const projectList = document.getElementById("sqProjectList");
    const projectTotals = document.getElementById("sqProjectTotals");
    const roomCountEl = document.getElementById("sqRoomCount");
    const totalAreaEl = document.getElementById("sqTotalArea");
    const totalPaintEl = document.getElementById("sqTotalPaint");
    const totalDaysEl = document.getElementById("sqTotalDays");

    let rooms = [];
    let roomCounter = 0;

    const RECT_ICON = `<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="6" width="16" height="12" rx="1.5" stroke="currentColor" stroke-width="1.7"/></svg>`;
    const L_ICON = `<svg viewBox="0 0 24 24" fill="none"><path d="M4 4h9v8h7v8H4V4z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`;

    function renderProject() {

        if (!rooms.length) {
            projectList.innerHTML = `<div class="sq-project-empty">No rooms added yet — build one above and add it to your project.</div>`;
            projectTotals.hidden = true;
            roomCountEl.textContent = "0 rooms";
            return;
        }

        projectList.innerHTML = rooms.map(room => `
            <div class="sq-project-row">
                <div class="sq-row-shape-icon">${room.shape === "rect" ? RECT_ICON : L_ICON}</div>
                <div class="sq-row-info">
                    <strong>${room.label}</strong>
                    <span>${room.dimsText}</span>
                </div>
                <div class="sq-row-area">${room.area.toFixed(2)} m²</div>
                <button class="sq-row-remove" data-id="${room.id}" aria-label="Remove room">&times;</button>
            </div>
        `).join("");

        projectList.querySelectorAll(".sq-row-remove").forEach(btn => {
            btn.addEventListener("click", () => {
                rooms = rooms.filter(r => r.id !== btn.dataset.id);
                renderProject();
            });
        });

        const totalArea = rooms.reduce((sum, r) => sum + r.area, 0);
        const paintLiters = Math.ceil((totalArea * 2) / 10); // 2 coats, ~10 m² per litre
        const days = Math.max(1, Math.ceil(totalArea / 35));

        totalAreaEl.textContent = totalArea.toFixed(2) + " m²";
        totalPaintEl.textContent = paintLiters + " L";
        totalDaysEl.textContent = days;

        roomCountEl.textContent = rooms.length + (rooms.length === 1 ? " room" : " rooms");
        projectTotals.hidden = false;

    }

    addRoomBtn.addEventListener("click", () => {

        roomCounter++;

        let dimsText;

        if (currentShape === "rect") {
            dimsText = `${parseFloat(lengthInput.value).toFixed(1)} × ${parseFloat(widthInput.value).toFixed(1)} m`;
        } else {
            dimsText = `${parseFloat(lLengthInput.value).toFixed(1)} × ${parseFloat(lWidthInput.value).toFixed(1)} m, cut ${parseFloat(cutLengthInput.value).toFixed(1)} × ${parseFloat(cutWidthInput.value).toFixed(1)} m`;
        }

        rooms.push({
            id: Date.now() + "-" + Math.random().toString(36).slice(2),
            label: `Room ${roomCounter}`,
            shape: currentShape,
            dimsText,
            area: currentAreaM2
        });

        renderProject();

    });

    /*----- INITIAL RENDER -----*/

    recalculate();
    renderProject();

})();