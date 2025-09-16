// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",

  // Enable SPA behavior - all routes serve the same page
  trailingSlash: false,

  // Optimize for SPA
  experimental: {
    optimizePackageImports: ["@heroicons/react"],
  },

  // ✅ Transpile Ethers to fix production import/type issues
  transpilePackages: ["ethers"],

  // Custom webpack config
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  // Redirect configuration for SPA routing
  async redirects() {
    return [
      // Redirect /spa-page to root (since it's now handled by the main page)
      {
        source: "/spa-page",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
