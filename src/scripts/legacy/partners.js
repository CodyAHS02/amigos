function initPartnerPage() {
    const revealItems = document.querySelectorAll(".partners-reveal");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
    });

    revealItems.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index * 55, 360)}ms`;
        observer.observe(item);
    });

    const network = document.querySelector(".partner-network");
    const nodes = document.querySelectorAll(".network-node");

    if (network && nodes.length) {
        network.addEventListener("pointermove", (event) => {
            const bounds = network.getBoundingClientRect();
            const x = ((event.clientX - bounds.left) / bounds.width) - .5;
            const y = ((event.clientY - bounds.top) / bounds.height) - .5;

            nodes.forEach((node) => {
                const depth = Number(node.dataset.depth || 18);
                node.style.translate = `${x * depth}px ${y * depth}px`;
            });
        });

        network.addEventListener("pointerleave", () => {
            nodes.forEach((node) => {
                node.style.translate = "0 0";
            });
        });
    }

    document.querySelectorAll(".partner-card, .flow-step, .imagery-card").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) - .5;
            const y = ((event.clientY - rect.top) / rect.height) - .5;

            card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-4px)`;
        });

        card.addEventListener("pointerleave", () => {
            card.style.transform = "";
        });
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPartnerPage, { once: true });
} else {
    initPartnerPage();
}
