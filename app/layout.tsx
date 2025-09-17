import type { Metadata } from 'next';
import './globals.css';


export const metadata: Metadata = { title: 'LadderUp', description: 'Multiplayer Snakes & Ladders' };


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <div className="container">{children}</div>
      </body>
    </html>
  );
}