import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IMDb Insights',
  description: 'AI-powered movie insights and sentiment analysis based on audience reviews.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground bg-[url('/bg-glow.svg')] bg-no-repeat bg-top">
        {children}
      </body>
    </html>
  );
}
