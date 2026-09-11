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
        ".hero-label",
        ".gipser-hero-content h1",
        ".gipser-hero-content p",
        ".hero-actions a",
        ".hero-stat"
    ], { opacity: 0, y: 40 });

    gsap.set([
        ".reveal-image",
        ".reveal-content",
        ".reveal-card",
        ".reveal-section",
        ".reveal-step"
    ], { opacity: 0, y: 50 });


    const heroTimeline = gsap.timeline();

    heroTimeline
        .to(".hero-label", {
            opacity: 1,
            y: 0,
            duration: .7,
            ease: "power3.out"
        })
        .to(".gipser-hero-content h1", {
            opacity: 1,
            y: 0,
            duration: .9,
            ease: "power3.out"
        }, "-=.35")
        .to(".gipser-hero-content p", {
            opacity: 1,
            y: 0,
            duration: .8,
            ease: "power3.out"
        }, "-=.45")
        .to(".hero-actions a", {
            opacity: 1,
            y: 0,
            stagger: .15,
            duration: .6,
            ease: "power3.out"
        }, "-=.35")
        .to(".hero-stat", {
            opacity: 1,
            y: 0,
            stagger: .15,
            duration: .7,
            ease: "power3.out"
        }, "-=.25");


    gsap.to(".gipser-hero-bg img", {
        scale: 1.08,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });


    gsap.to(".gipser-hero-bg img", {
        y: -80,
        ease: "none",
        scrollTrigger: {
            trigger: ".gipser-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.5
        }
    });


    gsap.to(".reveal-image,.reveal-content", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: .2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".gipser-intro",
            start: "top 75%",
            once: true
        }
    });


    gsap.to(".reveal-card", {
        opacity: 1,
        y: 0,
        duration: .8,
        stagger: .12,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".service-grid",
            start: "top 80%",
            once: true
        }
    });


    gsap.to(".problem-item", {
        opacity: 1,
        y: 0,
        duration: .8,
        stagger: .12,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".problem-grid",
            start: "top 80%",
            once: true
        }
    });


    gsap.to(".material-item", {
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


    gsap.to(".professional-card", {
        opacity: 1,
        y: 0,
        duration: .8,
        stagger: .15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".professional-grid",
            start: "top 80%",
            once: true
        }
    });


    gsap.to(".transition-content,.transition-image", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: .2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".surface-transition-section",
            start: "top 75%",
            once: true
        }
    });


    gsap.to(".property-content,.floating-card", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: .15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".property-preservation-section",
            start: "top 75%",
            once: true
        }
    });


    gsap.to(".property-background img", {
        y: -100,
        ease: "none",
        scrollTrigger: {
            trigger: ".property-preservation-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5
        }
    });


    gsap.to(".process-progress", {
        height: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: ".process-timeline",
            start: "top center",
            end: "bottom center",
            scrub: 1.5
        }
    });


    gsap.utils.toArray(".process-step").forEach((step, index) => {

        gsap.to(step, {
            opacity: 1,
            y: 0,
            duration: .8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: step,
                start: "top 80%",
                once: true
            }
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



    document.querySelectorAll(".service-card,.problem-item,.material-item,.professional-card,.step-content,.floating-card")
        .forEach(card => {

            card.addEventListener("mouseenter", () => {

                gsap.to(card, {
                    y: -10,
                    duration: .3,
                    ease: "power2.out"
                });

            });


            card.addEventListener("mouseleave", () => {

                gsap.to(card, {
                    y: 0,
                    duration: .3,
                    ease: "power2.out"
                });

            });

        });


    document.querySelectorAll(".service-image img,.material-image img,.transition-image img")
        .forEach(image => {

            const parent = image.closest(".service-card,.material-item,.transition-visual");

            if (parent) {

                parent.addEventListener("mouseenter", () => {

                    gsap.to(image, {
                        scale: 1.08,
                        duration: .5,
                        ease: "power2.out"
                    });

                });

                parent.addEventListener("mouseleave", () => {

                    gsap.to(image, {
                        scale: 1,
                        duration: .5,
                        ease: "power2.out"
                    });

                });

            }

        });


    ScrollTrigger.refresh();

});