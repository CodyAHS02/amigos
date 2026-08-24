/*==================================================
    SCROLL REVEAL
==================================================*/

function dwObserve(selector, className = "in-view", threshold = .15) {
    document.querySelectorAll(selector).forEach(el => {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(className);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold });
        io.observe(el);
    });
}

dwObserve(".dw-reveal");
dwObserve(".dw-flip-grid");

/*==================================================
    HERO DECK — separates slightly as you scroll
==================================================*/

(() => {

    const deck = document.getElementById("dwHeroDeck");
    if (!deck || typeof gsap === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".dw-deck-1", {
        x: -24, y: -14,
        scrollTrigger: { trigger: deck, start: "top 80%", end: "bottom top", scrub: 0.6 }
    });

    gsap.to(".dw-deck-2", {
        x: 26, y: 10,
        scrollTrigger: { trigger: deck, start: "top 80%", end: "bottom top", scrub: 0.6 }
    });

    gsap.to(".dw-deck-3", {
        x: -18, y: 20,
        scrollTrigger: { trigger: deck, start: "top 80%", end: "bottom top", scrub: 0.6 }
    });

})();

/*==================================================
    WALL CROSS-SECTION — click to expand a layer
==================================================*/

document.querySelectorAll(".dw-layer-bar").forEach(bar => {

    bar.addEventListener("click", () => {

        const layer = bar.closest(".dw-layer");
        const wasActive = layer.classList.contains("active");

        document.querySelectorAll(".dw-layer").forEach(l => l.classList.remove("active"));

        if (!wasActive) layer.classList.add("active");

    });

});

/*==================================================
    FINISH LEVEL SLIDER
==================================================*/

(() => {

    const slider = document.getElementById("dwFinishSlider");
    const numEl = document.getElementById("dwFinishNum");
    const titleEl = document.getElementById("dwFinishTitle");
    const descEl = document.getElementById("dwFinishDesc");
    const textureEl = document.getElementById("dwFinishTexture");

    if (!slider) return;

    const LEVELS = [
        {
            title: "Level 0 — Unfinished",
            desc: "No taping or compound at all. Used only where the wall will be permanently hidden, like behind removable panels.",
            blur: "0px", opacity: 1
        },
        {
            title: "Level 1 — Tape Embedded",
            desc: "Joints taped and embedded in compound with excess wiped off. Common for above ceilings and areas that stay concealed.",
            blur: "0.4px", opacity: .9
        },
        {
            title: "Level 2 — One Skim Coat",
            desc: "A single coat of compound over tape and fasteners. Standard behind tile, in garages, or utility spaces.",
            blur: "0.8px", opacity: .75
        },
        {
            title: "Level 3 — Two Skim Coats",
            desc: "An additional coat smooths joints further. Typical prep for heavy or textured wall coverings.",
            blur: "1.2px", opacity: .55
        },
        {
            title: "Level 4 — Standard Finish",
            desc: "Three coats of compound, sanded smooth. The default for flat or eggshell paint in most homes.",
            blur: "1.8px", opacity: .3
        },
        {
            title: "Level 5 — Skim Coat Finish",
            desc: "A full skim coat over the entire surface. The only level that hides imperfections under raking light or gloss paint.",
            blur: "2.4px", opacity: .08
        }
    ];

    function applyLevel(index) {

        const level = LEVELS[index];

        numEl.textContent = index;
        titleEl.style.opacity = 0;
        descEl.style.opacity = 0;

        setTimeout(() => {
            titleEl.textContent = level.title;
            descEl.textContent = level.desc;
            titleEl.style.opacity = 1;
            descEl.style.opacity = 1;
        }, 150);

        textureEl.style.filter = `blur(${level.blur})`;
        textureEl.style.backgroundColor = `rgba(255,255,255,${0.02 + (index * 0.01)})`;
        textureEl.style.opacity = 0.3 + (index * 0.12);

    }

    slider.addEventListener("input", () => applyLevel(+slider.value));

    applyLevel(0);

})();