export const runtime = 'edge';

import 'tailwind-config/load.css';
import { Inter } from 'next/font/google';
import { AppShell } from 'ui';

// TODO: Get this from package.json
const versionNumber = '0.0.1';

// TODO: Get these in a better way
const navigation = [
  { label: 'Bot', href: '/bot', isActive: true },
  { label: 'Settings', href: '/settings', isActive: false }
];

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'KideAppBot',
  description: 'Ticket bot for Kide.app'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className={`h-full ${inter.className}`}>
        <AppShell>
          <AppShell.AppBar navigationOptions={navigation} versionNumber={versionNumber} />
          <AppShell.MainContainer>{children}</AppShell.MainContainer>
        </AppShell>
      </body>
    </html>
  );
}
