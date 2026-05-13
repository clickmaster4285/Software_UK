import { getAllServicePages, serviceMenuSections, slugify } from '@/data/service-pages';
import ServicesClient from './ServicesClient';

export const metadata = {
  title: 'Services | ClickMasters',
  description: 'Explore our comprehensive digital services - from software development to AI solutions, web design to automation.',
};

export default function ServicesPage() {
  const services = getAllServicePages();

  return <ServicesClient services={services} categories={serviceMenuSections} />;
}