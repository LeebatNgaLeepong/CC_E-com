import type { NextConfig } from "next";
import dotenv from "dotenv";
import path from "node:path";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

dotenv.config({ path: ["../back-end/.env.local", "../back-end/.env"] });

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: path.resolve(__dirname, ".."),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

initOpenNextCloudflareForDev({
  configPath: path.resolve(__dirname, "../back-end/wrangler.jsonc"),
  persist: { path: path.resolve(__dirname, "../back-end/.wrangler/state/v3") },
});

export default nextConfig;
