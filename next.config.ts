import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thefifthmatt.github.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
