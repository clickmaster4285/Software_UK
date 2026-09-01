// \app\(landing)\[category]\page.js
import { notFound } from 'next/navigation';
import { getServiceData, getAllServiceSlugs } from '@/data/main-services';
import { metadataConfig, breadcrumbSchema, faqSchema, serviceSchema, siteConfig } from '@/app/metadata-config';
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

   const metadata = metadataConfig.serviceDetail(
      serviceData.metaTitle || serviceData.title,
      serviceData.metaDescription || serviceData.description,
      category
   );

   if (serviceData.metaKeywords) {
      metadata.keywords = serviceData.metaKeywords;
   }

   return metadata;
}

export default async function ServicePage({ params }) {
   const { category } = await params;

   // Main category pages use enriched data from main-services + service-section-data.
   // (All category slugs resolve via getServiceData — see getAllServiceSlugs().

   const mainData = getServiceData(category);

   if (!mainData) {
      notFound();
   }

   const pageUrl = `${siteConfig.url}/${category}`;
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
            id={`service-schema-${category}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
         />
         {faqJsonLd && (
            <script
               id={`faq-schema-${category}`}
               type="application/ld+json"
               dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
         )}
         <script
            id={`breadcrumb-${category}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
               __html: JSON.stringify(
                  breadcrumbSchema([
                     { name: 'Home', url: '/' },
                     { name: mainData.title, url: `/${category}` },
                  ])
               ),
            }}
         />

         <ServiceClient serviceData={mainData} />
      </>
   );
}