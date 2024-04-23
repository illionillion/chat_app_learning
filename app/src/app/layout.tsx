import { Inter } from 'next/font/google';
import { UIProvider } from '@yamada-ui/react';
import type { Metadata } from 'next';
import { customConfig } from '@/lib/common/config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My SNS Home',
  description: 'My SNS Home',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <UIProvider config={customConfig}>{children}</UIProvider>
      </body>
    </html>
  );
}
