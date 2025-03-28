import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || '',
    NEXT_PUBLIC_GIT_BRANCH: process.env.VERCEL_GIT_REPO_BRANCH || 'local',
  }

  // Add other custom configurations below
};

export default nextConfig;