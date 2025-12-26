import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
  analyzerMode: "static",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  turbopack: {},

  webpack: (config, { isServer }) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias || {}),
        canvas: false,
        encoding: false,
      },
    };

    if (isServer) {
      config.externals = [...(config.externals || []), "@react-pdf/renderer"];
    }

    if (!isServer) {
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          pdf: {
            test: /[\\/]node_modules[\\/](@react-pdf|pdfkit|png-js|fontkit)[\\/]/,
            name: "pdf-bundle",
            priority: 30,
            reuseExistingChunk: false,
          },
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: "framer-motion",
            priority: 20,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            priority: 10,
          },
        },
      };
    }

    return config;
  },

  images: {
    formats: ["image/webp", "image/avif"],
  },

  poweredByHeader: false,
};

export default withBundleAnalyzer(nextConfig);
