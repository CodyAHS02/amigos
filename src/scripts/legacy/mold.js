function runWhenDomReady(init) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
}

runWhenDomReady(() => {
    if (typeof gsap !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Content Reveal
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

        gsap.set([
            ".mold-eyebrow",
            ".mold-hero h1",
            ".mold-hero-p",
            ".mold-hero-actions a",
            ".metric-item",
            ".mold-hero-visual"
        ], { opacity: 0, y: 30 });

        heroTl
            .to(".mold-eyebrow", { opacity: 1, y: 0, duration: 0.6 })
            .to(".mold-hero h1", { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
            .to(".mold-hero-p", { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
            .to(".mold-hero-actions a", { opacity: 1, y: 0, stagger: 0.12, duration: 0.5 }, "-=0.4")
            .to(".metric-item", { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 }, "-=0.3")
            .to(".mold-hero-visual", { opacity: 1, y: 0, duration: 0.9 }, "-=0.6");

        // Parallax on hero image
        const heroImg = document.querySelector(".mold-hero-visual img");
        if (heroImg) {
            gsap.to(heroImg, {
                yPercent: -10,
                ease: "none",
                scrollTrigger: {
                    trigger: ".mold-hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.2
                }
            });
        }

        // Reveal Elements
        gsap.utils.toArray(".reveal").forEach((elem) => {
            gsap.fromTo(elem, 
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%",
                        once: true
                    }
                }
            );
        });

        // Staggered Cards
        const cardContainers = [
            { trigger: ".mold-science-grid", targets: ".science-card" },
            { trigger: ".mold-services-grid", targets: ".mold-service-card" },
            { trigger: ".mold-process-grid", targets: ".mold-process-card" }
        ];

        cardContainers.forEach(group => {
            const container = document.querySelector(group.trigger);
            if (container) {
                gsap.fromTo(group.targets,
                    { opacity: 0, y: 45 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        stagger: 0.12,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: group.trigger,
                            start: "top 82%",
                            once: true
                        }
                    }
                );
            }
        });

        ScrollTrigger.refresh();
    }

    // Interactive Before / After Slider
    const slider = document.getElementById("baSlider");
    const beforePane = document.getElementById("baBeforePane");
    const afterPane = document.getElementById("baAfterPane");
    const divider = document.getElementById("baDivider");
    const beforeLabel = document.getElementById("baBeforeLabel");
    const afterLabel = document.getElementById("baAfterLabel");

    if (slider && beforePane && afterPane && divider) {
        let isDragging = false;

        const updatePosition = (clientX) => {
            const rect = slider.getBoundingClientRect();
            let percent = ((clientX - rect.left) / rect.width) * 100;
            percent = Math.max(5, Math.min(95, percent));

            beforePane.style.width = percent + "%";
            afterPane.style.width = (100 - percent) + "%";
            divider.style.left = percent + "%";

            if (beforeLabel) beforeLabel.style.opacity = percent < 12 ? (percent / 12) : 1;
            if (afterLabel) afterLabel.style.opacity = (100 - percent) < 12 ? ((100 - percent) / 12) : 1;
        };

        const onStart = (e) => {
            isDragging = true;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updatePosition(clientX);
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updatePosition(clientX);
        };

        const onEnd = () => {
            isDragging = false;
        };

        slider.addEventListener("mousedown", onStart);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onEnd);

        slider.addEventListener("touchstart", onStart, { passive: true });
        window.addEventListener("touchmove", onMove, { passive: true });
        window.addEventListener("touchend", onEnd);

        // Initial 50% split
        updatePosition(slider.getBoundingClientRect().left + slider.getBoundingClientRect().width * 0.5);
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const header = item.querySelector(".faq-header");
        if (header) {
            header.addEventListener("click", () => {
                const isActive = item.classList.contains("active");
                faqItems.forEach(other => other.classList.remove("active"));
                if (!isActive) {
                    item.classList.add("active");
                }
            });
        }
    });
});
