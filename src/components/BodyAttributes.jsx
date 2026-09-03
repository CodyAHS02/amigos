"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const routeBodyState = {
  "/": { dataPage: "home" },
  "/about": { dataPage: "about" },
  "/contact": { className: "contact-page", dataPage: "contact" },
  "/offer-calculator": { dataPage: "offer-calculator" },
  "/partners": { dataPage: "partners" },
  "/projects": { className: "projects-page", dataPage: "projects" },
  "/property-value-preservation": { dataPage: "werterhalt" }
};

export default function BodyAttributes() {
  const pathname = usePathname();

  useEffect(() => {
    const state = routeBodyState[pathname] || {};

    document.body.className = state.className || "";

    if (state.dataPage) {
      document.body.dataset.page = state.dataPage;
    } else {
      delete document.body.dataset.page;
    }

    document.querySelectorAll("[data-page]").forEach((link) => {
      link.classList.toggle("active", link.dataset.page === state.dataPage);
    });
  }, [pathname]);

  return null;
}
