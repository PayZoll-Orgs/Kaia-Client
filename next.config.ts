import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Enable SPA behavior - all routes serve the same page
  trailingSlash: false,
  
  // Optimize for SPA
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },

  // Disable server-side rendering for problematic packages
  transpilePackages: ['@linenext/dapp-portal-sdk', '@okxconnect/ui'],
  
  // Custom webpack config
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    // Add polyfills for crypto and other Node.js modules (client-side only)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
        path: require.resolve('path-browserify'),
        fs: false,
        net: false,
        tls: false,
      };

      // Add provider plugin for global variables
      const webpack = require('webpack');
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
    }

    // Ignore problematic server-side imports
    if (isServer) {
      config.externals = [...(config.externals || []), {
        '@okxconnect/ui': '@okxconnect/ui',
        'pino-pretty': 'pino-pretty',
      }];
    }

    return config;
  },
  
  // Redirect configuration for SPA routing
  async redirects() {
    return [
      // Redirect /spa-page to root (since it's now handled by the main page)
      {
        source: '/spa-page',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
