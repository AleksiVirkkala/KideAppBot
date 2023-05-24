import { Metadata } from 'next';
import { appDescription, appName, appVersion } from './appInfo';

const appleTouchIconMeta = [57, 60, 72, 76, 114, 120, 144, 152, 180].map(size => ({
  rel: 'apple-touch-icon',
  sizes: `${size}x${size}`,
  url: `/og/appicon?size=${size}&version=${appVersion}`
}));

const appleSplashScreenSizes = [
  { w: 430, h: 932, ratio: 3 },
  { w: 393, h: 852, ratio: 3 },
  { w: 428, h: 926, ratio: 3 },
  { w: 390, h: 844, ratio: 3 },
  { w: 375, h: 812, ratio: 3 },
  { w: 414, h: 896, ratio: 3 },
  { w: 414, h: 896, ratio: 2 },
  { w: 414, h: 736, ratio: 3 },
  { w: 375, h: 667, ratio: 2 },
  { w: 320, h: 568, ratio: 2 },
  { w: 1024, h: 1366, ratio: 2 },
  { w: 834, h: 1194, ratio: 2 },
  { w: 820, h: 1180, ratio: 2 },
  { w: 834, h: 1112, ratio: 2 },
  { w: 810, h: 1080, ratio: 2 },
  { w: 768, h: 1024, ratio: 2 },
  { w: 744, h: 1133, ratio: 2 }
];

const mapToSplashMeta = (
  { w, h, ratio }: (typeof appleSplashScreenSizes)[number],
  orientation: 'landscape' | 'portrait'
) => ({
  rel: 'apple-touch-startup-image',
  media: `screen and (device-width: ${w}px) and (device-height: ${h}px) and (-webkit-min-device-pixel-ratio: ${ratio}) and (orientation: ${orientation})`,
  url: `og/splashscreen?width=${w * ratio}&height=${h * ratio}&version=${appVersion}`
});

const appleSplashScreenMeta = [
  // Vertical splash screen sizes
  ...appleSplashScreenSizes.map(obj => mapToSplashMeta(obj, 'portrait')),
  // Horizontal splash screen sizes
  ...appleSplashScreenSizes.map(({ w, h, ratio }) =>
    mapToSplashMeta({ w: h, h: w, ratio }, 'landscape')
  )
];

const safariPinnedTabMeta = { rel: 'mask-icon', color: '#6366f1', url: '/safari-pinned-tab.svg' };

export const metadata: Metadata = {
  title: appName,
  description: appDescription,
  applicationName: appName,
  appleWebApp: {
    capable: true,
    title: appName
  },
  formatDetection: {
    telephone: false
  },
  themeColor: '#f3f4f6',
  viewport:
    'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
  manifest: '/manifest.json',
  icons: [
    { rel: 'shortcut icon', url: '/favicon.ico' },
    ...appleTouchIconMeta,
    ...appleSplashScreenMeta,
    safariPinnedTabMeta
  ],
  keywords: ['nextjs', 'pwa', 'next-pwa', 'kide.app', 'bot']
};
