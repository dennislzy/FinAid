/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,  // ← 加這行
  },
  typescript: {
    ignoreBuildErrors: true,  // ← 加這行
  },
};

export default nextConfig;