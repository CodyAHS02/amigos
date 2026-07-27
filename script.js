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

            gsap.set(content, { y: -220 * exit, opacity: 1 - exit });
            gsap.set(glow, { opacity: 1 - exit });

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

    /*==================================================
                ELEMENTS
    ==================================================*/

    const input = document.getElementById("roomUpload");

    const uploadArea = document.querySelector(".upload-area");

    const uploadBtn = document.querySelector(".upload-btn");

    const previewEmpty = document.querySelector(".preview-empty");

    const previewImages = document.querySelector(".preview-images");

    const beforeImg = document.querySelector(".preview-before");

    const afterImg = document.querySelector(".preview-after");

    const palettes = document.querySelector(".palette-wrapper");

    const paletteButtons = document.querySelectorAll(".palette");

    const generateBtn = document.querySelector(".generate-btn");

    const toggleButtons = document.querySelectorAll(".toggle-btn");



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

    }, {

        threshold: .2

    });

    observer.observe(section);



    /*==================================================
                OPEN FILE
    ==================================================*/

    uploadBtn.addEventListener("click", () => {

        input.click();

    });

    uploadArea.addEventListener("click", () => {

        input.click();

    });



    /*==================================================
                IMAGE UPLOAD
    ==================================================*/

    input.addEventListener("change", (e) => {

        const file = e.target.files[0];

        if (!file) return;

        showImage(file);

    });



    /*==================================================
                DRAG & DROP
    ==================================================*/

    uploadArea.addEventListener("dragover", (e) => {

        e.preventDefault();

        uploadArea.classList.add("dragover");

    });

    uploadArea.addEventListener("dragleave", () => {

        uploadArea.classList.remove("dragover");

    });

    uploadArea.addEventListener("drop", (e) => {

        e.preventDefault();

        uploadArea.classList.remove("dragover");

        const file = e.dataTransfer.files[0];

        if (file) {

            input.files = e.dataTransfer.files;

            showImage(file);

        }

    });



    /*==================================================
                SHOW IMAGE
    ==================================================*/

    function showImage(file) {

        const reader = new FileReader();

        reader.onload = function (event) {

            beforeImg.src = event.target.result;

            afterImg.src = event.target.result;

            previewEmpty.style.display = "none";

            previewImages.classList.add("show");

            beforeImg.classList.add("active");

            afterImg.classList.remove("active");

            palettes.classList.add("show");

            generateBtn.disabled = false;

        }

        reader.readAsDataURL(file);

    }



    /*==================================================
            BEFORE / AFTER
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
            COLOR PALETTE
    ==================================================*/

    paletteButtons.forEach(button => {

        button.addEventListener("click", () => {

            paletteButtons.forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            const color = button.dataset.color;

            afterImg.style.background = color;

            afterImg.style.mixBlendMode = "multiply";

            afterImg.style.opacity = ".88";

            afterImg.style.transition = ".45s ease";

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


/*==================================================
        AI QUOTATION CALCULATOR
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const section = document.querySelector(".quote-section");

    if (!section) return;

    /*==================================================
                    ELEMENTS
    ==================================================*/

    const propertyType = document.getElementById("propertyType");
    const paintQuality = document.getElementById("paintQuality");
    const sqmRange = document.getElementById("sqmRange");
    const sqmValue = document.getElementById("sqmValue");

    const roomCount = document.getElementById("roomCount");
    const minusBtn = document.querySelector(".counter-btn.minus");
    const plusBtn = document.querySelector(".counter-btn.plus");

    const optionInputs = document.querySelectorAll(".option input");

    const estimatedPrice = document.getElementById("estimatedPrice");
    const estimatedDays = document.getElementById("estimatedDays");
    const recommendedPackage = document.getElementById("recommendedPackage");

    const summaryList = document.getElementById("summaryList");

    let rooms = 1;

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

    }, {
        threshold: .18
    });

    observer.observe(section);

    /*==================================================
                ROOM COUNTER
    ==================================================*/

    plusBtn.addEventListener("click", () => {

        rooms++;

        roomCount.textContent = rooms;

        calculate();

    });

    minusBtn.addEventListener("click", () => {

        if (rooms <= 1) return;

        rooms--;

        roomCount.textContent = rooms;

        calculate();

    });

    /*==================================================
                    RANGE
    ==================================================*/

    sqmRange.addEventListener("input", () => {

        sqmValue.textContent = sqmRange.value;

        calculate();

    });

    /*==================================================
                SELECTS
    ==================================================*/

    propertyType.addEventListener("change", calculate);

    paintQuality.addEventListener("change", calculate);

    optionInputs.forEach(input => {

        input.addEventListener("change", calculate);

    });

    /*==================================================
                PRICE CALCULATION
    ==================================================*/

    function calculate() {

        let sqm = parseInt(sqmRange.value);

        let price = sqm * 28;

        let duration = Math.ceil(sqm / 35);

        /* Property */

        switch (propertyType.value) {

            case "House":

                price += 900;

                duration += 2;

                break;

            case "Villa":

                price += 2200;

                duration += 4;

                break;

            case "Office":

                price += 1400;

                duration += 2;

                break;

        }

        /* Rooms */

        price += rooms * 250;

        duration += Math.floor(rooms / 2);

        /* Paint */

        switch (paintQuality.value) {

            case "Premium":

                price *= 1.18;

                break;

            case "Luxury":

                price *= 1.35;

                duration += 2;

                break;

        }

        /* Extras */

        optionInputs.forEach(input => {

            if (input.checked) {

                switch (input.value) {

                    case "walls":

                        price += 500;
                        break;

                    case "ceiling":

                        price += 420;
                        break;

                    case "wallpaper":

                        price += 700;
                        break;

                    case "facade":

                        price += 1500;
                        duration += 2;
                        break;

                    case "repairs":

                        price += 900;
                        duration += 1;
                        break;

                    case "drywall":

                        price += 1200;
                        duration += 2;
                        break;

                    case "finish":

                        price += 1800;
                        break;

                }

            }

        });

        let pack = "BASIC";

        if (price > 7000) {

            pack = "PLUS";

        }

        if (price > 13000) {

            pack = "PREMIUM";

        }

        animateNumber(
            estimatedPrice,
            parseInt(estimatedPrice.textContent.replace(/,/g, "")),
            Math.round(price)
        );

        animateNumber(
            estimatedDays,
            parseInt(estimatedDays.textContent),
            duration
        );

        recommendedPackage.textContent = pack;

        updateSummary();

    }

    /*==================================================
                SUMMARY
    ==================================================*/

    function updateSummary() {

        summaryList.innerHTML = "";

        const items = [];

        items.push(propertyType.value || "Property");

        items.push(rooms + (rooms === 1 ? " Room" : " Rooms"));

        items.push(sqmRange.value + " m²");

        items.push(paintQuality.value);

        optionInputs.forEach(input => {

            if (input.checked) {

                items.push(input.parentElement.querySelector("span").textContent);

            }

        });

        items.forEach(item => {

            const li = document.createElement("li");

            li.textContent = item;

            summaryList.appendChild(li);

        });

    }

    /*==================================================
                COUNT UP
    ==================================================*/

    function animateNumber(element, start, end) {

        const duration = 700;

        let startTime = null;

        function animation(currentTime) {

            if (!startTime) startTime = currentTime;

            const progress = Math.min((currentTime - startTime) / duration, 1);

            const value = Math.floor(start + (end - start) * progress);

            element.textContent = value.toLocaleString();

            if (progress < 1) {

                requestAnimationFrame(animation);

            }

        }

        requestAnimationFrame(animation);

    }

    /*==================================================
                INITIAL
    ==================================================*/

    calculate();

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
    { category: "purchase", image: "assets/projects/project-01.jpg", location: "Zurich", title: "Modern Family Villa" },
    { category: "purchase", image: "assets/projects/project-02.jpg", location: "Geneva", title: "Lake View Residence" },
    { category: "purchase", image: "assets/projects/project-03.jpg", location: "Lausanne", title: "Contemporary Residence" },
    { category: "purchase", image: "assets/projects/project-04.jpg", location: "Zermatt", title: "Alpine Chalet" },
    { category: "purchase", image: "assets/projects/project-05.jpg", location: "Basel", title: "Vision Mansion" },
    { category: "purchase", image: "assets/projects/project-06.jpg", location: "Bern", title: "Eli House Corner Plot" },

    // ===== International Properties =====
    { category: "international", image: "assets/projects/project-01.jpg", location: "Zurich", title: "Modern Family Villa" },
    { category: "international", image: "assets/projects/project-02.jpg", location: "Geneva", title: "Lake View Residence" },
    { category: "international", image: "assets/projects/project-03.jpg", location: "Lausanne", title: "Contemporary Residence" },
    { category: "international", image: "assets/projects/project-04.jpg", location: "Zermatt", title: "Alpine Chalet" },
    { category: "international", image: "assets/projects/project-05.jpg", location: "Basel", title: "Vision Mansion" },
    { category: "international", image: "assets/projects/project-06.jpg", location: "Bern", title: "Eli House Corner Plot" }

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