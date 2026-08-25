export const siteConfig = {
  name: 'Clickmasters',
  legalName: 'Clickmasters Software Development Company',
  url: 'https://clickmasterssoftwaredevelopmentcompany.co.uk',
  description: 'Clickmasters is a software development company providing software development services that build digital products, improve systems and drive digital growth.',
  logo: 'https://clickmasterssoftwaredevelopmentcompany.co.uk/cm-logos/logo.webp',
  email: 'sale@clickmasterssoftwaredevelopmentcompany.co.uk',
  telephone: '+44798856086',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Main PWD Rd',
    addressLocality: 'Islamabad',
    addressRegion: 'Punjab',
    addressCountry: 'Pakistan',
  },
};

export const metadataConfig = {
  serviceDetail: (title, description, slug) => ({
    title: `${title} | Clickmasters`,
    description: description,
    openGraph: {
      title: `${title} | Clickmasters`,
      description: description,
      url: `${siteConfig.url}/${slug}`,
      siteName: siteConfig.name,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Clickmasters`,
      description: description,
    },
    alternates: {
      canonical: `${siteConfig.url}/${slug}`,
    },
  }),
};

function toAbsoluteUrl(url) {
  if (!url) return siteConfig.url;
  if (/^https?:\/\//i.test(url)) return url;
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return `${siteConfig.url}${normalizedPath}`.replace(/\/+$/, '');
}

// 1. Organization Schema
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: siteConfig.logo,
    image: siteConfig.logo,
    description: siteConfig.description,
    telephone: siteConfig.telephone,
    email: siteConfig.email,
    address: siteConfig.address,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.telephone,
      contactType: 'customer service',
      email: siteConfig.email,
      availableLanguage: ['English'],
    },
    sameAs: [],
  };
}

// 2. WebSite Schema
export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    publisher: {
      '@id': `${siteConfig.url}/#organization`,
    },
    inLanguage: 'en-GB',
  };
}

// 3. WebPage Schema
export function webPageSchema(name, description, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${toAbsoluteUrl(url)}/#webpage`,
    url: toAbsoluteUrl(url),
    name: name || siteConfig.name,
    description: description || siteConfig.description,
    isPartOf: {
      '@id': `${siteConfig.url}/#website`,
    },
    about: {
      '@id': `${siteConfig.url}/#organization`,
    },
    mainEntity: {
      '@id': `${siteConfig.url}/#software-development-service`,
    },
    inLanguage: 'en-GB',
  };
}

// 4. FAQPage Schema
export function faqSchema(items, url) {
  if (!items || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'en-GB',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  if (url) {
    schema['@id'] = `${toAbsoluteUrl(url)}/#faq`;
    schema.url = `${toAbsoluteUrl(url)}/#faq`;
  }

  return schema;
}

// 5. Service Schema
export function serviceSchema(name, description, url, areaServed = null, fragmentId = 'service') {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${toAbsoluteUrl(url)}/#${fragmentId}`,
    name,
    serviceType: name,
    provider: {
      '@id': `${siteConfig.url}/#organization`,
    },
    description,
    url: toAbsoluteUrl(url),
    mainEntityOfPage: {
      '@id': `${toAbsoluteUrl(url)}/#webpage`,
    },
  };

  if (areaServed) {
    schema.areaServed = {
      '@type': 'Country',
      name: areaServed,
    };
  }

  return schema;
}

// 6. Article Schema
export function articleSchema({ title, description, url, author, datePublished, dateModified, image }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${toAbsoluteUrl(url)}/#article`,
    headline: title,
    description: description,
    url: toAbsoluteUrl(url),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${toAbsoluteUrl(url)}/#webpage`,
    },
    publisher: {
      '@id': `${siteConfig.url}/#organization`,
    },
  };

  if (author) {
    schema.author = {
      '@type': 'Person',
      name: author,
    };
  } else {
    schema.author = {
      '@id': `${siteConfig.url}/#organization`,
    };
  }

  if (datePublished) schema.datePublished = datePublished;
  if (dateModified) schema.dateModified = dateModified;
  if (image) schema.image = image;

  return schema;
}

// 7. Breadcrumb Schema
export function breadcrumbSchema(crumbs) {
  const cleanedCrumbs = crumbs
    .map((crumb) => ({
      name: crumb.name?.trim(),
      url: toAbsoluteUrl(crumb.url?.trim()),
    }))
    .filter((crumb) => Boolean(crumb.name && crumb.url));

  if (cleanedCrumbs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: cleanedCrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

// 8. ContactPage Schema
export function contactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${siteConfig.url}/contact/#webpage`,
    url: `${siteConfig.url}/contact`,
    name: 'Contact Clickmasters',
    description: 'Get in touch with Clickmasters for your next software development project.',
    mainEntity: {
      '@type': 'LocalBusiness',
      '@id': `${siteConfig.url}/#localbusiness`,
      name: siteConfig.legalName,
      image: siteConfig.logo,
      telephone: siteConfig.telephone,
      email: siteConfig.email,
      address: siteConfig.address,
      url: siteConfig.url,
      parentOrganization: {
        '@id': `${siteConfig.url}/#organization`,
      },
    }
  };
}

// 9. AboutPage Schema
export function aboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${siteConfig.url}/about/#webpage`,
    url: `${siteConfig.url}/about`,
    name: 'About Clickmasters',
    description: 'Learn about Clickmasters, a premier software development company.',
    mainEntity: {
      '@id': `${siteConfig.url}/#organization`,
    },
  };
}

// Homepage static FAQ for backward compatibility
export const homepageFaqSchema = faqSchema([
  {
    question: 'What does a software development company do?',
    answer: 'A software development company helps businesses plan, design, build, test and improve digital products such as custom software, websites, applications, SaaS platforms and AI-powered systems.',
  },
  {
    question: 'What software development services does Clickmasters provide?',
    answer: 'Our software development services include custom software development, website development, application development, AI software development, SaaS development, enterprise software development and cloud development.',
  },
  {
    question: 'Why work with a software development agency?',
    answer: 'A software development agency gives businesses access to product planning, design and engineering expertise for building or improving digital products without developing every capability internally.',
  },
  {
    question: 'Can you develop software around our requirements?',
    answer: 'Yes. Software can be designed around specific users, workflows, processes, integrations and functionality rather than relying entirely on standard software.',
  },
  {
    question: 'Can you develop AI-powered software?',
    answer: 'Yes. AI capabilities can include AI agents, chatbots, LLM-powered functionality, intelligent automation and integrations where they provide genuine value.',
  },
  {
    question: 'Can you improve existing software?',
    answer: 'Yes. Existing software can be enhanced, extended, integrated or modernised depending on its technology, limitations and future requirements.',
  },
  {
    question: 'Do you provide ongoing software support?',
    answer: 'Yes. Ongoing development can include maintenance, updates, optimisation, new functionality and further improvements as the product evolves.',
  },
], '/');