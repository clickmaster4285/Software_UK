export const siteConfig = {
  name: 'Clickmasters',
  legalName: 'Clickmasters Software Development Company',
  url: 'https://clickmasterssoftwaredevelopmentcompany.co.uk',
  description: 'Clickmasters is a software development company providing software development services that build digital products, improve systems and drive digital growth.',
  logo: 'https://clickmasterssoftwaredevelopmentcompany.co.uk/cm-logos/logo.webp',
  email: 'sales@clickmasterssoftwaredevelopmentcompany.co.uk',
  telephone: '+447988576086',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Main PWD Rd',
    addressLocality: 'Islamabad',
    addressRegion: 'Punjab',
    addressCountry: 'Pakistan',
  },
};

export function withBrandSuffix(title, maxLen = 60) {
  const brand = ' | Clickmasters';
  let cleaned = String(title || '')
    .replace(/\s*\|\s*Clickmasters\s*$/i, '')
    .replace(/\s*\|\s*ClickMasters\s*$/i, '')
    .trim();
  const maxCore = Math.max(20, maxLen - brand.length);
  if (cleaned.length > maxCore) {
    cleaned = cleaned
      .slice(0, maxCore)
      .replace(/\s+\S*$/, '')
      .replace(/[\s|,–—:-]+$/g, '')
      .trim();
  }
  return cleaned ? `${cleaned}${brand}` : 'Clickmasters';
}

export function clampDescription(description, maxLen = 155) {
  const text = String(description || '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1).replace(/\s+\S*$/, '').trim()}…`;
}

export const metadataConfig = {
  serviceDetail: (title, description, slug) => {
    const branded = withBrandSuffix(title);
    const desc = clampDescription(description);
    return {
      title: branded,
      description: desc,
      openGraph: {
        title: branded,
        description: desc,
        url: `${siteConfig.url}/${slug}`,
        siteName: siteConfig.name,
        locale: 'en_GB',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: branded,
        description: desc,
      },
      alternates: {
        canonical: `${siteConfig.url}/${slug}`,
      },
    };
  },
};

function toAbsoluteUrl(url) {
  if (!url) return siteConfig.url;
  if (/^https?:\/\//i.test(url)) return url;
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return `${siteConfig.url}${normalizedPath}`.replace(/\/+$/, '');
}

const MONTH_INDEX = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

/** Convert "June 2025" / "2025-06-01" into ISO-8601 DateTime for schema.org. */
export function toIsoDateTime(value) {
  if (!value) return undefined;
  const raw = String(value).trim();
  if (!raw) return undefined;

  if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) return raw;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return `${raw}T00:00:00+00:00`;

  const monthYear = raw.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYear) {
    const month = MONTH_INDEX[monthYear[1].toLowerCase()];
    if (month) {
      return `${monthYear[2]}-${String(month).padStart(2, '0')}-01T00:00:00+00:00`;
    }
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  return undefined;
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
  const absoluteUrl = toAbsoluteUrl(url);
  const published = toIsoDateTime(datePublished) || toIsoDateTime(dateModified);
  const modified = toIsoDateTime(dateModified) || published;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${absoluteUrl}/#article`,
    headline: title,
    description: description,
    url: absoluteUrl,
    image: image ? toAbsoluteUrl(image) : siteConfig.logo,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${absoluteUrl}/#webpage`,
    },
    publisher: {
      '@id': `${siteConfig.url}/#organization`,
    },
  };

  if (author) {
    schema.author = {
      '@type': 'Person',
      name: author,
      url: `${siteConfig.url}/about`,
      sameAs: [siteConfig.url],
    };
  } else {
    schema.author = {
      '@id': `${siteConfig.url}/#organization`,
    };
  }

  if (published) schema.datePublished = published;
  if (modified) schema.dateModified = modified;

  return schema;
}

/** Review schema helper (case-study client quotes, etc.). */
export function reviewSchema({
  reviewBody,
  authorName,
  datePublished,
  ratingValue = '5',
  itemReviewedName,
}) {
  if (!reviewBody) return null;

  const published = toIsoDateTime(datePublished);

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Organization',
      name: itemReviewedName || siteConfig.legalName || siteConfig.name,
      url: siteConfig.url,
    },
    author: {
      '@type': 'Person',
      name: authorName || 'Client',
      url: `${siteConfig.url}/about`,
      sameAs: [siteConfig.url],
    },
    reviewBody,
    ...(published ? { datePublished: published } : {}),
    reviewRating: {
      '@type': 'Rating',
      ratingValue: String(ratingValue),
      bestRating: '5',
    },
  };
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
      priceRange: '£££',
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 33.6844,
        longitude: 73.0479,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ],
          opens: '09:00',
          closes: '18:00',
        },
      ],
      parentOrganization: {
        '@id': `${siteConfig.url}/#organization`,
      },
    },
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