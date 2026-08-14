/*==================================================
    SCROLL REVEAL
==================================================*/

function ipObserve(selector, className = "in-view", threshold = .15) {
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

ipObserve(".ip-reveal");
ipObserve(".ip-portfolio-grid");
ipObserve(".ip-tier-grid");

/*==================================================
    ANIMATED COUNTERS + OCCUPANCY RING
==================================================*/

document.querySelectorAll(".ip-counter").forEach(counter => {

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

(() => {
    const ring = document.getElementById("ipRingFill");
    if (!ring) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                ring.style.strokeDashoffset = 264 * (1 - 0.96); // 96% filled
                io.unobserve(ring);
            }
        });
    }, { threshold: .5 });

    io.observe(ring.closest(".ip-dash-card"));
})();

/*==================================================
    SELF-DRAWING PERFORMANCE CHART
==================================================*/

(() => {
    const chart = document.getElementById("ipLineChart");
    const line = document.getElementById("ipChartLine");
    const dots = document.querySelectorAll(".ip-chart-dot");

    if (!chart) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            line.classList.add("drawn");

            dots.forEach((dot, i) => {
                setTimeout(() => dot.classList.add("show"), 400 + i * 350);
            });

            io.unobserve(chart);
        });
    }, { threshold: .4 });

    io.observe(chart);
})();

/*==================================================
    ROI CALCULATOR
==================================================*/

(() => {

    const valueSlider = document.getElementById("ipValueSlider");
    const rentSlider = document.getElementById("ipRentSlider");
    const expenseSlider = document.getElementById("ipExpenseSlider");

    if (!valueSlider) return;

    const valueOut = document.getElementById("ipValueOut");
    const rentOut = document.getElementById("ipRentOut");
    const expenseOut = document.getElementById("ipExpenseOut");
    const grossOut = document.getElementById("ipGrossOut");
    const netOut = document.getElementById("ipNetOut");
    const capOut = document.getElementById("ipCapOut");

    function fmtCHF(n) {
        return "CHF " + Math.round(n).toLocaleString("en-US");
    }

    function recalc() {

        const value = +valueSlider.value;
        const rent = +rentSlider.value;
        const expensePct = +expenseSlider.value;

        const grossAnnual = rent * 12;
        const netAnnual = grossAnnual * (1 - expensePct / 100);
        const capRate = (netAnnual / value) * 100;

        valueOut.textContent = fmtCHF(value);
        rentOut.textContent = fmtCHF(rent);
        expenseOut.textContent = expensePct + "%";
        grossOut.textContent = fmtCHF(grossAnnual);
        netOut.textContent = fmtCHF(netAnnual);
        capOut.textContent = capRate.toFixed(2) + "%";

    }

    [valueSlider, rentSlider, expenseSlider].forEach(slider => {
        slider.addEventListener("input", recalc);
    });

    recalc();

})();