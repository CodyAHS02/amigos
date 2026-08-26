"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className={`site-header${isHome ? " home-initial" : ""}`} id="siteHeader">
      <a className="logo" href="/">
        <img src="/assets/logo.png" alt="Amigos Maler" />
      </a>

      <nav className="site-nav">
        <a href="/" data-page="home">
          Home
        </a>
        <a href="/about" data-page="about">
          About
        </a>

        <div className="nav-dropdown">
          <a href="/services" className="dropdown-trigger">
            Services
            <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <div className="dropdown-menu">
            <a href="/interior-painting" className="dropdown-item">
              <span className="item-num">01</span>
              <div className="item-info">
                <span className="item-title">Interior Painting</span>
                <span className="item-desc">Walls, ceilings, doors and high-quality coatings</span>
              </div>
            </a>
            <a href="/exterior-painting" className="dropdown-item">
              <span className="item-num">02</span>
              <div className="item-info">
                <span className="item-title">Exterior Painting</span>
                <span className="item-desc">Facades, woodwork and weather-resistant coatings</span>
              </div>
            </a>
            <a href="/Plastering" className="dropdown-item">
              <span className="item-num">03</span>
              <div className="item-info">
                <span className="item-title">Plastering Work</span>
                <span className="item-desc">Filling, plastering and surface work</span>
              </div>
            </a>
            <a href="/Drywall" className="dropdown-item">
              <span className="item-num">04</span>
              <div className="item-info">
                <span className="item-title">Drywall/Interior construction</span>
                <span className="item-desc">Walls, ceilings and customized room solutions</span>
              </div>
            </a>
            <a href="/Facade-Renovation" className="dropdown-item">
              <span className="item-num">05</span>
              <div className="item-info">
                <span className="item-title">Facade Renovation</span>
                <span className="item-desc">Protection, renovation and redesign of facades</span>
              </div>
            </a>
            <a href="/appartment-renovation" className="dropdown-item">
              <span className="item-num">06</span>
              <div className="item-info">
                <span className="item-title">Appartment Renovation</span>
                <span className="item-desc">Renovations for tenant changes, property sales or personal use</span>
              </div>
            </a>
            <a href="/spray-painting" className="dropdown-item">
              <span className="item-num">07</span>
              <div className="item-info">
                <span className="item-title">Spray Painting</span>
                <span className="item-desc">Doors, frames, shutters and other components</span>
              </div>
            </a>
            <a href="/color-and-material" className="dropdown-item">
              <span className="item-num">08</span>
              <div className="item-info">
                <span className="item-title">Color & Material Construction</span>
                <span className="item-desc">Color concepts and suitable coating systems</span>
              </div>
            </a>
            <a href="/services" className="dropdown-item">
              <span className="item-num">09</span>
              <div className="item-info">
                <span className="item-title">Discover All Services</span>
                <span className="item-desc">Explore More Services</span>
              </div>
            </a>
          </div>
        </div>

        <a href="/#projectsSection" data-page="projects">
          Projects
        </a>
        <a href="/property-value-preservation" data-page="werterhalt">
          Property Value Preservation
        </a>
        <a href="/contact" data-page="contact">
          Contact
        </a>
      </nav>

      <a href="/contact" className="header-btn">
        Request A Quote
      </a>

      <button className="hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}
