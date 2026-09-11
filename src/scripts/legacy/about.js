// Next loads legacy browser scripts after hydration. If DOMContentLoaded has
// already fired, run the initializer immediately so approved HTML behavior stays intact.
function runWhenDomReady(init) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
}

gsap.registerPlugin(ScrollTrigger);

function applyAboutDarkThemeSurfaces() {
    const isDark = document.documentElement.dataset.theme === "amigos-dark";
    const mixedGradient = "linear-gradient(120deg, #FFD21F 0%, #FF7A1A 44%, #E62453 100%)";

    const clearInlineTheme = (el) => {
        ["background", "background-size", "animation", "color", "border-color", "padding-left", "padding-right"].forEach(prop => el.style.removeProperty(prop));
    };

    document
        .querySelectorAll(".numbers-section, .values-section, .final-cta")
        .forEach(section => {
            if (!isDark) {
                clearInlineTheme(section);
                return;
            }

            section.style.setProperty("background", mixedGradient, "important");
            section.style.setProperty("background-size", "320% 320%", "important");
            section.style.setProperty("animation", "aboutMovingGradient 12s ease-in-out infinite", "important");
            section.style.setProperty("color", "#fff", "important");
        });

    document
        .querySelectorAll(".values-section .value-row")
        .forEach(row => {
            if (!isDark) {
                clearInlineTheme(row);
                return;
            }

            row.style.setProperty("background", mixedGradient, "important");
            row.style.setProperty("background-size", "320% 320%", "important");
            row.style.setProperty("animation", "aboutMovingGradient 10s ease-in-out infinite", "important");
            row.style.setProperty("border-color", "rgba(255, 255, 255, .42)", "important");
            row.style.setProperty("padding-left", "clamp(52px, 4vw, 82px)", "important");
            row.style.setProperty("padding-right", "clamp(34px, 3vw, 64px)", "important");
        });

    document
        .querySelectorAll(".about-testimonials h2")
        .forEach(heading => {
            if (!isDark) {
                heading.style.removeProperty("color");
                return;
            }

            heading.style.setProperty("color", "#fff", "important");
        });

    document
        .querySelectorAll(".about-testimonials .testimonial-card")
        .forEach(card => {
            if (!isDark) {
                clearInlineTheme(card);
                card.style.removeProperty("border-color");
                return;
            }

            card.style.setProperty("background", mixedGradient, "important");
            card.style.setProperty("background-size", "320% 320%", "important");
            card.style.setProperty("animation", "aboutMovingGradient 10s ease-in-out infinite", "important");
            card.style.setProperty("border-color", "rgba(255, 255, 255, .42)", "important");
            card.style.setProperty("color", "#fff", "important");
        });
}

runWhenDomReady(() => {
    applyAboutDarkThemeSurfaces();

    new MutationObserver(applyAboutDarkThemeSurfaces).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "class"]
    });
});

/*==================================================
    HEADER — scroll state + mobile nav
==================================================*/

(() => {

    const header = document.querySelector(".site-header");
    const hamburger = document.getElementById("hamburger");
    const nav = document.getElementById("siteNav");

    if (!header) return;

    ScrollTrigger.create({
        start: "top -60",
        onUpdate: (self) => header.classList.toggle("scrolled", self.scroll() > 60)
    });

    hamburger?.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        hamburger.classList.toggle("active", open);
        header.classList.toggle("nav-open", open);
        hamburger.setAttribute("aria-expanded", open);
    });

    nav?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            hamburger?.classList.remove("active");
            header.classList.remove("nav-open");
            hamburger?.setAttribute("aria-expanded", false);
        });
    });

})();

/*==================================================
    HERO — cinematic reveal + slow parallax
==================================================*/

(() => {

    const hero = document.querySelector(".about-hero");
    if (!hero) return;

    const heroImg = hero.querySelector(".about-hero-media img");

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(heroImg, { scale: 1.22 }, { scale: 1.12, duration: 2.2 })
        .to(".about-hero h1", { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2 }, .5)
        .to(".hero-copy", { opacity: 1, y: 0, filter: "blur(0px)", duration: .9 }, .8)
        .to(".hero-actions .btn", { opacity: 1, y: 0, duration: .7, stagger: .12 }, 1)
        .to(".scroll-indicator", { opacity: 1, duration: .8 }, 1.2);

    gsap.to(".scroll-indicator span", {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1.4,
        ease: "power1.inOut"
    });

    // very slow Ken-Burns continues on scroll, no aggressive zoom
    gsap.to(heroImg, {
        yPercent: 10,
        scale: 1.18,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true }
    });

    // subtle mouse parallax
    hero.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth - .5) * 8;
        const y = (e.clientY / window.innerHeight - .5) * 8;
        gsap.to(heroImg, { x, y, duration: 1.6, ease: "power3.out" });
    });

    hero.addEventListener("mouseleave", () => {
        gsap.to(heroImg, { x: 0, y: 0, duration: 1.8, ease: "power3.out" });
    });

})();

/*==================================================
    GENERIC SCROLL REVEAL — reveal-block / reveal-image / reveal-line
==================================================*/

function revealGroup(selector, opts = {}) {

    document.querySelectorAll(selector).forEach(section => {

        const targets = section.querySelectorAll(
            ".reveal-block, .reveal-image, .reveal-line, .reveal-step"
        );

        if (!targets.length) return;

        gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: .9,
            ease: "power3.out",
            stagger: opts.stagger ?? .12,
            scrollTrigger: {
                trigger: section,
                start: "top 82%"
            }
        });

    });

}

runWhenDomReady(() => {
    revealGroup(".story-section");
    revealGroup(".numbers-section", { stagger: .1 });
    revealGroup(".founder-section");
    revealGroup(".values-section", { stagger: .08 });
    gsap.fromTo(".value-icon",
        { scale: .4, opacity: 0 },
        {
            scale: 1, opacity: 1, duration: .6, ease: "back.out(1.7)",
            stagger: .08,
            scrollTrigger: { trigger: ".values-section", start: "top 82%" }
        }
    );
    revealGroup(".process-section", { stagger: .1 });
    revealGroup(".why-image-section");
    revealGroup(".partner-section", { stagger: .08 });
    revealGroup(".about-testimonials");
    revealGroup(".final-cta");
});

/*==================================================
    STORY IMAGES — horizontal slide-in + slow zoom
==================================================*/

(() => {

    const images = gsap.utils.toArray(".story-image");
    if (!images.length) return;

    images.forEach((img, i) => {

        gsap.fromTo(img,
            { x: 44, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 1.1, ease: "power3.out",
                delay: i * .08,
                scrollTrigger: { trigger: img, start: "top 88%" }
            }
        );

    })

})();

/*==================================================
    NUMBERS — count-up on enter, once
==================================================*/

(() => {

    document.querySelectorAll(".number-item strong[data-count]").forEach(el => {

        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || "";
        const prefix = el.dataset.prefix || "";
        const item = el.closest(".number-item");

        ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            once: true,
            onEnter: () => {

                const obj = { val: 0 };
                item?.classList.add("is-filling");

                gsap.to(obj, {
                    val: target,
                    duration: 1.8,
                    ease: "power2.out",
                    onUpdate: () => {
                        el.textContent = prefix + Math.floor(obj.val).toLocaleString("de-CH") + suffix;
                    },
                    onComplete: () => {
                        item?.classList.add("is-filled");
                    }
                });

            }
        });

    });

})();

/*==================================================
    FOUNDER IMAGE — slow zoom on scroll
==================================================*/

(() => {

    const img = document.querySelector(".founder-image img");
    if (!img) return;

    // gentle settle-in, once, the first time it enters view
    gsap.fromTo(img,
        { scale: 1.03 },
        {
            scale: 1, duration: 1.6, ease: "power2.out",
            scrollTrigger: { trigger: ".founder-image", start: "top 85%", once: true }
        }
    );

    // then continues with the very slow Ken Burns as the section scrolls past
    gsap.to(img, {
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: ".founder-section", start: "top bottom", end: "bottom top", scrub: true }
    });

})();

/*==================================================
    PROCESS — progress line fills as steps pass,
    active dot follows scroll
==================================================*/

(() => {

    const track = document.querySelector(".process-track");
    const fill = document.querySelector(".process-progress span");
    const steps = gsap.utils.toArray(".process-step");

    if (!track || !steps.length) return;

    ScrollTrigger.create({
        trigger: track,
        start: "top 60%",
        end: "bottom 60%",
        scrub: true,
        onUpdate: (self) => {

            if (fill) fill.style.width = (self.progress * 100) + "%";

            const activeIndex = Math.min(
                steps.length - 1,
                Math.floor(self.progress * steps.length)
            );

            steps.forEach((step, i) => step.classList.toggle("active", i <= activeIndex));

        }
    });

})();

/*==================================================
    WHY AMIGOS — parallax background
==================================================*/

(() => {

    const img = document.querySelector(".why-image-media img");
    if (!img) return;

    gsap.to(img, {
        yPercent: 12,
        scale: 1.14,
        ease: "none",
        scrollTrigger: { trigger: ".why-image-section", start: "top bottom", end: "bottom top", scrub: true }
    });

})();

/* ==================================================
   ABOUT TESTIMONIAL SLIDER
================================================== */

(() => {

    /* ── Real testimonials dataset ── */
    const TESTIMONIALS_DATA = [
        {
            name: "Natasha Fischer",
            city: "Switzerland",
            rating: 5,
            quote: "We are absolutely thrilled with Patricio's work. Both interior and exterior walls were painted perfectly. The work was clean, precise, and completed with great attention to detail."
        },
        {
            name: "Bettina Marinelli",
            city: "Switzerland",
            rating: 5,
            quote: "Our ground floor, entrance, living room, kitchen, stairwell and doors were beautifully painted. Expert advice, careful execution, and excellent quality."
        },
        {
            name: "Melanie Bryan",
            city: "Aarau",
            rating: 5,
            quote: "Amigos Maler provided expert advice and professional service. They were dedicated, helpful, and delivered outstanding results."
        },
        {
            name: "Sabiduri 1010",
            city: "Switzerland",
            rating: 5,
            quote: "I needed help painting my office wall and couldn't have wished for a better person. Professional, reliable, and excellent work."
        },
        {
            name: "Rineta Slishani",
            city: "Switzerland",
            rating: 5,
            quote: "Highly recommended! The work was completed reliably, on schedule, and with excellent quality."
        },
        {
            name: "Corinne Sittmann",
            city: "Switzerland",
            rating: 5,
            quote: "Very friendly and competent advice. The work was completed quickly and to a high standard. I would definitely hire Amigos again."
        },
        {
            name: "Erich Leimgruber",
            city: "Switzerland",
            rating: 5,
            quote: "The workers are very competent, clean, and precise. The price-performance ratio is excellent."
        },
        {
            name: "Benjamin Allemann",
            city: "Switzerland",
            rating: 5,
            quote: "You guys are great, friendly, and very helpful. We would book you again anytime."
        }
    ];

    /* ── Wait for DOM ── */
    function init() {

        const slider  = document.querySelector(".testimonial-slider");
        const section = document.querySelector(".about-testimonials");

        if (!slider || !section) {
            console.warn("Testimonials: slider/section not found");
            return;
        }

        const track    = slider.querySelector(".testimonial-track");
        const prevBtn  = slider.querySelector("[data-prev]");
        const nextBtn  = slider.querySelector("[data-next]");

        /* progress bar lives OUTSIDE the slider div — query from the section */
        const progressBar = section.querySelector(".testimonial-progress span");

        if (!track) {
            console.warn("Testimonials: track not found");
            return;
        }

        /* ── Inject real cards ── */
        track.innerHTML = TESTIMONIALS_DATA.map((t, i) => {
            const stars = "★".repeat(t.rating);
            return `
                <article class="testimonial-card${i === 0 ? " active" : ""}">
                    <div class="testimonial-stars">${stars}</div>
                    <p>"${t.quote}"</p>
                    <span>${t.name} · ${t.city}</span>
                </article>
            `;
        }).join("");

        applyAboutDarkThemeSurfaces();

        const cards = Array.from(track.querySelectorAll(".testimonial-card"));
        let current = 0;
        let autoId  = null;

        /* ── Core update ── */
        function updateSlider() {
            const cardWidth   = cards[0].getBoundingClientRect().width;
            const marginRight = parseFloat(getComputedStyle(cards[0]).marginRight) || 0;
            const distance    = cardWidth + marginRight;

            track.style.transform = `translate3d(-${current * distance}px, 0, 0)`;

            cards.forEach((card, idx) => card.classList.toggle("active", idx === current));

            if (progressBar) {
                progressBar.style.width = `${((current + 1) / cards.length) * 100}%`;
            }
        }

        function goNext() {
            current = (current + 1) % cards.length;
            updateSlider();
            restartAutoplay();
        }

        function goPrev() {
            current = (current - 1 + cards.length) % cards.length;
            updateSlider();
            restartAutoplay();
        }

        function restartAutoplay() {
            clearInterval(autoId);
            autoId = setInterval(goNext, 5500);
        }

        nextBtn?.addEventListener("click", goNext);
        prevBtn?.addEventListener("click", goPrev);
        window.addEventListener("resize", updateSlider);

        updateSlider();
        restartAutoplay();
    }

    runWhenDomReady(init);
})();
