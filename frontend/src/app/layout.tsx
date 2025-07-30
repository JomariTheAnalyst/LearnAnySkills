import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'LearnAnySkills - AI-Powered Learning Platform',
  description: 'Master practical skills with AI-generated lessons. Learn Python Data Analysis, SQL, Excel and more with interactive 3D interface.',
  keywords: ['learning', 'AI', 'skills', 'Python', 'SQL', 'Excel', 'data analysis'],
  authors: [{ name: 'LearnAnySkills Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'LearnAnySkills - AI-Powered Learning Platform',
    description: 'Master practical skills with AI-generated lessons and interactive learning experience.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50`}>
        <div id="root" className="relative">
          {children}
        </div>
        
        {/* Background decoration */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-primary-200 rounded-full opacity-20 blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-secondary-200 rounded-full opacity-20 blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}} />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-200 rounded-full opacity-10 blur-2xl animate-float" />
        </div>
      </body>
    </html>
  );
}