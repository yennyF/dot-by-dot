import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: { unoptimized: true },
  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
  /* use relative paths */
  assetPrefix: ".",
};

export default nextConfig;
