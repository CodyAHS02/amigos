// Next loads legacy browser scripts after hydration. If DOMContentLoaded has
// already fired, run the initializer immediately so approved HTML behavior stays intact.
function runWhenDomReady(init) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
}

/* =========================================
   AMIGOS MALER
   MALERARBEITEN AUSSEN JS
========================================= */

runWhenDomReady(() => {

    gsap.registerPlugin(ScrollTrigger);


    /* =========================================
       INITIAL STATES
    ========================================= */

    gsap.set([
        ".svc-hero-eyebrow",
        ".svc-hero-content h1",
        ".svc-hero-content p",
        ".svc-hero-buttons a",
        ".svc-hero-quick-stats"
    ], {
        opacity: 0,
        y: 40
    });


    gsap.set([
        ".svc-reveal"
    ], {
        opacity: 0,
        y: 50
    });


    gsap.set([
        ".service-card",
        ".benefit-card",
        ".process-card",
        ".material-card"
    ], {
        opacity: 0,
        y: 50
    });





    /* =========================================
       HERO LOAD ANIMATION
    ========================================= */

    const heroTimeline = gsap.timeline();


    heroTimeline

        .to(".svc-hero-eyebrow", {
            opacity: 1,
            y: 0,
            duration: .7,
            ease: "power3.out"
        })

        .to(".svc-hero-content h1", {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.35")

        .to(".svc-hero-content p", {
            opacity: 1,
            y: 0,
            duration: .8,
            ease: "power3.out"
        }, "-=0.5")

        .to(".svc-hero-buttons a", {
            opacity: 1,
            y: 0,
            stagger: .15,
            duration: .6,
            ease: "power3.out"
        }, "-=0.45")

        .to(".svc-hero-quick-stats", {
            opacity: 1,
            y: 0,
            duration: .8,
            ease: "power3.out"
        }, "-=0.3");







    /* =========================================
       HERO KEN BURNS
    ========================================= */

    gsap.to(".svc-hero-bg img", {

        scale: 1.08,

        duration: 18,

        repeat: -1,

        yoyo: true,

        ease: "sine.inOut"

    });







    /* =========================================
       HERO PARALLAX
    ========================================= */

    gsap.to(".svc-hero-bg img", {

        y: -100,

        ease: "none",

        scrollTrigger: {

            trigger: ".svc-hero",

            start: "top top",

            end: "bottom top",

            scrub: 1.5

        }

    });







    /* =========================================
       GENERAL SECTION REVEAL
    ========================================= */

    gsap.utils.toArray(".svc-reveal")
        .forEach(section => {


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







    /* =========================================
       SERVICES CARDS
    ========================================= */

    gsap.to(".service-card", {

        opacity: 1,

        y: 0,

        duration: .8,

        stagger: .12,

        ease: "power3.out",

        scrollTrigger: {

            trigger: ".services-grid",

            start: "top 80%",

            once: true

        }

    });








    /* =========================================
       SERVICE CARD HOVER
    ========================================= */

    document.querySelectorAll(".service-card")
        .forEach(card => {


            const image = card.querySelector("img");


            card.addEventListener("mouseenter", () => {


                gsap.to(card, {

                    y: -10,

                    duration: .35,

                    ease: "power2.out"

                });


                if (image) {

                    gsap.to(image, {

                        scale: 1.07,

                        duration: .5

                    });

                }


            });




            card.addEventListener("mouseleave", () => {


                gsap.to(card, {

                    y: 0,

                    duration: .35

                });


                if (image) {

                    gsap.to(image, {

                        scale: 1,

                        duration: .5

                    });

                }


            });


        });









    /* =========================================
       BENEFITS ANIMATION
    ========================================= */

    gsap.to(".benefit-card", {

        opacity: 1,

        y: 0,

        duration: .8,

        stagger: .15,

        ease: "power3.out",

        scrollTrigger: {

            trigger: ".benefits-grid",

            start: "top 80%",

            once: true

        }

    });








    /* =========================================
       PROCESS TIMELINE
    ========================================= */

    gsap.to(".process-card", {

        opacity: 1,

        y: 0,

        duration: .8,

        stagger: .15,

        ease: "power3.out",

        scrollTrigger: {

            trigger: ".process-timeline",

            start: "top 80%",

            once: true

        }

    });








    /* =========================================
       MATERIAL CARDS
    ========================================= */

    gsap.to(".material-card", {

        opacity: 1,

        y: 0,

        duration: .8,

        stagger: .15,

        ease: "power3.out",

        scrollTrigger: {

            trigger: ".materials-grid",

            start: "top 80%",

            once: true

        }

    });







    /* =========================================
       MATERIAL HOVER
    ========================================= */

    document.querySelectorAll(".material-card")
        .forEach(card => {


            card.addEventListener("mouseenter", () => {


                gsap.to(card, {

                    y: -10,

                    duration: .3

                });


            });


            card.addEventListener("mouseleave", () => {


                gsap.to(card, {

                    y: 0,

                    duration: .3

                });


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








    /* =========================================
       VALUE SECTION PARALLAX
    ========================================= */

    gsap.to(".value-image img", {

        y: -80,

        ease: "none",

        scrollTrigger: {

            trigger: ".value-section",

            start: "top bottom",

            end: "bottom top",

            scrub: 1.5

        }

    });








    /* =========================================
       COUNTERS
    ========================================= */

    document.querySelectorAll(".svc-counter")
        .forEach(counter => {


            const target =
                Number(counter.dataset.target);



            ScrollTrigger.create({

                trigger: counter,

                start: "top 90%",


                once: true,


                onEnter: () => {


                    gsap.to(counter, {

                        innerText: target,

                        duration: 1.5,

                        snap: {
                            innerText: 1
                        },

                        ease: "power2.out"

                    });


                }


            });


        });







    /* =========================================
       BUTTON HOVER
    ========================================= */

    document.querySelectorAll(
        ".svc-btn-primary,.svc-btn-secondary"
    )
        .forEach(button => {


            button.addEventListener("mouseenter", () => {


                gsap.to(button, {

                    y: -4,

                    duration: .25

                });


            });


            button.addEventListener("mouseleave", () => {


                gsap.to(button, {

                    y: 0,

                    duration: .25

                });


            });


        });







    /* =========================================
       REFRESH
    ========================================= */

    ScrollTrigger.refresh();


});