import nextPWA from '@imbios/next-pwa';

const withPWA = nextPWA({
	dest: 'public',
	disable: process.env.NODE_ENV === 'development'
});

import NextjsConfig from 'nextjs-config';
/** @type {import('next').NextConfig} */
const nextConfig = {
	...NextjsConfig,
	transpilePackages: ['ui', '@common/utils']
};

export default withPWA(nextConfig);
