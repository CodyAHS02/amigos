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


    /* ================================
    INITIAL STATES
    ================================ */


    gsap.set([
        ".hero-content .eyebrow",
        ".hero-content h1",
        ".hero-content p",
        ".hero-buttons a"
    ], {
        opacity: 0,
        y: 40
    });


    gsap.set(".reveal", {
        opacity: 0,
        y: 50
    });


    gsap.set([
        ".service-card",
        ".process-card",
        ".why-card",
        ".colour-sample"
    ], {
        opacity: 0,
        y: 60
    });


    gsap.set(".before-after-slider", {
        clipPath: "inset(0 0 100% 0)"
    });



    /* ================================
    HERO ANIMATION
    ================================ */


    gsap.timeline()

        .to(".hero-content .eyebrow", {
            opacity: 1,
            y: 0,
            duration: .8,
            ease: "power3.out"
        })

        .to(".hero-content h1", {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.5")

        .to(".hero-content p", {
            opacity: 1,
            y: 0,
            duration: .8,
            ease: "power3.out"
        }, "-=0.6")

        .to(".hero-buttons a", {
            opacity: 1,
            y: 0,
            stagger: .15,
            duration: .6,
            ease: "power3.out"
        }, "-=0.5");



    /* ================================
    SCROLL REVEAL
    ================================ */


    gsap.utils.toArray(".reveal").forEach(section => {

        gsap.to(section, {

            opacity: 1,
            y: 0,
            duration: .9,
            ease: "power3.out",

            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                once: true
            }

        });

    });



    /* ================================
    SERVICE CARDS
    ================================ */


    gsap.to(".service-card", {

        opacity: 1,
        y: 0,

        duration: .9,
        stagger: .12,

        ease: "power3.out",

        scrollTrigger: {
            trigger: ".service-grid",
            start: "top 80%",
            once: true
        }

    });



    /* ================================
    PROCESS CARDS
    ================================ */


    gsap.to(".process-card", {

        opacity: 1,
        y: 0,

        duration: .8,
        stagger: .15,

        ease: "power3.out",

        scrollTrigger: {
            trigger: ".process-grid",
            start: "top 80%",
            once: true
        }

    });



    /* ================================
    WHY CARDS
    ================================ */


    gsap.to(".why-card", {

        opacity: 1,
        y: 0,

        duration: .8,
        stagger: .15,

        ease: "power3.out",

        scrollTrigger: {
            trigger: ".why-grid",
            start: "top 80%",
            once: true
        }

    });



    /* ================================
    HERO PARALLAX
    ================================ */


    gsap.to(".hero-image img", {

        y: -120,

        ease: "none",

        scrollTrigger: {
            trigger: ".services-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.5
        }

    });



    /* ================================
    KEN BURNS
    ================================ */


    gsap.to(".hero-image img", {

        scale: 1.08,

        duration: 18,

        repeat: -1,

        yoyo: true,

        ease: "sine.inOut"

    });



    /* ================================
    BEFORE AFTER REVEAL
    ================================ */


    gsap.to(".before-after-slider", {

        clipPath: "inset(0 0 0% 0)",

        duration: 1.2,

        ease: "power3.out",

        scrollTrigger: {
            trigger: ".before-after-slider",
            start: "top 80%",
            once: true
        }

    });



    /* ================================
    COLOR BLOCKS
    ================================ */


    gsap.to(".colour-sample", {

        opacity: 1,
        y: 0,
        scale: 1,

        duration: .8,

        stagger: .12,

        ease: "power3.out",

        scrollTrigger: {
            trigger: ".colour-grid",
            start: "top 80%",
            once: true
        }

    });



    /* ================================
    PROPERTY PARALLAX
    ================================ */


    gsap.utils.toArray(".property-image img")
        .forEach(img => {

            gsap.to(img, {

                y: -80,

                ease: "none",

                scrollTrigger: {
                    trigger: img,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5
                }

            });

        });


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


    /* ================================
    REFRESH
    ================================ */


    ScrollTrigger.refresh();


});
