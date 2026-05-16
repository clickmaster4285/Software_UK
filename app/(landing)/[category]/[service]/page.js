import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllServicePages, getServicePage, slugify } from '@/data/service-pages';
import { siteConfig } from '@/app/metadata-config';
import ServiceClient from '../ServiceClient';

export async function generateStaticParams() {
  const services = getAllServicePages();
  return services.map((service) => ({
    category: service.categorySlug,
    service: service.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { category, service } = await params;
  const page = getServicePage(service);
  if (!page) return { title: 'Service Not Found' };

  const canonical = `${siteConfig.url}/${category}/${service}`;
  return {
    title: `${page.title} | ClickMasters`,
    description: page.metaDescription,
    alternates: { canonical },
  };
}

export default async function ServiceDetailPage({ params }) {
  const { category, service } = await params;
  const page = getServicePage(service);

  if (!page) {
    notFound();
  }

  return <ServiceClient serviceData={page} />;
}