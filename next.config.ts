import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Set to 0 so Vercel does not aggressively cache optimized images.
    // Without this, changing an image URL in Supabase won't show on the
    // live site until Vercel's image cache expires (can be hours/days).
    minimumCacheTTL: 0,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
