export const runtime = 'edge';

import 'tailwind-config/load.css';
import { Inter } from 'next/font/google';
import { MainContainer, Navbar, Page } from 'ui';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'KideAppBot',
  description: 'Ticket bot for Kide.app'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className={`h-full ${inter.className}`}>
        <Navbar />
        <MainContainer>{children}</MainContainer>
      </body>
    </html>
  );
}
