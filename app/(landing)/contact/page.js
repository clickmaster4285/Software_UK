import dynamic from 'next/dynamic';

const ContactPageContent = dynamic(() => import('./ContactPageContent'), { ssr: true });

export default function Page() {
  return <ContactPageContent />;
}
