export const runtime = 'edge';

import 'tailwind-config/load.css';
import { Inter } from 'next/font/google';
import { AppShell } from 'ui';
import { appVersion } from '@/utils/appInfo';

// TODO: Get these in a better way
const navigation = [
  { label: 'Bot', href: '/bot', isActive: true },
  { label: 'Settings', href: '/settings', isActive: false }
];

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="py-safe h-full overflow-hidden bg-gray-100">
      <body className={`h-full overflow-auto ${inter.className}`}>
        <AppShell>
          <AppShell.AppBar
            navigationOptions={navigation}
            versionNumber={appVersion}
            className="px-safe"
          />
          <AppShell.MainContainer>
            <div className="px-safe">{children}</div>
          </AppShell.MainContainer>
        </AppShell>
      </body>
    </html>
  );
}

export { metadata } from '@/utils/metadata';
