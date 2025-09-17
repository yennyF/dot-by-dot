import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: { unoptimized: true },
  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
  basePath: process.env.NODE_ENV === "production" ? "/dot-by-dot" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/dot-by-dot/" : "",
  trailingSlash: true,
};
export default nextConfig;
