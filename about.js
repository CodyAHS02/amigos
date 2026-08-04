//==================================================
// ABOUT HERO
//==================================================

gsap.registerPlugin(ScrollTrigger);

//==================================================
// INTRO
//==================================================

const heroTL = gsap.timeline({
    defaults: {
        ease: "power3.out"
    }
});

gsap.set(".about-hero-content h1", {
    opacity: 1,
    filter: "blur(0px)"
})
gsap.set(".about-hero-content p", {
    opacity: 1,
    filter: "blur(0px)"
})
gsap.set(".about-hero-buttons", {
    opacity: 1,
    filter: "blur(0px)"
})
gsap.set(".about-hero-eyebrow", {
    opacity: 1,
    filter: "blur(0px)"
})
gsap.set(".about-hero-label", {
    opacity: 1,
    filter: "blur(0px)"
})
gsap.set(".about-hero-bg-text", {
    opacity: 1,
    filter: "blur(0px)"
})

heroTL

    .fromTo(".about-hero-bg img", {

        scale: 1.22,
        rotate: .8

    }, {

        scale: 1.12,
        rotate: 0,

        duration: 2.4

    })

    .from(".about-hero-overlay", {

        opacity: 0,

        duration: 1.6

    }, 0)

    .from(".about-hero-lines span", {

        width: 0,

        stagger: .12,

        duration: 1.1

    }, .3)

    .from(".about-hero-eyebrow", {

        y: 50,

        opacity: 0,

        filter: "blur(18px)",

        duration: .8

    }, .45)

    .from(".about-hero-content h1", {

        y: 80,

        opacity: 0,

        filter: "blur(20px)",

        duration: 1.2

    }, .65)

    .from(".about-hero-content p", {

        y: 40,

        opacity: 0,

        filter: "blur(15px)",

        duration: .9

    }, .95)

    .from(".about-hero-buttons", {

        y: 40,

        opacity: 0,

        stagger: .12,

        duration: .8

    }, 1.1)

    .from(".about-hero-label", {

        x: 40,

        opacity: 0,

        duration: 1

    }, 1)

    .from(".about-hero-bg-text", {

        y: 100,

        opacity: 0,

        duration: 1.4

    }, .8)

    .from(".about-scroll-indicator", {

        opacity: 0,

        y: 40,

        duration: .8

    }, 1.4);


//==================================================
// MOUSE PARALLAX
//==================================================

const hero = document.querySelector(".about-hero");

if (hero) {

    hero.addEventListener("mousemove", (e) => {

        const x = (e.clientX / window.innerWidth - .5) * 10;
        const y = (e.clientY / window.innerHeight - .5) * 10;

        gsap.to(".about-hero-bg img", {

            x,

            y,

            rotation: x * .04,

            scale: 1.13,

            duration: 1.6,

            ease: "power3.out"

        });

        gsap.to(".about-hero-content", {

            x: x * .18,

            y: y * .18,

            duration: 1.2

        });

        gsap.to(".about-hero-label", {

            x: x * .35,

            y: y * .35,

            duration: 1.4

        });

        gsap.to(".about-hero-bg-text", {

            x: x * .45,

            duration: 2

        });

    });

    hero.addEventListener("mouseleave", () => {

        gsap.to(".about-hero-bg img", {

            x: 0,

            y: 0,

            rotation: 0,

            scale: 1.12,

            duration: 1.8,

            ease: "power3.out"

        });

        gsap.to(".about-hero-content", {

            x: 0,

            y: 0,

            duration: 1.5

        });

        gsap.to(".about-hero-label", {

            x: 0,

            y: 0,

            duration: 1.5

        });

        gsap.to(".about-hero-bg-text", {

            x: 0,

            duration: 2

        });

    });

}


//==================================================
// SCROLL PARALLAX
//==================================================

gsap.to(".about-hero-bg img", {

    yPercent: 12,

    scale: 1.18,

    ease: "none",

    scrollTrigger: {

        trigger: ".about-hero",

        start: "top top",

        end: "bottom top",

        scrub: true

    }

});

gsap.to(".about-hero-content", {

    yPercent: -18,

    opacity: .2,

    ease: "none",

    scrollTrigger: {

        trigger: ".about-hero",

        start: "top top",

        end: "bottom top",

        scrub: true

    }

});

gsap.to(".about-hero-bg-text", {

    yPercent: -40,

    ease: "none",

    scrollTrigger: {

        trigger: ".about-hero",

        start: "top top",

        end: "bottom top",

        scrub: true

    }

});


//==================================================
// SCROLL INDICATOR
//==================================================

gsap.to(".about-scroll-indicator span", {

    y: 18,

    repeat: -1,

    yoyo: true,

    duration: 1,

    ease: "power1.inOut"

});

//==================================================
// ABOUT VALUES SECTION
//==================================================

gsap.timeline({
    scrollTrigger: {
        trigger: ".about-values-heading",
        start: "top 80%"
    }
})
    .to(".about-values-heading span", { opacity: 1, y: 0, filter: "blur(0px)", duration: .8 })
    .to(".about-values-heading h2", { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 }, "-=.45")
    .to(".about-values-heading p", { opacity: 1, y: 0, filter: "blur(0px)", duration: .8 }, "-=.55");

gsap.to(".value-card", {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    duration: .9,
    ease: "power3.out",
    stagger: .12,
    scrollTrigger: {
        trigger: ".floating-values",
        start: "top 85%"
    }
});


//==================================================
// ABOUT PROCESS — STACKING CARD DECK
//==================================================
//
// Desktop: the deck is pinned in the viewport. As you scroll, the
// next card slides up from below and settles on top; the card(s)
// behind it recede slightly (scale down, dim, shift back) — a real
// stacked-deck feel. A slim index / progress bar / dot row sits
// below the stack and is fully clickable, so navigation works by
// scroll AND by click.
//
// Mobile: no pin, no deck math — cards just fade in normally as
// you scroll past them in the column layout.
//
//==================================================

const processHeadingTL = gsap.timeline({
    scrollTrigger: {
        trigger: ".about-process-heading",
        start: "top 80%"
    }
})

    .to(".about-process-heading span", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: .8
    })

    .to(".about-process-heading h2", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1
    }, "-=.45")

    .to(".about-process-heading p", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: .8
    }, "-=.55");


const processMM = gsap.matchMedia();

processMM.add(
    {
        isDesktop: "(min-width: 992px)",
        isMobile: "(max-width: 991px)"
    },
    (context) => {

        const { isDesktop } = context.conditions;

        const deck = document.querySelector(".process-deck");
        const steps = gsap.utils.toArray(".process-step");
        const cards = steps.map(step => step.querySelector(".process-card"));

        //--------------------------------------------------
        // DESKTOP / TABLET — pinned, scroll-and-click deck
        //--------------------------------------------------

        if (isDesktop && deck && steps.length) {

            const navFill = document.querySelector(".process-nav-fill");
            const navCurrent = document.querySelector(".process-nav-index .current");
            const navDots = gsap.utils.toArray(".process-nav-dot");
            const clamp01 = gsap.utils.clamp(0, 1);

            const N = steps.length;
            const MAX_BEHIND = 3; // cap how many receded layers stay visible

            // Initial state: card 0 settled and visible, the rest
            // waiting just below, ready to be dealt in.
            cards.forEach((card, i) => {
                if (i === 0) {
                    gsap.set(card, { y: 0, opacity: 1, scale: 1, rotation: 0 });
                } else {
                    gsap.set(card, { y: 70, opacity: 0, scale: .94, rotation: 5 });
                }
            });

            function applyDepth(activeFloat) {

                cards.forEach((card, i) => {

                    const depth = activeFloat - i;

                    if (depth <= 0) {

                        gsap.set(card, { y: 70, opacity: 0, scale: .94, rotation: 5 });

                    } else if (depth < 1) {

                        const t = depth;

                        gsap.set(card, {
                            y: gsap.utils.interpolate(70, 0, t),
                            opacity: gsap.utils.interpolate(0, 1, t),
                            scale: gsap.utils.interpolate(.94, 1, t),
                            rotation: gsap.utils.interpolate(5, 0, t)
                        });

                    } else {

                        const behind = Math.min(depth - 1, MAX_BEHIND);

                        gsap.set(card, {
                            y: -behind * 10,
                            opacity: 1 - behind * .12,
                            scale: 1 - behind * .035,
                            rotation: -behind * 1.4
                        });
                    }
                });
            }

            function updateNav(p, activeIndex) {
                if (navFill) navFill.style.width = (p * 100) + "%";
                if (navCurrent) navCurrent.textContent = String(activeIndex + 1).padStart(2, "0");
                navDots.forEach((dot, i) => dot.classList.toggle("active", i === activeIndex));
            }

            // A bit more than one viewport per transition gives each
            // deal-in / recede motion room to read clearly.
            const getScrollDistance = () => window.innerHeight * (N - 1) * 1.15;

            const deckTrigger = ScrollTrigger.create({
                trigger: deck,
                start: "top top",
                end: () => "+=" + getScrollDistance(),
                pin: true,
                anticipatePin: 1,
                scrub: true,
                onUpdate(self) {

                    const p = clamp01(self.progress);
                    const activeFloat = p * (N - 1);

                    applyDepth(activeFloat);

                    const activeIndex = Math.round(clamp01(activeFloat / (N - 1)) * (N - 1));
                    updateNav(p, activeIndex);
                }
            });

            navDots.forEach((dot, i) => {
                dot.addEventListener("click", () => {
                    const targetP = i / (N - 1);
                    const scrollPos = deckTrigger.start + targetP * (deckTrigger.end - deckTrigger.start);
                    window.scrollTo({ top: scrollPos, behavior: "smooth" });
                });
            });

        } else if (steps.length) {

            //--------------------------------------------------
            // MOBILE — no pin, no deck math, simple fade-in
            //--------------------------------------------------

            steps.forEach((step, i) => {
                const card = cards[i];

                gsap.fromTo(card,
                    { opacity: 0, y: 60, scale: .95, filter: "blur(14px)" },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: "blur(0px)",
                        duration: .9,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: step,
                            start: "top 82%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        }
    }
);




//--------------------------------------------------
// CARD HOVER
//--------------------------------------------------

document.querySelectorAll(".process-card").forEach(card => {

    card.addEventListener("mousemove", e => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;

        const y = e.clientY - rect.top;

        gsap.to(card, {

            rotationY: (x - rect.width / 2) / 25,

            rotationX: -(y - rect.height / 2) / 25,

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

//==================================================
// ABOUT STATEMENT
//==================================================

gsap.registerPlugin(ScrollTrigger);

//--------------------------------------------------
// INITIAL STATES
//--------------------------------------------------

gsap.set(".about-statement-bg img", {
    scale: 1.2
});

gsap.set(".about-statement-overlay", {
    opacity: 1
});

gsap.set(".about-statement-lines span", {
    width: 0,
    opacity: 0
});


//--------------------------------------------------
// REVEAL TIMELINE
//--------------------------------------------------

const statementTL = gsap.timeline({

    scrollTrigger: {

        trigger: ".about-statement",

        start: "top 70%",

        toggleActions: "play none none reverse"

    },

    defaults: {

        ease: "power3.out"

    }

});


statementTL

    .to(".about-statement-bg img", {

        scale: 1.2,

        duration: 2.2,

        ease: "power2.out"

    }, 0)

    .to(".about-statement-overlay", {

        opacity: .78,

        duration: 2

    }, 0)

    .to(".about-statement-lines span", {

        width: "100%",

        opacity: 1,

        duration: 1.3,

        stagger: .18

    }, .15)

    .to(".about-statement-eyebrow", {

        opacity: 1,

        y: 0,

        filter: "blur(0px)",

        duration: .8

    }, .35)

    .to(".about-statement-content h2", {

        opacity: 1,

        y: 0,

        filter: "blur(0px)",

        duration: 1.2

    }, .55)

    .to(".about-statement-content p", {

        opacity: 1,

        y: 0,

        filter: "blur(0px)",

        duration: .9

    }, .85)

    .to(".statement-number", {

        opacity: 1,

        y: 0,

        filter: "blur(0px)",

        duration: 1

    }, .95)

    .to(".statement-divider", {

        opacity: 1,

        y: 0,

        filter: "blur(0px)",

        duration: .8

    }, 1.05)

    .to(".statement-quote", {

        opacity: 1,

        y: 0,

        filter: "blur(0px)",

        duration: .9

    }, 1.15);


//--------------------------------------------------
// PARALLAX
//--------------------------------------------------

gsap.to(".about-statement-bg img", {

    yPercent: 15,
    scale: 1.2,

    ease: "none",

    scrollTrigger: {

        trigger: ".about-statement",

        start: "top bottom",

        end: "bottom top",

        scrub: true

    }

});


gsap.to(".about-statement-content", {

    yPercent: -10,

    ease: "none",

    scrollTrigger: {

        trigger: ".about-statement",

        start: "top bottom",

        end: "bottom top",

        scrub: true

    }

});


gsap.to(".about-statement-side", {

    yPercent: -18,

    ease: "none",

    scrollTrigger: {

        trigger: ".about-statement",

        start: "top bottom",

        end: "bottom top",

        scrub: true

    }

});


//--------------------------------------------------
// MOUSE PARALLAX
//--------------------------------------------------

const statement = document.querySelector(".about-statement");

if (statement) {

    statement.addEventListener("mousemove", (e) => {

        const rect = statement.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width - .5;
        const y = (e.clientY - rect.top) / rect.height - .5;

        gsap.to(".about-statement-bg img", {

            x: x * 30,

            y: y * 25,
            scale: 1.2,

            duration: 1.5,

            ease: "power3.out"

        });

        gsap.to(".about-statement-content", {

            x: x * 12,

            y: y * 10,

            duration: 1.4,

            ease: "power3.out"

        });

        gsap.to(".about-statement-side", {

            x: x * 18,

            y: y * 14,

            duration: 1.5,

            ease: "power3.out"

        });

    });


    statement.addEventListener("mouseleave", () => {

        gsap.to([
            ".about-statement-content",
            ".about-statement-side"

        ], {

            x: 0,

            y: 0,

            duration: 1.6,

            ease: "power3.out"

        }).to(".about-statement-bg img", {
            scale: 1.2
        })

    });

}

/*==================================================
    TESTIMONIALS — CONVEX ARC CAROUSEL
==================================================== */

const TESTIMONIALS_DATA = [
    { name: "Daniel Müller", city: "Zurich", quote: "Professional from inspection to completion. Everything exceeded expectations." },
    { name: "Sarah Weber", city: "Bern", quote: "Fast communication and flawless finishing. Highly recommended." },
    { name: "Lucas Frei", city: "Geneva", quote: "The AI inspection saved us thousands. Amazing experience." },
    { name: "Emma Keller", city: "Basel", quote: "Everything felt transparent from day one." },
    { name: "Sophia Baumann", city: "Lugano", quote: "Beautiful renovation. Better than we imagined." },
    { name: "Marco Steiner", city: "Lausanne", quote: "Couldn't have chosen a better company." }
];

document.addEventListener("DOMContentLoaded", () => {

    const track = document.getElementById("carouselTrack");
    const stage = document.getElementById("carouselStage");
    const dotsEl = document.getElementById("carouselDots");
    const prevBtn = document.getElementById("carouselPrev");
    const nextBtn = document.getElementById("carouselNext");

    if (!track) return;

    let activeIndex = 0;
    const total = TESTIMONIALS_DATA.length;

    /*==========================
        BUILD CARDS + DOTS (once)
    ==========================*/

    TESTIMONIALS_DATA.forEach((t, i) => {

        const card = document.createElement("div");
        card.className = "testimonial-card";
        card.dataset.index = i;

        card.innerHTML = `
            <div class="stars">★★★★★</div>
            <p>"${t.quote}"</p>
            <h4>${t.name}</h4>
            <span class="city">${t.city}</span>
        `;

        card.addEventListener("click", () => {
            // Only side cards (offset ±1) are meant to be clickable —
            // the offset attribute is refreshed by updateCarousel().
            const offset = parseInt(card.dataset.offset, 10);
            if (Math.abs(offset) === 1) goTo(i);
        });

        track.appendChild(card);

        const dot = document.createElement("button");
        dot.className = "carousel-dot";
        dot.addEventListener("click", () => goTo(i));
        dotsEl.appendChild(dot);

    });

    const cardEls = track.querySelectorAll(".testimonial-card");
    const dotEls = dotsEl.querySelectorAll(".carousel-dot");

    /*==========================
        POSITION CARDS ALONG THE CONVEX ARC
        Offset is each card's distance from the active
        index (circular, so it wraps both directions).
        Only offsets -2..2 get a defined position; anything
        further is parked off-screen and hidden.
    ==========================*/

    function shortestOffset(index) {

        let diff = index - activeIndex;

        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        return diff;

    }

    function updateCarousel() {

        cardEls.forEach((card, i) => {

            const offset = shortestOffset(i);
            card.dataset.offset = offset;

            let transform, opacity, zIndex, pointerEvents;

            if (offset === 0) {
                // ACTIVE — front and center, closest to viewer
                transform = "translate3d(0, 0, 0) rotateY(0deg) rotateZ(0deg) scale(1)";
                opacity = 1;
                zIndex = 30;
                pointerEvents = "none";
            } else if (Math.abs(offset) === 1) {
                // NEIGHBORS — curve back and down (convex/dome effect),
                // rotated slightly to face inward toward center
                const dir = offset > 0 ? 1 : -1;
                transform = `translate3d(${dir * 340}px, 60px, -180px) rotateY(${-dir * 20}deg) rotateZ(${dir * 3}deg) scale(.82)`;
                opacity = .78;
                zIndex = 20;
                pointerEvents = "auto";
            } else if (Math.abs(offset) === 2) {
                // FAR CARDS — parked further out/back, invisible but
                // positioned so the transition into view is smooth
                const dir = offset > 0 ? 1 : -1;
                transform = `translate3d(${dir * 600}px, 110px, -360px) rotateY(${-dir * 30}deg) scale(.62)`;
                opacity = 0;
                zIndex = 10;
                pointerEvents = "none";
            } else {
                // Anything beyond ±2 just sits with the far-card values,
                // fully hidden — only matters during fast repeated clicks
                transform = "translate3d(0, 110px, -420px) scale(.5)";
                opacity = 0;
                zIndex = 5;
                pointerEvents = "none";
            }

            card.style.transform = transform;
            card.style.opacity = opacity;
            card.style.zIndex = zIndex;
            card.style.pointerEvents = pointerEvents;

        });

        dotEls.forEach((dot, i) => dot.classList.toggle("active", i === activeIndex));

    }

    function goTo(index) {
        activeIndex = ((index % total) + total) % total; // wrap both directions
        updateCarousel();
    }

    prevBtn.addEventListener("click", () => goTo(activeIndex - 1));
    nextBtn.addEventListener("click", () => goTo(activeIndex + 1));

    /*==========================
        DRAG / SWIPE (touch + mouse)
    ==========================*/

    let dragStartX = 0;
    let isDragging = false;

    stage.addEventListener("pointerdown", (e) => {
        isDragging = true;
        dragStartX = e.clientX;
    });

    stage.addEventListener("pointerup", (e) => {

        if (!isDragging) return;
        isDragging = false;

        const delta = e.clientX - dragStartX;
        const threshold = 60; // minimum px drag distance to count as a swipe

        if (delta > threshold) goTo(activeIndex - 1);
        else if (delta < -threshold) goTo(activeIndex + 1);

    });

    stage.addEventListener("pointerleave", () => { isDragging = false; });

    /*==========================
        INITIAL RENDER
    ==========================*/

    updateCarousel();

});