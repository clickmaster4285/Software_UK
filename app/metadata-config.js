export const siteConfig = {
  name: 'ClickMasters',
  url: 'https://clickmasters.co',
  description: 'ClickMasters - Software Development Company, AI solutions, and digital transformation for B2B companies.',
};

export const metadataConfig = {
  serviceDetail: (title, description, slug) => ({
    title: `${title} | ClickMasters`,
    description: description,
    openGraph: {
      title: `${title} | ClickMasters`,
      description: description,
      url: `${siteConfig.url}/${slug}`,
      siteName: siteConfig.name,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ClickMasters`,
      description: description,
    },
    alternates: {
      canonical: `${siteConfig.url}/${slug}`,
    },
  }),
};