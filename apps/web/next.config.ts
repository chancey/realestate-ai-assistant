import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@realestate/shared", "@realestate/mls-client"],
};

export default nextConfig;
