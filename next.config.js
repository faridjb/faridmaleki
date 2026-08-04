/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/faridmaleki';

const nextConfig = {
  output: 'export', // static export — GitHub Pages has no Node server
  basePath, // project site lives under the configured subpath
  assetPrefix: basePath,
  trailingSlash: true, // plays nicer with GitHub Pages routing
  images: {
    unoptimized: true, // next/image optimization needs a server; disable it
  },
};

module.exports = nextConfig;
