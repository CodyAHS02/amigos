/*==================================================
    GLOBAL PARTIALS LOADER

    Fetches /partials/header.html and /partials/footer.html
    and injects them into every page's #site-header-root and
    #site-footer-root mount points, so the header/footer only
    exist in ONE place on disk.

    IMPORTANT: this must be served over http(s) — either the
    live Vercel deploy or a local dev server (e.g. `npx serve`,
    VS Code "Live Server", `python3 -m http.server`). Opening
    index.html directly as a file:// URL will NOT work, because
    browsers block fetch() for local files.

    Once both partials are injected, this dispatches a
    "partials:loaded" event on document. Any script that needs
    to attach behaviour to header/footer elements (hamburger
    menu, dropdown, chatbot widget, scroll-to-top, sticky header)
    must wait for that event instead of running on page load,
    since the elements don't exist until this fetch resolves.
==================================================*/

(() => {

    async function loadPartial(url, mountId) {

        const mount = document.getElementById(mountId);
        if (!mount) return;

        try {

            const res = await fetch(url);
            if (!res.ok) throw new Error(`${url} → ${res.status}`);

            mount.outerHTML = await res.text();

        } catch (err) {

            console.error(`[partials] failed to load ${url}:`, err);

        }

    }

    function markActiveLink() {

        const currentPage = document.body.dataset.page;
        if (!currentPage) return;

        document.querySelectorAll("[data-page]").forEach(link => {
            link.classList.toggle("active", link.dataset.page === currentPage);
        });

    }

    async function init() {

        await Promise.all([
            loadPartial("partials/header.html", "site-header-root"),
            loadPartial("partials/footer.html", "site-footer-root")
        ]);

        markActiveLink();

        document.dispatchEvent(new CustomEvent("partials:loaded"));

    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();