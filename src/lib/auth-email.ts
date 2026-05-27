import { websiteConfig } from '@/config/website';

type SendAuthEmailParams = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendAuthEmail({
  to,
  subject,
  html,
  text,
}: SendAuthEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[auth email skipped]', { to, subject, text });
    }
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: websiteConfig.mail.from,
      to,
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Resend email failed: ${response.status} ${errorText}`);
  }
}

