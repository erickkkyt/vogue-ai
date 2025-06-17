import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false, // Typically for dashboard areas, you might not want links followed either
  },
  // Set a generic title for the dashboard area for browser tabs
  title: 'Dashboard - Baby Podcast Pro',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // You can add shared dashboard UI structure here if needed (e.g., a sidebar, header specific to dashboard)
  return (
    <>
      {/* Google AdSense 脚本 */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6313486072364487"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      <section
        className="min-h-screen"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          backgroundPosition: 'center',
        }}
      >
        {children}
      </section>
    </>
  );
} 