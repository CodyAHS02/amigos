const legacyPages = [
  "about",
  "contact",
  "services",
  "interior-painting",
  "exterior-painting",
  "Plastering",
  "Drywall",
  "Facade-Renovation",
  "appartment-renovation",
  "spray-painting",
  "color-and-material",
  "projects",
  "property-value-preservation",
  "partners"
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  turbopack: {
    root: import.meta.dirname
  },
  async redirects() {
    return legacyPages.map((page) => ({
      source: `/${page}.html`,
      destination: `/${page}`,
      permanent: true
    }));
  },
  async headers() {
    return [
      {
        source: "/customer/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" }
        ]
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" }
        ]
      }
    ];
  }
};

export default nextConfig;
