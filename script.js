gsap.registerPlugin(ScrollTrigger);

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

const video = document.getElementById("heroVideo");
const colors = document.querySelectorAll(".color");

const intro = document.querySelector(".intro-title");
const header = document.querySelector(".hero-header");
const content = document.querySelector(".hero-content");
const glow = document.querySelector(".content-glow");

let swapped = false;

let iconsVisible = false;

colors.forEach(btn => {

    btn.onclick = () => {

        document
            .querySelector(".color.active")
            ?.classList.remove("active");

        btn.classList.add("active");

        const color = btn.dataset.color;

        paintWall("front-wall", color);
        paintWall("left-wall", color);
        paintWall("right-wall", color);
        paintWall("ceiling", color);

    };

});

let videoReady = false;

/*----------------------------------------------------
MOBILE NAV — ANIMATED REVEAL
----------------------------------------------------*/

const hamburger = document.querySelector(".hamburger");
const heroNav = document.querySelector(".hero-nav");
const navLinks = gsap.utils.toArray(".hero-nav a");

let navOpen = false;

const navTl = gsap.timeline({ paused: true })

    .to(heroNav, {
        clipPath: "circle(150% at calc(100% - 46px) 42px)",
        duration: 0.9,
        ease: "power4.inOut"
    })

    .to(navLinks, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.out"
    }, "-=0.45");

hamburger?.addEventListener("click", () => {

    navOpen = !navOpen;

    hamburger.classList.toggle("active", navOpen);
    heroNav.classList.toggle("open", navOpen);
    hamburger.setAttribute("aria-expanded", navOpen);

    if (navOpen) {
        navTl.play();
    } else {
        navTl.reverse();
    }

});

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navOpen = false;
        hamburger.classList.remove("active");
        heroNav.classList.remove("open");
        hamburger.setAttribute("aria-expanded", false);
        navTl.reverse();

    });

});

// Prime the video (needed for iOS to render the first frame) —
// purely cosmetic, does NOT gate the ScrollTrigger anymore.
video.addEventListener("loadedmetadata", () => {

    video.play().then(() => {
        video.pause();
        video.currentTime = 0;
        videoReady = true;
    });

});

// Hero ScrollTrigger now created IMMEDIATELY, synchronously,
// on initial script execution — before .why's triggers run.
// This guarantees the pin-spacer exists and the document height
// is correct BEFORE anything below it measures the page.
ScrollTrigger.create({

    trigger: ".hero",
    start: "top top",
    end: "+=3500",
    scrub: 1,
    pin: true,
    anticipatePin: 1,

    onUpdate(self) {

        const p = self.progress;

        //-----------------------------------
        // VIDEO — only scrub once it's actually ready
        //-----------------------------------

        if (videoReady) {

            const videoProgress = Math.min(p / 0.80, 1);
            video.currentTime = video.duration * videoProgress;

        }

        //-----------------------------------
        // INTRO
        //-----------------------------------

        gsap.set(intro, {
            y: -140 * Math.min(p / .20, 1),
            opacity: 1 - Math.min(p / .18, 1),
            scale: 1 + .08 * Math.min(p / .18, 1)
        });

        //-----------------------------------
        // HEADER
        //-----------------------------------

        const hp = (p - .12) / .10;

        gsap.set(header, {
            opacity: gsap.utils.clamp(0, 1, hp),
            y: -80 + (80 * gsap.utils.clamp(0, 1, hp))
        });

        //-----------------------------------
        // CONTENT REVEAL
        //-----------------------------------

        const cp = (p - .72) / .08;

        gsap.set(content, { opacity: gsap.utils.clamp(0, 1, cp) });
        gsap.set(glow, { opacity: gsap.utils.clamp(0, 1, cp) });

        //-----------------------------------
        // CONTENT EXIT
        //-----------------------------------

        if (p > .84) {

            const exit = (p - .84) / .10;

            gsap.set(content, { y: -220 * exit, opacity: 1 - exit, pointerEvents: "none" });
            gsap.set(glow, { opacity: 1 - exit });
            gsap.set(intro, { pointerEvents: "none" })

        }

        //-----------------------------------
        // VIDEO -> CANVAS
        //-----------------------------------

        if (p >= 0.94 && !swapped) {

            swapped = true;

            gsap.to(video, { opacity: 0, duration: 0.18, ease: "power2.out" });
            gsap.to(paintCanvas, { opacity: 1, duration: 0.18, ease: "power2.out", pointerEvents: "auto" });

        }

        if (p < 0.94 && swapped) {

            swapped = false;

            gsap.to(video, { opacity: 1, duration: 0.18 });
            gsap.to(paintCanvas, { opacity: 0, duration: 0.18, pointerEvents: "none" });

        }

        //-----------------------------------
        // SHOW PAINT ICONS
        //-----------------------------------

        if (p >= .95 && !iconsVisible) {
            paintIcons.classList.add("show");
            iconsVisible = true;
        }

        if (p < .95 && iconsVisible) {
            paintIcons.classList.remove("show");
            iconsVisible = false;
        }

    }

});

gsap.to(".paint-trigger", {
    y: -5,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: .2
});

/*----------------------------------------------------
LOADER
----------------------------------------------------*/

const loader = document.querySelector(".loader");
const loaderCount = document.getElementById("loaderCount");
const leftDoor = document.querySelector(".loader-door-left");
const rightDoor = document.querySelector(".loader-door-right");

// Lock scroll while loading
document.documentElement.style.overflow = "hidden";

// intro-title starts hidden, revealed only once the loader finishes.
gsap.set(".intro-title", { opacity: 0, y: 50, filter: "blur(16px)" });

const loadProgress = { value: 0 };
let pageLoaded = false;

window.addEventListener("load", () => { pageLoaded = true; });

function tickLoader() {

    const target = pageLoaded ? 100 : 90;

    loadProgress.value += (target - loadProgress.value) * 0.06;

    if (pageLoaded && target - loadProgress.value < 0.3) {
        loadProgress.value = 100;
    }

    loaderCount.textContent = Math.floor(loadProgress.value);

    if (loadProgress.value >= 100) {
        finishLoader();
        return;
    }

    requestAnimationFrame(tickLoader);

}

requestAnimationFrame(tickLoader);

function finishLoader() {

    gsap.timeline({

        onComplete: () => {
            loader.style.display = "none";
            document.documentElement.style.overflow = "";
            revealHero();
        }

    })

        .to(".loader-counter", {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: "power2.in"
        })

        .to(leftDoor, {
            xPercent: -100,
            duration: 1.1,
            ease: "power4.inOut"
        }, "-=0.1")

        .to(rightDoor, {
            xPercent: 100,
            duration: 1.1,
            ease: "power4.inOut"
        }, "<");

}

function revealHero() {

    gsap.to(".intro-title", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.3,
        ease: "power4.out"
    });

}


// WHY AMIGOS JS
const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("active");

            if (entry.target.classList.contains("stat")) {

                animateCounter(entry.target.querySelector(".counter"));

            }

            observer.unobserve(entry.target);

        }

    });

}, {
    threshold: .35
});


document.querySelectorAll(".reveal").forEach(el => {

    observer.observe(el);

});



function animateCounter(counter) {

    const target = +counter.dataset.target;

    const duration = 1800;

    let start = null;

    function step(timestamp) {

        if (!start) start = timestamp;

        const progress = Math.min((timestamp - start) / duration, 1);

        counter.textContent = Math.floor(progress * target).toLocaleString();

        if (progress < 1) {

            requestAnimationFrame(step);

        } else {

            counter.textContent = target.toLocaleString();

        }

    }

    requestAnimationFrame(step);

}

// SERVICES JS
/*=========================================
        SERVICES PANEL INTERACTION
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    const panels = document.querySelectorAll(".service-panel");

    if (!panels.length) return;

    let activePanel = panels[0];
    let isMobile = window.innerWidth <= 991;

    // First panel active
    activePanel.classList.add("active");

    /*=========================
        Activate Panel
    =========================*/

    function activatePanel(panel) {

        if (panel === activePanel) return;

        activePanel.classList.remove("active");

        panel.classList.add("active");

        activePanel = panel;

    }

    /*=========================
        Desktop Hover
    =========================*/

    function bindDesktop() {

        panels.forEach(panel => {

            panel.addEventListener("mouseenter", () => {

                if (isMobile) return;

                activatePanel(panel);

            });

        });

    }

    /*=========================
        Mobile Click
    =========================*/

    function bindMobile() {

        panels.forEach(panel => {

            panel.addEventListener("click", (e) => {

                if (!isMobile) return;

                e.preventDefault();

                activatePanel(panel);

            });

        });

    }

    bindDesktop();
    bindMobile();

    /*=========================
        Reset on Mouse Leave
    =========================*/

    const wrapper = document.querySelector(".services-panels");

    wrapper.addEventListener("mouseleave", () => {

        if (isMobile) return;

        activatePanel(panels[0]);

    });

    /*=========================
        Resize
    =========================*/

    window.addEventListener("resize", () => {

        isMobile = window.innerWidth <= 991;

    });

});

/*=========================================
        SECTION REVEAL
=========================================*/

const servicesSection = document.querySelector(".services-section");

const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

            revealObserver.unobserve(entry.target);

        }

    });

}, {
    threshold: .18
});

revealObserver.observe(servicesSection);

/*==================================================
            AI PROPERTY VISUALIZER
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const section = document.querySelector(".ai-section");
    if (!section) return;

    const input = document.getElementById("roomUpload");
    const stage = document.getElementById("aiStage");
    const stageTopbar = document.getElementById("stageTopbar");
    const uploadBtn = document.getElementById("uploadBtn");
    const beforeImg = document.getElementById("beforeImg");
    const afterImg = document.getElementById("afterImg");
    const controlsDock = document.getElementById("aiControlsDock");
    const generateBtn = document.getElementById("generateBtn");
    const toggleButtons = document.querySelectorAll(".toggle-btn");

    const scanOverlay = document.getElementById("scanOverlay");
    const scanStatusText = document.getElementById("scanStatusText");
    const aiStatusBadge = document.getElementById("aiStatusBadge");

    /*==================================================
        SECTION REVEAL
    ==================================================*/

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                section.classList.add("show");
                observer.unobserve(section);
            }
        });
    }, { threshold: .2 });

    observer.observe(section);

    /*==================================================
        OPEN FILE — clicking anywhere in the empty stage,
        or the button inside it
    ==================================================*/

    uploadBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        input.click();
    });

    document.getElementById("stageEmpty").addEventListener("click", () => {
        input.click();
    });

    input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) showImage(file);
    });

    /*==================================================
        DRAG & DROP — the whole stage is the dropzone
    ==================================================*/

    stage.addEventListener("dragover", (e) => {
        e.preventDefault();
        stage.classList.add("dragover");
    });

    stage.addEventListener("dragleave", () => {
        stage.classList.remove("dragover");
    });

    stage.addEventListener("drop", (e) => {
        e.preventDefault();
        stage.classList.remove("dragover");
        const file = e.dataTransfer.files[0];
        if (file) {
            input.files = e.dataTransfer.files;
            showImage(file);
        }
    });

    /*==================================================
        SCAN SEQUENCE
    ==================================================*/

    const SCAN_STEPS = [
        "Analyzing image…",
        "Detecting wall surfaces…",
        "Generating segmentation mask…",
        "Preview ready"
    ];

    function runScanSequence(onComplete) {

        let step = 0;
        scanOverlay.classList.add("active");
        aiStatusBadge.classList.remove("done");
        aiStatusBadge.classList.add("scanning");
        aiStatusBadge.innerHTML = `<span class="ai-status-dot"></span> Processing`;

        const interval = setInterval(() => {

            scanStatusText.textContent = SCAN_STEPS[step];
            step++;

            if (step >= SCAN_STEPS.length) {

                clearInterval(interval);

                // ------------------------------------------------------------
                // HOOK YOUR REAL API CALL HERE. Replace this whole
                // runScanSequence() body with something like:
                //
                //   const formData = new FormData();
                //   formData.append("image", file);
                //   fetch("/api/vision/detect-walls", { method: "POST", body: formData })
                //       .then(res => res.json())
                //       .then(data => { onComplete(); })
                //       .catch(err => { /* show error state */ });
                // ------------------------------------------------------------

                setTimeout(() => {
                    scanOverlay.classList.remove("active");
                    aiStatusBadge.classList.remove("scanning");
                    aiStatusBadge.classList.add("done");
                    aiStatusBadge.innerHTML = `<span class="ai-status-dot"></span> Walls detected`;
                    onComplete();
                }, 400);

            }

        }, 550);

    }

    function showImage(file) {

        const reader = new FileReader();

        reader.onload = function (event) {

            beforeImg.src = event.target.result;
            afterImg.src = event.target.result;

            stage.classList.add("has-image");
            stageTopbar.classList.add("show");

            runScanSequence(() => {
                controlsDock.classList.add("show");
                generateBtn.disabled = false;
            });

        };

        reader.readAsDataURL(file);

    }

    /*==================================================
        BEFORE / AFTER TOGGLE
    ==================================================*/

    toggleButtons.forEach(button => {

        button.addEventListener("click", () => {

            toggleButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            if (button.dataset.view === "before") {
                beforeImg.classList.add("active");
                afterImg.classList.remove("active");
            } else {
                beforeImg.classList.remove("active");
                afterImg.classList.add("active");
            }

        });

    });

    /*==================================================
        TABS: color vs wallpaper (mutually exclusive)
    ==================================================*/

    const optionTabs = document.querySelectorAll(".option-tab");
    const optionPanels = document.querySelectorAll(".option-panel");

    optionTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            optionTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            optionPanels.forEach(p => p.classList.toggle("active", p.dataset.panel === tab.dataset.mode));
        });
    });

    /*==================================================
        COLOR SLIDER (hue bar + eyedropper pick)
    ==================================================*/

    const colorSlider = document.getElementById("colorSlider");
    const colorCursor = document.getElementById("colorSliderCursor");
    const colorSelectedRow = document.getElementById("colorSelectedRow");
    const colorSelectedSwatch = document.getElementById("colorSelectedSwatch");
    const colorSelectedHex = document.getElementById("colorSelectedHex");
    const wallpaperButtons = document.querySelectorAll(".wallpaperAI");

    function hslToHex(h, s, l) {
        s /= 100; l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        const toHex = x => Math.round(x * 255).toString(16).padStart(2, "0");
        return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
    }

    function pickColorAt(clientX) {

        const rect = colorSlider.getBoundingClientRect();
        const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        const hex = hslToHex(pct * 360, 100, 50);

        colorCursor.style.left = `${pct * 100}%`;
        colorCursor.classList.add("show");

        colorSelectedSwatch.style.background = hex;
        colorSelectedHex.textContent = hex.toUpperCase();
        colorSelectedRow.classList.add("show");

        wallpaperButtons.forEach(btn => btn.classList.remove("active"));

        afterImg.style.backgroundImage = "none";
        afterImg.style.background = hex;
        afterImg.style.mixBlendMode = "multiply";
        afterImg.style.opacity = ".88";
        afterImg.style.transition = ".45s ease";

        // HOOK: send { hex } to your backend here when wiring the real API

    }

    let sliderDragging = false;

    colorSlider.addEventListener("mousedown", (e) => { sliderDragging = true; pickColorAt(e.clientX); });
    window.addEventListener("mousemove", (e) => { if (sliderDragging) pickColorAt(e.clientX); });
    window.addEventListener("mouseup", () => { sliderDragging = false; });
    colorSlider.addEventListener("touchstart", (e) => pickColorAt(e.touches[0].clientX));
    colorSlider.addEventListener("touchmove", (e) => pickColorAt(e.touches[0].clientX));

    /*==================================================
        WALLPAPER SELECTION
    ==================================================*/

    wallpaperButtons.forEach(btn => {

        btn.addEventListener("click", () => {

            wallpaperButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            colorCursor.classList.remove("show");
            colorSelectedRow.classList.remove("show");

            afterImg.style.background = "none";
            afterImg.style.backgroundImage = `url(${btn.dataset.wallpaper})`;
            afterImg.style.backgroundSize = "cover";
            afterImg.style.mixBlendMode = "multiply";
            afterImg.style.opacity = ".85";
            afterImg.style.transition = ".45s ease";

            // HOOK: send { wallpaperId: btn.dataset.wallpaper } to backend here

        });

    });

    /*==================================================
        GENERATE BUTTON
    ==================================================*/

    generateBtn.addEventListener("click", () => {

        generateBtn.innerHTML = "Generating...";
        generateBtn.disabled = true;

        setTimeout(() => {
            generateBtn.innerHTML = "AI Preview Ready";
        }, 1500);

    });

});

/*
============================================================
AI QUOATION
============================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    const section = document.querySelector(".quote-section");
    if (!section) return;

    /*==================================================
        PRICING CONFIG — placeholder unit rates.
        Adjust to Amigos Maler's real pricing before going live.
    ==================================================*/

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

        return parts.length ? parts.join(", ") : "No work selected yet";

    }

    function fmt(n) {
        return n.toFixed(2);
    }

    /*==================================================
        ISOMETRIC ROOM ILLUSTRATION
        Bilinear interpolation places the window/door/
        radiator inside a wall's four corners so they
        follow the wall's own perspective skew instead of
        sitting on top as flat, mismatched rectangles.
    ==================================================*/

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

    function poly(points) {
        return points.map(p => p.join(",")).join(" ");
    }

    function buildRoomSVG(items, sizeKey) {

        const dims = sizeKey === "large" ? { w: 340, h: 270 } : { w: 150, h: 119 };

        // Shared anchor points — every face (ceiling, walls, floor) is
        // built from these, so nothing floats or misaligns between faces.
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

        // Recolored to the site's own palette (olive accent) instead of red.
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

    /*==================================================
        STATE
    ==================================================*/

    let rooms = [];
    let modalOpen = false;
    let modalStep = 1;
    let editingId = null;
    let draft = emptyDraft();

    /*==================================================
        DOM REFS
    ==================================================*/

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

    /*==================================================
        RENDER — rooms list + live estimate card
    ==================================================*/

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

    /*==================================================
        MODAL — open / close / navigation
    ==================================================*/

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

    /*==================================================
        MODAL — render step 1 / step 2
    ==================================================*/

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

        modalBodyEl.querySelectorAll(".quote-number-input").forEach(input => {
            input.addEventListener("input", () => updateItem(input.dataset.key, input.value));
        });

    }

    /*==================================================
        GLOBAL EVENTS
    ==================================================*/

    addSpaceBtn.addEventListener("click", openAdd);
    modalCloseBtn.addEventListener("click", closeModal);

    modalEl.addEventListener("click", (e) => {
        if (e.target === modalEl) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalOpen) closeModal();
    });

    /*==================================================
        SECTION REVEAL (same pattern as the rest of the site)
    ==================================================*/

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                section.classList.add("show");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: .18 });

    revealObserver.observe(section);

    /*==================================================
        INITIAL RENDER
    ==================================================*/

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

    /*==================================================
        PARTICLE BURST — rebuilt fresh each time the modal
        opens so the colors/angles/timing feel alive and
        not like a static repeating animation.
    ==================================================*/

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

    /*==================================================
        OPEN / CLOSE
    ==================================================*/

    function openSuccess() {

        // Restart CSS animations every time by removing + re-adding
        // the "open" class on the next frame.
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
        // `rooms` and `grandTotal()` come from quote-calculator.js —
        // both are plain, serializable data, so this is typically all
        // you need once you have a real endpoint:
        //
        //   fetch("/api/quotes", {
        //       method: "POST",
        //       headers: { "Content-Type": "application/json" },
        //       body: JSON.stringify({ rooms, total: grandTotal() })
        //   })
        //   .then(res => res.json())
        //   .then(() => openSuccess())
        //   .catch(err => { /* show an error state instead */ });
        //
        // For now it opens the success modal immediately.
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

});

/*==================================================
    TESTIMONIALS — CONVEX ARC CAROUSEL
==================================================== */

const TESTIMONIALS_DATA = [
    { name: "Daniel Müller", city: "Zurich", quote: "Professional from inspection to completion. Everything exceeded expectations." },
    { name: "Sarah Weber", city: "Bern", quote: "Fast communication and flawless finishing. Highly recommended." },
    { name: "Lucas Frei", city: "Geneva", quote: "The AI inspection saved us thousands. Amazing experience." },
    { name: "Emma Keller", city: "Basel", quote: "Everything felt transparent from day one." },
    { name: "Sophia Baumann", city: "Lugano", quote: "Beautiful renovation. Better than we imagined." },
    { name: "Marco Steiner", city: "Lausanne", quote: "Couldn't have chosen a better company." }
];

document.addEventListener("DOMContentLoaded", () => {

    const track = document.getElementById("carouselTrack");
    const stage = document.getElementById("carouselStage");
    const dotsEl = document.getElementById("carouselDots");
    const prevBtn = document.getElementById("carouselPrev");
    const nextBtn = document.getElementById("carouselNext");

    if (!track) return;

    let activeIndex = 0;
    const total = TESTIMONIALS_DATA.length;

    /*==========================
        BUILD CARDS + DOTS (once)
    ==========================*/

    TESTIMONIALS_DATA.forEach((t, i) => {

        const card = document.createElement("div");
        card.className = "testimonial-card";
        card.dataset.index = i;

        card.innerHTML = `
            <div class="stars">★★★★★</div>
            <p>"${t.quote}"</p>
            <h4>${t.name}</h4>
            <span class="city">${t.city}</span>
        `;

        card.addEventListener("click", () => {
            // Only side cards (offset ±1) are meant to be clickable —
            // the offset attribute is refreshed by updateCarousel().
            const offset = parseInt(card.dataset.offset, 10);
            if (Math.abs(offset) === 1) goTo(i);
        });

        track.appendChild(card);

        const dot = document.createElement("button");
        dot.className = "carousel-dot";
        dot.addEventListener("click", () => goTo(i));
        dotsEl.appendChild(dot);

    });

    const cardEls = track.querySelectorAll(".testimonial-card");
    const dotEls = dotsEl.querySelectorAll(".carousel-dot");

    /*==========================
        POSITION CARDS ALONG THE CONVEX ARC
        Offset is each card's distance from the active
        index (circular, so it wraps both directions).
        Only offsets -2..2 get a defined position; anything
        further is parked off-screen and hidden.
    ==========================*/

    function shortestOffset(index) {

        let diff = index - activeIndex;

        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        return diff;

    }

    function updateCarousel() {

        cardEls.forEach((card, i) => {

            const offset = shortestOffset(i);
            card.dataset.offset = offset;

            let transform, opacity, zIndex, pointerEvents;

            if (offset === 0) {
                // ACTIVE — front and center, closest to viewer
                transform = "translate3d(0, 0, 0) rotateY(0deg) rotateZ(0deg) scale(1)";
                opacity = 1;
                zIndex = 30;
                pointerEvents = "none";
            } else if (Math.abs(offset) === 1) {
                // NEIGHBORS — curve back and down (convex/dome effect),
                // rotated slightly to face inward toward center
                const dir = offset > 0 ? 1 : -1;
                transform = `translate3d(${dir * 340}px, 60px, -180px) rotateY(${-dir * 20}deg) rotateZ(${dir * 3}deg) scale(.82)`;
                opacity = .78;
                zIndex = 20;
                pointerEvents = "auto";
            } else if (Math.abs(offset) === 2) {
                // FAR CARDS — parked further out/back, invisible but
                // positioned so the transition into view is smooth
                const dir = offset > 0 ? 1 : -1;
                transform = `translate3d(${dir * 600}px, 110px, -360px) rotateY(${-dir * 30}deg) scale(.62)`;
                opacity = 0;
                zIndex = 10;
                pointerEvents = "none";
            } else {
                // Anything beyond ±2 just sits with the far-card values,
                // fully hidden — only matters during fast repeated clicks
                transform = "translate3d(0, 110px, -420px) scale(.5)";
                opacity = 0;
                zIndex = 5;
                pointerEvents = "none";
            }

            card.style.transform = transform;
            card.style.opacity = opacity;
            card.style.zIndex = zIndex;
            card.style.pointerEvents = pointerEvents;

        });

        dotEls.forEach((dot, i) => dot.classList.toggle("active", i === activeIndex));

    }

    function goTo(index) {
        activeIndex = ((index % total) + total) % total; // wrap both directions
        updateCarousel();
    }

    prevBtn.addEventListener("click", () => goTo(activeIndex - 1));
    nextBtn.addEventListener("click", () => goTo(activeIndex + 1));

    /*==========================
        DRAG / SWIPE (touch + mouse)
    ==========================*/

    let dragStartX = 0;
    let isDragging = false;

    stage.addEventListener("pointerdown", (e) => {
        isDragging = true;
        dragStartX = e.clientX;
    });

    stage.addEventListener("pointerup", (e) => {

        if (!isDragging) return;
        isDragging = false;

        const delta = e.clientX - dragStartX;
        const threshold = 60; // minimum px drag distance to count as a swipe

        if (delta > threshold) goTo(activeIndex - 1);
        else if (delta < -threshold) goTo(activeIndex + 1);

    });

    stage.addEventListener("pointerleave", () => { isDragging = false; });

    /*==========================
        INITIAL RENDER
    ==========================*/

    updateCarousel();

});

/*==================================================
    PROJECTS SECTION — DATA-DRIVEN, NORMAL SCROLL
==================================================== */

const PROJECTS_DATA = [

    // ===== Properties for Sale =====
    { category: "sale", image: "assets/projects/project-01.jpg", location: "Zurich", title: "Modern Family Villa" },
    { category: "sale", image: "assets/projects/project-02.jpg", location: "Geneva", title: "Lake View Residence" },
    { category: "sale", image: "assets/projects/project-03.jpg", location: "Lausanne", title: "Contemporary Residence" },
    { category: "sale", image: "assets/projects/project-04.jpg", location: "Zermatt", title: "Alpine Chalet" },
    { category: "sale", image: "assets/projects/project-05.jpg", location: "Basel", title: "Vision Mansion" },
    { category: "sale", image: "assets/projects/project-06.jpg", location: "Bern", title: "Eli House Corner Plot" },

    // ===== Properties for Purchase =====
    { category: "purchase", image: "assets/projects/project-07.jpg", location: "Lucerne", title: "Lakeside Horizon Villa" },
    { category: "purchase", image: "assets/projects/project-08.jpg", location: "Interlaken", title: "Mountain Crest Estate" },
    { category: "purchase", image: "assets/projects/project-09.jpg", location: "Lugano", title: "Sunset Panorama Home" },
    { category: "purchase", image: "assets/projects/project-10.jpg", location: "Montreux", title: "Grand Riverside Residence" },
    { category: "purchase", image: "assets/projects/project-11.jpg", location: "St. Moritz", title: "Crystal Peak Chalet" },
    { category: "purchase", image: "assets/projects/project-12.jpg", location: "Fribourg", title: "Oakwood Signature House" },

    // ===== International Properties =====
    { category: "international", image: "assets/projects/project-13.jpg", location: "Thun", title: "Emerald Lake Retreat" },
    { category: "international", image: "assets/projects/project-14.jpg", location: "Sion", title: "Prestige Valley Villa" },
    { category: "international", image: "assets/projects/project-15.jpg", location: "Neuchâtel", title: "Modern Skyline Residence" },
    { category: "international", image: "assets/projects/project-16.jpg", location: "Winterthur", title: "Urban Harmony Estate" },
    { category: "international", image: "assets/projects/project-17.jpg", location: "Bellinzona", title: "Heritage Stone Manor" },
    { category: "international", image: "assets/projects/project-18.jpg", location: "Davos", title: "Summit View Chalet" }
];

document.addEventListener("DOMContentLoaded", () => {

    const section = document.getElementById("projectsSection");
    const gallery = document.getElementById("projectsGallery");
    const dock = document.getElementById("projectsDock");
    const indicator = document.getElementById("dockIndicator");
    const tabs = document.querySelectorAll(".dock-tab");

    if (!section || !gallery) return;

    let currentCategory = "sale";

    /*==========================
        HERO-SCROLLED GATE
        The dock must never appear until the user has
        scrolled past the hero section — this flag is
        checked before the dock is allowed to show.
    ==========================*/

    let heroScrolledPast = false;

    ScrollTrigger.create({
        trigger: ".hero",
        start: "bottom top",
        onEnter: () => heroScrolledPast = true,
        onLeaveBack: () => heroScrolledPast = false
    });

    /*==========================
        CARD RENDERING
    ==========================*/

    function buildCardHTML(project) {
        return `
            <article class="project-card" data-category="${project.category}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="project-info">
                    <span>${project.location}</span>
                    <h3>${project.title}</h3>
                </div>
            </article>
        `;
    }

    function renderCategory(category) {
        const matching = PROJECTS_DATA.filter(p => p.category === category);
        gallery.innerHTML = matching.map(buildCardHTML).join("");
    }

    /*==========================
        PER-CARD SCROLL REVEAL
        Restored to the original, proven behavior: each
        card's image + info fade/blur/slide in as it enters
        the viewport (and reverse if scrolled back above),
        plus the original subtle image parallax.
    ==========================*/

    function applyCardAnimations() {

        gallery.querySelectorAll(".project-card").forEach(card => {

            const img = card.querySelector(".project-image");
            const info = card.querySelector(".project-info");
            const image = card.querySelector("img");

            gsap.from(img, {
                scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
                opacity: 0, filter: "blur(25px)", y: 80, duration: 1, ease: "power3.out", clearProps: "all"
            });

            gsap.from(info, {
                scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none reverse" },
                opacity: 0, y: 25, duration: .7, delay: .2, ease: "power2.out", clearProps: "all"
            });

            gsap.to(image, {
                yPercent: 10,
                ease: "none",
                scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true }
            });

        });

    }

    /*==========================
        SLIDING INDICATOR
    ==========================*/

    function moveIndicatorTo(tab) {

        const dockRect = dock.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();

        gsap.to(indicator, {
            x: tabRect.left - dockRect.left - 8,
            width: tabRect.width,
            duration: .5,
            ease: "power3.out"
        });

    }

    /*==========================
        CATEGORY SWITCHING
    ==========================*/

    function switchCategory(category) {

        if (category === currentCategory) return;

        const outgoing = gallery.querySelectorAll(".project-card");

        gsap.to(outgoing, {
            opacity: 0,
            y: 20,
            duration: .3,
            ease: "power2.in",
            onComplete: () => {

                currentCategory = category;
                renderCategory(category);
                applyCardAnimations();

                // New cards are usually already in/near view when
                // switching tabs, so give them an immediate settle-in
                // rather than waiting on their scroll triggers.
                const incoming = gallery.querySelectorAll(".project-card");
                gsap.set(incoming, { opacity: 0, y: 30 });
                gsap.to(incoming, { opacity: 1, y: 0, duration: .5, stagger: .05, ease: "power3.out" });

                ScrollTrigger.refresh();

            }
        });

    }

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            moveIndicatorTo(tab);
            switchCategory(tab.dataset.filter);

        });

    });

    /*==========================
        INITIAL RENDER
    ==========================*/

    renderCategory(currentCategory);
    applyCardAnimations();
    requestAnimationFrame(() => moveIndicatorTo(document.querySelector(".dock-tab.active")));

    /*==========================
        DOCK VISIBILITY — tied to the section's position
        in the viewport, not to pinning. Fades/blurs in as
        the section is approached, shrinks/fades out once
        the section is scrolled past (either direction).
    ==========================*/

    gsap.set(dock, { opacity: 0, y: 30, scale: .85, filter: "blur(14px)" });

    function showDock() {
        gsap.to(dock, {
            opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
            duration: .6, ease: "power3.out",
            onStart: () => dock.style.pointerEvents = "auto"
        });
    }

    function hideDock() {
        gsap.to(dock, {
            opacity: 0, y: 24, scale: .85, filter: "blur(14px)",
            duration: .5, ease: "power2.in",
            onStart: () => dock.style.pointerEvents = "none"
        });
    }

    ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        end: "bottom 20%",
        onEnter: showDock,
        onEnterBack: showDock,
        onLeave: hideDock,
        onLeaveBack: hideDock
    });

});

// PLANS JS

const pin = document.querySelector(".plans-pin");
const slides = gsap.utils.toArray(".plan-slide");
const scrims = slides.map(s => s.querySelector(".plan-scrim"));
const fills = gsap.utils.toArray(".plan-bar-fill");

const enterWindows = [
    null,
    [0.10, 0.42],
    [0.58, 0.90]
];

function localProgress(p, win) {
    if (!win) return 1;
    return gsap.utils.clamp(0, 1, (p - win[0]) / (win[1] - win[0]));
}

ScrollTrigger.create({

    trigger: pin,
    start: "top top",
    end: "+=3200",
    scrub: 1,
    pin: true,
    anticipatePin: 1,

    onUpdate(self) {

        const p = self.progress;
        const enterAmount = slides.map((_, i) => localProgress(p, enterWindows[i]));

        slides.forEach((slide, i) => {

            const amt = enterAmount[i];

            gsap.set(slide, {
                yPercent: 100 * (1 - amt),
                zIndex: i + 1
            });

            if (fills[i]) fills[i].style.width = (amt * 100) + "%";

            const nextAmt = i + 1 < slides.length ? enterAmount[i + 1] : 0;

            if (scrims[i]) {
                scrims[i].style.opacity = nextAmt * 0.32;
            }

            gsap.set(slide, {
                scale: 1 - nextAmt * 0.025
            });

            const isCovered = nextAmt > 0.5;
            const isSliding = amt < 0.98;
            slide.style.pointerEvents = (!isCovered && !isSliding) ? "auto" : "none";

        });

    }

});

// FOOTER JS
(() => {

    const footer = document.querySelector(".site-footer");
    if (!footer) return;

    gsap.timeline({
        scrollTrigger: {
            trigger: footer,
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
    })
        .from(".footer-wordmark h2", {
            scaleY: 0.05,
            filter: "blur(24px)",
            duration: 1.1,
            ease: "power3.out"
        })
        .from(".footer-wordmark .eyebrow", {
            y: 60,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.4")
        .from(".footer-meta > div", {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: "power2.out"
        }, "-=0.15");

})();

// AUDIENCE BBAR JS
(() => {

    const bar = document.querySelector(".audience-bar");
    if (!bar) return;

    gsap.timeline({
        scrollTrigger: {
            trigger: bar,
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    })
        .from(".audience-left h3", {
            opacity: 0,
            y: 24,
            filter: "blur(14px)",
            duration: 0.75,
            ease: "power3.out"
        })
        .from(".audience-left p", {
            opacity: 0,
            y: 18,
            filter: "blur(10px)",
            duration: 0.65,
            ease: "power3.out"
        }, "-=.4")
        .from(".audience-right .item, .audience-right .divider", {
            opacity: 0,
            y: 16,
            filter: "blur(10px)",
            duration: 0.55,
            stagger: 0.08,
            ease: "power3.out"
        }, "-=.35");

})();


/*==================================================
    CHATBOT WIDGET — UI SCAFFOLDING ONLY
    Handles open/close + message rendering.
    No AI/backend logic wired in yet — see the
    "HOOK YOUR CHATBOT LOGIC HERE" comment below.
==================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const widget = document.getElementById("chatbotWidget");
    const toggleBtn = document.getElementById("chatbotToggle");
    const closeBtn = document.getElementById("chatbotClose");
    const body = document.getElementById("chatbotBody");
    const form = document.getElementById("chatbotForm");
    const input = document.getElementById("chatbotInput");

    if (!widget) return;

    let isOpen = false;

    /*==========================
        OPEN / CLOSE
    ==========================*/

    function openChat() {
        isOpen = true;
        widget.classList.add("open");
        toggleBtn.setAttribute("aria-expanded", "true");
        setTimeout(() => input?.focus(), 400);
    }

    function closeChat() {
        isOpen = false;
        widget.classList.remove("open");
        toggleBtn.setAttribute("aria-expanded", "false");
    }

    function toggleChat() {
        isOpen ? closeChat() : openChat();
    }

    toggleBtn.addEventListener("click", toggleChat);
    closeBtn.addEventListener("click", closeChat);

    // Close when clicking outside the widget
    document.addEventListener("click", (e) => {
        if (isOpen && !widget.contains(e.target)) closeChat();
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen) closeChat();
    });

    /*==========================
        MESSAGE RENDERING
        Reusable helper — call this whenever a new
        bot or user message needs to appear on screen.
    ==========================*/

    function addMessage(text, sender = "bot") {

        const msg = document.createElement("div");
        msg.className = `chatbot-message ${sender}`;

        msg.innerHTML = sender === "bot"
            ? `<img src="assets/chatbot-avatar.jpg" alt="" class="chatbot-msg-avatar"><div class="chatbot-bubble"></div>`
            : `<div class="chatbot-bubble"></div>`;

        msg.querySelector(".chatbot-bubble").textContent = text;

        body.appendChild(msg);
        body.scrollTop = body.scrollHeight;

    }

    /*==========================
        FORM SUBMIT (placeholder)
    ==========================*/

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const text = input.value.trim();
        if (!text) return;

        addMessage(text, "user");
        input.value = "";

        // ------------------------------------------------
        // HOOK YOUR CHATBOT LOGIC HERE.
        // Replace this placeholder with a real call, e.g.:
        //
        //   sendToChatbotAPI(text).then(reply => {
        //       addMessage(reply, "bot");
        //   });
        //
        // For now it just echoes a static reply so the
        // open/close + send flow is visibly working end-to-end.
        // ------------------------------------------------

        setTimeout(() => {
            addMessage("Thanks for your message! (placeholder reply — connect real logic here)", "bot");
        }, 600);

    });

});

/*==================================================
    SCROLL TO TOP BUTTON
==================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const scrollTopBtn = document.getElementById("scrollTopBtn");

    if (!scrollTopBtn) return;

    ScrollTrigger.create({
        trigger: ".hero",
        start: "bottom top", // fires once the hero's bottom edge passes the top of the viewport
        onEnter: () => scrollTopBtn.classList.add("visible"),
        onLeaveBack: () => scrollTopBtn.classList.remove("visible")
    });

    scrollTopBtn.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        });

    });

});