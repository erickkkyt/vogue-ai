import Footer from '@/components/common/Footer';
import { FileCheck2, Mail } from 'lucide-react';
import type { ReactNode } from 'react';

export type VogueLegalSection = {
  title: string;
  body: string[];
};

type VogueLegalPageProps = {
  title: string;
  description?: string;
  effectiveDate: string;
  intro?: ReactNode;
  closingNotice?: ReactNode;
  sections: VogueLegalSection[];
  contactTitle: string;
  contactBody: ReactNode;
};

function getSectionId(title: string) {
  return title
    .toLowerCase()
    .replace(/^[0-9]+\.?\s*/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function VogueLegalPage({
  title,
  description,
  effectiveDate,
  intro,
  closingNotice,
  sections,
  contactTitle,
  contactBody,
}: VogueLegalPageProps) {
  const contentGridClassName = intro
    ? 'mt-6 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start'
    : 'grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start';

  return (
    <div className="flex min-h-screen flex-col bg-[var(--vogue-page)] text-slate-950">
      <main className="flex-grow">
        <section className="border-b border-[var(--vogue-border)] bg-[linear-gradient(180deg,#fffaf7_0%,#fbf2ed_100%)] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <h1 className="text-[2rem] font-semibold leading-[1.08] text-slate-950 sm:text-[2.65rem]">
                {title}
              </h1>
              {description ? (
                <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600 sm:text-[16px]">
                  {description}
                </p>
              ) : null}
              <p className="mt-3 text-[12px] font-medium text-slate-500">
                Effective date: {effectiveDate}
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-7xl">
            {intro ? (
              <div className="rounded-[8px] border border-[rgba(79,103,255,0.16)] bg-[rgba(241,237,255,0.58)] p-4 text-[14px] leading-7 text-slate-700 shadow-[0_16px_42px_rgba(79,103,255,0.07)] sm:text-[15px] xl:whitespace-nowrap">
                {intro}
              </div>
            ) : null}

            <div className={contentGridClassName}>
              <aside className="lg:sticky lg:top-24">
                <nav className="rounded-[8px] border border-[var(--vogue-border)] bg-[rgba(255,253,251,0.78)] p-4 shadow-[0_16px_42px_rgba(72,55,44,0.08)]">
                  <p className="flex items-center gap-2 text-[12px] font-semibold text-slate-500">
                    <FileCheck2 className="h-4 w-4 text-[var(--vogue-accent-strong)]" />
                    Contents
                  </p>
                  <ol className="mt-3 grid gap-1.5">
                    {sections.map((section) => (
                      <li key={section.title}>
                        <a
                          href={`#${getSectionId(section.title)}`}
                          className="block rounded-[6px] px-2 py-1.5 text-[13px] leading-5 text-slate-600 transition hover:bg-white hover:text-slate-950"
                        >
                          {section.title}
                        </a>
                      </li>
                    ))}
                    <li>
                      <a
                        href="#contact"
                        className="block rounded-[6px] px-2 py-1.5 text-[13px] leading-5 text-slate-600 transition hover:bg-white hover:text-slate-950"
                      >
                        {contactTitle}
                      </a>
                    </li>
                  </ol>
                </nav>
              </aside>

              <div className="grid gap-5">
                {sections.map((section) => (
                  <article
                    key={section.title}
                    id={getSectionId(section.title)}
                    className="scroll-mt-24 rounded-[8px] border border-[var(--vogue-border)] bg-[rgba(255,253,251,0.84)] p-5 shadow-[0_16px_42px_rgba(72,55,44,0.08)] sm:p-6"
                  >
                    <h2 className="text-[1.25rem] font-semibold text-slate-950">
                      {section.title}
                    </h2>
                    <div className="mt-4 grid gap-4 text-[15px] leading-8 text-slate-700">
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </article>
                ))}

                <article
                  id="contact"
                  className="scroll-mt-24 rounded-[8px] border border-[var(--vogue-border)] bg-[rgba(255,253,251,0.84)] p-5 shadow-[0_16px_42px_rgba(72,55,44,0.08)] sm:p-6"
                >
                  <h2 className="flex items-center gap-2 text-[1.25rem] font-semibold text-slate-950">
                    <Mail className="h-5 w-5 text-[var(--vogue-accent-strong)]" />
                    {contactTitle}
                  </h2>
                  <div className="mt-4 text-[15px] leading-8 text-slate-700">
                    {contactBody}
                  </div>
                </article>
              </div>
            </div>

            {closingNotice ? (
              <div className="mt-8 border-t border-[var(--vogue-border)] pt-5 text-[13px] leading-6 text-slate-500">
                {closingNotice}
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
