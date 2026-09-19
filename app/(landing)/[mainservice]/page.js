// \app\(landing)\[mainservice]\page.js
import { notFound } from 'next/navigation';
import { getServiceData, getAllServiceSlugs } from '@/data/main-services';
import { metadataConfig, breadcrumbSchema, faqSchema, serviceSchema, siteConfig } from '@/app/metadata-config';
import ServiceClient from './main-service';

// Generate static paths for all services at build time
export async function generateStaticParams() {
   const slugs = getAllServiceSlugs();
   return slugs.map((mainservice) => ({ mainservice }));
}

export async function generateMetadata({ params }) {
   const { mainservice } = await params;
   const serviceData = getServiceData(mainservice);

   if (!serviceData) {
      return { title: 'Service Not Found' };
   }

   const metadata = metadataConfig.serviceDetail(
      serviceData.metaTitle || serviceData.title,
      serviceData.metaDescription || serviceData.description,
      mainservice
   );

   if (serviceData.metaKeywords) {
      metadata.keywords = serviceData.metaKeywords;
   }

   return metadata;
}

export default async function ServicePage({ params }) {
   const { mainservice } = await params;

   // Main category pages use enriched data from main-services + service-section-data.
   // (All category slugs resolve via getServiceData — see getAllServiceSlugs().

   const mainData = getServiceData(mainservice);

   if (!mainData) {
      notFound();
   }

   const pageUrl = `${siteConfig.url}/${mainservice}`;
   const faqs = (mainData.faqs || []).map((f) => ({
      question: f.question,
      answer: f.answer,
   }));
   const serviceJsonLd = serviceSchema(
      mainData.metaTitle || mainData.title,
      mainData.metaDescription || mainData.description,
      pageUrl,
      'United Kingdom'
   );
   const faqJsonLd = faqSchema(faqs, `${pageUrl}/`);

   return (
      <>
         <script
            id={`service-schema-${mainservice}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
         />
         {faqJsonLd && (
            <script
               id={`faq-schema-${mainservice}`}
               type="application/ld+json"
               dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
         )}
         <script
            id={`breadcrumb-${mainservice}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
               __html: JSON.stringify(
                  breadcrumbSchema([
                     { name: 'Home', url: '/' },
                     { name: mainData.title, url: `/${mainservice}` },
                  ])
               ),
            }}
         />

         <ServiceClient serviceData={mainData} />
      </>
   );
}