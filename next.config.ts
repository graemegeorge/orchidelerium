import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "inaturalist-open-data.s3.amazonaws.com",
      },
      {
        hostname: "static.inaturalist.org",
      },
    ],
  },
};

export default nextConfig;
