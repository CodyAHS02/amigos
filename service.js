//==================================================
// SERVICE PAGE — SHARED ANIMATIONS
//==================================================
// This file is shared by every service detail page.
// It works generically off class names (.service-section,
// .service-section-heading, .glass-card, .service-cta) so
// no page-specific JS is needed — just plug in the markup.
//==================================================

gsap.registerPlugin(ScrollTrigger);

//==================================================
// HERO INTRO
//==================================================

const serviceHeroTL = gsap.timeline({
    defaults: { ease: "power3.out" }
});

serviceHeroTL

    .from(".service-hero-lines span", {
        width: 0,
        stagger: .12,
        duration: 1.1
    })

    .to(".service-hero-eyebrow", {
        opacity: 1, y: 0, filter: "blur(0px)", duration: .8
    }, .2)

    .to(".service-hero-content h1", {
        opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2
    }, .4)

    .to(".service-hero-content p", {
        opacity: 1, y: 0, filter: "blur(0px)", duration: .9
    }, .7)

    .to(".service-hero-buttons", {
        opacity: 1, y: 0, filter: "blur(0px)", duration: .8, stagger: .1
    }, .85)

    .to(".service-hero-bg-text", {
        opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2
    }, .5)

    .to(".service-scroll-indicator", {
        opacity: 1, y: 0, filter: "blur(0px)", duration: .8
    }, 1.1);

gsap.to(".service-scroll-indicator span", {
    y: 16,
    repeat: -1,
    yoyo: true,
    duration: 1,
    ease: "power1.inOut"
});

//==================================================
// SECTION HEADING + CARD REVEALS (generic)
//==================================================

document.querySelectorAll(".service-section").forEach(section => {

    const heading = section.querySelector(".service-section-heading");

    if (heading) {
        gsap.timeline({
            scrollTrigger: { trigger: heading, start: "top 80%" }
        })
            .to(heading.querySelector("span"), { opacity: 1, y: 0, filter: "blur(0px)", duration: .8 })
            .to(heading.querySelector("h2"), { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 }, "-=.45")
            .to(heading.querySelector("p"), { opacity: 1, y: 0, filter: "blur(0px)", duration: .8 }, "-=.55");
    }

    const cardGrid = section.querySelector("[class*='-grid']");
    const cards = section.querySelectorAll(".glass-card");

    if (cards.length) {
        gsap.to(cards, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: .9,
            ease: "power3.out",
            stagger: .12,
            scrollTrigger: {
                trigger: cardGrid || section,
                start: "top 82%"
            }
        });
    }
});

//==================================================
// CTA BAND
//==================================================

document.querySelectorAll(".service-cta").forEach(cta => {

    gsap.timeline({
        scrollTrigger: { trigger: cta, start: "top 78%" }
    })
        .to(cta.querySelector("h2"), { opacity: 1, y: 0, filter: "blur(0px)", duration: .9 })
        .to(cta.querySelector("p"), { opacity: 1, y: 0, filter: "blur(0px)", duration: .8 }, "-=.5")
        .to(cta.querySelector(".btn-primary"), { opacity: 1, y: 0, filter: "blur(0px)", duration: .7 }, "-=.4");
});

//==================================================
// GLASS CARD HOVER TILT
//==================================================

document.querySelectorAll(".glass-card").forEach(card => {

    card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(card, {
            rotationY: (x - rect.width / 2) / 30,
            rotationX: -(y - rect.height / 2) / 30,
            transformPerspective: 900,
            duration: .35
        });
    });

    card.addEventListener("mouseleave", () => {
        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: .6,
            ease: "power3.out"
        });
    });
});
