/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingRoot: join(__dirname, "../../"),
    outputFileTracingIgnores: ["**/*"], // Ignore tous les fichiers pour la collecte des traces
  },
};

module.exports = nextConfig;
