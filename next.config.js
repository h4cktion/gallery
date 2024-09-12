/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingExcludes: ["**/*"], // Ignore tous les fichiers pour la collecte des traces
  },
};

module.exports = nextConfig;
