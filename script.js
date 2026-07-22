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

// TESTIMONIALS JS
gsap.registerPlugin(ScrollTrigger);

/*=========================================================
ELEMENTS
=========================================================*/

const section = document.querySelector(".testimonials");
const cards = gsap.utils.toArray(".review-card");
const orb = document.querySelector(".testimonial-orb");
const btn = document.querySelector(".review-btn");


/*=========================================================
MASTER REVEAL
=========================================================*/

const tl = gsap.timeline({

    scrollTrigger: {

        trigger: section,

        start: "top 70%",

        once: true

    }

});

tl

    .from(".testimonial-kicker", {

        y: 30,
        opacity: 0,
        duration: .6,
        ease: "power3.out"

    })

    .from(".testimonial-center h2", {

        y: 60,
        opacity: 0,
        duration: .9,
        ease: "power4.out"

    }, "-=.25")

    .from(".rating", {

        y: 30,
        opacity: 0,
        duration: .6

    }, "-=.45")

    .from(btn, {

        y: 25,
        opacity: 0,
        duration: .55

    }, "-=.45")

    .from(cards, {

        opacity: 0,
        scale: .8,
        y: 80,

        stagger: {
            each: .08,
            from: "random"
        },

        duration: .9,

        ease: "power4.out"

    }, "-=.45")

    .from(orb, {

        opacity: 0,
        scale: .4,
        duration: 1.2,
        ease: "power2.out"

    }, "-=1");


/*=========================================================
FLOATING CARDS
=========================================================*/

cards.forEach((card, index) => {

    gsap.to(card, {

        y: gsap.utils.random(-18, 18),

        x: gsap.utils.random(-12, 12),

        rotation: `+=${gsap.utils.random(-2, 2)}`,

        repeat: -1,

        yoyo: true,

        duration: gsap.utils.random(4, 7),

        ease: "sine.inOut",

        delay: index * .15

    });

});


/*=========================================================
ORB BREATH
=========================================================*/

gsap.to(orb, {

    scale: 1.18,

    opacity: .95,

    duration: 5,

    repeat: -1,

    yoyo: true,

    ease: "sine.inOut"

});


/*=========================================================
PARALLAX
=========================================================*/

gsap.to(orb, {

    y: -120,

    ease: "none",

    scrollTrigger: {

        trigger: section,

        start: "top bottom",

        end: "bottom top",

        scrub: true

    }

});


/*=========================================================
BUTTON MAGNETIC
=========================================================*/

btn.addEventListener("mousemove", e => {

    const r = btn.getBoundingClientRect();

    gsap.to(btn, {

        x: (e.clientX - r.left - r.width / 2) * .18,

        y: (e.clientY - r.top - r.height / 2) * .18,

        duration: .3

    });

});

btn.addEventListener("mouseleave", () => {

    gsap.to(btn, {

        x: 0,
        y: 0,

        duration: .6,

        ease: "elastic.out(1,.45)"

    });

});


/*=========================================================
CARD HOVER
=========================================================*/

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        cards.forEach(c => {

            if (c !== card) {

                gsap.to(c, {

                    opacity: .28,

                    scale: .95,

                    duration: .35

                });

            }

        });

    });

    card.addEventListener("mouseleave", () => {

        gsap.to(cards, {

            opacity: 1,

            scale: 1,

            duration: .35

        });

    });

});


/*=========================================================
3D TILT
=========================================================*/

cards.forEach(card => {

    card.addEventListener("mousemove", e => {

        const r = card.getBoundingClientRect();

        const px = (e.clientX - r.left) / r.width;

        const py = (e.clientY - r.top) / r.height;

        gsap.to(card, {

            rotateY: (px - .5) * 12,

            rotateX: (.5 - py) * 12,

            duration: .35,

            ease: "power2.out"

        });

    });

    card.addEventListener("mouseleave", () => {

        gsap.to(card, {

            rotateX: 0,

            rotateY: 0,

            duration: .8,

            ease: "elastic.out(1,.45)"

        });

    });

});


/*=========================================================
ORB FOLLOW MOUSE
=========================================================*/

section.addEventListener("mousemove", e => {

    const r = section.getBoundingClientRect();

    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    gsap.to(orb, {

        x: (x - r.width / 2) * .08,

        y: (y - r.height / 2) * .08,

        duration: 2,

        ease: "power3.out"

    });

});

// PROJECTS
const projectCards = gsap.utils.toArray(".project-card");


/*==========================================
HEADING
==========================================*/

gsap.timeline({

    scrollTrigger: {

        trigger: ".projects-heading",

        start: "top 80%"

    }

})

    .from(".projects .eyebrow", {

        y: 30,
        opacity: 0,
        duration: .5,
        ease: "power3.out"

    })

    .from(".projects-heading h2", {

        y: 60,
        opacity: 0,
        duration: .8,
        ease: "power4.out"

    }, "-=.2")

    .from(".projects-heading p", {

        y: 35,
        opacity: 0,
        duration: .7,
        ease: "power3.out"

    }, "-=.45");


/*==========================================
CARDS REVEAL
==========================================*/

projectCards.forEach(card => {

    const img = card.querySelector(".project-image");
    const info = card.querySelector(".project-info");

    gsap.from(img, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        filter: "blur(25px)",
        y: 80,
        duration: 1,
        ease: "power3.out",
        clearProps: "all"
    });

    gsap.from(info, {
        scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 25,
        duration: .7,
        delay: .2,
        ease: "power2.out",
        clearProps: "all"
    });

});

/*==========================================
IMAGE PARALLAX
==========================================*/

projectCards.forEach(card => {

    const img = card.querySelector("img");

    gsap.to(img, {

        yPercent: 10,

        ease: "none",

        scrollTrigger: {

            trigger: card,

            start: "top bottom",

            end: "bottom top",

            scrub: true

        }

    });

});


/*==========================================
HOVER
==========================================*/

projectCards.forEach(card => {

    const img = card.querySelector("img");

    card.addEventListener("mouseenter", () => {

        gsap.to(img, {

            scale: 1.05,

            duration: .6,

            ease: "power2.out"

        });

    });

    card.addEventListener("mouseleave", () => {

        gsap.to(img, {

            scale: 1,

            duration: .6,

            ease: "power2.out"

        });

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