// \app\(landing)\[category]\page.js
import { notFound } from 'next/navigation';
import { getServiceData, getAllServiceSlugs } from '@/data/main-services';
import { metadataConfig } from '@/app/metadata-config';
import ServiceClient from './main-service';

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

import { getServicePage } from '@/data/sub-services';
import { mainServicesData } from '@/data/main-services';

export default async function ServicePage({ params }) {
   const { category } = await params;

   // Main category pages use enriched data from main-services + service-section-data
   const mainData = mainServicesData[category]
      ? getServiceData(category)
      : getServicePage(category);

   if (!mainData) {
      notFound();
   }

   return <ServiceClient serviceData={mainData} />;
}