import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Simple full stack task manager (Next.js + Django)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning: browser extensions inject attributes into <body> before hydration */}
      <body suppressHydrationWarning>
        {children}
        <Toaster position="top-left" theme="dark" richColors closeButton />
      </body>
    </html>
  );
}
