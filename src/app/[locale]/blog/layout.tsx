import Footer from '@/components/common/Footer';

export default function LocalizedBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow bg-[var(--vogue-page)]">{children}</main>
      <Footer />
    </div>
  );
}
