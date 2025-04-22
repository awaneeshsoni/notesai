import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    appDir: true,
  },
  typescript: {
    ignoreBuildErrors: false, // optional: true if you’re okay ignoring TS errors in production
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": require("path").resolve(__dirname, "app"), // supports @/ path from tsconfig
    };
    return config;
  },
};

export default nextConfig;
