import { redirect } from 'next/navigation';

export default function AiBabyGeneratorFallbackPage() {
  redirect('/en/ai-baby-generator');
}
