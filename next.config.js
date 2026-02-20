/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure assets load from correct path (fixes 404 for JS/CSS chunks)
  basePath: "",
  assetPrefix: "",
  trailingSlash: false,
  // Avoid aggressive caching of stale chunks
  generateEtags: true,
};

module.exports = nextConfig;
