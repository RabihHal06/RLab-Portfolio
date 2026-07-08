import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rabih El Halabi | Senior Business Analyst & Implementation Consultant | Dubai, UAE',
  description: 'Senior Business Analyst and Implementation Consultant with 14+ years across enterprise software, Higher Education SIS, and regional support across 7 countries in the MENA region. Available for BA, Implementation, and TAM roles in Dubai, UAE.',
  icons: {
    icon: '/api/favicon',
    shortcut: '/api/favicon',
    apple: '/api/favicon',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1E2761" />
      </head>
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
