import NextjsConfig from 'nextjs-config';
/** @type {import('next').NextConfig} */
const nextConfig = {
  ...NextjsConfig,
  transpilePackages: ['ui']
};

export default nextConfig;
