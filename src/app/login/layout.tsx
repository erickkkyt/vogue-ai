import type { Metadata } from 'next';

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
  return <>{children}</>;
} 