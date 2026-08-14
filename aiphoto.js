/*==================================================
    NEW: SCROLL REVEAL
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
apObserve(".ap-pipeline");

/*==================================================
    NEW: ACCURACY BARS FILL ON SCROLL
==================================================*/

(() => {

    const bars = document.getElementById("apBars");
    if (!bars) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            bars.querySelectorAll(".ap-bar-fill").forEach((fill, i) => {
                setTimeout(() => {
                    fill.style.width = fill.dataset.target + "%";
                }, i * 150);
            });

            io.unobserve(bars);
        });
    }, { threshold: .4 });

    io.observe(bars);

})();


/*====================================================================
    EMBEDDED AI VISUALIZER — original logic, unchanged
====================================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const section = document.querySelector(".ai-section");
    if (!section) return;

    const input = document.getElementById("roomUpload");
    const stage = document.getElementById("aiStage");
    const stageTopbar = document.getElementById("stageTopbar");
    const uploadBtn = document.getElementById("uploadBtn");
    const beforeImg = document.getElementById("beforeImg");
    const afterImg = document.getElementById("afterImg");
    const controlsDock = document.getElementById("aiControlsDock");
    const generateBtn = document.getElementById("generateBtn");
    const toggleButtons = document.querySelectorAll(".toggle-btn");

    const scanOverlay = document.getElementById("scanOverlay");
    const scanStatusText = document.getElementById("scanStatusText");
    const aiStatusBadge = document.getElementById("aiStatusBadge");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                section.classList.add("show");
                observer.unobserve(section);
            }
        });
    }, { threshold: .2 });

    observer.observe(section);

    uploadBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        input.click();
    });

    document.getElementById("stageEmpty").addEventListener("click", () => {
        input.click();
    });

    input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) showImage(file);
    });

    stage.addEventListener("dragover", (e) => {
        e.preventDefault();
        stage.classList.add("dragover");
    });

    stage.addEventListener("dragleave", () => {
        stage.classList.remove("dragover");
    });

    stage.addEventListener("drop", (e) => {
        e.preventDefault();
        stage.classList.remove("dragover");
        const file = e.dataTransfer.files[0];
        if (file) {
            input.files = e.dataTransfer.files;
            showImage(file);
        }
    });

    const SCAN_STEPS = [
        "Analyzing image…",
        "Detecting wall surfaces…",
        "Generating segmentation mask…",
        "Preview ready"
    ];

    function runScanSequence(onComplete) {

        let step = 0;
        scanOverlay.classList.add("active");
        aiStatusBadge.classList.remove("done");
        aiStatusBadge.classList.add("scanning");
        aiStatusBadge.innerHTML = `<span class="ai-status-dot"></span> Processing`;

        const interval = setInterval(() => {

            scanStatusText.textContent = SCAN_STEPS[step];
            step++;

            if (step >= SCAN_STEPS.length) {

                clearInterval(interval);

                // ------------------------------------------------------------
                // HOOK YOUR REAL API CALL HERE. Replace this whole
                // runScanSequence() body with something like:
                //
                //   const formData = new FormData();
                //   formData.append("image", file);
                //   fetch("/api/vision/detect-walls", { method: "POST", body: formData })
                //       .then(res => res.json())
                //       .then(data => { onComplete(); })
                //       .catch(err => { /* show error state */ });
                // ------------------------------------------------------------

                setTimeout(() => {
                    scanOverlay.classList.remove("active");
                    aiStatusBadge.classList.remove("scanning");
                    aiStatusBadge.classList.add("done");
                    aiStatusBadge.innerHTML = `<span class="ai-status-dot"></span> Walls detected`;
                    onComplete();
                }, 400);

            }

        }, 550);

    }

    function showImage(file) {

        const reader = new FileReader();

        reader.onload = function (event) {

            beforeImg.src = event.target.result;
            afterImg.src = event.target.result;

            stage.classList.add("has-image");
            stageTopbar.classList.add("show");

            runScanSequence(() => {
                controlsDock.classList.add("show");
                generateBtn.disabled = false;
            });

        };

        reader.readAsDataURL(file);

    }

    toggleButtons.forEach(button => {

        button.addEventListener("click", () => {

            toggleButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            if (button.dataset.view === "before") {
                beforeImg.classList.add("active");
                afterImg.classList.remove("active");
            } else {
                beforeImg.classList.remove("active");
                afterImg.classList.add("active");
            }

        });

    });

    const optionTabs = document.querySelectorAll(".option-tab");
    const optionPanels = document.querySelectorAll(".option-panel");

    optionTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            optionTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            optionPanels.forEach(p => p.classList.toggle("active", p.dataset.panel === tab.dataset.mode));
        });
    });

    const colorSlider = document.getElementById("colorSlider");
    const colorCursor = document.getElementById("colorSliderCursor");
    const colorSelectedRow = document.getElementById("colorSelectedRow");
    const colorSelectedSwatch = document.getElementById("colorSelectedSwatch");
    const colorSelectedHex = document.getElementById("colorSelectedHex");
    const wallpaperButtons = document.querySelectorAll(".wallpaperAI");

    function hslToHex(h, s, l) {
        s /= 100; l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        const toHex = x => Math.round(x * 255).toString(16).padStart(2, "0");
        return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
    }

    function pickColorAt(clientX) {

        const rect = colorSlider.getBoundingClientRect();
        const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        const hex = hslToHex(pct * 360, 100, 50);

        colorCursor.style.left = `${pct * 100}%`;
        colorCursor.classList.add("show");

        colorSelectedSwatch.style.background = hex;
        colorSelectedHex.textContent = hex.toUpperCase();
        colorSelectedRow.classList.add("show");

        wallpaperButtons.forEach(btn => btn.classList.remove("active"));

        afterImg.style.backgroundImage = "none";
        afterImg.style.background = hex;
        afterImg.style.mixBlendMode = "multiply";
        afterImg.style.opacity = ".88";
        afterImg.style.transition = ".45s ease";

    }

    let sliderDragging = false;

    colorSlider.addEventListener("mousedown", (e) => { sliderDragging = true; pickColorAt(e.clientX); });
    window.addEventListener("mousemove", (e) => { if (sliderDragging) pickColorAt(e.clientX); });
    window.addEventListener("mouseup", () => { sliderDragging = false; });
    colorSlider.addEventListener("touchstart", (e) => pickColorAt(e.touches[0].clientX));
    colorSlider.addEventListener("touchmove", (e) => pickColorAt(e.touches[0].clientX));

    wallpaperButtons.forEach(btn => {

        btn.addEventListener("click", () => {

            wallpaperButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            colorCursor.classList.remove("show");
            colorSelectedRow.classList.remove("show");

            afterImg.style.background = "none";
            afterImg.style.backgroundImage = `url(${btn.dataset.wallpaper})`;
            afterImg.style.backgroundSize = "cover";
            afterImg.style.mixBlendMode = "multiply";
            afterImg.style.opacity = ".85";
            afterImg.style.transition = ".45s ease";

        });

    });

    generateBtn.addEventListener("click", () => {

        generateBtn.innerHTML = "Generating...";
        generateBtn.disabled = true;

        setTimeout(() => {
            generateBtn.innerHTML = "AI Preview Ready";
        }, 1500);

    });

});