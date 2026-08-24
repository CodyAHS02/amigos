/*==================================================
    SCROLL REVEAL
==================================================*/

function pmObserve(selector, className = "in-view", threshold = .15) {
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

pmObserve(".pm-reveal");
pmObserve(".pm-gallery-card");

/*==================================================
    HERO DASHBOARD — gauge fill + number count-up
==================================================*/

(() => {

    const hero = document.querySelector(".pm-hero");
    const fill = document.getElementById("pmGaugeFill");
    const num = document.getElementById("pmGaugeNum");

    if (!hero || !fill || !num) return;

    const CIRCUMFERENCE = 326.7;
    const TARGET_PERCENT = 96;

    function animateGauge() {

        const offset = CIRCUMFERENCE - (CIRCUMFERENCE * TARGET_PERCENT) / 100;
        fill.style.strokeDashoffset = offset;

        const duration = 1400;
        let start = null;

        function step(ts) {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            num.textContent = Math.floor(progress * TARGET_PERCENT);
            if (progress < 1) requestAnimationFrame(step);
            else num.textContent = TARGET_PERCENT;
        }

        requestAnimationFrame(step);

    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateGauge();
                io.unobserve(entry.target);
            }
        });
    }, { threshold: .4 });

    io.observe(hero);

})();

/*==================================================
    SEASONAL CARE WHEEL
==================================================*/

(() => {

    const wheel = document.getElementById("pmWheel");
    if (!wheel) return;

    const segments = wheel.querySelectorAll(".pm-wheel-seg");
    const iconEl = document.getElementById("pmWheelIcon");
    const labelEl = document.getElementById("pmWheelLabel");
    const titleEl = document.getElementById("pmSeasonTitle");
    const listEl = document.getElementById("pmSeasonList");

    const SEASONS = {
        spring: {
            icon: "🌱",
            label: "Spring",
            title: "Spring Checklist",
            tasks: [
                "Gutter clear-out after winter debris",
                "Exterior inspection for frost damage",
                "Irrigation & drainage check",
                "Refresh exterior paint touch-ups"
            ]
        },
        summer: {
            icon: "☀️",
            label: "Summer",
            title: "Summer Checklist",
            tasks: [
                "Check exterior paint for UV fade",
                "Inspect seals around windows & doors",
                "Test ventilation and cooling systems",
                "Garden & exterior drainage upkeep"
            ]
        },
        autumn: {
            icon: "🍂",
            label: "Autumn",
            title: "Autumn Checklist",
            tasks: [
                "Clear gutters before leaf fall builds up",
                "Check roof and facade before winter",
                "Service heating systems ahead of cold",
                "Weatherproof exposed exterior surfaces"
            ]
        },
        winter: {
            icon: "❄️",
            label: "Winter",
            title: "Winter Checklist",
            tasks: [
                "Inspect for frost and freeze damage",
                "Check insulation and draught-proofing",
                "Test emergency heating backups",
                "Salt/clear walkways after snowfall"
            ]
        }
    };

    function setSeason(season, btn) {

        segments.forEach(s => s.classList.toggle("active", s === btn));

        const data = SEASONS[season];
        iconEl.textContent = data.icon;
        labelEl.textContent = data.label;
        titleEl.textContent = data.title;

        listEl.style.opacity = 0;

        setTimeout(() => {
            listEl.innerHTML = data.tasks.map(t => `<li>${t}</li>`).join("");
            listEl.style.opacity = 1;
        }, 180);

    }

    segments.forEach(btn => {
        btn.addEventListener("click", () => setSeason(btn.dataset.season, btn));
    });

})();

/*==================================================
    COVERAGE BUILDER
==================================================*/

(() => {

    const toggle = document.getElementById("pmFreqToggle");
    const indicator = document.getElementById("pmFreqIndicator");
    const visitsNum = document.getElementById("pmVisitsNum");
    const list = document.getElementById("pmCoverageList");

    if (!toggle || !indicator) return;

    const buttons = toggle.querySelectorAll(".pm-freq-btn");

    const PLANS = {
        quarterly: {
            visits: 4,
            items: [
                "Seasonal exterior inspection",
                "Basic upkeep task list",
                "Email summary after each visit"
            ]
        },
        bimonthly: {
            visits: 6,
            items: [
                "Full exterior & interior inspection",
                "Priority scheduling for repairs",
                "Seasonal task checklist included"
            ]
        },
        monthly: {
            visits: 12,
            items: [
                "Full property walkthrough every visit",
                "Priority + emergency callout access",
                "Dedicated maintenance coordinator",
                "Detailed photo report after each visit"
            ]
        }
    };

    function moveIndicator(btn) {
        indicator.style.width = btn.offsetWidth + "px";
        indicator.style.transform = `translateX(${btn.offsetLeft - 6}px)`;
    }

    function setFreq(freq, btn) {

        buttons.forEach(b => b.classList.toggle("active", b === btn));
        moveIndicator(btn);

        const plan = PLANS[freq];

        visitsNum.style.opacity = 0;
        list.classList.add("fading");

        setTimeout(() => {
            visitsNum.textContent = plan.visits;
            list.innerHTML = plan.items.map(i => `<li>${i}</li>`).join("");
            visitsNum.style.opacity = 1;
            list.classList.remove("fading");
        }, 220);

    }

    buttons.forEach(btn => {
        btn.addEventListener("click", () => setFreq(btn.dataset.freq, btn));
    });

    window.addEventListener("load", () => moveIndicator(toggle.querySelector(".pm-freq-btn.active")));
    window.addEventListener("resize", () => moveIndicator(toggle.querySelector(".pm-freq-btn.active")));
    requestAnimationFrame(() => moveIndicator(toggle.querySelector(".pm-freq-btn.active")));

})();

/*==================================================
    PLAN RECOMMENDER QUIZ
==================================================*/

(() => {

    const quiz = document.getElementById("pmQuiz");
    if (!quiz) return;

    const step1 = quiz.querySelector('[data-step="1"]');
    const step2 = quiz.querySelector('[data-step="2"]');
    const result = quiz.querySelector('[data-step="result"]');
    const planNameEl = document.getElementById("pmQuizPlanName");
    const planDescEl = document.getElementById("pmQuizPlanDesc");
    const restartBtn = document.getElementById("pmQuizRestart");

    const PLAN_DESCRIPTIONS = {
        Basic: "Essential seasonal upkeep and an annual inspection — a solid starting point for a well-kept property.",
        Plus: "Regular inspections with priority scheduling — a solid middle ground for most homeowners.",
        Premium: "Full-coverage, hands-off maintenance with a dedicated coordinator and emergency priority access."
    };

    let propertyType = null;

    function goToStep2(value) {
        propertyType = value;
        step1.classList.remove("active");
        step2.classList.add("active");
    }

    function showResult(handsOff) {

        let plan = handsOff === "basic" ? "Basic" : handsOff === "premium" ? "Premium" : "Plus";

        // multi-unit / investment properties benefit from at least Plus-level coverage
        if (propertyType === "multi" && plan === "Basic") plan = "Plus";

        planNameEl.textContent = plan;
        planDescEl.textContent = PLAN_DESCRIPTIONS[plan];

        step2.classList.remove("active");
        result.classList.add("active");

    }

    step1.querySelectorAll(".pm-quiz-option").forEach(opt => {
        opt.addEventListener("click", () => goToStep2(opt.dataset.value));
    });

    step2.querySelectorAll(".pm-quiz-option").forEach(opt => {
        opt.addEventListener("click", () => showResult(opt.dataset.value));
    });

    restartBtn?.addEventListener("click", () => {
        result.classList.remove("active");
        step1.classList.add("active");
        propertyType = null;
    });

})();