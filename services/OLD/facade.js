/*==================================================
    SCROLL REVEAL — .fac-reveal, drag track, accordion
==================================================*/

function facObserve(selector, className = "in-view", threshold = .15) {
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

facObserve(".fac-reveal");
facObserve("#facDragTrack");
facObserve("#facAccordion");

/*==================================================
    ANIMATED COUNTERS
==================================================*/

document.querySelectorAll(".fac-counter").forEach(counter => {

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const target = +counter.dataset.target;
            const suffix = counter.dataset.suffix || "";
            const duration = 1300;
            let start = null;

            function step(ts) {
                if (!start) start = ts;
                const progress = Math.min((ts - start) / duration, 1);
                counter.textContent = Math.floor(progress * target) + suffix;
                if (progress < 1) requestAnimationFrame(step);
                else counter.textContent = target + suffix;
            }

            requestAnimationFrame(step);
            io.unobserve(counter);

        });
    }, { threshold: .6 });

    io.observe(counter);

});

/*==================================================
    HORIZONTAL DRAG GALLERY — with momentum/inertia
==================================================*/

(() => {

    const track = document.getElementById("facDragTrack");
    if (!track) return;

    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let momentumId = null;

    function pointerX(e) {
        return e.touches ? e.touches[0].clientX : e.clientX;
    }

    function stopMomentum() {
        if (momentumId) cancelAnimationFrame(momentumId);
        momentumId = null;
    }

    function runMomentum() {

        if (Math.abs(velocity) < 0.5) {
            stopMomentum();
            return;
        }

        track.scrollLeft -= velocity;
        velocity *= 0.94; // friction — smaller = stops sooner

        momentumId = requestAnimationFrame(runMomentum);

    }

    function down(e) {
        isDown = true;
        stopMomentum();
        track.classList.add("grabbing");
        startX = pointerX(e);
        scrollStart = track.scrollLeft;
        lastX = startX;
        lastTime = performance.now();
        velocity = 0;
    }

    function move(e) {
        if (!isDown) return;
        const x = pointerX(e);
        const dx = x - startX;
        track.scrollLeft = scrollStart - dx;

        const now = performance.now();
        const dt = now - lastTime || 16;
        velocity = ((x - lastX) / dt) * 16; // px per frame, roughly
        lastX = x;
        lastTime = now;
    }

    function up() {
        if (!isDown) return;
        isDown = false;
        track.classList.remove("grabbing");
        runMomentum();
    }

    track.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    track.addEventListener("mouseleave", up);

    track.addEventListener("touchstart", down, { passive: true });
    track.addEventListener("touchmove", move, { passive: true });
    track.addEventListener("touchend", up);

    // fade the "drag to explore" hint once the user has actually dragged
    const hint = document.querySelector(".fac-drag-hint");
    let hasInteracted = false;

    track.addEventListener("scroll", () => {
        if (hasInteracted || !hint) return;
        hasInteracted = true;
        hint.style.opacity = "0.4";
    });

})();

/*==================================================
    ACCORDION — height-measured smooth open
==================================================*/

document.querySelectorAll(".fac-acc-trigger").forEach(trigger => {

    trigger.addEventListener("click", () => {

        const item = trigger.closest(".fac-acc-item");
        const panel = item.querySelector(".fac-acc-panel");
        const wasActive = item.classList.contains("active");

        document.querySelectorAll(".fac-acc-item").forEach(i => {
            i.classList.remove("active");
            i.querySelector(".fac-acc-panel").style.maxHeight = null;
        });

        if (!wasActive) {
            item.classList.add("active");
            panel.style.maxHeight = panel.scrollHeight + "px";
        }

    });

});

/*==================================================
    PINNED RESTORATION STAGE SEQUENCE
==================================================*/

(() => {

    const pinSection = document.getElementById("facStagePin");
    if (!pinSection || typeof gsap === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const stageImgs = pinSection.querySelectorAll(".fac-stage-img");
    const stageTexts = pinSection.querySelectorAll(".fac-stage-text");
    const stageDots = pinSection.querySelectorAll(".fac-stage-dot");

    let currentStage = 0;

    function setStage(index) {

        if (index === currentStage) return;
        currentStage = index;

        stageImgs.forEach((img, i) => img.classList.toggle("active", i === index));
        stageTexts.forEach((txt, i) => txt.classList.toggle("active", i === index));
        stageDots.forEach((dot, i) => dot.classList.toggle("active", i === index));

    }

    ScrollTrigger.create({
        trigger: pinSection,
        start: "top top",
        end: "+=2600",
        pin: true,
        scrub: 0.4,
        onUpdate(self) {
            const stage = Math.min(3, Math.floor(self.progress * 4));
            setStage(stage);
        }
    });

})();

/*==================================================
    HERO — subtle parallax tilt on mouse move
==================================================*/

(() => {

    const heroRight = document.querySelector(".fac-hero-right");
    if (!heroRight) return;

    const imgA = heroRight.querySelector(".fac-hero-img-a");
    const imgB = heroRight.querySelector(".fac-hero-img-b");

    heroRight.addEventListener("mousemove", (e) => {

        const rect = heroRight.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;

        imgA.style.transform = `translate(${px * 10}px, ${py * 10}px)`;
        imgB.style.transform = `translate(${px * -16}px, ${py * -16}px)`;

    });

    heroRight.addEventListener("mouseleave", () => {
        imgA.style.transform = "translate(0,0)";
        imgB.style.transform = "translate(0,0)";
    });

})();