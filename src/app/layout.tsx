import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://hayzed.com.ng'),
  title: 'Hayzed — Find What You Need in Lagos Markets',
  description: 'Tell us what you need in Lagos markets. Join Hayzed early access and help shape an easier way to find products.',
  openGraph: { title: 'Hayzed — Find What You Need in Lagos Markets', description: 'Tell us what you need. We are learning Lagos markets to make local shopping easier.', type: 'website', locale: 'en_NG', siteName: 'Hayzed' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
