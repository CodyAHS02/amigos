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

/*==================================================
    BEFORE / AFTER DRAG SLIDER
==================================================*/

(() => {

    const frame = document.getElementById("svcBaFrame");
    const clip = document.getElementById("svcBaClip");
    const handle = document.getElementById("svcBaHandle");

    if (!frame) return;

    let dragging = false;

    function setPosition(clientX) {

        const rect = frame.getBoundingClientRect();
        const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));

        clip.style.width = `${pct}%`;
        handle.style.left = `${pct}%`;

    }

    frame.addEventListener("mousedown", (e) => { dragging = true; setPosition(e.clientX); });
    window.addEventListener("mousemove", (e) => { if (dragging) setPosition(e.clientX); });
    window.addEventListener("mouseup", () => { dragging = false; });

    frame.addEventListener("touchstart", (e) => setPosition(e.touches[0].clientX));
    frame.addEventListener("touchmove", (e) => setPosition(e.touches[0].clientX));

})();

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