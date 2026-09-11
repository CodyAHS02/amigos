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

    const animateFrom = (selector, trigger, options = {}) => {
        const el = document.querySelectorAll(selector);
        if (!el.length) return;

        gsap.fromTo(el, {
            opacity: 0,
            y: options.y || 50,
            x: options.x || 0
        }, {
            opacity: 1,
            y: 0,
            x: 0,
            duration: options.duration || .8,
            stagger: options.stagger || 0,
            ease: "power3.out",
            scrollTrigger: {
                trigger: trigger,
                start: options.start || "top 80%",
                once: true
            }
        });
    };


    /* HERO */

    const hero = gsap.timeline();

    if (document.querySelector(".ren-eyebrow")) {
        hero.fromTo(".ren-eyebrow",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: .6, ease: "power3.out" });
    }

    if (document.querySelector(".ren-hero-content h1")) {
        hero.fromTo(".ren-hero-content h1",
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
            "-=.3");
    }

    if (document.querySelector(".ren-hero-content>p")) {
        hero.fromTo(".ren-hero-content>p",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: .8, ease: "power3.out" },
            "-=.5");
    }

    if (document.querySelector(".ren-buttons a")) {
        hero.fromTo(".ren-buttons a",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, stagger: .15, duration: .6, ease: "power3.out" },
            "-=.4");
    }

    if (document.querySelector(".situation-item")) {
        hero.fromTo(".situation-item",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, stagger: .15, duration: .7, ease: "power3.out" },
            "-=.3");
    }


    /* HERO BACKGROUND */

    if (document.querySelector(".ren-hero-bg")) {
        gsap.to(".ren-hero-bg", {
            scale: 1.08,
            duration: 18,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }


    if (document.querySelector(".ren-floating-shape")) {
        gsap.to(".ren-floating-shape", {
            rotation: 360,
            duration: 40,
            repeat: -1,
            ease: "none"
        });
    }


    /* INTRO */

    animateFrom(
        ".ren-intro-text",
        ".ren-intro",
        {
            x: -60,
            y: 0,
            duration: 1
        }
    );


    animateFrom(
        ".ren-intro-visual",
        ".ren-intro",
        {
            x: 60,
            y: 0,
            duration: 1
        }
    );


    /* SITUATION CARDS */

    animateFrom(
        ".ren-card",
        ".situation-grid",
        {
            y: 60,
            stagger: .2
        }
    );


    /* RENOVATION SCOPE */

    animateFrom(
        ".scope-item",
        ".scope-grid",
        {
            y: 50,
            stagger: .15
        }
    );


    /* BEFORE AFTER */

    animateFrom(
        ".ba-header",
        ".before-after-section",
        {
            y: 40,
            duration: .8
        }
    );


    animateFrom(
        ".ba-wrapper",
        ".before-after-section",
        {
            y: 40,
            duration: 1
        }
    );



    /* BEFORE AFTER SLIDER */

    const range = document.querySelector(".ba-range");
    const afterImage = document.querySelector(".after-image");
    const divider = document.querySelector(".ba-divider");


    if (range && afterImage && divider) {

        range.addEventListener("input", e => {

            let value = e.target.value;

            afterImage.style.width = value + "%";
            divider.style.left = value + "%";

        });

    }



    /* PROCESS TIMELINE */


    if (document.querySelector(".process-progress")) {

        gsap.to(".process-progress", {
            height: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: ".ren-process",
                start: "top center",
                end: "bottom center",
                scrub: 1.5
            }
        });

    }


    animateFrom(
        ".process-step",
        ".process-items",
        {
            y: 60,
            stagger: .2,
            duration: .8
        }
    );


    /* FLOW */

    animateFrom(
        ".flow-item",
        ".flow-wrapper",
        {
            y: 40,
            stagger: .18
        }
    );



    if (document.querySelector(".flow-line")) {

        gsap.to(".flow-line", {
            "--line-width": "100%",
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".flow-wrapper",
                start: "top center",
                once: true
            }
        });

    }



    /* PROPERTY SECTION */


    animateFrom(
        ".property-image",
        ".property-value-section",
        {
            x: -50,
            y: 0
        }
    );


    animateFrom(
        ".property-content",
        ".property-value-section",
        {
            x: 50,
            y: 0
        }
    );



    if (document.querySelector(".property-image img")) {

        gsap.to(".property-image img", {
            y: -80,
            ease: "none",
            scrollTrigger: {
                trigger: ".property-value-section",
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5
            }
        });

    }



    /* WHY AMIGOS */


    animateFrom(
        ".why-card",
        ".why-grid",
        {
            y: 50,
            stagger: .15
        }
    );


    /* FINAL CTA */


    animateFrom(
        ".cta-content",
        ".ren-final-cta",
        {
            y: 50,
            duration: 1
        }
    );



    if (document.querySelector(".cta-background")) {

        gsap.to(".cta-background", {
            y: -80,
            ease: "none",
            scrollTrigger: {
                trigger: ".ren-final-cta",
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5
            }
        });

    }



    /* HOVER EFFECTS */

    document.querySelectorAll(
        ".ren-card,.scope-item,.why-card,.situation-item"
    ).forEach(card => {


        card.addEventListener("mouseenter", () => {

            gsap.to(card, {
                y: -12,
                duration: .35,
                ease: "power2.out"
            });

        });


        card.addEventListener("mouseleave", () => {

            gsap.to(card, {
                y: 0,
                duration: .35,
                ease: "power2.out"
            });

        });


    });



    /* IMAGE ZOOM */


    document.querySelectorAll(
        ".scope-item img,.card-image img"
    ).forEach(image => {

        const parent = image.closest(".scope-item,.ren-card");

        if (!parent) return;


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