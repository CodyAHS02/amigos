gsap.registerPlugin(ScrollTrigger);

/*==================================================
        MOBILE NAV
==================================================*/

const hamburger = document.getElementById("hamburger");
const siteNav = document.getElementById("siteNav");

hamburger?.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    hamburger.classList.toggle("active", open);
    hamburger.setAttribute("aria-expanded", open);
});

siteNav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        siteNav.classList.remove("open");
        hamburger.classList.remove("active");
    });
});

/*==================================================
        HERO INTRO
==================================================*/

gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".contact-hero-lines span", { width: 0, stagger: .12, duration: 1 }, .2)
    .from(".contact-eyebrow", { y: 40, opacity: 0, filter: "blur(14px)", duration: .8 }, .35)
    .from(".contact-hero-inner h1", { y: 60, opacity: 0, filter: "blur(18px)", duration: 1.1 }, .5)
    .from(".contact-hero-inner p", { y: 30, opacity: 0, filter: "blur(12px)", duration: .8 }, .8)
    .from(".contact-hero-buttons a", { y: 30, opacity: 0, stagger: .1, duration: .7 }, .95)
    .from(".contact-hero-bg-text", { y: 80, opacity: 0, duration: 1.2 }, .5)
    .from(".contact-scroll-indicator", { opacity: 0, y: 20, duration: .6 }, 1.2);

gsap.to(".contact-scroll-indicator span", {
    y: 16, repeat: -1, yoyo: true, duration: 1, ease: "power1.inOut"
});

/*==================================================
        CURSOR-FOLLOW GLOW (hero only)
==================================================*/

const hero = document.querySelector(".contact-hero");
const glow = document.getElementById("cursorGlow");

if (hero && glow) {

    const glowX = gsap.quickTo(glow, "x", { duration: .6, ease: "power3.out" });
    const glowY = gsap.quickTo(glow, "y", { duration: .6, ease: "power3.out" });

    hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        glowX(e.clientX - rect.left);
        glowY(e.clientY - rect.top);
    });

}

/*==================================================
        MAGNETIC BUTTONS
==================================================*/

document.querySelectorAll(".magnetic-btn").forEach(btn => {

    const strength = .35;

    btn.addEventListener("mousemove", (e) => {

        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: relX * strength,
            y: relY * strength,
            duration: .4,
            ease: "power3.out"
        });

    });

    btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: .6, ease: "elastic.out(1, 0.4)" });
    });

});

/*==================================================
        FLOATING LABEL — <select> needs a class
        toggled manually since :placeholder-shown
        doesn't apply to it.
==================================================*/

document.querySelectorAll(".select-field select").forEach(select => {

    const field = select.closest(".form-field");

    function sync() {
        field.classList.toggle("has-value", select.value !== "");
    }

    select.addEventListener("change", sync);
    sync();

});

/*==================================================
        SUBMIT — animated success state + particle burst
==================================================*/

const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("formSubmitBtn");
const particlesHost = document.getElementById("submitParticles");

const PARTICLE_COLORS = ["#ffffff", "#A6B09A", "#D8CCB4"];

function spawnSubmitParticles(count = 12) {

    particlesHost.innerHTML = "";

    for (let i = 0; i < count; i++) {

        const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
        const distance = 50 + Math.random() * 60;

        const dot = document.createElement("span");
        dot.className = "submit-particle";
        dot.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
        dot.style.setProperty("--ty", `${Math.sin(angle) * distance}px`);
        dot.style.setProperty("--size", `${4 + Math.random() * 4}px`);
        dot.style.setProperty("--delay", `${Math.random() * 0.15}s`);
        dot.style.setProperty("--color", PARTICLE_COLORS[i % PARTICLE_COLORS.length]);

        particlesHost.appendChild(dot);

    }

}

contactForm?.addEventListener("submit", (e) => {

    e.preventDefault();

    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    // ------------------------------------------------------------
    // HOOK YOUR BACKEND CALL HERE. Grab field values with:
    //   document.getElementById("fieldName").value  (etc.)
    // POST them, then only run the success animation below once
    // the request actually succeeds — don't fire it optimistically
    // in production.
    // ------------------------------------------------------------

    spawnSubmitParticles();
    submitBtn.classList.add("sent");

    setTimeout(() => {
        submitBtn.classList.remove("sent");
        contactForm.reset();
        document.querySelectorAll(".select-field").forEach(f => f.classList.remove("has-value"));
    }, 2600);

});

/*==================================================
        COPY TO CLIPBOARD
==================================================*/

document.querySelectorAll(".info-copy-btn").forEach(btn => {

    btn.addEventListener("click", async () => {

        const value = btn.dataset.copy;

        try {
            await navigator.clipboard.writeText(value);
        } catch (err) {
            // Clipboard API unavailable — fail silently, the value
            // is still visible on the button for manual copying.
        }

        btn.classList.add("copied");
        clearTimeout(btn._copyTimeout);
        btn._copyTimeout = setTimeout(() => btn.classList.remove("copied"), 1800);

    });

});

/*==================================================
        LIVE ZÜRICH CLOCK + OPEN/CLOSED STATUS
==================================================*/

const liveClock = document.getElementById("liveClock");
const clockStatus = document.getElementById("clockStatus");

function updateClock() {

    const now = new Date();

    const timeStr = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Zurich",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).format(now);

    liveClock.textContent = timeStr;

    const zurichHour = parseInt(new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Zurich", hour: "2-digit", hour12: false
    }).format(now), 10);

    const zurichWeekday = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Zurich", weekday: "short"
    }).format(now);

    const isWeekday = !["Sat", "Sun"].includes(zurichWeekday);
    const isOpenHours = zurichHour >= 8 && zurichHour < 18;
    const isOpen = isWeekday && isOpenHours;

    clockStatus.classList.toggle("open", isOpen);
    clockStatus.innerHTML = isOpen
        ? `<i class="clock-dot"></i> We're online now`
        : `<i class="clock-dot"></i> Outside business hours`;

}

updateClock();
setInterval(updateClock, 1000);

/*==================================================
        FAQ ACCORDION
==================================================*/

document.querySelectorAll(".faq-item").forEach(item => {

    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {

        const isOpen = item.classList.contains("open");

        // close any other open item for a clean single-open accordion
        document.querySelectorAll(".faq-item.open").forEach(openItem => {
            if (openItem !== item) {
                openItem.classList.remove("open");
                openItem.querySelector(".faq-answer").style.maxHeight = null;
            }
        });

        if (isOpen) {
            item.classList.remove("open");
            answer.style.maxHeight = null;
        } else {
            item.classList.add("open");
            answer.style.maxHeight = answer.scrollHeight + "px";
        }

    });

});

/*==================================================
        SCROLL REVEALS
==================================================*/

gsap.utils.toArray(".reveal").forEach(el => {

    gsap.to(el, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: el,
            start: "top 85%"
        }
    });

});

/*==================================================
        TILT CARDS (reused technique from about.js)
==================================================*/

document.querySelectorAll(".tilt-card").forEach(card => {

    card.addEventListener("mousemove", e => {

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(card, {
            rotationY: (x - rect.width / 2) / 22,
            rotationX: -(y - rect.height / 2) / 22,
            transformPerspective: 900,
            duration: .35
        });

    });

    card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotationX: 0, rotationY: 0, duration: .6, ease: "power3.out" });
    });

});