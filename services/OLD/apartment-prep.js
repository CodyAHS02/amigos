/*==================================================
    SCROLL REVEAL
==================================================*/

function apObserve(selector, className = "in-view", threshold = .15) {
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

apObserve(".ap-reveal");
apObserve(".ap-ticket");

/*==================================================
    HERO — auto-ticking checklist loop
==================================================*/

(() => {

    const items = document.querySelectorAll("#apChecklist li");
    if (!items.length) return;

    let index = 0;
    let running = false;

    function resetAll() {
        items.forEach(li => li.classList.remove("checked"));
    }

    function tickNext() {

        if (index >= items.length) {
            setTimeout(() => {
                resetAll();
                index = 0;
                setTimeout(tickNext, 500);
            }, 1800);
            return;
        }

        items[index].classList.add("checked");
        index++;
        setTimeout(tickNext, 650);

    }

    function start() {
        if (running) return;
        running = true;
        setTimeout(tickNext, 500);
    }

    const hero = document.querySelector(".ap-hero");
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                start();
                io.unobserve(entry.target);
            }
        });
    }, { threshold: .3 });

    if (hero) io.observe(hero);

})();

/*==================================================
    TURNAROUND BADGE — count up
==================================================*/

document.querySelectorAll(".ap-turn-num").forEach(counter => {

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const target = +counter.dataset.target;
            const duration = 900;
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
    }, { threshold: .6 });

    io.observe(counter);

});

/*==================================================
    ROOM SWITCHER — tabs, sliding indicator, crossfade
==================================================*/

(() => {

    const tabsWrap = document.getElementById("apRoomTabs");
    const indicator = document.getElementById("apRoomIndicator");
    if (!tabsWrap || !indicator) return;

    const tabs = tabsWrap.querySelectorAll(".ap-room-tab");
    const images = document.querySelectorAll(".ap-room-img");
    const panels = document.querySelectorAll(".ap-room-panel");

    function moveIndicator(tab) {
        indicator.style.width = tab.offsetWidth + "px";
        indicator.style.transform = `translateX(${tab.offsetLeft - 6}px)`;
    }

    function setRoom(room, tab) {

        tabs.forEach(t => t.classList.toggle("active", t === tab));
        images.forEach(img => img.classList.toggle("active", img.dataset.roomImg === room));
        panels.forEach(panel => panel.classList.toggle("active", panel.dataset.roomPanel === room));

        moveIndicator(tab);

    }

    tabs.forEach(tab => {
        tab.addEventListener("click", () => setRoom(tab.dataset.room, tab));
    });

    // position the indicator correctly once layout is ready, and again on resize
    window.addEventListener("load", () => moveIndicator(tabsWrap.querySelector(".ap-room-tab.active")));
    window.addEventListener("resize", () => moveIndicator(tabsWrap.querySelector(".ap-room-tab.active")));

    // rough initial placement before full "load" fires
    requestAnimationFrame(() => moveIndicator(tabsWrap.querySelector(".ap-room-tab.active")));

})();

/*==================================================
    TURNAROUND TIMELINE — horizontal scrubbed fill
==================================================*/

(() => {

    const timeline = document.getElementById("apTurnTimeline");
    const fill = document.getElementById("apTurnFill");

    if (!timeline || !fill || typeof gsap === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.to(fill, {
        width: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: timeline,
            start: "top 75%",
            end: "bottom 60%",
            scrub: true
        }
    });

})();

/*==================================================
    TOGGLE COMPARISON — click switch, wipe reveal
==================================================*/

(() => {

    const switchBtn = document.getElementById("apToggleSwitch");
    const grid = document.getElementById("apToggleGrid");
    const labelBefore = document.getElementById("apLabelBefore");
    const labelAfter = document.getElementById("apLabelAfter");

    if (!switchBtn || !grid) return;

    let isOn = false;

    switchBtn.addEventListener("click", () => {

        isOn = !isOn;

        switchBtn.classList.toggle("on", isOn);
        switchBtn.setAttribute("aria-pressed", String(isOn));
        grid.classList.toggle("on", isOn);
        labelBefore.classList.toggle("on", !isOn);
        labelAfter.classList.toggle("on", isOn);

    });

})();

/*==================================================
    SCHEDULER
==================================================*/

(() => {

    const days = document.querySelectorAll(".ap-day");
    const result = document.getElementById("apSchedulerResult");

    if (!days.length || !result) return;

    days.forEach(day => {

        day.addEventListener("click", () => {

            days.forEach(d => d.classList.remove("selected"));
            day.classList.add("selected");

            const available = day.dataset.available === "true";
            const note = day.dataset.note;
            const dayName = day.querySelector(".ap-day-name").textContent;

            result.classList.toggle("available", available);
            result.classList.toggle("unavailable", !available);

            result.innerHTML = available
                ? `<strong>${dayName}</strong> looks good — ${note}. We'll confirm the exact time when you request your quote.`
                : `<strong>${dayName}</strong> is ${note.toLowerCase()} — pick another day, or ask us about the next opening.`;

        });

    });

})();