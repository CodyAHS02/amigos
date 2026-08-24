gsap.registerPlugin(ScrollTrigger);

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

const video = document.getElementById("heroVideo");
const colors = document.querySelectorAll(".color");

const intro = document.querySelector(".intro-title");
let header = null; // populated once the header partial is injected — see "partials:loaded" below
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
(deferred: the header only exists in the DOM once
partials.js has fetched & injected partials/header.html
— see the "partials:loaded" listener near the bottom
of this file)
----------------------------------------------------*/

let navOpen = false;

function initHeaderInteractions() {

    const hamburger = document.querySelector(".hamburger");
    const siteNav = document.querySelector(".site-nav");
    const navLinks = gsap.utils.toArray(".site-nav > a, .site-nav > .nav-dropdown > .dropdown-trigger");

    if (!hamburger || !siteNav) return; // header partial failed to load — bail safely

    const navTl = gsap.timeline({ paused: true })

        .to(siteNav, {
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

    hamburger.addEventListener("click", () => {

        navOpen = !navOpen;

        hamburger.classList.toggle("active", navOpen);
        siteNav.classList.toggle("open", navOpen);
        hamburger.setAttribute("aria-expanded", navOpen);

        if (navOpen) {
            navTl.play();
        } else {
            navTl.reverse();
        }

    });

    // Dropdown toggle for mobile / touch devices
    document.querySelectorAll(".dropdown-trigger").forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            const parent = trigger.closest(".nav-dropdown");
            if (window.innerWidth <= 991) {
                e.preventDefault();
                e.stopPropagation();
                parent?.classList.toggle("open");
            }
        });
    });

    // Close mobile navigation drawer when clicking a final link
    document.querySelectorAll(".site-nav a").forEach(link => {
        if (link.classList.contains("dropdown-trigger")) return;

        link.addEventListener("click", () => {
            if (navOpen) {
                navOpen = false;
                hamburger.classList.remove("active");
                siteNav.classList.remove("open");
                hamburger.setAttribute("aria-expanded", false);
                navTl.reverse();
            }
        });
    });

}

/*----------------------------------------------------
STICKY HEADER
Switches the header from a transparent hero overlay to
a solid navy bar once the page has scrolled past whatever
this page's hero section is — using GSAP ScrollTrigger's
"bottom top" trigger against the [data-hero] element, so
it adapts automatically to each page's actual hero height
(no hardcoded pixel/vh values, no per-page tuning needed).
If a page has no [data-hero] element at all, the header
just starts in its solid state.
----------------------------------------------------*/

function initStickyHeader() {

    const headerEl = document.querySelector(".site-header");
    const heroEl = document.querySelector("[data-hero]");

    if (!headerEl) return;

    if (!heroEl) {
        headerEl.classList.add("is-scrolled");
        return;
    }

    ScrollTrigger.create({
        trigger: heroEl,
        start: "bottom top", // fires the instant the hero's bottom edge passes the top of the viewport
        onEnter: () => headerEl.classList.add("is-scrolled"),
        onLeaveBack: () => headerEl.classList.remove("is-scrolled")
    });

}

/*----------------------------------------------------
Runs once /partials/header.html + /partials/footer.html
have both been fetched and injected by partials.js.
Everything that touches header or footer elements must
live behind this event — see partials.js for details.
----------------------------------------------------*/

function onPartialsReady() {
    header = document.querySelector(".site-header");

    initHeaderInteractions();
    initStickyHeader();
    initChatbotWidget();
    initScrollTopButton();
}

if (window.__partialsLoaded) {
    onPartialsReady();
} else {
    document.addEventListener("partials:loaded", onPartialsReady);
}

// Prime the video (needed for iOS to render the first frame) —
// purely cosmetic, does NOT gate the ScrollTrigger anymore.
// Guard: heroVideo only exists on the homepage.
if (video) {
    video.addEventListener("loadedmetadata", () => {

        video.play().then(() => {
            video.pause();
            video.currentTime = 0;
            videoReady = true;
        });

    });
}

// Hero ScrollTrigger now created IMMEDIATELY, synchronously,
// on initial script execution — before .why's triggers run.
// This guarantees the pin-spacer exists and the document height
// is correct BEFORE anything below it measures the page.
// Hero ScrollTrigger + paint animations — homepage only
if (document.querySelector(".hero")) {

    const paintCanvas = document.getElementById("paintCanvas");
    const paintIcons  = document.querySelector(".paint-icons");

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

            if (videoReady && video) {

                const videoProgress = Math.min(p / 0.80, 1);
                video.currentTime = video.duration * videoProgress;

            }

            //-----------------------------------
            // INTRO
            //-----------------------------------

            if (intro) gsap.set(intro, {
                y: -140 * Math.min(p / .20, 1),
                opacity: 1 - Math.min(p / .18, 1),
                scale: 1 + .08 * Math.min(p / .18, 1)
            });

            //-----------------------------------
            // HEADER
            //-----------------------------------

            const hp = (p - .12) / .10;

            if (header) {
                gsap.set(header, {
                    opacity: gsap.utils.clamp(0, 1, hp),
                    y: -80 + (80 * gsap.utils.clamp(0, 1, hp))
                });
            }

            //-----------------------------------
            // CONTENT REVEAL
            //-----------------------------------

            const cp = (p - .72) / .08;

            if (content) gsap.set(content, { opacity: gsap.utils.clamp(0, 1, cp) });
            if (glow)    gsap.set(glow,    { opacity: gsap.utils.clamp(0, 1, cp) });

            //-----------------------------------
            // CONTENT EXIT
            //-----------------------------------

            if (p > .84) {

                const exit = (p - .84) / .10;

                if (content) gsap.set(content, { y: -220 * exit, opacity: 1 - exit, pointerEvents: "none" });
                if (glow)    gsap.set(glow, { opacity: 1 - exit });
                if (intro)   gsap.set(intro, { pointerEvents: "none" });

            }

            //-----------------------------------
            // VIDEO -> CANVAS
            //-----------------------------------

            if (p >= 0.94 && !swapped) {

                swapped = true;

                if (video)       gsap.to(video, { opacity: 0, duration: 0.18, ease: "power2.out" });
                if (paintCanvas) gsap.to(paintCanvas, { opacity: 1, duration: 0.18, ease: "power2.out", pointerEvents: "auto" });

            }

            if (p < 0.94 && swapped) {

                swapped = false;

                if (video)       gsap.to(video, { opacity: 1, duration: 0.18 });
                if (paintCanvas) gsap.to(paintCanvas, { opacity: 0, duration: 0.18, pointerEvents: "none" });

            }

            //-----------------------------------
            // SHOW PAINT ICONS
            //-----------------------------------

            if (paintIcons) {
                if (p >= .95 && !iconsVisible) {
                    paintIcons.classList.add("show");
                    iconsVisible = true;
                }

                if (p < .95 && iconsVisible) {
                    paintIcons.classList.remove("show");
                    iconsVisible = false;
                }
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

}

/*----------------------------------------------------
LOADER
----------------------------------------------------*/

const loader = document.querySelector(".loader");
const loaderCount = document.getElementById("loaderCount");
const leftDoor = document.querySelector(".loader-door-left");
const rightDoor = document.querySelector(".loader-door-right");

// Lock scroll while loading — homepage only (loader element only exists on index.html)
if (loader) {
    document.documentElement.style.overflow = "hidden";
    // intro-title starts hidden, revealed only once the loader finishes.
    gsap.set(".intro-title", { opacity: 0, y: 50, filter: "blur(16px)" });
} else {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
}

const loadProgress = { value: 0 };
let pageLoaded = false;

window.addEventListener("load", () => { pageLoaded = true; });

function tickLoader() {

    const target = pageLoaded ? 100 : 90;

    loadProgress.value += (target - loadProgress.value) * 0.06;

    if (pageLoaded && target - loadProgress.value < 0.3) {
        loadProgress.value = 100;
    }

    if (loaderCount) loaderCount.textContent = Math.floor(loadProgress.value);

    if (loadProgress.value >= 100) {
        finishLoader();
        return;
    }

    requestAnimationFrame(tickLoader);

}

// Only run the loader on pages that have it (homepage)
if (loader) requestAnimationFrame(tickLoader);

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

/*==================================================
        SERVICES — hover-to-expand panel grid
==================================================*/

const SERVICES_DATA = [
    { num: "01", title: "Painting", desc: "Interior & exterior painting with premium, long-lasting finishes.", img: "assets/services/pexels-kseniachernaya-5691592.jpg" },
    { num: "02", title: "Plastering", desc: "Professional drywall & plaster installation and repair.", img: "assets/services/pexels-ai25studioai-5493673.jpg" },
    { num: "03", title: "Facades", desc: "Restore beauty while preserving architectural value.", img: "assets/services/pexels-dmitry93-32114413.jpg" },
    { num: "04", title: "Apartment Renovation", desc: "Get properties ready for sale or new tenants.", img: "assets/services/pexels-tr-n-chinh-587690133-20666871.jpg" },
    { num: "05", title: "Property Value Preservation", desc: "Protect and increase long-term property value.", img: "assets/services/pexels-amine-kubranur-cakiroglu-689611212-37919681.jpg" },
    { num: "06", title: "Digital Project Planning", desc: "Plan and visualize your project before work begins.", img: "assets/services/engineers-brainstorming-ways-use-ai.jpg", tags: ["Price Calculator", "Photo Upload", "Color Visualization"] }
];

(() => {

    const grid = document.getElementById("servicesExpandGrid");
    if (!grid) return;

    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    /*----- BUILD PANELS -----*/

    SERVICES_DATA.forEach((service, i) => {

        const panel = document.createElement("div");
        panel.className = "service-panel" + (i === 0 && !isTouch ? " active" : "");
        panel.dataset.index = i;
        panel.setAttribute("tabindex", "0");
        panel.setAttribute("role", "button");
        panel.setAttribute("aria-expanded", i === 0 ? "true" : "false");

        panel.innerHTML = `
            <div class="sp-media">
                <img src="${service.img}" alt="${service.title}" loading="lazy">
            </div>

            <div class="sp-collapsed">
                <span class="sp-num">${service.num}</span>
                <span class="sp-vert-title">${service.title}</span>
                <span class="sp-plus" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </span>
            </div>

            <div class="sp-expanded">
                <span class="sp-num">${service.num}</span>
                <h3>${service.title}</h3>
                <p>${service.desc}</p>
                ${service.tags ? `<div class="sp-tags">${service.tags.map(t => `<span>${t}</span>`).join("")}</div>` : ""}
                <span class="sp-link">
                    Explore
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
            </div>
        `;

        grid.appendChild(panel);

    });

    const panels = grid.querySelectorAll(".service-panel");

    function setActive(target) {
        panels.forEach(p => {
            const isActive = p === target;
            p.classList.toggle("active", isActive);
            p.setAttribute("aria-expanded", isActive ? "true" : "false");
        });
    }

    if (isTouch) {

        /*----- TOUCH: tap toggles open/close, first one starts collapsed -----*/
        panels.forEach(p => p.classList.remove("active"));

        panels.forEach(panel => {
            panel.addEventListener("click", () => {
                const alreadyActive = panel.classList.contains("active");
                setActive(alreadyActive ? null : panel);
            });
        });

    } else {

        /*----- DESKTOP: hover expands, keyboard focus expands too -----*/
        panels.forEach(panel => {

            panel.addEventListener("mouseenter", () => setActive(panel));
            panel.addEventListener("focus", () => setActive(panel));

        });

        grid.addEventListener("mouseleave", () => setActive(panels[0]));

    }

})();


/*==================================================
        TARGET AUDIENCE — tilt + cursor spotlight
==================================================*/

(() => {

    const section = document.getElementById("audienceCardsSection");
    const glow = document.getElementById("audienceGlow");
    const cards = document.querySelectorAll(".audience-card[data-tilt]");

    if (!section) return;

    // ambient spotlight follows the cursor anywhere in the section
    section.addEventListener("mousemove", (e) => {

        const rect = section.getBoundingClientRect();
        glow.style.left = (e.clientX - rect.left) + "px";
        glow.style.top = (e.clientY - rect.top) + "px";

    });

    // per-card 3D tilt + icon "draw in" the first time it's hovered
    cards.forEach(card => {

        card.addEventListener("mousemove", (e) => {

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateY = ((x - rect.width / 2) / rect.width) * 10;
            const rotateX = -((y - rect.height / 2) / rect.height) * 10;

            card.style.transform =
                `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;

        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
        });

    });

    // icons draw themselves in once, when the section scrolls into view —
    // not on hover
    const iconObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("icon-drawn");
                iconObserver.unobserve(entry.target);
            }

        });

    }, { threshold: .35 });

    cards.forEach(card => iconObserver.observe(card));

})();

/*==================================================
    DIGITAL TOOLS SECTION
==================================================*/

(() => {

    const section = document.querySelector(".dtools-section");
    if (!section) return;

    /*----- Section reveal -----*/

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                section.classList.add("show");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: .2 });

    revealObserver.observe(section);

    /*----- Cursor-tracked glow on each card -----*/

    section.querySelectorAll(".dtools-card").forEach(card => {

        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
            card.style.setProperty("--my", `${e.clientY - rect.top}px`);
        });

        // subtle tilt to match — magnetic, not cartoonish
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;

            card.style.transform = `perspective(900px) rotateX(${py * -4}deg) rotateY(${px * 4}deg) translateY(-2px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });

    });

    /*----- AI card: cycling color swatch demo -----*/

    const swatch = document.getElementById("dtoolsSwatch");

    if (swatch) {

        const DEMO_COLORS = ["#A6B09A", "#D8CCB4", "#8D98A4", "#5C6771", "#C9D4BF"];
        let colorIndex = 0;

        setInterval(() => {
            colorIndex = (colorIndex + 1) % DEMO_COLORS.length;
            swatch.style.background = DEMO_COLORS[colorIndex];
        }, 1600);

    }

    /*----- Quote card: ticking price counter, replays on scroll into view -----*/

    const ticker = document.getElementById("dtoolsTicker");

    if (ticker) {

        const tickerObserver = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const target = 4280;
                const duration = 1600;
                let start = null;

                function step(ts) {

                    if (!start) start = ts;

                    const progress = Math.min((ts - start) / duration, 1);
                    const value = Math.floor(progress * target);

                    ticker.textContent = "CHF " + value.toLocaleString("en-CH");

                    if (progress < 1) requestAnimationFrame(step);

                }

                requestAnimationFrame(step);
                tickerObserver.unobserve(ticker);

            });

        }, { threshold: .6 });

        tickerObserver.observe(ticker);

    }

})();


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
QUOTE WIZARD
============================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    const openBtn = document.getElementById("wizardOpenBtn");
    const wizard = document.getElementById("quoteWizard");
    const closeBtn = document.getElementById("wizardCloseBtn");
    const shell = wizard?.querySelector(".wizard-shell");
    const progressEl = document.getElementById("wizardProgress");
    const stepContentEl = document.getElementById("wizardStepContent");
    const sideTitleEl = document.getElementById("wizardSideTitle");
    const selectionsEl = document.getElementById("wizardSelections");
    const stepsLeftLabelEl = document.getElementById("wizardStepsLeftLabel");
    const stepsLeftFillEl = document.getElementById("wizardStepsLeftFill");
    const backBtn = document.getElementById("wizardBackBtn");
    const skipBtn = document.getElementById("wizardSkipBtn");
    const continueBtn = document.getElementById("wizardContinueBtn");
    const quoteSection = document.querySelector(".quote-section");

    if (!wizard || !openBtn) return;

    /*==================================================
        ICONS — small inline set reused across steps
    ==================================================*/

    const ICONS = {
        paint: `<svg viewBox="0 0 24 24" fill="none"><path d="M17 3l4 4-9 9-5 1 1-5 9-9Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M13 7l4 4" stroke="currentColor" stroke-width="1.6"/></svg>`,
        facade: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 21V9l8-6 8 6v12" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 21v-6h6v6" stroke="currentColor" stroke-width="1.6"/></svg>`,
        wallpaper: `<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M4 9c4 0 4 6 8 6s4-6 8-6" stroke="currentColor" stroke-width="1.4"/></svg>`,
        plaster: `<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" stroke-width="1.2" opacity=".5"/></svg>`,
        drywall: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="8" height="16" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="4" width="8" height="16" stroke="currentColor" stroke-width="1.6"/></svg>`,
        other: `<svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="18" cy="12" r="1.6" fill="currentColor"/></svg>`,

        rectangle: `<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="6" width="16" height="12" rx="1" stroke="currentColor" stroke-width="1.6"/></svg>`,
        lshape: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 4h10v8h6v8H4V4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
        sloped: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 18V6l16 4v8H4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
        multi: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="7" height="14" stroke="currentColor" stroke-width="1.5"/><rect x="14" y="5" width="7" height="14" stroke="currentColor" stroke-width="1.5"/></svg>`,
        custom: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 3"/></svg>`,

        walls: `<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" stroke="currentColor" stroke-width="1.6"/><path d="M4 12h16M12 4v16" stroke="currentColor" stroke-width="1.2"/></svg>`,
        ceiling: `<svg viewBox="0 0 24 24" fill="none"><path d="M3 8h18M3 8l3-4h12l3 4" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
        doors: `<svg viewBox="0 0 24 24" fill="none"><rect x="6" y="3" width="12" height="18" rx="1" stroke="currentColor" stroke-width="1.6"/><circle cx="15" cy="12" r="1" fill="currentColor"/></svg>`,
        windows: `<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" stroke="currentColor" stroke-width="1.6"/><path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="1.6"/></svg>`,
        radiator: `<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="7" width="16" height="10" rx="1" stroke="currentColor" stroke-width="1.6"/><path d="M8 7v10M12 7v10M16 7v10" stroke="currentColor" stroke-width="1.2"/></svg>`,
        stairs: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 20v-4h4v-4h4v-4h4V4h4" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
        house: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 11l8-7 8 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v10h12V10" stroke="currentColor" stroke-width="1.6"/></svg>`,
        fence: `<svg viewBox="0 0 24 24" fill="none"><path d="M5 4v16M12 4v16M19 4v16M3 9h18M3 15h18" stroke="currentColor" stroke-width="1.4"/></svg>`,

        good: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        minor: `<svg viewBox="0 0 24 24" fill="none"><path d="M13 2 5 14h6l-2 8 9-13h-6l1-7Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
        repair: `<svg viewBox="0 0 24 24" fill="none"><path d="M14 4l6 6-9 9H5v-6l9-9Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
        damp: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,

        calendar: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
        clock: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 7v5l4 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,

        own: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 11l8-7 8 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v10h12V10" stroke="currentColor" stroke-width="1.6"/></svg>`,
        rental: `<svg viewBox="0 0 24 24" fill="none"><circle cx="10" cy="8" r="4" stroke="currentColor" stroke-width="1.6"/><path d="M14 12l6 6M18 12l2 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
        commercial: `<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" stroke="currentColor" stroke-width="1.6"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`
    };

    const CHECK_SVG = `<svg viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-4-4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const BULB_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3 11.2c.6.4 1 1.1 1 1.8h4c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const UPLOAD_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 16V4M12 4l-4 4M12 4l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;

    /*==================================================
        STEP CONFIG
    ==================================================*/

    const WIZARD_STEPS = [
        {
            id: "workType", label: "Work", title: "What kind of work is this?",
            sub: "Pick the closest match — we'll refine details as we go.",
            type: "select",
            options: [
                { value: "painting", label: "Interior Painting", icon: "paint" },
                { value: "facade", label: "Facade Painting", icon: "facade" },
                { value: "wallpaper", label: "Wallpapering", icon: "wallpaper" },
                { value: "plaster", label: "Plastering", icon: "plaster" },
                { value: "drywall", label: "Drywall", icon: "drywall" },
                { value: "other", label: "Something Else", icon: "other" }
            ]
        },
        {
            id: "wallShape", label: "Wall Shape", title: "What shape are the walls?",
            sub: "A rough idea is enough — exact measurements come later if needed.",
            type: "select",
            options: [
                { value: "rectangle", label: "Rectangle", icon: "rectangle" },
                { value: "lshape", label: "L-Shape", icon: "lshape" },
                { value: "sloped", label: "Sloped / Attic", icon: "sloped" },
                { value: "multiple", label: "Multiple Walls", icon: "multi" },
                { value: "custom", label: "Custom / Not Sure", icon: "custom" }
            ]
        },
        {
            id: "areas", label: "Areas", title: "Which areas are affected?",
            sub: "Select everything that applies — you can pick more than one.",
            type: "multiselect",
            options: [
                { value: "walls", label: "Walls", icon: "walls" },
                { value: "ceiling", label: "Ceiling", icon: "ceiling" },
                { value: "doors", label: "Doors", icon: "doors" },
                { value: "windows", label: "Window Frames", icon: "windows" },
                { value: "radiators", label: "Radiators", icon: "radiator" },
                { value: "staircase", label: "Staircase / Corridor", icon: "stairs" },
                { value: "facade", label: "House Facade", icon: "house" },
                { value: "fence", label: "Fence", icon: "fence" },
                { value: "other", label: "Other", icon: "other" }
            ]
        },
        {
            id: "condition", label: "Condition", title: "What's the current condition?",
            sub: "This helps us understand how much prep work is involved.",
            type: "select",
            options: [
                { value: "good", label: "Good", desc: "Just needs a fresh coat", icon: "good" },
                { value: "minor", label: "Minor Marks or Cracks", desc: "Small touch-ups needed", icon: "minor" },
                { value: "repair", label: "Needs Repair", desc: "Holes, larger cracks or damage", icon: "repair" },
                { value: "damp", label: "Peeling or Damp", desc: "Flaking paint or moisture issues", icon: "damp" }
            ]
        },
        {
            id: "scope", label: "Scope", title: "How big is the scope?",
            sub: "A rough estimate is fine — we'll confirm exact measurements on-site.",
            type: "scope",
            options: [
                { value: "touchup", label: "Small Touch-Up", icon: "minor", needsArea: false },
                { value: "single", label: "Single Wall or Area", icon: "rectangle", needsArea: true },
                { value: "1-2rooms", label: "1–2 Rooms", icon: "walls", needsArea: true },
                { value: "2+rooms", label: "More Than 2 Rooms", icon: "multi", needsArea: true },
                { value: "wholehouse", label: "Whole House", icon: "house", needsArea: true },
                { value: "facade", label: "House Facade", icon: "facade", needsArea: true }
            ]
        },
        {
            id: "timing", label: "Timing", title: "When should this happen?", sub: null,
            type: "select",
            options: [
                { value: "asap", label: "As Soon As Possible", icon: "minor" },
                { value: "3months", label: "Next 3 Months", icon: "calendar" },
                { value: "3-6months", label: "In 3–6 Months", icon: "calendar" },
                { value: "flexible", label: "6–12 Months / Flexible", icon: "clock" }
            ]
        },
        {
            id: "situation", label: "Situation", title: "What's the situation?", sub: null,
            tip: "Renting and moving out? Booking 2–3 weeks ahead usually gets the best availability.",
            type: "select",
            options: [
                { value: "own", label: "Own Property", desc: "Your own home", icon: "own" },
                { value: "rental", label: "Rental", desc: "e.g. moving out", icon: "rental" },
                { value: "commercial", label: "Commercial / Office", desc: null, icon: "commercial" }
            ]
        },
        {
            id: "details", label: "Details", title: "Tell us a bit more",
            sub: "A sentence or two — and photos if you have them — helps painters quote accurately.",
            type: "text"
        },
        {
            id: "contact", label: "Contact", title: "Where should we send your quotes?",
            sub: "We'll match you with up to 3 vetted painters in your area.",
            type: "contact"
        }
    ];

    const TOTAL_STEPS = WIZARD_STEPS.length;

    /*==================================================
        STATE
    ==================================================*/

    let currentStep = 0;
    let selections = {};
    let areaValue = 24;
    let detailsText = "";
    let detailsPhotos = [];
    let contactValues = { firstName: "", lastName: "", email: "", phone: "", postcode: "", city: "" };
    let consentChecked = false;

    function resetWizardState() {
        currentStep = 0;
        selections = {};
        areaValue = 24;
        detailsText = "";
        detailsPhotos = [];
        contactValues = { firstName: "", lastName: "", email: "", phone: "", postcode: "", city: "" };
        consentChecked = false;
    }

    /*==================================================
        OPEN / CLOSE
    ==================================================*/

    function openWizard() {
        resetWizardState();
        buildProgressSegments();
        wizard.classList.add("open");
        document.body.style.overflow = "hidden";
        renderStep();
    }

    function closeWizard() {
        wizard.classList.remove("open");
        document.body.style.overflow = "";
    }

    openBtn.addEventListener("click", openWizard);
    closeBtn?.addEventListener("click", closeWizard);

    // Click on the dark backdrop (outside the shell) closes it too.
    wizard.addEventListener("click", (e) => {
        if (e.target === wizard) closeWizard();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && wizard.classList.contains("open")) closeWizard();
    });

    /*==================================================
        PROGRESS BAR
    ==================================================*/

    function buildProgressSegments() {
        progressEl.innerHTML = WIZARD_STEPS
            .map(() => `<div class="wizard-progress-seg"><span></span></div>`)
            .join("");
    }

    function updateProgress() {
        const segs = progressEl.querySelectorAll(".wizard-progress-seg span");
        segs.forEach((span, i) => {
            span.style.width = i <= currentStep ? "100%" : "0%";
        });
    }

    /*==================================================
        SIDEBAR
    ==================================================*/

    function selectionSummary(step) {

        if (step.type === "select" || step.type === "scope") {
            const val = selections[step.id];
            if (!val) return null;
            const opt = step.options.find(o => o.value === val);
            if (!opt) return null;
            if (step.type === "scope" && opt.needsArea) {
                return `${opt.label} · ~${areaValue} m²`;
            }
            return opt.label;
        }

        if (step.type === "multiselect") {
            const vals = selections[step.id];
            if (!vals || !vals.length) return null;
            return vals.map(v => step.options.find(o => o.value === v)?.label).filter(Boolean).join(", ");
        }

        return null;
    }

    function updateSidebar() {

        const workOpt = WIZARD_STEPS[0].options.find(o => o.value === selections.workType);
        sideTitleEl.textContent = workOpt ? `Your ${workOpt.label} Project` : "Your Project";

        const rowsHTML = WIZARD_STEPS
            .map(step => {
                const summary = selectionSummary(step);
                if (!summary) return "";
                return `
                    <div class="wizard-selection-row">
                        <span class="wizard-selection-check">${CHECK_SVG}</span>
                        <div>
                            <span class="wizard-selection-label">${step.label}</span>
                            <span class="wizard-selection-value">${summary}</span>
                        </div>
                    </div>
                `;
            })
            .join("");

        selectionsEl.innerHTML = rowsHTML;

        // Stagger the rows in on the next frame so newly-added ones animate.
        requestAnimationFrame(() => {
            selectionsEl.querySelectorAll(".wizard-selection-row").forEach(row => {
                row.classList.add("show");
            });
        });

        const remaining = TOTAL_STEPS - currentStep - 1;
        stepsLeftLabelEl.textContent = remaining <= 0
            ? "Last step to your offers"
            : `${remaining} step${remaining === 1 ? "" : "s"} to your offers`;

        stepsLeftFillEl.style.width = `${((currentStep + 1) / TOTAL_STEPS) * 100}%`;

    }

    /*==================================================
        STEP RENDERING
    ==================================================*/

    function optionGridHTML(step, isMulti) {

        return `
            <div class="wizard-option-grid">
                ${step.options.map(opt => {

            const selected = isMulti
                ? (selections[step.id] || []).includes(opt.value)
                : selections[step.id] === opt.value;

            return `
                        <button type="button" class="wizard-option ${selected ? "selected" : ""}" data-value="${opt.value}">
                            <span class="wizard-option-check">${CHECK_SVG}</span>
                            <span class="wizard-option-icon">${ICONS[opt.icon] || ""}</span>
                            <span class="wizard-option-label">${opt.label}</span>
                            ${opt.desc ? `<span class="wizard-option-desc">${opt.desc}</span>` : ""}
                        </button>
                    `;

        }).join("")}
            </div>
        `;

    }

    function stepperHTML() {
        return `
            <div class="wizard-stepper-wrap">
                <div class="wizard-stepper-label">Approximate area</div>
                <div class="wizard-stepper">
                    <button type="button" class="wizard-stepper-btn" id="wizardAreaMinus" aria-label="Decrease">&minus;</button>
                    <div class="wizard-stepper-value" id="wizardAreaValue">${areaValue}<span>m²</span></div>
                    <button type="button" class="wizard-stepper-btn" id="wizardAreaPlus" aria-label="Increase">+</button>
                </div>
            </div>
        `;
    }

    function renderStep() {

        const step = WIZARD_STEPS[currentStep];

        let bodyHTML = "";

        if (step.type === "select") {
            bodyHTML = optionGridHTML(step, false);
        } else if (step.type === "multiselect") {
            bodyHTML = optionGridHTML(step, true);
        } else if (step.type === "scope") {
            const selectedOpt = step.options.find(o => o.value === selections[step.id]);
            bodyHTML = optionGridHTML(step, false) + (selectedOpt?.needsArea ? stepperHTML() : "");
        } else if (step.type === "text") {
            bodyHTML = `
                <textarea class="wizard-textarea" id="wizardDetailsText" placeholder="e.g. Living room and hallway, walls are slightly faded, would like a light grey finish...">${detailsText}</textarea>
                <label class="wizard-upload" id="wizardUploadZone">
                    <input type="file" id="wizardPhotoInput" accept="image/*" multiple hidden>
                    <span class="wizard-upload-icon">${UPLOAD_SVG}</span>
                    <span class="wizard-upload-text"><b>Add photos</b> — optional, drag & drop or click</span>
                    <span class="wizard-upload-count" id="wizardUploadCount"></span>
                </label>
            `;
        } else if (step.type === "contact") {
            bodyHTML = `
                <div class="wizard-form-grid">
                    <div class="wizard-field">
                        <label for="wizardFirstName">First name (optional)</label>
                        <input type="text" id="wizardFirstName" value="${contactValues.firstName}" placeholder="Jane">
                    </div>
                    <div class="wizard-field">
                        <label for="wizardLastName">Last name</label>
                        <input type="text" id="wizardLastName" value="${contactValues.lastName}" placeholder="Doe">
                    </div>
                </div>
                <div class="wizard-form-grid full">
                    <div class="wizard-field">
                        <label for="wizardEmail">Email address</label>
                        <input type="email" id="wizardEmail" value="${contactValues.email}" placeholder="jane@example.com">
                    </div>
                </div>
                <div class="wizard-form-grid full">
                    <div class="wizard-field">
                        <label for="wizardPhone">Phone number</label>
                        <input type="tel" id="wizardPhone" value="${contactValues.phone}" placeholder="079 123 45 67">
                    </div>
                </div>
                <div class="wizard-form-grid">
                    <div class="wizard-field">
                        <label for="wizardPostcode">Postcode</label>
                        <input type="text" id="wizardPostcode" value="${contactValues.postcode}" placeholder="e.g. 8001">
                    </div>
                    <div class="wizard-field">
                        <label for="wizardCity">City</label>
                        <input type="text" id="wizardCity" value="${contactValues.city}" placeholder="e.g. Zurich">
                    </div>
                </div>
                <label class="wizard-consent">
                    <input type="checkbox" id="wizardConsent" ${consentChecked ? "checked" : ""}>
                    <span>I have read and accept the terms and privacy policy.</span>
                </label>
                <div class="wizard-privacy-note">
                    🔒 Your details are sent securely and used only to match you with painters.
                </div>
            `;
        }

        stepContentEl.innerHTML = `
            <span class="wizard-step-eyebrow">STEP ${currentStep + 1} / ${TOTAL_STEPS}</span>
            <h3 class="wizard-step-title">${step.title}</h3>
            ${step.sub ? `<p class="wizard-step-sub">${step.sub}</p>` : ""}
            ${step.tip ? `
                <div class="wizard-tip">
                    ${BULB_SVG}
                    <p>${step.tip}</p>
                </div>
            ` : ""}
            ${bodyHTML}
        `;

        bindStepEvents(step);
        updateNavState(step);
        updateProgress();
        updateSidebar();

        // Reset scroll position on the main panel for each new step.
        document.querySelector(".wizard-main")?.scrollTo({ top: 0 });

    }

    /*==================================================
        EVENT BINDING (re-bound on every render, since
        stepContentEl's innerHTML is fully replaced each
        time)
    ==================================================*/

    function bindStepEvents(step) {

        if (step.type === "select" || step.type === "multiselect" || step.type === "scope") {

            stepContentEl.querySelectorAll(".wizard-option").forEach(btn => {

                btn.addEventListener("click", () => {

                    const value = btn.dataset.value;

                    if (step.type === "multiselect") {
                        const current = selections[step.id] || [];
                        selections[step.id] = current.includes(value)
                            ? current.filter(v => v !== value)
                            : [...current, value];
                    } else {
                        selections[step.id] = value;
                    }

                    renderStep();

                });

            });

        }

        if (step.type === "scope") {

            const minus = document.getElementById("wizardAreaMinus");
            const plus = document.getElementById("wizardAreaPlus");
            const valueEl = document.getElementById("wizardAreaValue");

            minus?.addEventListener("click", () => {
                areaValue = Math.max(4, areaValue - 2);
                if (valueEl) valueEl.innerHTML = `${areaValue}<span>m²</span>`;
                updateSidebar();
            });

            plus?.addEventListener("click", () => {
                areaValue = Math.min(600, areaValue + 2);
                if (valueEl) valueEl.innerHTML = `${areaValue}<span>m²</span>`;
                updateSidebar();
            });

        }

        if (step.type === "text") {

            const textarea = document.getElementById("wizardDetailsText");
            textarea?.addEventListener("input", () => {
                detailsText = textarea.value;
            });

            const uploadZone = document.getElementById("wizardUploadZone");
            const photoInput = document.getElementById("wizardPhotoInput");
            const countEl = document.getElementById("wizardUploadCount");

            function refreshCount() {
                if (!countEl) return;
                countEl.textContent = detailsPhotos.length
                    ? `${detailsPhotos.length} photo${detailsPhotos.length > 1 ? "s" : ""} added`
                    : "";
            }

            function addFiles(fileList) {
                Array.from(fileList).forEach(f => {
                    if (f.type.startsWith("image/") && detailsPhotos.length < 10) {
                        detailsPhotos.push(f);
                    }
                });
                refreshCount();
            }

            photoInput?.addEventListener("change", (e) => addFiles(e.target.files));

            ["dragenter", "dragover"].forEach(evt => {
                uploadZone?.addEventListener(evt, (e) => {
                    e.preventDefault();
                    uploadZone.classList.add("dragging");
                });
            });

            ["dragleave", "drop"].forEach(evt => {
                uploadZone?.addEventListener(evt, (e) => {
                    e.preventDefault();
                    uploadZone.classList.remove("dragging");
                });
            });

            uploadZone?.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));

            refreshCount();

        }

        if (step.type === "contact") {

            const fields = {
                firstName: document.getElementById("wizardFirstName"),
                lastName: document.getElementById("wizardLastName"),
                email: document.getElementById("wizardEmail"),
                phone: document.getElementById("wizardPhone"),
                postcode: document.getElementById("wizardPostcode"),
                city: document.getElementById("wizardCity")
            };

            Object.keys(fields).forEach(key => {
                fields[key]?.addEventListener("input", () => {
                    contactValues[key] = fields[key].value;
                    updateNavState(step);
                });
            });

            const consentInput = document.getElementById("wizardConsent");
            consentInput?.addEventListener("change", () => {
                consentChecked = consentInput.checked;
                updateNavState(step);
            });

        }

    }

    /*==================================================
        NAV STATE (back / skip / continue)
    ==================================================*/

    function isStepValid(step) {

        if (step.type === "select") return !!selections[step.id];

        if (step.type === "multiselect") return (selections[step.id] || []).length > 0;

        if (step.type === "scope") {
            const val = selections[step.id];
            if (!val) return false;
            const opt = step.options.find(o => o.value === val);
            return !opt?.needsArea || areaValue > 0;
        }

        if (step.type === "text") return true; // optional step

        if (step.type === "contact") {
            return contactValues.lastName.trim() !== "" &&
                /\S+@\S+\.\S+/.test(contactValues.email) &&
                consentChecked;
        }

        return true;

    }

    function updateNavState(step) {

        backBtn.style.visibility = currentStep === 0 ? "hidden" : "visible";
        skipBtn.style.display = step.type === "text" ? "inline-flex" : "none";

        continueBtn.disabled = !isStepValid(step);
        continueBtn.textContent = currentStep === TOTAL_STEPS - 1
            ? "Request My Free Quotes"
            : "Continue";

    }

    backBtn.addEventListener("click", () => {
        if (currentStep === 0) return;
        currentStep -= 1;
        renderStep();
    });

    skipBtn.addEventListener("click", () => {
        goToNextStep();
    });

    continueBtn.addEventListener("click", () => {
        const step = WIZARD_STEPS[currentStep];
        if (!isStepValid(step)) return;
        goToNextStep();
    });

    function goToNextStep() {
        if (currentStep === TOTAL_STEPS - 1) {
            submitWizard();
            return;
        }
        currentStep += 1;
        renderStep();
    }

    /*==================================================
        SUBMIT

        HOOK YOUR BACKEND CALL HERE. `selections`,
        `areaValue`, `detailsText`, `detailsPhotos` and
        `contactValues` are all plain, easily serialized
        state — once there's a real endpoint (and pricing
        rules to go with it), something like:

          const formData = new FormData();
          formData.append("payload", JSON.stringify({
              selections, areaValue, detailsText, contactValues
          }));
          detailsPhotos.forEach(f => formData.append("photos", f));

          fetch("/api/quotes", { method: "POST", body: formData })
              .then(res => res.json())
              .then(() => { closeWizard(); window.wizardSuccess?.open(); })
              .catch(err => { showErrorState(err); });

        For now it just opens the success confirmation directly.
    ==================================================*/

    function submitWizard() {
        closeWizard();
        window.wizardSuccess?.open();
    }

    /*==================================================
        SECTION REVEAL (same pattern as the rest of the site)
    ==================================================*/

    if (quoteSection) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: .2 });

        revealObserver.observe(quoteSection);
    }

});

// SUCCESS MODAL

document.addEventListener("DOMContentLoaded", () => {

    const successModal = document.getElementById("successModal");
    const successClose = document.getElementById("successModalClose");
    const successDone = document.getElementById("successDoneBtn");
    const particlesHost = document.getElementById("successParticles");

    if (!successModal) return;

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
        OPEN / CLOSE — exposed on window.wizardSuccess so
        the quote wizard's final submit step (see the
        QUOTE WIZARD block further down) can trigger this
        same confirmation without needing to know anything
        about how it's built.
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

    window.wizardSuccess = { open: openSuccess, close: closeSuccess };

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

    {
        name: "Natasha Fischer",
        city: "Switzerland",
        rating: 5,
        quote: "We are absolutely thrilled with Patricio's work. Both interior and exterior walls were painted perfectly. The work was clean, precise, and completed with great attention to detail."
    },

    {
        name: "Bettina Marinelli",
        city: "Switzerland",
        rating: 5,
        quote: "Our ground floor, entrance, living room, kitchen, stairwell and doors were beautifully painted. Expert advice, careful execution, and excellent quality."
    },

    {
        name: "Melanie Bryan",
        city: "Aarau",
        rating: 5,
        quote: "Amigos Maler provided expert advice and professional service. They were dedicated, helpful, and delivered outstanding results."
    },

    {
        name: "Sabiduri 1010",
        city: "Switzerland",
        rating: 5,
        quote: "I needed help painting my office wall and couldn't have wished for a better person. Professional, reliable, and excellent work."
    },

    {
        name: "Rineta Slishani",
        city: "Switzerland",
        rating: 5,
        quote: "Highly recommended! The work was completed reliably, on schedule, and with excellent quality."
    },

    {
        name: "P",
        city: "Switzerland",
        rating: 5,
        quote: "We have already trusted Amigos with multiple jobs. Their plastering and painting work was completed professionally and beautifully."
    },

    {
        name: "Corinne Sittmann",
        city: "Switzerland",
        rating: 5,
        quote: "Very friendly and competent advice. The work was completed quickly and to a high standard. I would definitely hire Amigos again."
    },

    {
        name: "Erich Leimgruber",
        city: "Switzerland",
        rating: 5,
        quote: "The workers are very competent, clean, and precise. The price-performance ratio is excellent."
    },

    {
        name: "Benjamin Allemann",
        city: "Switzerland",
        rating: 5,
        quote: "You guys are great, friendly, and very helpful. We would book you again anytime."
    },

    {
        name: "Matteo Müller",
        city: "Switzerland",
        rating: 5,
        quote: "Excellent professionalism and dedication. Amigos provided great advice on colors and materials from the beginning."
    },

    {
        name: "Nicole Stadelmann",
        city: "Switzerland",
        rating: 5,
        quote: "Friendly service, excellent quality, and fair prices — everything you could want from a painting company."
    },

    {
        name: "Michael Niederle",
        city: "Switzerland",
        rating: 5,
        quote: "Fast communication, professional consultation, fair pricing, and the work was completed perfectly on time."
    },

    {
        name: "Hubert Strohmeier",
        city: "Switzerland",
        rating: 5,
        quote: "The windows of my apartment building were repainted beautifully. Excellent workmanship, completed on time and within budget."
    },

    {
        name: "Luca I.",
        city: "Switzerland",
        rating: 5,
        quote: "Very satisfied with the plastering and painting work. Friendly, efficient, professional service with a top-quality result."
    },

    {
        name: "Kevin Plüss",
        city: "Switzerland",
        rating: 5,
        quote: "Everything went perfectly from the first quote to the final painting work. Expectations were fully exceeded."
    },

    {
        name: "V M",
        city: "Switzerland",
        rating: 5,
        quote: "Amigos Painting Company is everything you could wish for — professional, reliable, and excellent value for money."
    },

    {
        name: "Heidi Jonch-Clausen",
        city: "Switzerland",
        rating: 5,
        quote: "Absolutely fantastic service, fast and efficient work, and a beautiful final result. Highly recommended."
    },

    {
        name: "Bahadir Sahin",
        city: "Switzerland",
        rating: 5,
        quote: "A very personable managing director who completes work quickly, professionally, and exactly according to expectations."
    },

    {
        name: "Bestattungen Nisio AG",
        city: "Switzerland",
        rating: 5,
        quote: "Careful and professional workmanship with a wonderful result. Everything was perfect."
    },

    {
        name: "Peter Gutknecht",
        city: "Switzerland",
        rating: 5,
        quote: "Everything went perfectly and the quality is excellent. I would recommend Amigos again without hesitation."
    },

    {
        name: "Andreas Rocci",
        city: "Switzerland",
        rating: 5,
        quote: "Thank you very much for your work. Quick, organized, and highly recommended."
    },

    {
        name: "Tanja Friedli",
        city: "Switzerland",
        rating: 5,
        quote: "Excellent work, very friendly service, precise execution, and highly recommended."
    },

    {
        name: "Aline Bammert",
        city: "Switzerland",
        rating: 5,
        quote: "Competent, honest, and friendly service during repair work."
    },

    {
        name: "Max Husi",
        city: "Switzerland",
        rating: 5,
        quote: "Friendly, dedicated service with great value for money."
    },

    {
        name: "Elsel Elsel",
        city: "Switzerland",
        rating: 5,
        quote: "Excellent work. Highly recommended."
    },

    {
        name: "Giorgy",
        city: "Switzerland",
        rating: 5,
        quote: "Thank you so much for the great work!"
    },

    {
        name: "Anthony Troy",
        city: "Switzerland",
        rating: 5,
        quote: "Completely satisfied with Amigos Maler GmbH. The team worked cleanly, reliably, and professionally. The result exceeded expectations."
    }

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
            <div class="stars">
            ${"★".repeat(t.rating || 5)}
            </div>
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
    PROJECTS SECTION — COVERFLOW CAROUSEL
==================================================== */
const PROJECTS_DATA = [

    // ===== Painting =====
    {
        category: "painting",
        type: "Interior Repaint",
        location: "Bern, BE",
        service: "Painting & Renovation Work",
        before: "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?auto=format&fit=crop&w=1000&q=80",
        after: "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=1000&q=80"
    },
    {
        category: "painting",
        type: "Ceiling & Wall Painting",
        location: "Thun, BE",
        service: "Painting & Renovation Work",
        before: "https://images.unsplash.com/photo-1674376360445-2996327553e7?auto=format&fit=crop&w=1000&q=80",
        after: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1000&q=80"
    },
    {
        category: "painting",
        type: "Living Room Refresh",
        location: "Lucerne, LU",
        service: "Painting & Renovation Work",
        before: "https://images.unsplash.com/photo-1647996179012-66b87eba3d17?auto=format&fit=crop&w=1000&q=80",
        after: "https://images.unsplash.com/photo-1532490389938-2856e3f1560a?auto=format&fit=crop&w=1000&q=80"
    },

    // ===== Facade Restoration =====
    {
        category: "facade",
        type: "Facade Renovation",
        location: "Olten, SO",
        service: "Maler- & Sanierungsarbeiten",
        before: "https://images.unsplash.com/photo-1753893558281-9acda0662bbd?auto=format&fit=crop&w=1000&q=80",
        after: "https://images.unsplash.com/photo-1613061538705-01190bb0e3b8?auto=format&fit=crop&w=1000&q=80"
    },
    {
        category: "facade",
        type: "Building Exterior Restoration",
        location: "Aarau, AG",
        service: "Facade Restoration",
        before: "https://images.unsplash.com/photo-1602757115429-b4190ae087be?auto=format&fit=crop&w=1000&q=80",
        after: "https://images.unsplash.com/photo-1600596525163-36b26caa9c89?auto=format&fit=crop&w=1000&q=80"
    },
    {
        category: "facade",
        type: "Facade Repaint",
        location: "Winterthur, ZH",
        service: "Facade Restoration",
        before: "https://images.unsplash.com/photo-1478979464727-af7d24e18554?auto=format&fit=crop&w=1000&q=80",
        after: "https://images.unsplash.com/photo-1481253127861-534498168948?auto=format&fit=crop&w=1000&q=80"
    },

    // ===== Drywall =====
    {
        category: "drywall",
        type: "Drywall Installation",
        location: "Basel, BS",
        service: "Drywall Services",
        before: "https://images.unsplash.com/photo-1704742950992-9815a104820c?auto=format&fit=crop&w=1000&q=80",
        after: "https://images.unsplash.com/photo-1733431772808-82d878e59000?auto=format&fit=crop&w=1000&q=80"
    },
    {
        category: "drywall",
        type: "Wall Board Finishing",
        location: "Zurich, ZH",
        service: "Drywall Services",
        before: "https://images.unsplash.com/photo-1768321903410-54961e343b71?auto=format&fit=crop&w=1000&q=80",
        after: "https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?auto=format&fit=crop&w=1000&q=80"
    },
    {
        category: "drywall",
        type: "Basement Drywall Finish",
        location: "Thun, BE",
        service: "Drywall Services",
        before: "https://images.unsplash.com/photo-1770838772836-6de311c35a91?auto=format&fit=crop&w=1000&q=80",
        after: "https://images.unsplash.com/photo-1733431774078-692252a6605e?auto=format&fit=crop&w=1000&q=80"
    }

];
/* =====================================================
   PROJECTS CAROUSEL
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const section = document.getElementById("projectsSection");
    const viewport = document.getElementById("projViewport");
    const track = document.getElementById("projTrack");

    const dotsWrap = document.getElementById("projDots");

    const prevBtn = document.getElementById("projPrev");
    const nextBtn = document.getElementById("projNext");

    const dock = document.getElementById("projectsDock");
    const indicator = document.getElementById("dockIndicator");

    const tabs = Array.from(
        document.querySelectorAll(".dock-tab")
    );


    if (
        !section ||
        !viewport ||
        !track ||
        !dotsWrap
    ) {
        return;
    }


    /* =================================================
       STATE
    ================================================= */

    let currentCategory = "painting";

    let projects = [];

    let activeIndex = 0;

    let isAnimating = false;

    let dragStartX = null;

    let dragDelta = 0;

    let didDrag = false;

    let resizeTimer = null;


    /* =================================================
       HELPERS
    ================================================= */

    function normalizeIndex(index) {

        const total = projects.length;

        if (!total) return 0;

        return (
            (index % total) + total
        ) % total;

    }


    function getRelativeIndex(index) {

        const total = projects.length;

        let diff =
            index - activeIndex;


        /*
            Example with 3 cards:

            active 0:
            card 0 =  0
            card 1 =  1
            card 2 = -1

            active 1:
            card 0 = -1
            card 1 =  0
            card 2 =  1

            This guarantees one card on each side
            with perfectly symmetrical spacing.
        */

        if (diff > total / 2) {
            diff -= total;
        }

        if (diff < -total / 2) {
            diff += total;
        }

        return diff;

    }


    function getLayoutValues(relativeIndex) {

        const width =
            viewport.clientWidth;

        const mobile =
            width <= 700;

        const tablet =
            width <= 1100;


        /*
            The key difference from your old carousel:

            Position is based on VIEWPORT size,
            not the card's changing/scaled width.

            Therefore the left and right cards always
            remain exactly symmetrical.
        */

        let sideDistance;


        if (mobile) {

            sideDistance =
                Math.min(
                    width * 0.72,
                    285
                );

        }

        else if (tablet) {

            sideDistance =
                Math.min(
                    width * 0.42,
                    390
                );

        }

        else {

            sideDistance =
                Math.min(
                    width * 0.36,
                    520
                );

        }


        const distance =
            Math.abs(relativeIndex);


        /*
            ACTIVE
        */

        if (relativeIndex === 0) {

            return {
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                blur: 0,
                zIndex: 30
            };

        }


        /*
            DIRECT LEFT / RIGHT NEIGHBOR
        */

        if (distance === 1) {

            return {
                x:
                    relativeIndex *
                    sideDistance,

                y: 12,

                scale:
                    mobile
                        ? 0.88
                        : 0.90,

                opacity:
                    mobile
                        ? 0.38
                        : 0.45,

                blur:
                    mobile
                        ? 1.5
                        : 1,

                zIndex: 20
            };

        }


        /*
            ANYTHING FURTHER AWAY
        */

        return {

            x:
                relativeIndex > 0
                    ? sideDistance * 1.7
                    : -sideDistance * 1.7,

            y: 20,

            scale: 0.80,

            opacity: 0,

            blur: 4,

            zIndex: 1
        };

    }


    /* =================================================
       CARD MARKUP
    ================================================= */

    function createCard(project, index) {

        const card =
            document.createElement("article");


        card.className =
            "proj-card";


        card.dataset.index =
            index;


        card.innerHTML = `

            <div class="proj-card-image">

                <img
                    src="${project.after}"
                    alt="${project.type}"
                    draggable="false"
                >

            </div>


            <div class="proj-card-info">

                <span class="proj-card-count">

                    ${String(index + 1).padStart(2, "0")}
                    /
                    ${String(projects.length).padStart(2, "0")}

                </span>


                <span class="proj-card-loc">

                    ${project.location}
                    ·
                    ${project.service}

                </span>


                <h3>
                    ${project.type}
                </h3>

            </div>

        `;


        card.addEventListener(
            "click",
            () => {

                if (didDrag) return;


                const index =
                    Number(
                        card.dataset.index
                    );


                if (
                    index !==
                    activeIndex
                ) {

                    goTo(
                        index
                    );

                }

            }
        );


        return card;

    }


    /* =================================================
       DOTS
    ================================================= */

    function buildDots() {

        dotsWrap.innerHTML = "";


        projects.forEach(
            (_, index) => {

                const dot =
                    document.createElement(
                        "button"
                    );


                dot.className =
                    "proj-dot";


                dot.type =
                    "button";


                dot.setAttribute(
                    "aria-label",
                    `View project ${index + 1}`
                );


                dot.addEventListener(
                    "click",
                    () => {

                        goTo(index);

                    }
                );


                dotsWrap.appendChild(
                    dot
                );

            }
        );

    }


    function updateDots() {

        const dots =
            dotsWrap.querySelectorAll(
                ".proj-dot"
            );


        dots.forEach(
            (dot, index) => {

                dot.classList.toggle(
                    "active",
                    index === activeIndex
                );

            }
        );

    }


    /* =================================================
       LAYOUT
    ================================================= */

    function positionCards(
        animate = true
    ) {

        const cards =
            Array.from(
                track.querySelectorAll(
                    ".proj-card"
                )
            );


        if (!cards.length) {
            return;
        }


        cards.forEach(
            (card, index) => {

                const relative =
                    getRelativeIndex(
                        index
                    );


                const layout =
                    getLayoutValues(
                        relative
                    );


                card.classList.toggle(
                    "is-active",
                    relative === 0
                );


                card.style.pointerEvents =
                    Math.abs(relative) <= 1
                        ? "auto"
                        : "none";


                const properties = {

                    xPercent: -50,

                    yPercent: -50,

                    x:
                        layout.x,

                    y:
                        layout.y,

                    scale:
                        layout.scale,

                    opacity:
                        layout.opacity,

                    filter:
                        `blur(${layout.blur}px)`,

                    zIndex:
                        layout.zIndex,

                    force3D: true,

                    overwrite: true

                };


                if (!animate) {

                    gsap.set(
                        card,
                        properties
                    );

                    return;

                }


                gsap.to(
                    card,
                    {

                        ...properties,

                        duration: 0.72,

                        ease:
                            "power4.inOut"

                    }
                );

            }
        );


        updateDots();

    }


    /* =================================================
       NAVIGATION
    ================================================= */

    function goTo(index) {

        if (
            isAnimating ||
            projects.length <= 1
        ) {
            return;
        }


        const nextIndex =
            normalizeIndex(index);


        if (
            nextIndex ===
            activeIndex
        ) {
            return;
        }


        isAnimating =
            true;


        activeIndex =
            nextIndex;


        positionCards(true);


        /*
            Prevent rapid multiple clicks from
            fighting the same GSAP animation.
        */

        window.setTimeout(
            () => {

                isAnimating = false;

            },
            560
        );

    }


    function goNext() {

        goTo(
            activeIndex + 1
        );

    }


    function goPrev() {

        goTo(
            activeIndex - 1
        );

    }


    prevBtn?.addEventListener(
        "click",
        goPrev
    );


    nextBtn?.addEventListener(
        "click",
        goNext
    );


    /* =================================================
       DRAG / SWIPE
    ================================================= */

    viewport.addEventListener(
        "pointerdown",
        (event) => {

            if (
                event.pointerType ===
                "mouse" &&
                event.button !== 0
            ) {
                return;
            }


            dragStartX =
                event.clientX;

            dragDelta =
                0;

            didDrag =
                false;


            viewport.setPointerCapture?.(
                event.pointerId
            );

        }
    );


    viewport.addEventListener(
        "pointermove",
        (event) => {

            if (
                dragStartX === null
            ) {
                return;
            }


            dragDelta =
                event.clientX -
                dragStartX;


            if (
                Math.abs(
                    dragDelta
                ) > 8
            ) {

                didDrag =
                    true;

            }

        }
    );


    viewport.addEventListener(
        "pointerup",
        (event) => {

            if (
                dragStartX === null
            ) {
                return;
            }


            const threshold =
                Math.min(
                    70,
                    viewport.clientWidth *
                    0.12
                );


            if (
                Math.abs(
                    dragDelta
                ) >= threshold
            ) {

                if (
                    dragDelta < 0
                ) {

                    goNext();

                }

                else {

                    goPrev();

                }

            }


            dragStartX =
                null;

            dragDelta =
                0;


            /*
                Delay reset so the click event
                after pointerup doesn't activate
                the card accidentally.
            */

            requestAnimationFrame(
                () => {

                    requestAnimationFrame(
                        () => {

                            didDrag =
                                false;

                        }
                    );

                }
            );


            try {

                viewport
                    .releasePointerCapture(
                        event.pointerId
                    );

            }

            catch (_) { }

        }
    );


    viewport.addEventListener(
        "pointercancel",
        () => {

            dragStartX =
                null;

            dragDelta =
                0;

            didDrag =
                false;

        }
    );


    /* =================================================
       KEYBOARD
    ================================================= */

    let sectionVisible =
        false;


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        sectionVisible =
                            entry.isIntersecting;

                    }
                );

            },
            {
                threshold: 0.3
            }
        );


    observer.observe(
        section
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                !sectionVisible
            ) {
                return;
            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                goPrev();

            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                goNext();

            }

        }
    );


    /* =================================================
       CATEGORY RENDERING
    ================================================= */

    function renderCategory(
        category,
        animateEntrance = true
    ) {

        projects =
            PROJECTS_DATA.filter(
                project =>
                    project.category ===
                    category
            );


        activeIndex =
            0;


        track.innerHTML =
            "";


        projects.forEach(
            (project, index) => {

                track.appendChild(
                    createCard(
                        project,
                        index
                    )
                );

            }
        );


        buildDots();


        /*
            Important:
            Wait one frame so CSS has calculated
            the responsive card sizes before
            calculating slider positions.
        */

        requestAnimationFrame(
            () => {

                positionCards(
                    false
                );


                if (
                    animateEntrance
                ) {

                    gsap.fromTo(
                        track,
                        {
                            opacity: 0,
                            y: 18
                        },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.55,
                            ease:
                                "power3.out"
                        }
                    );

                }

                else {

                    gsap.set(
                        track,
                        {
                            opacity: 1,
                            y: 0
                        }
                    );

                }

            }
        );

    }


    /* =================================================
       CATEGORY TABS
    ================================================= */

    function moveIndicatorTo(
        tab,
        animate = true
    ) {

        if (
            !dock ||
            !indicator ||
            !tab
        ) {
            return;
        }


        const dockRect =
            dock.getBoundingClientRect();


        const tabRect =
            tab.getBoundingClientRect();


        const x =
            tabRect.left -
            dockRect.left -
            8;


        if (!animate) {

            gsap.set(
                indicator,
                {
                    x,
                    width:
                        tabRect.width
                }
            );

            return;

        }


        gsap.to(
            indicator,
            {

                x,

                width:
                    tabRect.width,

                duration: 0.45,

                ease:
                    "power3.inOut",

                overwrite: true

            }
        );

    }


    tabs.forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    const category =
                        tab.dataset.filter;


                    if (
                        category ===
                        currentCategory
                    ) {
                        return;
                    }


                    currentCategory =
                        category;


                    tabs.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    tab.classList.add(
                        "active"
                    );


                    moveIndicatorTo(
                        tab
                    );


                    gsap.to(
                        track,
                        {

                            opacity: 0,

                            y: -10,

                            duration: 0.25,

                            ease:
                                "power2.in",

                            onComplete:
                                () => {

                                    renderCategory(
                                        category,
                                        true
                                    );

                                }

                        }
                    );

                }
            );

        }
    );


    /* =================================================
       RESIZE
    ================================================= */

    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    () => {

                        /*
                            No state rebuilding is necessary.

                            We simply calculate the correct
                            responsive spacing again.
                        */

                        positionCards(
                            false
                        );


                        const activeTab =
                            document.querySelector(
                                ".dock-tab.active"
                            );


                        moveIndicatorTo(
                            activeTab,
                            false
                        );

                    },
                    120
                );

        }
    );


    /* =================================================
       PROJECT FILTER DOCK VISIBILITY
    ================================================= */

    if (
        dock &&
        typeof ScrollTrigger !==
        "undefined"
    ) {

        gsap.set(
            dock,
            {

                opacity: 0,

                y: 25,

                scale: 0.92,

                filter:
                    "blur(12px)"

            }
        );


        function showDock() {

            dock.style.pointerEvents =
                "auto";


            gsap.to(
                dock,
                {

                    opacity: 1,

                    y: 0,

                    scale: 1,

                    filter:
                        "blur(0px)",

                    duration: 0.55,

                    ease:
                        "power3.out",

                    overwrite: true

                }
            );

        }


        function hideDock() {

            dock.style.pointerEvents =
                "none";


            gsap.to(
                dock,
                {

                    opacity: 0,

                    y: 20,

                    scale: 0.94,

                    filter:
                        "blur(10px)",

                    duration: 0.38,

                    ease:
                        "power2.in",

                    overwrite: true

                }
            );

        }


        ScrollTrigger.create({

            trigger:
                section,

            start:
                "top 75%",

            end:
                "bottom 18%",

            onEnter:
                showDock,

            onEnterBack:
                showDock,

            onLeave:
                hideDock,

            onLeaveBack:
                hideDock

        });

    }


    /* =================================================
       INITIALIZE
    ================================================= */

    renderCategory(
        currentCategory,
        false
    );


    requestAnimationFrame(
        () => {

            requestAnimationFrame(
                () => {

                    const activeTab =
                        document.querySelector(
                            ".dock-tab.active"
                        );


                    moveIndicatorTo(
                        activeTab,
                        false
                    );

                }
            );

        }
    );

});

// PLANS JS
/* =====================================================
   PLANS SECTION
   Premium Reveal + Billing Toggle
===================================================== */

(() => {

    const section = document.querySelector(".plans-section");

    if (!section) return;


    const headerItems = section.querySelectorAll(
        ".plans-header > *"
    );

    const cards = section.querySelectorAll(
        ".plan-card"
    );

    const buttons = section.querySelectorAll(
        ".billing-toggle button"
    );

    const prices = section.querySelectorAll(
        ".price strong"
    );

    const periods = section.querySelectorAll(
        ".price-period"
    );



    /* =========================================
       SET INITIAL STATES
    ========================================= */


    gsap.set(headerItems, {

        y: 40,

        opacity: 0,

        filter: "blur(12px)"

    });


    gsap.set(cards, {

        y: 70,

        opacity: 0,

        scale: .96

    });



    /* =========================================
       SCROLL REVEAL
    ========================================= */


    ScrollTrigger.create({

        trigger: section,

        start: "top 75%",

        once: true,


        onEnter: () => {


            gsap.to(headerItems, {

                y: 0,

                opacity: 1,

                filter: "blur(0px)",

                duration: .8,

                stagger: .12,

                ease: "power3.out"

            });



            gsap.to(cards, {

                y: 0,

                opacity: 1,

                scale: 1,

                duration: 1,

                stagger: .15,

                ease: "power3.out",

                delay: .15

            });


        }


    });





    /* =========================================
       BILLING TOGGLE
    ========================================= */


    buttons.forEach(button => {


        button.addEventListener("click", () => {


            buttons.forEach(btn => {

                btn.classList.remove("active");

            });


            button.classList.add("active");



            const yearly =
                button.dataset.period === "yearly";



            prices.forEach(price => {


                const newValue =
                    yearly
                        ? price.dataset.year
                        : price.dataset.month;



                gsap.to(price, {

                    opacity: 0,

                    y: -10,

                    duration: .2,


                    onComplete: () => {


                        price.textContent = newValue;


                        gsap.to(price, {

                            opacity: 1,

                            y: 0,

                            duration: .35,

                            ease: "power3.out"

                        });


                    }


                });



            });



            periods.forEach(period => {


                period.textContent =
                    yearly ? "/yr" : "/mo";


            });



        });


    });






    /* =========================================
       CARD HOVER TILT
    ========================================= */


    cards.forEach(card => {


        card.addEventListener("mousemove", (e) => {


            const rect =
                card.getBoundingClientRect();



            const x =
                e.clientX - rect.left;


            const y =
                e.clientY - rect.top;



            const rotateY =
                ((x / rect.width) - 0.5) * 6;


            const rotateX =
                ((y / rect.height) - 0.5) * -6;



            gsap.to(card, {

                rotateY,

                rotateX,

                transformPerspective: 1000,

                duration: .3,

                ease: "power2.out"


            });


        });



        card.addEventListener("mouseleave", () => {


            gsap.to(card, {

                rotateX: 0,

                rotateY: 0,

                duration: .5,

                ease: "power3.out"

            });


        });



    });






    /* =========================================
       BUTTON MAGNET EFFECT
    ========================================= */


    section.querySelectorAll(".plan-card button")
        .forEach(btn => {


            btn.addEventListener("mousemove", (e) => {


                const r =
                    btn.getBoundingClientRect();



                gsap.to(btn, {

                    x: (e.clientX - r.left - r.width / 2) * 0.12,

                    y: (e.clientY - r.top - r.height / 2) * 0.12,

                    duration: .3

                });



            });



            btn.addEventListener("mouseleave", () => {


                gsap.to(btn, {

                    x: 0,

                    y: 0,

                    duration: .5,

                    ease: "elastic.out(1,.4)"

                });


            });


        });




    /* Refresh after all sections load */

    window.addEventListener("load", () => {

        ScrollTrigger.refresh();

    });



})();

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

    Lives in the footer partial, so this only runs once
    /partials/footer.html has been injected — see the
    "partials:loaded" listener above.
==================================================== */

function initChatbotWidget() {

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

}

/*==================================================
    SCROLL TO TOP BUTTON
    Lives in the footer partial — same deferred timing
    as the chatbot widget above. Triggers off [data-hero]
    rather than a hardcoded ".hero" so it works on any
    page regardless of that page's hero height.
==================================================== */

function initScrollTopButton() {

    const scrollTopBtn = document.getElementById("scrollTopBtn");

    if (!scrollTopBtn) return;

    function handleScroll() {
        scrollTopBtn.classList.toggle("visible", window.scrollY > 80);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        });
    });

}