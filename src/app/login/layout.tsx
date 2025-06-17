import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true, // Or false, depending on your preference for links on this page
  },
  // You might want to set a title for the browser tab even if it's noindex
  title: 'Login - Vogue AI',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Google AdSense 脚本 */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6313486072364487"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
} 