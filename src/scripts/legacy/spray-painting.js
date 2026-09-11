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

    gsap.set([
        ".spray-eyebrow",
        ".spray-hero-content h1",
        ".spray-hero-content>p:not(.spray-eyebrow)",
        ".spray-hero-buttons a"
    ], {
        opacity: 0,
        y: 50
    });

    gsap.set([
        ".reveal-left",
        ".reveal-right",
        ".spray-panel",
        ".spray-step",
        ".quality-item",
        ".gallery-item",
        ".benefit-card",
        ".connection-item",
        ".spray-value-image",
        ".spray-value-content",
        ".final-cta-content"
    ], {
        opacity: 0,
        y: 60
    });


    const heroTimeline = gsap.timeline();

    heroTimeline
        .to(".spray-eyebrow", {
            opacity: 1,
            y: 0,
            duration: .7,
            ease: "power3.out"
        })
        .to(".spray-hero-content h1", {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=.3")
        .to(".spray-hero-content>p:not(.spray-eyebrow)", {
            opacity: 1,
            y: 0,
            duration: .8,
            ease: "power3.out"
        }, "-=.4")
        .to(".spray-hero-buttons a", {
            opacity: 1,
            y: 0,
            stagger: .15,
            duration: .7,
            ease: "power3.out"
        }, "-=.3");


    gsap.to(".spray-hero-image img", {
        scale: 1.08,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });


    gsap.to(".spray-hero-image img", {
        y: -100,
        ease: "none",
        scrollTrigger: {
            trigger: ".spray-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.5
        }
    });


    gsap.fromTo(".reveal-left",
        {
            opacity: 0,
            x: -80
        },
        {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".spray-intro",
                start: "top 75%",
                once: true
            }
        });


    gsap.fromTo(".reveal-right",
        {
            opacity: 0,
            x: 80
        },
        {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".spray-intro",
                start: "top 75%",
                once: true
            }
        });


    gsap.to(".spray-panel", {
        opacity: 1,
        y: 0,
        stagger: .15,
        duration: .8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".spray-service-panels",
            start: "top 80%",
            once: true
        }
    });


    const panels = document.querySelectorAll(".spray-panel");

    panels.forEach(panel => {

        panel.addEventListener("mouseenter", () => {

            panels.forEach(item => {
                item.classList.remove("active");
            });

            panel.classList.add("active");

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


    const finishOptions = document.querySelectorAll(".finish-option");
    const finishImages = document.querySelectorAll(".finish-image");

    finishOptions.forEach(option => {

        option.addEventListener("mouseenter", () => {

            const target = option.dataset.target;

            finishOptions.forEach(item => {
                item.classList.remove("active");
            });

            option.classList.add("active");

            finishImages.forEach(image => {

                image.classList.remove("active");

                if (image.dataset.image === target) {
                    image.classList.add("active");
                }

            });

        });

    });


    gsap.to(".quality-item", {
        opacity: 1,
        y: 0,
        stagger: .15,
        duration: .8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".quality-points",
            start: "top 80%",
            once: true
        }
    });


    gsap.to(".spray-step", {
        opacity: 1,
        y: 0,
        stagger: .2,
        duration: .8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".spray-timeline",
            start: "top 80%",
            once: true
        }
    });


    gsap.to(".timeline-progress", {
        "--timeline-progress": "100%",
        ease: "none",
        scrollTrigger: {
            trigger: ".spray-timeline",
            start: "top center",
            end: "bottom center",
            scrub: 1
        }
    });


    gsap.to(".gallery-item", {
        opacity: 1,
        y: 0,
        stagger: .15,
        duration: .8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".spray-gallery-grid",
            start: "top 80%",
            once: true
        }
    });


    gsap.to(".benefit-card", {
        opacity: 1,
        y: 0,
        stagger: .15,
        duration: .8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".benefits-grid",
            start: "top 80%",
            once: true
        }
    });


    gsap.to(".connection-item", {
        opacity: 1,
        y: 0,
        stagger: .25,
        duration: .8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".connection-flow",
            start: "top 80%",
            once: true
        }
    });


    gsap.to(".spray-value-image", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".spray-value",
            start: "top 80%",
            once: true
        }
    });


    gsap.to(".spray-value-content", {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: .2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".spray-value",
            start: "top 80%",
            once: true
        }
    });


    gsap.to(".spray-value-image img", {
        y: -90,
        ease: "none",
        scrollTrigger: {
            trigger: ".spray-value",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5
        }
    });


    gsap.to(".final-cta-content", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".spray-final-cta",
            start: "top 80%",
            once: true
        }
    });


    document.querySelectorAll(".gallery-item,.benefit-card,.connection-item")
        .forEach(item => {

            item.addEventListener("mouseenter", () => {

                gsap.to(item, {
                    y: -12,
                    duration: .35,
                    ease: "power2.out"
                });

            });


            item.addEventListener("mouseleave", () => {

                gsap.to(item, {
                    y: 0,
                    duration: .35,
                    ease: "power2.out"
                });

            });

        });


    document.querySelectorAll(".gallery-item img")
        .forEach(image => {

            const parent = image.closest(".gallery-item");

            parent.addEventListener("mouseenter", () => {

                gsap.to(image, {
                    scale: 1.08,
                    duration: .6,
                    ease: "power2.out"
                });

            });


            parent.addEventListener("mouseleave", () => {

                gsap.to(image, {
                    scale: 1,
                    duration: .6,
                    ease: "power2.out"
                });

            });

        });


    ScrollTrigger.refresh();

});
