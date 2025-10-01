import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  
  async rewrites(){
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_ORIGIN}/api/:path*`,
      },
    ];
  }, 
};

export default nextConfig;
