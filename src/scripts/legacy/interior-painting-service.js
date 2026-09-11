// Next loads legacy browser scripts after hydration. If DOMContentLoaded has
// already fired, run the initializer immediately so approved HTML behavior stays intact.
function runWhenDomReady(init) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
}

/*==================================================
    SECTION REVEAL — .svc-reveal
==================================================*/

document.querySelectorAll(".svc-reveal").forEach(section => {

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("svc-in-view");
                io.unobserve(entry.target);
            }
        });
    }, { threshold: .15 });

    io.observe(section);

});

/*==================================================
    COUNTERS
==================================================*/

document.querySelectorAll(".svc-counter").forEach(counter => {

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const target = +counter.dataset.target;
            const duration = 1400;
            let start = null;

            function step(ts) {
                if (!start) start = ts;
                const progress = Math.min((ts - start) / duration, 1);
                counter.textContent = Math.floor(progress * target);
                if (progress < 1) requestAnimationFrame(step);
                else counter.textContent = target;
            }

            requestAnimationFrame(step);
            io.unobserve(counter);

        });
    }, { threshold: .5 });

    io.observe(counter);

});

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


/*==================================================
    PROCESS TIMELINE — LINE FILLS AS YOU SCROLL
==================================================*/

(() => {

    const timeline = document.getElementById("svcTimeline");
    const fill = document.getElementById("svcTimelineFill");

    if (!timeline || !fill || typeof gsap === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.to(fill, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: timeline,
            start: "top 70%",
            end: "bottom 60%",
            scrub: true
        }
    });

})();

/*==================================================
    COLOR STAGE — background swap + textures
==================================================*/

(() => {

    const stage = document.getElementById("svcColorStage");
    const label = document.getElementById("svcColorLabel");
    const colorSwatches = document.querySelectorAll(".svc-swatch");
    const textureSwatches = document.querySelectorAll(".svc-texture-swatch");

    if (!stage) return;

    function applyColor(hex, name) {
        stage.style.backgroundColor = hex;
        if (label) label.textContent = name;
    }

    let activeHex = "#F5F3EE";
    let activeName = "Warm White";

    colorSwatches.forEach(btn => {

        btn.addEventListener("click", () => {
            colorSwatches.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeHex = btn.dataset.bg;
            activeName = btn.dataset.name;
            applyColor(activeHex, activeName);
        });

        btn.addEventListener("mouseenter", () => applyColor(btn.dataset.bg, btn.dataset.name));
        btn.addEventListener("mouseleave", () => applyColor(activeHex, activeName));

    });

    textureSwatches.forEach(btn => {

        btn.addEventListener("click", () => {
            textureSwatches.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            stage.dataset.texture = btn.dataset.texture;
        });

    });

})();

/*==================================================
    PROJECT VISUAL — SLOW PARALLAX ZOOM
==================================================*/

(() => {

    const img = document.getElementById("svcProjectImg");
    if (!img || typeof gsap === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.to(img, {
        yPercent: 10,
        scale: 1.18,
        ease: "none",
        scrollTrigger: {
            trigger: img.closest(".svc-project-visual"),
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

})();

/*==================================================
    FEATURE ROWS — scroll reveal
==================================================*/

document.querySelectorAll(".svc-feature-row").forEach((row, i) => {

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => row.classList.add("svc-row-in-view"), i * 60);
                io.unobserve(row);
            }
        });
    }, { threshold: .2 });

    io.observe(row);

});

/*==================================================
    TESTIMONIALS — same dataset as About page
==================================================*/

(() => {

    const track = document.getElementById("svcTestimonialTrack");
    const dotsWrap = document.getElementById("svcTestimonialDots");

    if (!track) return;

    const TESTIMONIALS_DATA = [
        { name: "Daniel Müller", city: "Zurich", quote: "Professional from inspection to completion. Everything exceeded expectations." },
        { name: "Sarah Weber", city: "Bern", quote: "Fast communication and flawless finishing. Highly recommended." },
        { name: "Lucas Frei", city: "Geneva", quote: "The AI inspection saved us thousands. Amazing experience." },
        { name: "Emma Keller", city: "Basel", quote: "Everything felt transparent from day one." },
        { name: "Sophia Baumann", city: "Lugano", quote: "Beautiful renovation. Better than we imagined." },
        { name: "Marco Steiner", city: "Lausanne", quote: "Couldn't have chosen a better company." }
    ];

    track.innerHTML = TESTIMONIALS_DATA.map((t, i) => `
        <div class="svc-testimonial-slide${i === 0 ? " active" : ""}">
            <p>"${t.quote}"</p>
            <span>${t.name} · ${t.city}</span>
        </div>
    `).join("");

    dotsWrap.innerHTML = TESTIMONIALS_DATA.map((_, i) =>
        `<button class="svc-testimonial-dot${i === 0 ? " active" : ""}" data-index="${i}"></button>`
    ).join("");

    const slides = track.querySelectorAll(".svc-testimonial-slide");
    const dots = dotsWrap.querySelectorAll(".svc-testimonial-dot");

    let index = 0;
    let autoplayId = null;

    function goTo(i) {
        index = ((i % slides.length) + slides.length) % slides.length;
        slides.forEach((s, n) => s.classList.toggle("active", n === index));
        dots.forEach((d, n) => d.classList.toggle("active", n === index));
    }

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            goTo(+dot.dataset.index);
            restartAutoplay();
        });
    });

    function restartAutoplay() {
        clearInterval(autoplayId);
        autoplayId = setInterval(() => goTo(index + 1), 5500);
    }

    restartAutoplay();

})();