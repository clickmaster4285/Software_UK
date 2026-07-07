export const siteConfig = {
  name: 'ClickMasters',
  legalName: 'ClickMasters Software Development Company',
  url: 'https://clickmasterssoftwaredevelopmentcompany.co.uk',
  description: 'ClickMasters - Software Development Company, AI solutions, and digital transformation for B2B companies.',
  logo: 'https://clickmasterssoftwaredevelopmentcompany.co.uk/cm-logos/clickmasters-logo.png', // Fallback URL
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

function toAbsoluteUrl(url) {
  if (!url) return siteConfig.url;
  if (/^https?:\/\//i.test(url)) return url;
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return `${siteConfig.url}${normalizedPath}`;
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
    inLanguage: 'en',
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
    primaryImageOfPage: {
      '@id': `${siteConfig.url}/#primaryimage`,
    },
  };
}

// 4. FAQPage Schema
export function faqSchema(items, url) {
  if (!items || items.length === 0) return null;
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
  
  if (url) {
    schema['@id'] = `${toAbsoluteUrl(url)}/#faq`;
    schema.mainEntityOfPage = toAbsoluteUrl(url);
  }
  
  return schema;
}

// 5. Service Schema
export function serviceSchema(name, description, url, areaServed = null) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${toAbsoluteUrl(url)}/#service`,
    serviceType: name,
    provider: {
      '@id': `${siteConfig.url}/#organization`,
    },
    description,
    url: toAbsoluteUrl(url),
    mainEntityOfPage: toAbsoluteUrl(url),
  };
  
  if (areaServed) {
    schema.areaServed = {
      '@type': 'Place',
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
    name: 'Contact ClickMasters',
    description: 'Get in touch with ClickMasters for your next software development project.',
    mainEntity: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${siteConfig.url}/#localbusiness`,
      name: siteConfig.legalName,
      image: siteConfig.logo,
      telephone: siteConfig.telephone,
      email: siteConfig.email,
      address: siteConfig.address,
      url: siteConfig.url,
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
    name: 'About ClickMasters',
    description: 'Learn about ClickMasters, a premier software development company.',
    mainEntity: {
      '@id': `${siteConfig.url}/#organization`,
    },
  };
}

// Homepage static FAQ for backward compatibility
export const homepageFaqSchema = faqSchema([
  {
    question: 'How much does custom software development cost?',
    answer: 'Custom software development costs vary based on complexity, features, and timeline. A basic web application typically starts from $5,000–$15,000, while enterprise systems range from $30,000–$200,000+. We provide free consultations to give accurate project estimates.',
  },
  {
    question: 'How long does it take to build a custom software application?',
    answer: 'Development timelines depend on the project scope. An MVP takes 6–12 weeks, a full web or mobile application takes 3–6 months, and enterprise systems can take 6–18 months. We use agile sprints to deliver working software every 2 weeks.',
  },
  {
    question: 'What technologies does ClickMasters use?',
    answer: "We use modern, proven technologies including React, Next.js, Node.js, Python, Flutter, React Native, PostgreSQL, MongoDB, AWS, Google Cloud, and Azure. We choose the best stack for each project's specific needs.",
  },
  {
    question: 'Do you provide post-launch support and maintenance?',
    answer: 'Yes. ClickMasters provides 24/7 post-launch support, security updates, performance monitoring, and feature development. We offer monthly maintenance plans to keep your software running smoothly.',
  },
  {
    question: 'Can ClickMasters work with international clients?',
    answer: 'Yes. We work with clients across the USA, Europe, Middle East, and worldwide. Our team operates across time zones and uses agile project management tools to ensure seamless collaboration regardless of location.',
  },
], '/');