// Next loads legacy browser scripts after hydration. If DOMContentLoaded has
// already fired, run the initializer immediately so approved HTML behavior stays intact.
function runWhenDomReady(init) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
}

runWhenDomReady(() => {
    gsap.registerPlugin(ScrollTrigger);
    const q = (s) => document.querySelector(s);
    const qa = (s) => document.querySelectorAll(s);

    const hero = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (q(".facade-hero")) {
        hero.fromTo(".facade-hero .reveal-hero", { opacity: 0, y: 45 }, { opacity: 1, y: 0, duration: .8, stagger: .16 });
    }
    if (q(".facade-hero-media img")) {
        gsap.to(".facade-hero-media img", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".facade-hero", start: "top top", end: "bottom top", scrub: 1.5 } });
    }

    if (q(".facade-intro-visual")) {
        gsap.fromTo(".facade-intro-visual", { opacity: 0, x: -70 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".facade-intro", start: "top 75%", once: true } });
    }
    if (q(".facade-intro-content")) {
        gsap.fromTo(".facade-intro-content", { opacity: 0, x: 70 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".facade-intro", start: "top 75%", once: true } });
    }

    if (qa(".reveal-card").length) {
        gsap.fromTo(".reveal-card", { opacity: 0, y: 55 }, { opacity: 1, y: 0, duration: .8, stagger: .14, ease: "power3.out", scrollTrigger: { trigger: ".facade-work-grid", start: "top 78%", once: true } });
    }

    qa(".facade-work-card").forEach(card => {
        card.addEventListener("mouseenter", () => {
            gsap.to(card, { y: -10, duration: .35, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
            gsap.to(card, { y: 0, duration: .35, ease: "power2.out" });
        });
    });

    /* =========================================
       BEFORE / AFTER SLIDER
    ========================================= */
    // SLIDER DRAG
    const slider = document.getElementById("baSlider");
    const beforePane = document.getElementById("baBeforePane");
    const afterPane = document.getElementById("baAfterPane");
    const divider = document.getElementById("baDivider");
    const baTagBefore = document.getElementById("baTagBefore");
    const baTagAfter = document.getElementById("baTagAfter");

    if (slider && beforePane && afterPane && divider) {

        let active = false;
        const EDGE_FADE_ZONE = 10; // % width under which a pane's tag starts fading

        function clamp01(n) {
            return Math.max(0, Math.min(1, n));
        }

        function updateSlider(x) {

            const box = slider.getBoundingClientRect();
            let value = ((x - box.left) / box.width) * 100;
            value = Math.max(0, Math.min(100, value));

            beforePane.style.width = value + "%";
            afterPane.style.width = (100 - value) + "%";
            divider.style.left = value + "%";

            baTagBefore.style.opacity = value < EDGE_FADE_ZONE ? clamp01(value / EDGE_FADE_ZONE) : 1;
            baTagAfter.style.opacity = (100 - value) < EDGE_FADE_ZONE ? clamp01((100 - value) / EDGE_FADE_ZONE) : 1;

        }

        divider.addEventListener("mousedown", () => { active = true; });
        window.addEventListener("mouseup", () => { active = false; });
        window.addEventListener("mousemove", (e) => { if (active) updateSlider(e.clientX); });

        divider.addEventListener("touchstart", () => { active = true; });
        window.addEventListener("touchend", () => { active = false; });
        window.addEventListener("touchmove", (e) => { if (active) updateSlider(e.touches[0].clientX); });

        window.addEventListener("load", () => {
            const box = slider.getBoundingClientRect();
            updateSlider(box.left + box.width / 2);
        });

    }

    /* =========================================
       BEFORE AFTER REVEAL
    ========================================= */

    gsap.from("#baSlider", {

        clipPath: "inset(0 0 100% 0)",

        duration: 1.2,

        ease: "power3.out",

        scrollTrigger: {

            trigger: "#baSlider",

            start: "top 80%",

            once: true

        }

    });


    if (q(".quality-parallax")) {
        gsap.to(".quality-parallax", { yPercent: 10, ease: "none", scrollTrigger: { trigger: ".facade-quality", start: "top bottom", end: "bottom top", scrub: 1.5 } });
    }

    if (qa(".reveal-point").length) {
        gsap.fromTo(".reveal-point", { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: .7, stagger: .16, ease: "power3.out", scrollTrigger: { trigger: ".quality-points", start: "top 78%", once: true } });
    }

    if (q(".timeline-progress")) {
        gsap.to(".timeline-progress", { height: "100%", ease: "none", scrollTrigger: { trigger: ".facade-timeline", start: "top 55%", end: "bottom 65%", scrub: 1 } });
    }

    if (qa(".reveal-process").length) {
        gsap.fromTo(".reveal-process", { opacity: 0, y: 55 }, { opacity: 1, y: 0, duration: .75, stagger: .18, ease: "power3.out", scrollTrigger: { trigger: ".facade-timeline", start: "top 75%", once: true } });
    }

    qa(".timeline-step").forEach(step => {
        const image = step.querySelector(".timeline-image");
        if (!image) return;
        step.addEventListener("mouseenter", () => {
            gsap.to(image, { opacity: 1, x: 0, scale: 1, duration: .45, ease: "power3.out" });
        });
        step.addEventListener("mouseleave", () => {
            gsap.to(image, { opacity: .35, x: 25, scale: .97, duration: .45, ease: "power3.out" });
        });
    });

    qa(".pd-panel").forEach(panel => {
        panel.addEventListener("mouseenter", () => {
            gsap.to(panel.querySelector(".pd-image img"), { scale: 1.08, duration: .8, ease: "power3.out" });
            gsap.to(panel.querySelector(".pd-arrow"), { rotation: 45, duration: .35, ease: "power2.out" });
        });
        panel.addEventListener("mouseleave", () => {
            gsap.to(panel.querySelector(".pd-image img"), { scale: 1, duration: .8, ease: "power3.out" });
            gsap.to(panel.querySelector(".pd-arrow"), { rotation: 0, duration: .35, ease: "power2.out" });
        });
    });

    if (qa(".reveal-benefit").length) {
        gsap.fromTo(".reveal-benefit", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: .75, stagger: .15, ease: "power3.out", scrollTrigger: { trigger: ".benefits-grid", start: "top 80%", once: true } });
    }

    if (q(".value-background")) {
        gsap.to(".value-background", { yPercent: -7, ease: "none", scrollTrigger: { trigger: ".facade-value", start: "top bottom", end: "bottom top", scrub: 1.5 } });
    }
    if (q(".reveal-value")) {
        gsap.fromTo(".reveal-value", { opacity: 0, y: 55 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".facade-value", start: "top 75%", once: true } });
    }

    if (q(".reveal-cta")) {
        gsap.fromTo(".reveal-cta", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".facade-final-cta", start: "top 78%", once: true } });
    }

    if (q(".cta-orbit")) {
        gsap.to(".cta-orbit", { rotation: 360, duration: 45, repeat: -1, ease: "none" });
    }

    qa(".facade-btn").forEach(button => {
        button.addEventListener("mouseenter", () => {
            gsap.to(button, { y: -4, duration: .3, ease: "power2.out" });
        });
        button.addEventListener("mouseleave", () => {
            gsap.to(button, { y: 0, duration: .3, ease: "power2.out" });
        });
    });

    ScrollTrigger.refresh();
});