import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@packages/components", "@packages/layout"],
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
};

export default nextConfig;
