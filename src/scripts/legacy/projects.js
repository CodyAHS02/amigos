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
   AMIGOS PROJECTS PAGE
========================================================= */

runWhenDomReady(function () {

    /* =====================================================
       GSAP
    ====================================================== */

    if (typeof gsap !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }


    /* =====================================================
       HERO REVEAL
    ====================================================== */

    if (typeof gsap !== "undefined") {

        gsap.from(".hero .reveal", {
            opacity: 0,
            y: 45,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
            delay: 0.15
        });


        gsap.from(".hero-project-visual", {
            opacity: 0,
            x: 70,
            scale: 0.96,
            duration: 1.25,
            ease: "power3.out",
            delay: 0.2
        });


        /* Hero slow movement */

        const heroImage =
            document.querySelector(".hero-image-container img");

        if (heroImage) {

            gsap.to(heroImage, {
                scale: 1.03,
                duration: 14,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });


            gsap.to(heroImage, {
                yPercent: 7,

                ease: "none",

                scrollTrigger: {
                    trigger: ".projects-hero",

                    start: "top top",

                    end: "bottom top",

                    scrub: 1.2
                }
            });

        }

    }


    /* =====================================================
       GENERIC SCROLL REVEALS
    ====================================================== */

    if (typeof gsap !== "undefined") {

        document
            .querySelectorAll(".reveal-up")
            .forEach(function (element) {

                gsap.from(element, {

                    opacity: 0,

                    y: 55,

                    duration: 0.9,

                    ease: "power3.out",

                    scrollTrigger: {

                        trigger: element,

                        start: "top 84%",

                        once: true

                    }

                });

            });

    }


    /* =====================================================
       PROJECT FILTERS
    ====================================================== */

    const filterButtons =
        Array.from(
            document.querySelectorAll(".project-filter")
        );

    const projectCards =
        Array.from(
            document.querySelectorAll(".project-card")
        );


    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const selectedFilter =
                button.dataset.filter;


            /* Active button */

            filterButtons.forEach(function (item) {

                item.classList.remove("active");

            });

            button.classList.add("active");


            /* Filter cards */

            projectCards.forEach(function (card, index) {

                const categories =
                    (card.dataset.category || "")
                        .split(" ");


                const shouldShow =
                    selectedFilter === "all" ||
                    categories.includes(selectedFilter);


                if (shouldShow) {

                    card.classList.remove("hidden");


                    if (typeof gsap !== "undefined") {

                        gsap.fromTo(

                            card,

                            {
                                opacity: 0,
                                y: 25,
                                scale: 0.97
                            },

                            {
                                opacity: 1,
                                y: 0,
                                scale: 1,

                                duration: 0.55,

                                delay: index * 0.04,

                                ease: "power3.out"
                            }

                        );

                    }

                } else {

                    card.classList.add("hidden");

                }

            });


            if (typeof ScrollTrigger !== "undefined") {
                ScrollTrigger.refresh();
            }

        });

    });


    /* =====================================================
       PROJECT MODAL
    ====================================================== */

    const modal =
        document.querySelector(".project-modal");

    const modalBackdrop =
        document.querySelector(".modal-backdrop");

    const modalPanel =
        document.querySelector(".modal-panel");

    const modalClose =
        document.querySelector(".modal-close");

    const modalImage =
        document.querySelector(".modal-image img");

    const modalCategory =
        document.querySelector(".modal-category");

    const modalTitle =
        document.querySelector(".modal-title");

    const modalLocation =
        document.querySelector(".modal-location");

    const modalService =
        document.querySelector(".modal-service");

    const modalDescription =
        document.querySelector(".modal-description");


    function openProject(card) {

        if (!modal) return;


        const image =
            card.querySelector(".project-image img");


        /* Image */

        modalImage.src = image.src;

        modalImage.alt = image.alt;


        /* Information */

        modalCategory.innerHTML =
            "<span></span>" +
            (card.dataset.category || "PROJECT")
                .replaceAll(" ", " · ")
                .toUpperCase();


        modalTitle.textContent =
            card.dataset.title || "";


        modalLocation.textContent =
            card.dataset.location || "";


        modalService.textContent =
            card.dataset.service || "";


        modalDescription.textContent =
            card.dataset.description || "";


        /* Open */

        modal.classList.add("open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add("modal-open");


        if (typeof gsap !== "undefined") {

            gsap.timeline()

                .to(modalBackdrop, {

                    opacity: 1,

                    duration: 0.35,

                    ease: "power2.out"

                })

                .to(

                    modalPanel,

                    {

                        opacity: 1,

                        y: 0,

                        scale: 1,

                        duration: 0.65,

                        ease: "power3.out"

                    },

                    "-=0.15"

                );

        }

    }


    function closeProject() {

        if (!modal) return;


        if (typeof gsap !== "undefined") {

            gsap.timeline({

                onComplete: function () {

                    modal.classList.remove("open");

                    modal.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                    document.body.classList.remove(
                        "modal-open"
                    );

                }

            })

                .to(modalPanel, {

                    opacity: 0,

                    y: 25,

                    scale: 0.97,

                    duration: 0.3,

                    ease: "power2.in"

                })

                .to(

                    modalBackdrop,

                    {

                        opacity: 0,

                        duration: 0.25,

                        ease: "power2.in"

                    },

                    "-=0.12"

                );

        }

    }


    projectCards.forEach(function (card) {

        card.addEventListener("click", function () {

            openProject(card);

        });

    });


    modalClose?.addEventListener(
        "click",
        closeProject
    );


    modalBackdrop?.addEventListener(
        "click",
        closeProject
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal?.classList.contains("open")
            ) {

                closeProject();

            }

        }
    );


    /* =====================================================
       BEFORE / AFTER SLIDER
    ====================================================== */

    document
        .querySelectorAll(".comparison")
        .forEach(function (comparison) {

            const range =
                comparison.querySelector(
                    ".comparison-range"
                );

            const before =
                comparison.querySelector(
                    ".comparison-before"
                );

            const handle =
                comparison.querySelector(
                    ".comparison-handle"
                );


            if (!range || !before || !handle) {
                return;
            }


            function updateSlider(value) {

                before.style.width =
                    value + "%";

                handle.style.left =
                    value + "%";

            }


            updateSlider(range.value);


            range.addEventListener(
                "input",
                function () {

                    updateSlider(
                        range.value
                    );

                }
            );

        });


    /* =====================================================
       QUALITY PROGRESS
    ====================================================== */

    if (
        typeof gsap !== "undefined" &&
        typeof ScrollTrigger !== "undefined"
    ) {

        const progress =
            document.querySelector(
                ".quality-progress span"
            );


        if (progress) {

            gsap.to(progress, {

                width: "100%",

                ease: "none",

                scrollTrigger: {

                    trigger: ".quality-list",

                    start: "top 65%",

                    end: "bottom 70%",

                    scrub: 1

                }

            });

        }


        /* Quality item reveals */

        document
            .querySelectorAll(".quality-item")
            .forEach(function (item, index) {

                gsap.from(item, {

                    opacity: 0,

                    x: 45,

                    duration: 0.75,

                    delay: index * 0.03,

                    ease: "power3.out",

                    scrollTrigger: {

                        trigger: item,

                        start: "top 85%",

                        once: true

                    }

                });

            });

    }

    /* =========================================================
   AMIGOS STANDARD
   PREMIUM CURSOR FOLLOW IMAGE
========================================================= */

    (() => {

        const section =
            document.querySelector(".quality-section");

        if (!section) return;


        const items = Array.from(
            section.querySelectorAll("[data-quality-item]")
        );


        const preview =
            section.querySelector(".quality-hover-image");

        const previewInner =
            section.querySelector(".quality-hover-image-inner");

        const previewImage =
            section.querySelector(
                ".quality-hover-image-media img"
            );

        const previewIndex =
            section.querySelector(
                ".quality-hover-image-index"
            );


        if (
            !items.length ||
            !preview ||
            !previewInner ||
            !previewImage
        ) {
            return;
        }


        /* =====================================================
           DEVICE CHECK
        ===================================================== */

        const isTouch =
            window.matchMedia(
                "(pointer: coarse)"
            ).matches;


        if (isTouch) {

            initMobile();

            return;
        }


        /* =====================================================
           MOVE PREVIEW TO BODY
           
           This is IMPORTANT.
    
           The preview is no longer affected by any
           section/container positioning.
        ===================================================== */

        document.body.appendChild(preview);


        /* =====================================================
           CREATE CUSTOM CURSOR
        ===================================================== */

        const cursor =
            document.createElement("div");

        cursor.className =
            "amigos-hover-cursor";

        document.body.appendChild(cursor);


        /* =====================================================
           STATE
        ===================================================== */

        let activeItem = null;

        let currentImage = "";

        let imageRequest = 0;

        let cursorVisible = false;


        /* =====================================================
           CURSOR POSITION
           
           We use left/top directly instead of GSAP x/y.
           
           This guarantees the image actually follows
           the browser cursor.
        ===================================================== */

        let mouseX =
            window.innerWidth / 2;

        let mouseY =
            window.innerHeight / 2;


        let targetImageX = 0;
        let targetImageY = 0;


        let currentImageX = 0;
        let currentImageY = 0;


        /* =====================================================
           MOUSE TRACKING
        ===================================================== */

        document.addEventListener(
            "mousemove",
            (event) => {

                mouseX = event.clientX;
                mouseY = event.clientY;


                /* ---------------------------------------------
                   CUSTOM CURSOR
                --------------------------------------------- */

                if (cursorVisible) {

                    cursor.style.left =
                        mouseX + "px";

                    cursor.style.top =
                        mouseY + "px";

                }


                /* ---------------------------------------------
                   IMAGE POSITION
                --------------------------------------------- */

                if (
                    preview.classList.contains(
                        "is-visible"
                    )
                ) {

                    updateImagePosition();

                }

            },
            {
                passive: true
            }
        );


        /* =====================================================
           CALCULATE IMAGE POSITION
        ===================================================== */

        function updateImagePosition() {

            const imageWidth =
                preview.offsetWidth || 390;

            const imageHeight =
                preview.offsetHeight || 490;


            /*
             * Horizontal position.
             *
             * Image sits slightly to the right
             * of the cursor.
             */

            targetImageX =
                mouseX + 35;


            /*
             * Vertical position.
             *
             * Image is centered around cursor.
             */

            targetImageY =
                mouseY -
                imageHeight / 2;


            /*
             * Keep image inside viewport.
             */

            const maxX =
                window.innerWidth -
                imageWidth -
                20;

            const maxY =
                window.innerHeight -
                imageHeight -
                20;


            targetImageX =
                Math.max(
                    20,
                    Math.min(
                        targetImageX,
                        maxX
                    )
                );


            targetImageY =
                Math.max(
                    20,
                    Math.min(
                        targetImageY,
                        maxY
                    )
                );

        }


        /* =====================================================
           SMOOTH IMAGE LOOP
           
           requestAnimationFrame gives us a much more
           reliable cursor-following effect than repeatedly
           creating GSAP tweens.
        ===================================================== */

        function animateImage() {

            currentImageX +=
                (targetImageX - currentImageX) *
                0.16;


            currentImageY +=
                (targetImageY - currentImageY) *
                0.16;


            preview.style.left =
                currentImageX + "px";


            preview.style.top =
                currentImageY + "px";


            requestAnimationFrame(
                animateImage
            );

        }


        animateImage();


        /* =====================================================
           SHOW CUSTOM CURSOR
        ===================================================== */

        function showCursor() {

            if (cursorVisible) return;

            cursorVisible = true;

            cursor.classList.add(
                "is-visible"
            );

            cursor.classList.add(
                "is-active"
            );


            cursor.style.left =
                mouseX + "px";

            cursor.style.top =
                mouseY + "px";

        }


        /* =====================================================
           HIDE CUSTOM CURSOR
        ===================================================== */

        function hideCursor() {

            cursorVisible = false;

            cursor.classList.remove(
                "is-visible"
            );

            cursor.classList.remove(
                "is-active"
            );

        }


        /* =====================================================
           LOAD IMAGE
        ===================================================== */

        function loadImage(
            url,
            item
        ) {

            if (!url) return;


            const requestID =
                ++imageRequest;


            const image =
                new Image();


            image.src = url;


            image.onload = () => {

                /*
                 * Ignore old image requests.
                 */

                if (
                    requestID !==
                    imageRequest ||
                    activeItem !== item
                ) {
                    return;
                }


                switchImage(url);

            };


            image.onerror = () => {

                /*
                 * Surface the failed URL instead of
                 * failing silently — makes broken
                 * data-image paths easy to spot.
                 */

                console.warn(
                    "[Amigos Standard] Failed to load image:",
                    url
                );

            };

        }


        /* =====================================================
           SWITCH IMAGE
           
           Image changes while the preview stays alive.
           This prevents the annoying disappearing/reappearing
           behavior when moving between rows.
        ===================================================== */

        function switchImage(url) {

            if (
                currentImage === url
            ) {

                showPreview();

                return;
            }


            currentImage = url;


            /*
             * Fade current image.
             */

            gsap.to(
                previewImage,
                {
                    opacity: 0,
                    scale: 1.05,
                    duration: .18,
                    ease: "power2.out",
                    overwrite: true,

                    onComplete: () => {

                        previewImage.src =
                            url;


                        /*
                         * New image reveal.
                         */

                        gsap.fromTo(
                            previewImage,
                            {
                                opacity: 0,
                                scale: 1.08,
                                y: 16
                            },
                            {
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                duration: .6,
                                ease: "power3.out",
                                overwrite: true
                            }
                        );

                    }

                }
            );


            showPreview();

        }


        /* =====================================================
           SHOW PREVIEW
        ===================================================== */

        function showPreview() {

            if (
                preview.classList.contains(
                    "is-visible"
                )
            ) {
                return;
            }


            preview.classList.add(
                "is-visible"
            );


            /*
             * Calculate immediately so the image
             * appears next to the actual cursor.
             */

            updateImagePosition();


            currentImageX =
                targetImageX;

            currentImageY =
                targetImageY;


            preview.style.left =
                currentImageX + "px";

            preview.style.top =
                currentImageY + "px";


            /*
             * Reveal image wrapper.
             */

            gsap.killTweensOf(
                previewInner
            );


            gsap.fromTo(
                previewInner,
                {
                    clipPath:
                        "inset(100% 0 0 0 round 2px)"
                },
                {
                    clipPath:
                        "inset(0% 0 0 0 round 2px)",
                    duration: .65,
                    ease: "power4.out"
                }
            );


            /*
             * Slight image scale reveal.
             */

            gsap.fromTo(
                previewImage,
                {
                    opacity: 0,
                    scale: 1.08
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: .65,
                    ease: "power3.out",
                    overwrite: true
                }
            );

        }


        /* =====================================================
           HIDE PREVIEW
        ===================================================== */

        function hidePreview() {

            activeItem = null;

            imageRequest++;


            gsap.killTweensOf([
                previewInner,
                previewImage
            ]);


            gsap.timeline({

                onComplete: () => {

                    preview.classList.remove(
                        "is-visible"
                    );

                }

            })

                .to(
                    previewImage,
                    {
                        opacity: 0,
                        scale: 1.04,
                        duration: .18,
                        ease: "power2.in"
                    }
                )

                .to(
                    previewInner,
                    {
                        clipPath:
                            "inset(100% 0 0 0 round 2px)",
                        duration: .35,
                        ease: "power3.in"
                    },
                    "-=.05"
                );

        }


        /* =====================================================
           ACTIVATE ROW
        ===================================================== */

        function activateItem(item) {

            if (
                activeItem === item
            ) {
                return;
            }


            activeItem = item;


            /*
             * Active state.
             */

            items.forEach(
                (other) => {

                    other.classList.toggle(
                        "is-active",
                        other === item
                    );

                }
            );


            /*
             * Show custom cursor.
             */

            showCursor();


            /*
             * Image number.
             */

            const index =
                items.indexOf(item) + 1;


            if (previewIndex) {

                previewIndex.textContent =
                    `${String(index).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;

            }


            /*
             * Load correct image.
             *
             * Read from the item's own <img> tag rather
             * than a data-image attribute — this way a
             * broken path shows up as a broken image icon
             * in the DOM immediately on page load, instead
             * of failing silently on hover.
             */

            const imageEl =
                item.querySelector(
                    ".quality-item-image"
                );

            const imageURL =
                imageEl ?
                    imageEl.getAttribute("src") :
                    null;


            if (!imageURL) {
                return;
            }


            loadImage(
                imageURL,
                item
            );

        }


        /* =====================================================
           ROW HOVER
        ===================================================== */

        items.forEach(
            (item) => {

                item.addEventListener(
                    "mouseenter",
                    () => {

                        activateItem(item);

                    }
                );

            }
        );


        /* =====================================================
           SECTION LEAVE
           
           Only hide when leaving the whole section.
        ===================================================== */

        section.addEventListener(
            "mouseleave",
            () => {

                hidePreview();

                hideCursor();


                items.forEach(
                    (item) => {

                        item.classList.remove(
                            "is-active"
                        );

                    }
                );

            }
        );


        /* =====================================================
           WINDOW RESIZE
        ===================================================== */

        window.addEventListener(
            "resize",
            () => {

                if (
                    preview.classList.contains(
                        "is-visible"
                    )
                ) {

                    updateImagePosition();

                    currentImageX =
                        targetImageX;

                    currentImageY =
                        targetImageY;

                }

            }
        );


        /* =====================================================
           MOBILE
        ===================================================== */

        function initMobile() {

            let activeMobile = null;


            items.forEach(
                (item) => {

                    item.addEventListener(
                        "click",
                        () => {

                            const imageEl =
                                item.querySelector(
                                    ".quality-item-image"
                                );

                            const imageURL =
                                imageEl ?
                                    imageEl.getAttribute("src") :
                                    null;


                            if (!imageURL) {
                                return;
                            }


                            const isSame =
                                activeMobile === item;


                            items.forEach(
                                (other) => {

                                    other.classList.remove(
                                        "is-active"
                                    );

                                }
                            );


                            if (isSame) {

                                activeMobile =
                                    null;

                                preview.classList.remove(
                                    "is-visible"
                                );

                                return;
                            }


                            activeMobile =
                                item;


                            item.classList.add(
                                "is-active"
                            );


                            const index =
                                items.indexOf(item) + 1;


                            if (previewIndex) {

                                previewIndex.textContent =
                                    `${String(index).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;

                            }


                            previewImage.src =
                                imageURL;


                            preview.classList.add(
                                "is-visible"
                            );


                            gsap.fromTo(
                                previewImage,
                                {
                                    opacity: 0,
                                    scale: 1.08
                                },
                                {
                                    opacity: 1,
                                    scale: 1,
                                    duration: .65,
                                    ease: "power3.out"
                                }
                            );

                        }
                    );

                }
            );

        }


    })();

    /* =====================================================
       CTA ORBITS
    ====================================================== */

    if (typeof gsap !== "undefined") {

        gsap.to(".circle-one", {

            rotation: 360,

            duration: 70,

            repeat: -1,

            ease: "none"

        });


        gsap.to(".circle-two", {

            rotation: -360,

            duration: 95,

            repeat: -1,

            ease: "none"

        });

    }


    /* =====================================================
       MOBILE NAV
    ====================================================== */

    const mobileMenu =
        document.querySelector(".mobile-menu");

    const navigation =
        document.querySelector(".projects-nav");


    mobileMenu?.addEventListener(
        "click",
        function () {

            const isOpen =
                navigation.classList.toggle(
                    "mobile-open"
                );


            if (isOpen) {

                navigation.style.display =
                    "flex";

                navigation.style.position =
                    "absolute";

                navigation.style.top =
                    "70px";

                navigation.style.left =
                    "0";

                navigation.style.right =
                    "0";

                navigation.style.padding =
                    "25px 6vw";

                navigation.style.flexDirection =
                    "column";

                navigation.style.background =
                    "var(--cream)";

                navigation.style.borderBottom =
                    "1px solid var(--line)";

            } else {

                navigation.removeAttribute(
                    "style"
                );

            }

        }
    );


    /* =====================================================
       REFRESH AFTER IMAGES LOAD
    ====================================================== */

    window.addEventListener(
        "load",
        function () {

            if (
                typeof ScrollTrigger !== "undefined"
            ) {

                ScrollTrigger.refresh();

            }

        }
    );

});