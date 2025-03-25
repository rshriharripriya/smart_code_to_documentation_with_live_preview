import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Auto documentation',
  description: 'Automated documentation for your code changes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        {/* 
          This layout is intentionally minimal - each route group 
          (landing) and (auto-doc) will provide its own navigation 
          and styling through their own layout files
        */}
        {children}
        
        {/* Optional: Add footer or other global elements here */}
        <footer className="py-6 border-t mt-12 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Shri Harri Priya Ramesh. All rights reserved.
        </footer>
      </body>
    </html>
  );
}