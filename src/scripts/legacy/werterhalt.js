// Next loads legacy browser scripts after hydration. If DOMContentLoaded has
// already fired, run the initializer immediately so approved HTML behavior stays intact.
function runWhenDomReady(init) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
}

/* =========================================================
   AMIGOS — PROPERTY VALUE PRESERVATION
   COMPLETE PAGE JAVASCRIPT
========================================================= */

runWhenDomReady(() => {

    /* =====================================================
       01. GLOBAL HELPERS
    ===================================================== */

    const select = (selector, parent = document) => {
        return parent.querySelector(selector);
    };

    const selectAll = (selector, parent = document) => {
        return [...parent.querySelectorAll(selector)];
    };


    /* =====================================================
       02. HEADER — SCROLL EFFECT
    ===================================================== */

    const header = select(".property-header");

    if (header) {
        const updateHeader = () => {
            if (window.scrollY > 40) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        };

        updateHeader();
        window.addEventListener("scroll", updateHeader, {
            passive: true
        });
    }


    /* =====================================================
       03. MOBILE MENU
    ===================================================== */

    const menuToggle = select(".property-menu-toggle");
    const navigation = select(".property-navigation");

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", () => {

            navigation.classList.toggle("mobile-open");
            menuToggle.classList.toggle("active");

        });

        selectAll(".property-navigation a").forEach(link => {
            link.addEventListener("click", () => {
                navigation.classList.remove("mobile-open");
                menuToggle.classList.remove("active");
            });
        });
    }


    /* =====================================================
       04. HERO — PROPERTY PARALLAX
    ===================================================== */

    const hero = select(".property-hero");
    const heroBuilding = select(".property-building");
    const heroImage = select(".building-image-wrap img");

    if (hero && heroBuilding && heroImage) {

        const heroParallax = () => {

            const rect = hero.getBoundingClientRect();

            if (
                rect.bottom > 0 &&
                rect.top < window.innerHeight
            ) {

                const progress =
                    (window.innerHeight - rect.top) /
                    (window.innerHeight + rect.height);

                const movement =
                    Math.max(-12, Math.min(12, progress * 18 - 9));

                heroImage.style.transform =
                    `scale(1.06) translate3d(0, ${movement}px, 0)`;
            }
        };

        window.addEventListener("scroll", heroParallax, {
            passive: true
        });

        heroParallax();
    }


    /* =====================================================
       05. HERO — HOTSPOT INTERACTION
    ===================================================== */

    const heroHotspots = selectAll(".property-hotspot");
    const statusTitle = select(".status-card-title");
    const statusDescription = select(".building-status-card p");
    const progressBar = select(".status-progress span");

    const heroHotspotData = {
        "hotspot-facade": {
            title: "Facade",
            description:
                "Surface condition, weathering and visible wear can be assessed before larger renovation work becomes necessary.",
            progress: "72%"
        },

        "hotspot-windows": {
            title: "Windows & Woodwork",
            description:
                "Painted and wooden elements should be checked regularly to help protect them from moisture and weather exposure.",
            progress: "68%"
        },

        "hotspot-interior": {
            title: "Interior",
            description:
                "Walls, ceilings and interior surfaces can be reviewed for wear, damage and upcoming maintenance needs.",
            progress: "81%"
        }
    };

    heroHotspots.forEach(hotspot => {

        hotspot.addEventListener("click", () => {

            const className = [...hotspot.classList]
                .find(cls => heroHotspotData[cls]);

            if (!className) return;

            const data = heroHotspotData[className];

            if (statusTitle) {
                statusTitle.textContent = data.title;
            }

            if (statusDescription) {
                statusDescription.textContent = data.description;
            }

            if (progressBar) {
                progressBar.style.width = data.progress;
            }

            heroHotspots.forEach(item => {
                item.classList.remove("active");
            });

            hotspot.classList.add("active");

        });

    });


    /* =====================================================
       06. MEANING DIAGRAM — INTERACTIVE NODES
    ===================================================== */

    const meaningNodes = selectAll(".meaning-node");
    const activePanel = select(".meaning-active-panel");

    if (meaningNodes.length && activePanel) {

        const panelNumber = select(".active-panel-number", activePanel);
        const panelTitle = select("strong", activePanel);
        const panelText = select("p", activePanel);

        const meaningData = {
            "meaning-node-one": {
                number: "01",
                title: "Recognise the condition",
                text:
                    "Understanding the current condition of a property creates the foundation for sensible long-term decisions."
            },

            "meaning-node-two": {
                number: "02",
                title: "Identify damage early",
                text:
                    "Early recognition of wear and damage can help avoid unnecessary escalation and larger repair requirements."
            },

            "meaning-node-three": {
                number: "03",
                title: "Protect surfaces",
                text:
                    "Suitable materials and coating systems help protect surfaces against everyday use and environmental influences."
            },

            "meaning-node-four": {
                number: "04",
                title: "Maintain building elements",
                text:
                    "Regular attention to surfaces and building elements supports the overall condition of the property."
            },

            "meaning-node-five": {
                number: "05",
                title: "Plan renovations",
                text:
                    "Renovation measures can be planned according to actual needs instead of reacting only when problems become urgent."
            },

            "meaning-node-six": {
                number: "06",
                title: "Think long term",
                text:
                    "The goal is a property that remains cared for, functional and visually appropriate over time."
            }
        };

        const activateMeaningNode = node => {

            const key = [...node.classList]
                .find(cls => meaningData[cls]);

            if (!key) return;

            const data = meaningData[key];

            meaningNodes.forEach(item => {
                item.classList.remove("active");
            });

            node.classList.add("active");

            if (panelNumber) {
                panelNumber.textContent = data.number;
            }

            if (panelTitle) {
                panelTitle.textContent = data.title;
            }

            if (panelText) {
                panelText.textContent = data.text;
            }
        };

        meaningNodes.forEach(node => {

            node.addEventListener("mouseenter", () => {
                activateMeaningNode(node);
            });

            node.addEventListener("click", () => {
                activateMeaningNode(node);
            });

        });

        if (meaningNodes[0]) {
            activateMeaningNode(meaningNodes[0]);
        }
    }


    /* =====================================================
       07. PROPERTY INSPECTION HOTSPOTS
    ===================================================== */

    const inspectionHotspots = selectAll(".inspection-hotspot");
    const inspectionTitle = select(
        ".inspection-information-content h3"
    );
    const inspectionText = select(
        ".inspection-information-content p"
    );
    const inspectionNumber = select(
        ".inspection-number"
    );

    const inspectionData = {
        "inspection-hotspot-facade": {
            number: "01 / 05",
            title: "Facade",
            text:
                "We look at visible weathering, cracks, coatings and surface condition to identify areas that may require maintenance or renovation."
        },

        "inspection-hotspot-windows": {
            number: "02 / 05",
            title: "Windows & Woodwork",
            text:
                "Painted woodwork and exposed elements can be checked for signs of wear, moisture exposure and deteriorating protective coatings."
        },

        "inspection-hotspot-interior": {
            number: "03 / 05",
            title: "Interior Spaces",
            text:
                "Interior rooms are considered in relation to use, condition, light, surfaces and future renovation requirements."
        },

        "inspection-hotspot-walls": {
            number: "04 / 05",
            title: "Walls & Ceilings",
            text:
                "Walls and ceilings are reviewed for cracks, surface damage, unevenness and preparation requirements before new finishes."
        },

        "inspection-hotspot-surfaces": {
            number: "05 / 05",
            title: "Surfaces",
            text:
                "The appropriate preparation, material and coating system depends on the specific surface and its intended use."
        }
    };

    const activateInspection = hotspot => {

        const key = [...hotspot.classList]
            .find(cls => inspectionData[cls]);

        if (!key) return;

        const data = inspectionData[key];

        inspectionHotspots.forEach(item => {
            item.classList.remove("active");
        });

        hotspot.classList.add("active");

        if (inspectionNumber) {
            inspectionNumber.textContent = data.number;
        }

        if (inspectionTitle) {
            inspectionTitle.textContent = data.title;
        }

        if (inspectionText) {
            inspectionText.textContent = data.text;
        }
    };

    inspectionHotspots.forEach(hotspot => {

        hotspot.addEventListener("mouseenter", () => {
            activateInspection(hotspot);
        });

        hotspot.addEventListener("click", () => {
            activateInspection(hotspot);
        });

    });

    if (inspectionHotspots[0]) {
        activateInspection(inspectionHotspots[0]);
    }


    /* =====================================================
       08. PROCESS TIMELINE
    ===================================================== */

    const processSection = select(".property-process");
    const processItems = selectAll(".process-item");
    const processProgress = select(".process-line-progress");

    const updateProcessTimeline = () => {

        if (!processSection || !processItems.length) return;

        const sectionRect = processSection.getBoundingClientRect();

        const viewportCenter = window.innerHeight * 0.52;

        let activeIndex = 0;

        processItems.forEach((item, index) => {

            const rect = item.getBoundingClientRect();

            const distance =
                Math.abs(
                    rect.top + rect.height / 2 -
                    viewportCenter
                );

            if (distance < window.innerHeight * .25) {
                activeIndex = index;
            }

            if (rect.top < viewportCenter) {
                item.classList.add("is-visible");
            }
        });

        processItems.forEach((item, index) => {

            item.classList.toggle(
                "active",
                index === activeIndex
            );

        });

        if (processProgress) {

            const progress =
                processItems.length <= 1
                    ? 100
                    : (activeIndex /
                        (processItems.length - 1)) * 100;

            processProgress.style.height =
                `${Math.max(8, progress)}%`;
        }
    };

    window.addEventListener("scroll", updateProcessTimeline, {
        passive: true
    });

    updateProcessTimeline();


    /* =====================================================
       09. PREVENTION — HORIZONTAL REVEAL
    ===================================================== */

    const preventionStory = select(".prevention-story");

    if (preventionStory) {

        const preventionPanels =
            selectAll(".prevention-panel", preventionStory);

        const updatePrevention = () => {

            const rect =
                preventionStory.getBoundingClientRect();

            const visible =
                1 -
                Math.abs(
                    rect.top + rect.height / 2 -
                    window.innerHeight / 2
                ) /
                (window.innerHeight * .9);

            const progress =
                Math.max(0, Math.min(1, visible));

            preventionPanels.forEach((panel, index) => {

                const direction =
                    index === 0 ? -1 :
                        index === 2 ? 1 : 0;

                panel.style.transform =
                    `translateX(${direction * (1 - progress) * 35}px)`;
            });
        };

        window.addEventListener("scroll", updatePrevention, {
            passive: true
        });

        updatePrevention();
    }


    /* =====================================================
       10. SERVICE CARDS — MAGNETIC HOVER
    ===================================================== */

    const serviceCards =
        selectAll(".service-system-card");

    serviceCards.forEach(card => {

        card.addEventListener("mousemove", event => {

            const rect = card.getBoundingClientRect();

            const x =
                event.clientX -
                rect.left -
                rect.width / 2;

            const y =
                event.clientY -
                rect.top -
                rect.height / 2;

            card.style.transform =
                `translate(${x * .025}px, ${y * .025 - 7}px)`;
        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "";
        });
    });


    /* =====================================================
       11. AUDIENCE CARDS — IMAGE PARALLAX
    ===================================================== */

    const audienceCards =
        selectAll(".audience-card");

    const updateAudienceParallax = () => {

        audienceCards.forEach(card => {

            const image = select(".audience-image img", card);

            if (!image) return;

            const rect = card.getBoundingClientRect();

            if (
                rect.bottom < 0 ||
                rect.top > window.innerHeight
            ) return;

            const center =
                rect.top + rect.height / 2;

            const offset =
                (center - window.innerHeight / 2) * -.025;

            image.style.transform =
                `scale(1.07) translateY(${offset}px)`;
        });
    };

    window.addEventListener("scroll", updateAudienceParallax, {
        passive: true
    });


    /* =====================================================
       12. PROPERTY LIFECYCLE — INTERACTIVE CYCLE
    ===================================================== */

    const lifecyclePoints =
        selectAll(".lifecycle-point");

    const lifecycleCenter =
        select(".lifecycle-center strong");

    const lifecycleLabels = {
        "lifecycle-point-one": "Control",
        "lifecycle-point-two": "Maintenance",
        "lifecycle-point-three": "Renovation",
        "lifecycle-point-four": "Protection"
    };

    lifecyclePoints.forEach(point => {

        point.addEventListener("mouseenter", () => {

            const key = [...point.classList]
                .find(cls => lifecycleLabels[cls]);

            if (!key || !lifecycleCenter) return;

            lifecycleCenter.textContent =
                lifecycleLabels[key];

        });

        point.addEventListener("click", () => {

            const key = [...point.classList]
                .find(cls => lifecycleLabels[cls]);

            if (!key || !lifecycleCenter) return;

            lifecycleCenter.textContent =
                lifecycleLabels[key];
        });
    });


    /* =====================================================
       13. DIGITAL INTERFACE — CARD INTERACTION
    ===================================================== */

    const interfaceCards =
        selectAll(".interface-card");

    interfaceCards.forEach(card => {

        card.addEventListener("mouseenter", () => {

            interfaceCards.forEach(item => {
                item.style.opacity =
                    item === card ? "1" : ".55";
            });

        });

        card.addEventListener("mouseleave", () => {

            interfaceCards.forEach(item => {
                item.style.opacity = "";
            });

        });
    });


    /* =====================================================
       14. LARGE PROPERTY IMAGE PARALLAX
    ===================================================== */

    const largePropertySection =
        select(".property-visual-section");

    const largePropertyImage =
        select(".property-visual-image img");

    if (largePropertySection && largePropertyImage) {

        const updateLargeImage = () => {

            const rect =
                largePropertySection.getBoundingClientRect();

            if (
                rect.bottom < 0 ||
                rect.top > window.innerHeight
            ) return;

            const progress =
                (window.innerHeight - rect.top) /
                (window.innerHeight + rect.height);

            const offset =
                (progress - .5) * 55;

            largePropertyImage.style.transform =
                `scale(1.08) translateY(${offset}px)`;
        };

        window.addEventListener("scroll", updateLargeImage, {
            passive: true
        });

        updateLargeImage();
    }


    /* =====================================================
       15. TRUST CARDS — SEQUENTIAL HOVER
    ===================================================== */

    const trustItems =
        selectAll(".trust-item");

    trustItems.forEach((item, index) => {

        item.style.transitionDelay =
            `${index * 40}ms`;

    });


    /* =====================================================
       16. SCROLL REVEAL SYSTEM
    ===================================================== */

    const revealSelectors = [
        ".hero-introduction",
        ".property-condition-visual",
        ".meaning-intro",
        ".meaning-node",
        ".inspection-heading",
        ".inspection-stage",
        ".process-header",
        ".process-item",
        ".prevention-heading",
        ".prevention-panel",
        ".service-system-header",
        ".service-system-card",
        ".audience-header",
        ".audience-card",
        ".lifecycle-copy",
        ".lifecycle-visual",
        ".digital-value-content",
        ".digital-interface",
        ".property-visual-statement",
        ".trust-heading",
        ".trust-item",
        ".final-cta-content"
    ];

    const revealElements = [];

    revealSelectors.forEach(selector => {

        selectAll(selector).forEach(element => {

            element.classList.add("scroll-reveal");

            revealElements.push(element);
        });
    });

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "scroll-revealed"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );
                    }
                });

            },
            {
                threshold: .12,
                rootMargin: "0px 0px -60px 0px"
            }
        );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* =====================================================
       17. DYNAMIC REVEAL CSS
       Added through JS so the CSS file remains clean.
    ===================================================== */

    const revealStyle =
        document.createElement("style");

    revealStyle.textContent = `

        .scroll-reveal {
            opacity: 0;
            transform: translateY(35px);
            transition:
                opacity .9s cubic-bezier(.22,1,.36,1),
                transform .9s cubic-bezier(.22,1,.36,1);
        }

        .scroll-revealed {
            opacity: 1;
            transform: translateY(0);
        }

        .meaning-node.scroll-reveal:nth-child(2),
        .service-system-card.scroll-reveal:nth-child(2),
        .audience-card.scroll-reveal:nth-child(2),
        .trust-item.scroll-reveal:nth-child(2) {
            transition-delay: .08s;
        }

        .meaning-node.scroll-reveal:nth-child(3),
        .service-system-card.scroll-reveal:nth-child(3),
        .audience-card.scroll-reveal:nth-child(3),
        .trust-item.scroll-reveal:nth-child(3) {
            transition-delay: .16s;
        }

        .meaning-node.scroll-reveal:nth-child(4),
        .service-system-card.scroll-reveal:nth-child(4),
        .audience-card.scroll-reveal:nth-child(4),
        .trust-item.scroll-reveal:nth-child(4) {
            transition-delay: .24s;
        }

        .meaning-node.scroll-reveal:nth-child(5),
        .service-system-card.scroll-reveal:nth-child(5) {
            transition-delay: .32s;
        }

        .meaning-node.scroll-reveal:nth-child(6),
        .service-system-card.scroll-reveal:nth-child(6) {
            transition-delay: .40s;
        }

        @media (max-width: 760px) {

            .property-navigation.mobile-open {
                position: absolute;
                top: 70px;
                left: 5%;
                right: 5%;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 0;
                padding: 15px;
                background: rgba(251,248,242,.97);
                box-shadow: 0 20px 50px rgba(7,26,51,.12);
                backdrop-filter: blur(18px);
            }

            .property-navigation.mobile-open a {
                width: 100%;
                padding: 14px 5px;
                border-bottom: 1px solid rgba(7,26,51,.08);
            }

            .property-navigation.mobile-open a:last-child {
                border-bottom: 0;
            }

            .property-menu-toggle.active span:first-child {
                transform: translateY(5px) rotate(45deg);
            }

            .property-menu-toggle.active span:nth-child(2) {
                opacity: 0;
            }

            .property-menu-toggle.active span:last-child {
                transform: translateY(-5px) rotate(-45deg);
            }
        }

    `;

    document.head.appendChild(revealStyle);


    /* =====================================================
       18. HERO STAGGERED INTRODUCTION
    ===================================================== */

    const heroElements = [
        ".hero-label",
        ".hero-introduction h1",
        ".hero-introduction > p",
        ".hero-actions",
        ".property-condition-visual"
    ];

    heroElements.forEach((selector, index) => {

        const element = select(selector);

        if (!element) return;

        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";

        setTimeout(() => {

            element.style.transition =
                "opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1)";

            element.style.opacity = "1";
            element.style.transform = "translateY(0)";

        }, 180 + index * 150);
    });


    /* =====================================================
       19. HERO INFORMATION POINTS
    ===================================================== */

    const conditionData =
        selectAll(".condition-data");

    conditionData.forEach((item, index) => {

        item.style.opacity = "0";
        item.style.transform = "translateY(12px)";

        setTimeout(() => {

            item.style.transition =
                "opacity .7s ease, transform .7s cubic-bezier(.22,1,.36,1)";

            item.style.opacity = "1";
            item.style.transform = "translateY(0)";

        }, 900 + index * 180);
    });


    /* =====================================================
       20. SMOOTH ANCHOR SCROLLING
    ===================================================== */

    selectAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#" ||
                targetId.length < 2
            ) return;

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const headerHeight =
                header ? header.offsetHeight : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                15;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });


    /* =====================================================
       21. ACTIVE SECTION TRACKING
    ===================================================== */

    const pageSections = selectAll(
        "section[id]"
    );

    const sectionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        selectAll(
                            ".property-navigation a"
                        ).forEach(link => {

                            link.classList.remove("active");

                            if (
                                link.getAttribute("href") ===
                                `#${entry.target.id}`
                            ) {
                                link.classList.add("active");
                            }
                        });
                    }

                });

            },
            {
                threshold: .25
            }
        );

    pageSections.forEach(section => {
        sectionObserver.observe(section);
    });


    /* =====================================================
       22. IMAGE LAZY LOADING
    ===================================================== */

    selectAll("img").forEach(image => {

        if (!image.hasAttribute("loading")) {
            image.setAttribute("loading", "lazy");
        }

    });


    /* =====================================================
       23. REDUCED MOTION CHECK
    ===================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (reducedMotion) {

        document.documentElement.style.scrollBehavior =
            "auto";

        selectAll("*").forEach(element => {

            element.style.animationDuration =
                "0.01ms";

            element.style.transitionDuration =
                "0.01ms";
        });
    }


    /* =====================================================
       24. INITIAL PAGE STATE
    ===================================================== */

    updateAudienceParallax();

    console.log(
        "Amigos Property Value Preservation page initialized."
    );

});