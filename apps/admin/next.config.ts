import type { NextConfig } from "next";
import { execSync } from "child_process";

// Generate service worker with embedded Firebase config
try {
  execSync('node scripts/generate-sw.js', { cwd: __dirname, stdio: 'inherit' });
} catch (error) {
  console.warn('Failed to generate service worker:', error);
}

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/utils'],
};

export default nextConfig;
