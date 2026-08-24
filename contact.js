/* =========================================================
   AMIGOS CONTACT PAGE — ANIMATIONS
   GSAP + ScrollTrigger
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // Fail gracefully if GSAP is unavailable.
    if (typeof gsap === "undefined") {
        console.warn("GSAP is not loaded. Contact animations are disabled.");
        return;
    }

    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }


    /* =========================================================
       HERO INTRO
    ========================================================= */

    const heroTimeline = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    heroTimeline
        .from(".contact-kicker", {
            y: 18,
            opacity: 0,
            duration: 0.65
        })

        .from(".contact-copy h1", {
            y: 55,
            opacity: 0,
            duration: 0.95
        }, "-=0.35")

        .from(".contact-intro", {
            y: 25,
            opacity: 0,
            duration: 0.7
        }, "-=0.55")

        .from(".contact-actions", {
            y: 20,
            opacity: 0,
            duration: 0.6
        }, "-=0.4")

        .from(".contact-details", {
            y: 18,
            opacity: 0,
            duration: 0.6
        }, "-=0.35")

        .from(".contact-visual", {
            x: 55,
            opacity: 0,
            duration: 1.05
        }, "-=1.0");


    /* =========================================================
       HERO IMAGE REVEAL
    ========================================================= */

    const image = document.querySelector(
        ".contact-image-frame img"
    );

    if (image) {

        gsap.fromTo(
            image,

            {
                scale: 1.14
            },

            {
                scale: 1.03,
                duration: 1.8,
                ease: "power3.out"
            }
        );

    }


    /* =========================================================
       IMAGE DETAILS
    ========================================================= */

    gsap.from(".contact-image-tag", {
        y: 25,
        opacity: 0,
        duration: 0.75,
        delay: 0.65,
        ease: "power3.out"
    });


    gsap.from(".contact-image-number", {
        y: -15,
        opacity: 0,
        duration: 0.55,
        delay: 0.85,
        ease: "power2.out"
    });


    gsap.from(".contact-image-caption", {
        y: 12,
        opacity: 0,
        duration: 0.55,
        delay: 1.15,
        ease: "power2.out"
    });


    /* =========================================================
       SUBTLE IMAGE PARALLAX
    ========================================================= */

    if (
        typeof ScrollTrigger !== "undefined" &&
        image
    ) {

        gsap.to(image, {

            yPercent: 5,

            ease: "none",

            scrollTrigger: {

                trigger: ".contact-visual",

                start: "top bottom",

                end: "bottom top",

                scrub: 1

            }

        });

    }


    /* =========================================================
       FORM SECTION
    ========================================================= */

    if (typeof ScrollTrigger !== "undefined") {


        /* -----------------------------------------------------
           FORM HEADING
        ----------------------------------------------------- */

        gsap.from(".form-heading", {

            y: 50,

            opacity: 0,

            duration: 0.9,

            ease: "power3.out",

            scrollTrigger: {

                trigger: ".contact-form-section",

                start: "top 78%",

                once: true

            }

        });


        /* -----------------------------------------------------
           FORM CONTAINER
        ----------------------------------------------------- */

        gsap.from(".contact-form", {

            y: 45,

            opacity: 0,

            duration: 0.9,

            delay: 0.12,

            ease: "power3.out",

            scrollTrigger: {

                trigger: ".contact-form-section",

                start: "top 78%",

                once: true

            }

        });


        /* -----------------------------------------------------
           FORM LABELS
        ----------------------------------------------------- */

        gsap.from(".contact-form label", {

            y: 18,

            opacity: 0,

            duration: 0.55,

            stagger: 0.08,

            ease: "power2.out",

            scrollTrigger: {

                trigger: ".contact-form",

                start: "top 80%",

                once: true

            }

        });


        /* -----------------------------------------------------
           SUBMIT BUTTON
        ----------------------------------------------------- */

        gsap.from(".contact-submit", {

            y: 15,

            opacity: 0,

            duration: 0.55,

            ease: "power2.out",

            scrollTrigger: {

                trigger: ".contact-submit",

                start: "top 90%",

                once: true

            }

        });


        /* =====================================================
           FINAL CTA STRIP
        ===================================================== */

        gsap.from(".contact-strip-inner > div", {

            x: -45,

            opacity: 0,

            duration: 0.9,

            ease: "power3.out",

            scrollTrigger: {

                trigger: ".contact-strip",

                start: "top 80%",

                once: true

            }

        });


        gsap.from(".contact-strip-inner > a", {

            x: 35,

            opacity: 0,

            duration: 0.75,

            delay: 0.15,

            ease: "power3.out",

            scrollTrigger: {

                trigger: ".contact-strip",

                start: "top 80%",

                once: true

            }

        });

    }


    /* =========================================================
       BUTTON MICRO-INTERACTION
    ========================================================= */

    document
        .querySelectorAll(
            ".contact-btn, .contact-submit"
        )
        .forEach(button => {

            const arrow = button.querySelector("span");

            if (!arrow) return;


            button.addEventListener(
                "mouseenter",
                () => {

                    gsap.to(arrow, {

                        x: 5,

                        duration: 0.25,

                        ease: "power2.out"

                    });

                }
            );


            button.addEventListener(
                "mouseleave",
                () => {

                    gsap.to(arrow, {

                        x: 0,

                        duration: 0.25,

                        ease: "power2.out"

                    });

                }
            );

        });


    /* =========================================================
       SMOOTH ANCHOR SCROLL
    ========================================================= */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(targetId);

                    if (!target) return;


                    event.preventDefault();


                    window.scrollTo({

                        top:
                            target.getBoundingClientRect().top +
                            window.scrollY -
                            40,

                        behavior: "smooth"

                    });

                }
            );

        });


    /* =========================================================
       REFRESH SCROLLTRIGGER AFTER LOAD
    ========================================================= */

    window.addEventListener("load", () => {

        if (
            typeof ScrollTrigger !== "undefined"
        ) {

            ScrollTrigger.refresh();

        }

    });

});