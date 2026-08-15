import dynamic from 'next/dynamic';

const AboutPageContent = dynamic(() => import('./AboutPageContent'), { ssr: true });

export default function Page() {
  return <AboutPageContent />;
}