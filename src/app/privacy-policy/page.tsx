import Link from 'next/link';
import VogueLegalPage from '@/components/legal/VogueLegalPage';
import { getLanguageAlternates, getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../messages/en.json';

const PAGE_PATH = '/privacy-policy';
const title = 'Privacy Policy - Vogue AI';
const description =
  'Learn how Vogue AI handles account data, prompts, uploads, generated outputs, payments, analytics, and third-party AI processing.';

export async function generatePrivacyPolicyMetadata(
  locale: string
): Promise<Metadata> {
  const localizedPath = getUrlWithLocale(PAGE_PATH, locale);

  return {
    title,
    description,
    alternates: {
      canonical: localizedPath,
      languages: getLanguageAlternates(PAGE_PATH),
    },
    openGraph: {
      title,
      description,
      url: localizedPath,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export function generateMetadata(): Promise<Metadata> {
  return generatePrivacyPolicyMetadata('en');
}

const sections = [
  {
    title: '1. Information we collect',
    body: [
      'Account data: name, email address, login method, account identifiers, session metadata, credit balance, subscription status, and support messages.',
      'Creative workflow data: prompts, reference images, uploaded assets, generated outputs, model parameters, generation status, task identifiers, prompt-gallery interactions, and image history records.',
      'Payment data: checkout identifiers, order status, payment provider, amount, currency, invoice or receipt metadata, refund status, and fraud-prevention signals. We do not store full card numbers.',
      'Technical data: IP address, browser type, device type, operating system, referral page, feature events, error logs, performance data, cookies, and similar technologies.',
    ],
  },
  {
    title: '2. How we use information',
    body: [
      'We use information to create and secure accounts, run the prompt gallery, process image generations, store generated assets, maintain credit balances, process purchases, provide support, and troubleshoot failed tasks.',
      'We use operational data to prevent abuse, enforce content safety rules, detect fraud, protect payment systems, debug outages, measure product performance, and improve user experience.',
      'We may use contact information to send service messages, receipts, security alerts, policy updates, refund responses, and support replies. Marketing messages are sent only where permitted by law and can be opted out of.',
    ],
  },
  {
    title: '3. Service providers and processors',
    body: [
      'Vogue AI relies on infrastructure, authentication, payment, storage, model, email, analytics, and observability providers to operate the Service.',
      'Core processors may include Google OAuth, Better Auth, Stripe, ZPAY, Cloudflare R2, Vercel, Resend, and similar providers used for authentication, checkout, storage, hosting, email delivery, and platform operations.',
      'AI generation requests may be routed to model or generation providers such as KIE, Evolink, 302.ai, or comparable model-routing services. These providers receive the prompt, reference image, parameters, and task metadata needed to generate or return outputs.',
      'Analytics and product diagnostics may include Microsoft Clarity and Google Analytics. These tools help us understand page usage, friction, browser errors, and feature adoption.',
    ],
  },
  {
    title: '4. AI model processing',
    body: [
      'When you submit a prompt, upload a reference image, or start a generation, the relevant content may be sent to third-party AI providers solely to process the request, return the result, apply safety checks, investigate failures, or prevent abuse.',
      'Vogue AI does not use your private prompts, uploaded assets, or generated outputs to train foundation models. Third-party providers may process requests under their own service terms, retention rules, security measures, and legal obligations.',
      'If you use public gallery prompts or publish generated outputs outside Vogue AI, those materials may become visible to others according to your own sharing choices or the rules of the destination platform.',
    ],
  },
  {
    title: '5. Cookies and analytics choices',
    body: [
      'We use cookies and similar technologies to keep you signed in, remember preferences, protect sessions, measure traffic, understand feature usage, and improve reliability.',
      'You can control cookies through your browser settings. Blocking required cookies may prevent login, checkout, generation history, or credit-account features from working correctly.',
      'Where required by law, we provide consent or opt-out controls for analytics and marketing technologies.',
    ],
  },
  {
    title: '6. Sharing and disclosure',
    body: [
      'We do not sell personal information. We share information only with service providers that help operate Vogue AI, when you ask us to process a generation or payment, when needed for support, or when required for legal, safety, fraud-prevention, or rights-protection reasons.',
      'We may disclose information if required by law, legal process, regulator request, payment-network rules, security investigation, abuse report, or to protect the rights, property, and safety of Vogue AI, users, providers, and the public.',
      'If Vogue AI is involved in a merger, acquisition, financing, reorganization, or sale of assets, user information may be transferred as part of that transaction, subject to appropriate safeguards.',
    ],
  },
  {
    title: '7. Retention and deletion',
    body: [
      'We keep account, payment, credit, and support records for as long as needed to provide the Service, resolve disputes, maintain financial records, prevent fraud, and comply with legal obligations.',
      'Prompt, upload, and generated-output records may be retained while your account is active so that you can view history, reuse assets, and receive support for failed tasks. Some temporary provider logs may expire on the provider side according to their policies.',
      'You can request deletion of your account or specific personal information by contacting support@vogueai.net. We may retain limited records where required for legal, tax, audit, security, payment, or fraud-prevention purposes.',
    ],
  },
  {
    title: '8. Security and international transfers',
    body: [
      'We use reasonable technical and organizational measures to protect account data, payment metadata, prompts, uploads, generated outputs, and system logs from unauthorized access, loss, misuse, and alteration.',
      'No online service can guarantee perfect security. You should use a secure email account, protect login links, and contact us if you suspect unauthorized account access.',
      'Vogue AI and its providers may process information in countries other than your country of residence. We rely on provider safeguards, contracts, and applicable transfer mechanisms where required.',
    ],
  },
  {
    title: '9. Your choices and rights',
    body: [
      'Depending on your location, you may have rights to access, correct, delete, export, restrict, or object to certain processing of your personal information.',
      'You can update basic account details in the product where available, manage browser cookies, unsubscribe from eligible marketing emails, and contact support for account or data requests.',
      'We may need to verify your identity before fulfilling rights requests and may decline or limit requests where permitted by law.',
    ],
  },
  {
    title: '10. Changes to this policy',
    body: [
      'We may update this Privacy Policy as Vogue AI adds providers, payment methods, features, safety workflows, or legal requirements.',
      'When we make material changes, we will update the effective date and may provide additional notice through the product or email when appropriate.',
    ],
  },
];

export function PrivacyPolicyPageContent({ locale }: { locale: string }) {
  return (
    <VogueLegalPage
      title="Privacy Policy"
      effectiveDate="May 21, 2026"
      closingNotice={
        <>
          By using Vogue AI, you agree that we may process information as
          described in this Privacy Policy and our{' '}
          <Link
            href={getUrlWithLocale('/terms-of-service', locale)}
            className="font-semibold text-slate-950 underline-offset-4 hover:underline"
          >
            Terms of Service
          </Link>
          .
        </>
      }
      sections={sections}
      contactTitle="11. Contact"
      contactBody={
        <p>
          Privacy requests, deletion requests, provider questions, and security
          concerns should be sent to{' '}
          <a
            href="mailto:support@vogueai.net"
            className="font-semibold text-slate-950 underline-offset-4 hover:underline"
          >
            support@vogueai.net
          </a>
          .
        </p>
      }
    />
  );
}

export default function PrivacyPolicyFallbackPage() {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <PrivacyPolicyPageContent locale="en" />
    </NextIntlClientProvider>
  );
}
