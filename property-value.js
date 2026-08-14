/*==================================================
    SCROLL REVEAL
==================================================*/

function pvObserve(selector, className = "in-view", threshold = .15) {
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

pvObserve(".pv-reveal");
pvObserve(".pv-threat-card");
pvObserve(".pv-reveal-left");
pvObserve(".pv-reveal-right");

/*==================================================
    HERO CHART — self-drawing divergence lines
==================================================*/

(() => {

    const card = document.querySelector(".pv-chart-card");
    const preserved = document.getElementById("pvLinePreserved");
    const neglected = document.getElementById("pvLineNeglected");

    if (!card || !preserved || !neglected) return;

    [preserved, neglected].forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.transition = "stroke-dashoffset 2.2s cubic-bezier(.22,1,.36,1)";
    });

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            neglected.style.strokeDashoffset = 0;
            setTimeout(() => { preserved.style.strokeDashoffset = 0; }, 250);

            io.unobserve(entry.target);

        });
    }, { threshold: .4 });

    io.observe(card);

})();

/*==================================================
    COUNTERS (.pv-counter)
==================================================*/

document.querySelectorAll(".pv-counter").forEach(counter => {

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
    TILT CARDS — "what erodes value" grid
==================================================*/

document.querySelectorAll(".pv-threat-card").forEach(card => {

    card.addEventListener("mousemove", (e) => {

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = ((x - rect.width / 2) / rect.width) * 14;
        const rotateX = -((y - rect.height / 2) / rect.height) * 14;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";
    });

});

/*==================================================
    PRESERVED VS NEGLECTED — animated bars
==================================================*/

(() => {

    const compare = document.getElementById("pvBarCompare");
    if (!compare) return;

    const preservedFill = document.getElementById("pvBarPreserved");
    const neglectedFill = document.getElementById("pvBarNeglected");
    const preservedNum = document.getElementById("pvBarNumPreserved");
    const neglectedNum = document.getElementById("pvBarNumNeglected");

    function animateBar(fillEl, numEl) {

        const target = +fillEl.dataset.target;
        fillEl.style.height = target + "%";

        const duration = 1400;
        let start = null;

        function step(ts) {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            numEl.textContent = Math.floor(progress * target) + "%";
            if (progress < 1) requestAnimationFrame(step);
            else numEl.textContent = target + "%";
        }

        requestAnimationFrame(step);

    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            animateBar(preservedFill, preservedNum);
            setTimeout(() => animateBar(neglectedFill, neglectedNum), 200);

            io.unobserve(entry.target);

        });
    }, { threshold: .4 });

    io.observe(compare);

})();

/*==================================================
    VALUE CALCULATOR
==================================================*/

(() => {

    const valueSlider = document.getElementById("pvCalcValue");
    const yearsSlider = document.getElementById("pvCalcYears");
    const valueDisplay = document.getElementById("pvCalcValueDisplay");
    const yearsDisplay = document.getElementById("pvCalcYearsDisplay");
    const resultEl = document.getElementById("pvCalcResult");

    if (!valueSlider || !yearsSlider || !resultEl) return;

    const PRESERVED_RETAIN = 0.94;

    function formatCHF(n) {
        return "CHF " + Math.round(n).toLocaleString("en-CH");
    }

    function neglectedRetainForYears(years) {
        // rough decline curve — starts near preserved, drops further the longer
        // a property goes without regular care, floored so it never looks absurd
        return Math.max(0.55, 0.97 - years * 0.021);
    }

    function calculate() {

        const propertyValue = +valueSlider.value;
        const years = +yearsSlider.value;

        valueDisplay.textContent = formatCHF(propertyValue);
        yearsDisplay.textContent = years + (years === 1 ? " Year" : " Years");

        const neglectedRetain = neglectedRetainForYears(years);
        const valueProtected = propertyValue * (PRESERVED_RETAIN - neglectedRetain);

        resultEl.textContent = formatCHF(Math.max(0, valueProtected));

        resultEl.classList.remove("pulse");
        void resultEl.offsetWidth;
        resultEl.classList.add("pulse");

    }

    valueSlider.addEventListener("input", calculate);
    yearsSlider.addEventListener("input", calculate);

    calculate();

})();