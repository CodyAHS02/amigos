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
        ".hero-content h1",
        ".hero-description",
        ".hero-actions a"
    ], {
        opacity: 0,
        y: 50
    });

    gsap.set([
        ".reveal-left",
        ".reveal-right",
        ".creation-card",
        ".application-item",
        ".process-step",
        ".flow-item",
        ".benefit-card",
        ".property-image",
        ".property-content",
        ".cta-inner"
    ], {
        opacity: 0,
        y: 60
    });


    const heroAnimation = gsap.timeline();

    heroAnimation
        .to(".hero-label", {
            opacity: 1,
            y: 0,
            duration: .7,
            ease: "power3.out"
        })
        .to(".hero-content h1", {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=.3")
        .to(".hero-description", {
            opacity: 1,
            y: 0,
            duration: .8,
            ease: "power3.out"
        }, "-=.4")
        .to(".hero-actions a", {
            opacity: 1,
            y: 0,
            stagger: .15,
            duration: .7,
            ease: "power3.out"
        }, "-=.3");


    gsap.to(".hero-bg img", {
        scale: 1.08,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });


    gsap.to(".hero-bg img", {
        y: -100,
        ease: "none",
        scrollTrigger: {
            trigger: ".drywall-hero",
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
                trigger: ".space-intro",
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
                trigger: ".space-intro",
                start: "top 75%",
                once: true
            }
        });


    gsap.to(".creation-card", {
        opacity: 1,
        y: 0,
        stagger: .15,
        duration: .8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".creation-grid",
            start: "top 80%",
            once: true
        }
    });


    gsap.to(".application-item", {
        opacity: 1,
        y: 0,
        stagger: .2,
        duration: .8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".drywall-applications",
            start: "top 75%",
            once: true
        }
    });


    gsap.to(".process-step", {
        opacity: 1,
        y: 0,
        stagger: .25,
        duration: .9,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".process-timeline",
            start: "top 80%",
            once: true
        }
    });


    gsap.to(".timeline-line", {
        "--timeline-progress": "100%",
        duration: 2,
        ease: "none",
        scrollTrigger: {
            trigger: ".process-timeline",
            start: "top center",
            end: "bottom center",
            scrub: 1
        }
    });


    gsap.to(".flow-item", {
        opacity: 1,
        y: 0,
        stagger: .2,
        duration: .8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".service-flow",
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
            trigger: ".benefit-grid",
            start: "top 80%",
            once: true
        }
    });


    gsap.to([
        ".property-image",
        ".property-content"
    ], {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: .2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".property-preservation",
            start: "top 80%",
            once: true
        }
    });


    gsap.to(".property-image img", {
        y: -80,
        ease: "none",
        scrollTrigger: {
            trigger: ".property-preservation",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5
        }
    });


    gsap.to(".cta-inner", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".final-cta",
            start: "top 80%",
            once: true
        }
    });


    const slider = document.querySelector(".before-after-slider");
    const after = document.querySelector(".after-image");
    const handle = document.querySelector(".slider-handle");


    if (slider && after && handle) {

        let dragging = false;

        function updateSlider(position) {

            const rect = slider.getBoundingClientRect();

            let percentage = ((position - rect.left) / rect.width) * 100;

            percentage = Math.max(0, Math.min(100, percentage));

            after.style.width = percentage + "%";
            handle.style.left = percentage + "%";

        }


        handle.addEventListener("mousedown", () => {
            dragging = true;
        });


        window.addEventListener("mouseup", () => {
            dragging = false;
        });


        window.addEventListener("mousemove", (e) => {

            if (dragging) {
                updateSlider(e.clientX);
            }

        });


        handle.addEventListener("touchstart", () => {
            dragging = true;
        });


        window.addEventListener("touchend", () => {
            dragging = false;
        });


        window.addEventListener("touchmove", (e) => {

            if (dragging) {
                updateSlider(e.touches[0].clientX);
            }

        });

    }


    const track = document.querySelector(".carousel-track");
    const next = document.querySelector(".carousel-next");
    const prev = document.querySelector(".carousel-prev");


    if (track && next && prev) {

        next.addEventListener("click", () => {

            track.scrollBy({
                left: 400,
                behavior: "smooth"
            });

        });


        prev.addEventListener("click", () => {

            track.scrollBy({
                left: -400,
                behavior: "smooth"
            });

        });


        let pressed = false;
        let startX = 0;
        let currentScroll = 0;


        track.addEventListener("mousedown", (e) => {

            pressed = true;
            startX = e.pageX - track.offsetLeft;
            currentScroll = track.scrollLeft;

        });


        track.addEventListener("mouseleave", () => {
            pressed = false;
        });


        track.addEventListener("mouseup", () => {
            pressed = false;
        });


        track.addEventListener("mousemove", (e) => {

            if (!pressed) return;

            e.preventDefault();

            const move = e.pageX - track.offsetLeft;

            track.scrollLeft = currentScroll - (move - startX) * 1.2;

        });

    }


    document.querySelectorAll(".creation-card,.transform-card,.application-item,.flow-item,.benefit-card")
        .forEach(item => {

            item.addEventListener("mouseenter", () => {

                gsap.to(item, {
                    y: -10,
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


    document.querySelectorAll(".process-step")
        .forEach(step => {

            const image = step.querySelector(".floating-process-image");

            step.addEventListener("mouseenter", () => {

                gsap.to(image, {
                    opacity: 1,
                    scale: 1,
                    duration: .4,
                    ease: "power3.out"
                });

            });


            step.addEventListener("mouseleave", () => {

                gsap.to(image, {
                    opacity: 0,
                    scale: .9,
                    duration: .4,
                    ease: "power3.inOut"
                });

            });

        });


    ScrollTrigger.refresh();

});
