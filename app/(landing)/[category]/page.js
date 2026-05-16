// app/services/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getServiceData, getAllServiceSlugs } from '@/data/services';
import { metadataConfig } from '@/app/metadata-config';
import ServiceClient from './ServiceClient';

// Generate static paths for all services at build time
export async function generateStaticParams() {
   const slugs = getAllServiceSlugs();
   return slugs.map((category) => ({ category }));
}

export async function generateMetadata({ params }) {
   const { category } = await params;
   const serviceData = getServiceData(category);

   if (!serviceData) {
      return { title: 'Service Not Found' };
   }

   return metadataConfig.serviceDetail(
      serviceData.title,
      serviceData.description,
      category
   );
}

import { getServicePage } from '@/data/service-pages';

export default async function ServicePage({ params }) {
   const { category } = await params;

   // getServicePage already merges overrides with base data from service-pages logic
   const pageContent = getServicePage(category);

   // If no content found for this slug, try base services as fallback
   const mainData = pageContent || getServiceData(category);

   if (!mainData) {
      notFound();
   }

   return <ServiceClient serviceData={mainData} />;
}