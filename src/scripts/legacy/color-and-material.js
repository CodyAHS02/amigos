// Next loads legacy browser scripts after hydration. If DOMContentLoaded has
// already fired, run the initializer immediately so approved HTML behavior stays intact.
function runWhenDomReady(init) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
}

runWhenDomReady(() => {
    gsap.registerPlugin(ScrollTrigger);

    const qs = (selector, parent = document) => parent.querySelector(selector);
    const qsa = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    /* =========================================================
       SAFETY
    ========================================================= */

    if (!document.body) return;

    /* =========================================================
       HERO — STAGGERED REVEAL + KEN BURNS
    ========================================================= */

    const heroElements = qsa(".reveal-color");

    if (heroElements.length) {
        gsap.set(heroElements, {
            opacity: 0,
            y: 45
        });

        gsap.to(heroElements, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.14,
            ease: "power3.out",
            delay: 0.15
        });
    }

    const heroImage = qs(".color-hero-image img");

    if (heroImage) {
        gsap.fromTo(
            heroImage,
            { scale: 1.02 },
            {
                scale: 1.09,
                duration: 18,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            }
        );

        gsap.to(heroImage, {
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
                trigger: ".color-hero",
                start: "top top",
                end: "bottom top",
                scrub: 1.4
            }
        });
    }

    /* =========================================================
       HERO SWATCH FLOAT
    ========================================================= */

    const heroSwatches = qsa(".color-hero-swatch span");

    if (heroSwatches.length) {
        gsap.to(heroSwatches, {
            y: -10,
            duration: 2.2,
            stagger: 0.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    /* =========================================================
       INTRO — OPPOSITE DIRECTION REVEAL
    ========================================================= */

    const introLeft = qsa(".reveal-color-left");
    const introRight = qsa(".reveal-color-right");

    if (introLeft.length) {
        gsap.fromTo(
            introLeft,
            {
                opacity: 0,
                x: -70
            },
            {
                opacity: 1,
                x: 0,
                duration: 1.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".color-intro",
                    start: "top 75%",
                    once: true
                }
            }
        );
    }

    if (introRight.length) {
        gsap.fromTo(
            introRight,
            {
                opacity: 0,
                x: 70
            },
            {
                opacity: 1,
                x: 0,
                duration: 1.1,
                delay: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".color-intro",
                    start: "top 75%",
                    once: true
                }
            }
        );
    }

    const introImage = qs(".intro-color-frame img");

    if (introImage) {
        gsap.to(introImage, {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
                trigger: ".color-intro",
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2
            }
        });
    }

    /* =========================================================
       CHOICE CARDS — STAGGERED REVEAL
    ========================================================= */

    const choiceCards = qsa(".reveal-choice");

    if (choiceCards.length) {
        gsap.set(choiceCards, {
            opacity: 0,
            y: 60
        });

        gsap.to(choiceCards, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.13,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".choices-grid",
                start: "top 80%",
                once: true
            }
        });
    }

    /* =========================================================
       CHOICE CARD INTERACTION
    ========================================================= */

    qsa(".choice-card").forEach(card => {
        const image = qs(".choice-image img", card);
        const arrow = qs(".choice-arrow", card);

        card.addEventListener("mouseenter", () => {
            gsap.to(card, {
                y: -10,
                duration: 0.35,
                ease: "power2.out"
            });

            if (image) {
                gsap.to(image, {
                    scale: 1.08,
                    duration: 0.7,
                    ease: "power3.out"
                });
            }

            if (arrow) {
                gsap.to(arrow, {
                    x: 4,
                    y: -4,
                    rotation: 8,
                    duration: 0.35,
                    ease: "power2.out"
                });
            }
        });

        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                y: 0,
                duration: 0.4,
                ease: "power2.out"
            });

            if (image) {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.7,
                    ease: "power3.out"
                });
            }

            if (arrow) {
                gsap.to(arrow, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    duration: 0.35,
                    ease: "power2.out"
                });
            }
        });
    });

    /* =========================================================
       INTERACTIVE COLOR ROOM
       ========================================================= */

    const colorWall = qs(".room-color-wall");
    const colorSwatches = qsa(".color-swatch");
    const selectedName = qs(".room-selected-name");
    const selectedDescription = qs(".room-selected-description");
    const experienceCounter = qs(".color-experience-meta span:last-child");

    if (colorWall && colorSwatches.length) {

        colorSwatches.forEach((swatch, index) => {

            swatch.addEventListener("click", () => {

                const color = swatch.dataset.color || "#E8E1D4";
                const name = swatch.dataset.name || "Selected Color";
                const description =
                    swatch.dataset.description ||
                    "A carefully selected color direction for your space.";

                colorSwatches.forEach(item => {
                    item.classList.remove("active");
                });

                swatch.classList.add("active");

                gsap.to(colorWall, {
                    backgroundColor: color,
                    duration: 0.75,
                    ease: "power2.out"
                });

                if (selectedName) {
                    gsap.to(selectedName, {
                        opacity: 0,
                        y: 8,
                        duration: 0.18,
                        onComplete: () => {
                            selectedName.textContent = name;

                            gsap.to(selectedName, {
                                opacity: 1,
                                y: 0,
                                duration: 0.35,
                                ease: "power2.out"
                            });
                        }
                    });
                }

                if (selectedDescription) {
                    gsap.to(selectedDescription, {
                        opacity: 0,
                        y: 8,
                        duration: 0.18,
                        onComplete: () => {
                            selectedDescription.textContent = description;

                            gsap.to(selectedDescription, {
                                opacity: 1,
                                y: 0,
                                duration: 0.35,
                                ease: "power2.out"
                            });
                        }
                    });
                }

                if (experienceCounter) {
                    experienceCounter.textContent =
                        String(index + 1).padStart(2, "0") + " / " +
                        String(colorSwatches.length).padStart(2, "0");
                }

                gsap.fromTo(
                    swatch,
                    {
                        scale: 0.94
                    },
                    {
                        scale: 1,
                        duration: 0.45,
                        ease: "back.out(1.7)"
                    }
                );
            });

        });
    }

    /* =========================================================
       COLOR EXPERIENCE REVEAL
    ========================================================= */

    if (qs(".color-room-stage")) {
        gsap.fromTo(
            ".color-room-stage",
            {
                opacity: 0,
                y: 70,
                scale: 0.97
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".color-experience",
                    start: "top 75%",
                    once: true
                }
            }
        );
    }

    /* =========================================================
    COLOR + LIGHT EXPERIENCE
    ========================================================= */

    const lightPreview = document.querySelector(".light-preview");
    const lightScenes = [...document.querySelectorAll(".light-scene")];
    const lightOptions = [...document.querySelectorAll(".light-option")];

    if (lightPreview && lightScenes.length && lightOptions.length) {

        let currentLight = 0;
        let isSwitching = false;

        /* -----------------------------------------------
           INITIAL STATE
        ------------------------------------------------ */

        lightScenes.forEach((scene, index) => {
            scene.classList.toggle("active", index === 0);
        });

        lightOptions.forEach((option, index) => {
            option.classList.toggle("active", index === 0);
        });


        /* -----------------------------------------------
           CHANGE LIGHTING
        ------------------------------------------------ */

        function changeLighting(index) {

            if (isSwitching || index === currentLight) return;

            const nextScene = lightScenes[index];
            const currentScene = lightScenes[currentLight];
            const nextOption = lightOptions[index];

            if (!nextScene || !currentScene) return;

            isSwitching = true;

            /* Remove active button state */

            lightOptions.forEach(option => {
                option.classList.remove("active");
            });

            nextOption.classList.add("active");


            /* Prepare next scene */

            gsap.set(nextScene, {
                opacity: 0,
                visibility: "visible",
                zIndex: 3
            });


            /* Crossfade */

            gsap.timeline({
                onComplete: () => {

                    currentScene.classList.remove("active");

                    gsap.set(currentScene, {
                        opacity: 0,
                        visibility: "hidden",
                        zIndex: 1
                    });

                    nextScene.classList.add("active");

                    gsap.set(nextScene, {
                        zIndex: 2
                    });

                    currentLight = index;
                    isSwitching = false;
                }
            })

                .to(nextScene, {
                    opacity: 1,
                    duration: .75,
                    ease: "power2.inOut"
                })

                .fromTo(
                    nextScene.querySelector("img"),
                    {
                        scale: 1.07
                    },
                    {
                        scale: 1.045,
                        duration: 1.15,
                        ease: "power2.out"
                    },
                    "<"
                );
        }


        /* -----------------------------------------------
           BUTTON EVENTS
        ------------------------------------------------ */

        lightOptions.forEach((option, index) => {

            option.addEventListener("click", () => {
                changeLighting(index);
            });

        });


        /* -----------------------------------------------
           HOVER MICRO INTERACTION
        ------------------------------------------------ */

        lightOptions.forEach(option => {

            option.addEventListener("mouseenter", () => {

                if (!option.classList.contains("active")) {
                    gsap.to(option, {
                        y: -2,
                        duration: .25,
                        ease: "power2.out"
                    });
                }

            });

            option.addEventListener("mouseleave", () => {

                gsap.to(option, {
                    y: 0,
                    duration: .25,
                    ease: "power2.out"
                });

            });

        });


        /* -----------------------------------------------
           IMAGE PARALLAX
        ------------------------------------------------ */

        lightScenes.forEach(scene => {

            const image = scene.querySelector("img");

            if (!image) return;

            gsap.to(image, {
                yPercent: 5,
                ease: "none",
                scrollTrigger: {
                    trigger: lightPreview,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5
                }
            });

        });


        /* -----------------------------------------------
           SECTION REVEAL
        ------------------------------------------------ */

        gsap.fromTo(
            ".color-light-header",
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".color-light",
                    start: "top 78%",
                    once: true
                }
            }
        );


        gsap.fromTo(
            lightPreview,
            {
                opacity: 0,
                y: 70,
                scale: .97
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.1,
                delay: .1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".color-light",
                    start: "top 68%",
                    once: true
                }
            }
        );

    }


    /* =========================================================
       FALLBACK — IF DIFFERENT CLASS STRUCTURE EXISTS
       ========================================================= */

    const oldLightOptions = document.querySelectorAll(
        ".lighting-option, [data-light]"
    );

    oldLightOptions.forEach(option => {

        if (
            option.classList.contains("light-option") ||
            option.closest(".color-light")
        ) {
            return;
        }

        option.addEventListener("click", () => {

            const target = option.dataset.light;

            if (!target) return;

            document.querySelectorAll("[data-light]").forEach(item => {

                if (
                    item.classList.contains("light-scene") ||
                    item.classList.contains("light-option")
                ) {
                    return;
                }

                item.classList.toggle(
                    "active",
                    item.dataset.light === target
                );

            });

        });

    });


    /* =========================================================
       REFRESH AFTER IMAGES LOAD
       ========================================================= */

    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });

    /* =========================================================
       MATERIAL GALLERY
       ========================================================= */

    const materialWrap = qs(".material-track-wrap");
    const materialTrack = qs(".material-track");
    const materialPrev = qs(".material-prev");
    const materialNext = qs(".material-next");

    if (materialWrap && materialTrack) {

        let isDragging = false;
        let startX = 0;
        let startScroll = 0;

        materialWrap.addEventListener("pointerdown", event => {
            isDragging = true;
            startX = event.clientX;
            startScroll = materialWrap.scrollLeft;
            materialWrap.setPointerCapture(event.pointerId);
        });

        materialWrap.addEventListener("pointermove", event => {

            if (!isDragging) return;

            const distance = event.clientX - startX;

            materialWrap.scrollLeft =
                startScroll - distance * 1.25;
        });

        const stopDragging = () => {
            isDragging = false;
        };

        materialWrap.addEventListener("pointerup", stopDragging);
        materialWrap.addEventListener("pointercancel", stopDragging);
        materialWrap.addEventListener("pointerleave", stopDragging);

        if (materialPrev) {
            materialPrev.addEventListener("click", () => {
                materialWrap.scrollBy({
                    left: -410,
                    behavior: "smooth"
                });
            });
        }

        if (materialNext) {
            materialNext.addEventListener("click", () => {
                materialWrap.scrollBy({
                    left: 410,
                    behavior: "smooth"
                });
            });
        }
    }

    qsa(".material-item").forEach(item => {

        const image = qs(".material-image img", item);

        item.addEventListener("mouseenter", () => {

            if (image) {
                gsap.to(image, {
                    scale: 1.07,
                    duration: 0.7,
                    ease: "power3.out"
                });
            }

        });

        item.addEventListener("mouseleave", () => {

            if (image) {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.7,
                    ease: "power3.out"
                });
            }

        });

    });

    if (qs(".material-gallery")) {
        gsap.fromTo(
            ".material-item",
            {
                opacity: 0,
                x: 80
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".material-gallery",
                    start: "top 78%",
                    once: true
                }
            }
        );
    }

    /* =========================================================
       CONSULTATION TIMELINE
       ========================================================= */

    const consultationLine = qs(".consultation-line span");

    if (consultationLine) {

        gsap.to(consultationLine, {
            height: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: ".consultation-timeline",
                start: "top 65%",
                end: "bottom 65%",
                scrub: 1
            }
        });

    }

    const consultationSteps = qsa(".reveal-consultation");

    if (consultationSteps.length) {

        gsap.fromTo(
            consultationSteps,
            {
                opacity: 0,
                y: 65
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.18,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".consultation-timeline",
                    start: "top 78%",
                    once: true
                }
            }
        );

    }

    /* =========================================================
       CONSULTATION HOVER IMAGES
       ========================================================= */

    qsa(".consultation-step").forEach(step => {

        const image = qs(".consultation-image", step);

        if (!image) return;

        step.addEventListener("mouseenter", () => {

            gsap.to(image, {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.45,
                ease: "power3.out"
            });

        });

        step.addEventListener("mouseleave", () => {

            gsap.to(image, {
                opacity: 0.35,
                x: 25,
                scale: 0.97,
                duration: 0.45,
                ease: "power3.out"
            });

        });

    });

    /* =========================================================
   PALETTE BUILDER
   IMAGE SWITCHING + CINEMATIC TRANSITION
========================================================= */

    const paletteOptions = qsa(".palette-option");
    const paletteName = qs(".palette-preview-name");
    const currentSwatches = qsa(".palette-current-swatches i");

    const palettePreview = qs(".palette-preview");
    const paletteImages = qsa(".palette-room-image");
    const paletteTransition = qs(".palette-transition");

    if (paletteOptions.length && paletteImages.length) {

        let currentPalette = 0;
        let isSwitching = false;


        /* ---------------------------------------------------------
           INITIAL STATE
        --------------------------------------------------------- */

        paletteImages.forEach((image, index) => {

            image.classList.toggle(
                "active",
                index === 0
            );

        });


        /* ---------------------------------------------------------
           CHANGE PALETTE
        --------------------------------------------------------- */

        function changePalette(index, option) {

            if (
                isSwitching ||
                index === currentPalette ||
                !paletteImages[index]
            ) {
                return;
            }

            isSwitching = true;


            const currentImage =
                paletteImages[currentPalette];

            const nextImage =
                paletteImages[index];


            const name =
                option.dataset.name ||
                "Selected Palette";

            const colors =
                (option.dataset.colors || "")
                    .split(",")
                    .map(color => color.trim());


            /* -----------------------------------------------------
               ACTIVE BUTTON
            ----------------------------------------------------- */

            paletteOptions.forEach(item => {
                item.classList.remove("active");
            });

            option.classList.add("active");


            /* -----------------------------------------------------
               PREPARE NEXT IMAGE
            ----------------------------------------------------- */

            gsap.set(nextImage, {
                opacity: 0,
                visibility: "visible",
                zIndex: 3,
                scale: 1.08,
                filter: "blur(4px)"
            });


            /* -----------------------------------------------------
               TRANSITION WIPE
            ----------------------------------------------------- */

            if (paletteTransition) {

                gsap.set(paletteTransition, {
                    opacity: 0,
                    xPercent: -100
                });

            }


            const timeline = gsap.timeline({

                onComplete: () => {

                    /* Hide old image */

                    currentImage.classList.remove("active");

                    gsap.set(currentImage, {
                        opacity: 0,
                        visibility: "hidden",
                        zIndex: 1,
                        scale: 1.045,
                        filter: "blur(0px)"
                    });


                    /* Activate new image */

                    nextImage.classList.add("active");

                    gsap.set(nextImage, {
                        zIndex: 2,
                        opacity: 1,
                        visibility: "visible",
                        scale: 1,
                        filter: "blur(0px)"
                    });


                    currentPalette = index;

                    isSwitching = false;

                }

            });


            /* -----------------------------------------------------
               DARK TRANSITION SWEEP
            ----------------------------------------------------- */

            if (paletteTransition) {

                timeline
                    .to(
                        paletteTransition,
                        {
                            opacity: 1,
                            duration: .18,
                            ease: "power2.out"
                        }
                    )

                    .to(
                        paletteTransition,
                        {
                            xPercent: 100,
                            duration: .7,
                            ease: "power3.inOut"
                        }
                    );

            }


            /* -----------------------------------------------------
               CROSSFADE IMAGE
            ----------------------------------------------------- */

            timeline
                .to(
                    nextImage,
                    {
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px)",
                        duration: 1.05,
                        ease: "power3.out"
                    },
                    "-=.35"
                )

                .to(
                    currentImage,
                    {
                        opacity: 0,
                        scale: .985,
                        duration: .8,
                        ease: "power2.inOut"
                    },
                    "<"
                );


            /* -----------------------------------------------------
               UPDATE PALETTE NAME
            ----------------------------------------------------- */

            if (paletteName) {

                gsap.to(
                    paletteName,
                    {
                        opacity: 0,
                        y: 8,
                        duration: .18,

                        onComplete: () => {

                            paletteName.textContent = name;

                            gsap.to(
                                paletteName,
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: .4,
                                    ease: "power3.out"
                                }
                            );

                        }
                    }
                );

            }


            /* -----------------------------------------------------
               UPDATE SELECTED COLOR SWATCHES
            ----------------------------------------------------- */

            currentSwatches.forEach(
                (swatch, swatchIndex) => {

                    if (!colors[swatchIndex]) {
                        return;
                    }

                    gsap.to(
                        swatch,
                        {
                            backgroundColor:
                                colors[swatchIndex],

                            duration: .55,

                            ease: "power2.out"
                        }
                    );

                }
            );


            /* -----------------------------------------------------
               BUTTON MICRO INTERACTION
            ----------------------------------------------------- */

            gsap.fromTo(
                option,
                {
                    x: -10
                },
                {
                    x: 0,
                    duration: .45,
                    ease: "back.out(1.7)"
                }
            );

        }


        /* ---------------------------------------------------------
           BUTTON EVENTS
        --------------------------------------------------------- */

        paletteOptions.forEach(
            (option, index) => {

                option.addEventListener(
                    "click",
                    () => {

                        changePalette(
                            index,
                            option
                        );

                    }
                );

            }
        );


        /* ---------------------------------------------------------
           HOVER MICRO INTERACTION
        --------------------------------------------------------- */

        paletteOptions.forEach(option => {

            option.addEventListener(
                "mouseenter",
                () => {

                    if (
                        !option.classList.contains("active")
                    ) {

                        gsap.to(
                            option,
                            {
                                x: 5,
                                duration: .3,
                                ease: "power2.out"
                            }
                        );

                    }

                }
            );


            option.addEventListener(
                "mouseleave",
                () => {

                    gsap.to(
                        option,
                        {
                            x: 0,
                            duration: .3,
                            ease: "power2.out"
                        }
                    );

                }
            );

        });

    }

    /* =========================================================
       BENEFITS — STAGGERED REVEAL
       ========================================================= */

    const benefitCards = qsa(".reveal-benefit-color");

    if (benefitCards.length) {

        gsap.fromTo(
            benefitCards,
            {
                opacity: 0,
                y: 55
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.75,
                stagger: 0.14,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".color-benefits-grid",
                    start: "top 80%",
                    once: true
                }
            }
        );

    }

    /* =========================================================
       BENEFIT CARD INTERACTION
       ========================================================= */

    qsa(".color-benefit-card").forEach(card => {

        card.addEventListener("mouseenter", () => {

            gsap.to(card, {
                y: -8,
                duration: 0.35,
                ease: "power2.out"
            });

        });

        card.addEventListener("mouseleave", () => {

            gsap.to(card, {
                y: 0,
                duration: 0.35,
                ease: "power2.out"
            });

        });

    });

    /* =========================================================
       DIGITAL PLANNING — PARALLAX
    ========================================================= */

    const digitalImage = qs(".digital-planning-image > img");

    if (digitalImage) {

        gsap.to(digitalImage, {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
                trigger: ".digital-planning",
                start: "top bottom",
                end: "bottom top",
                scrub: 1.4
            }
        });

    }

    if (qs(".digital-planning-content")) {

        gsap.fromTo(
            ".digital-planning-content",
            {
                opacity: 0,
                x: 60
            },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".digital-planning",
                    start: "top 75%",
                    once: true
                }
            }
        );

    }

    /* =========================================================
       DIGITAL GRID MOVEMENT
    ========================================================= */

    const digitalGrid = qs(".digital-grid");

    if (digitalGrid) {

        gsap.to(digitalGrid, {
            backgroundPosition: "70px 70px",
            duration: 8,
            repeat: -1,
            ease: "none"
        });

    }

    /* =========================================================
       FINAL CTA
    ========================================================= */

    if (qs(".reveal-final-color")) {

        gsap.fromTo(
            ".reveal-final-color",
            {
                opacity: 0,
                y: 55
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".color-final-cta",
                    start: "top 80%",
                    once: true
                }
            }
        );

    }

    /* =========================================================
       CTA ORBITS
    ========================================================= */

    const orbit = qs(".cta-color-orbit");

    if (orbit) {

        gsap.to(orbit, {
            rotation: 360,
            duration: 45,
            repeat: -1,
            ease: "none"
        });

    }

    /* =========================================================
       GENERIC BUTTON INTERACTION
    ========================================================= */

    qsa(".color-btn").forEach(button => {

        button.addEventListener("mouseenter", () => {

            gsap.to(button, {
                y: -4,
                duration: 0.3,
                ease: "power2.out"
            });

        });

        button.addEventListener("mouseleave", () => {

            gsap.to(button, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });

        });

    });

    /* =========================================================
       SMOOTH ANCHOR SCROLL
    ========================================================= */

    qsa('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = qs(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

    /* =========================================================
       REFRESH AFTER IMAGES LOAD
    ========================================================= */

    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });

    ScrollTrigger.refresh();
});