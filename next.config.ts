import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
  env: {
    NEXT_PUBLIC_DB_NAME: process.env.NEXT_PUBLIC_DB_NAME,
  },
};

export default nextConfig;
