import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co", // Supabase
      },
      {
        protocol: "https",
        hostname: "**.blob.core.windows.net", // Azure Blob Storage
      },
      {
        protocol: "https",
        hostname: "**.azurefd.net", // Azure CDN Front Door
      },
      {
        protocol: "https",
        hostname: "**.s3.amazonaws.com", // AWS S3
      },
      {
        protocol: "https",
        hostname: "**.s3.*.amazonaws.com", // AWS S3 with region
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com", // AWS S3
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net", // AWS CloudFront
      },
    ],
  },
};

export default nextConfig;
