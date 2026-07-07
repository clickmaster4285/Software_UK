export const siteConfig = {
  name: 'ClickMasters',
  url: 'https://clickmasterssoftwaredevelopmentcompany.co.uk',
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

function toAbsoluteUrl(url) {
  if (!url) return siteConfig.url;
  if (/^https?:\/\//i.test(url)) return url;
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return `${siteConfig.url}${normalizedPath}`;
};

export function faqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
};

export function serviceSchema(name, description, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: name,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    description,
    url,
  };
};

export function breadcrumbSchema(crumbs) {
  const cleanedCrumbs = crumbs
    .map((crumb) => ({
      name: crumb.name?.trim(),
      url: toAbsoluteUrl(crumb.url?.trim()),
    }))
    .filter((crumb) => Boolean(crumb.name && crumb.url));

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
};

export const homepageFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${siteConfig.url}/#faq`,
  mainEntityOfPage: `${siteConfig.url}/`,
  inLanguage: 'en',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does custom software development cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Custom software development costs vary based on complexity, features, and timeline. A basic web application typically starts from $5,000–$15,000, while enterprise systems range from $30,000–$200,000+. We provide free consultations to give accurate project estimates.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to build a custom software application?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Development timelines depend on the project scope. An MVP takes 6–12 weeks, a full web or mobile application takes 3–6 months, and enterprise systems can take 6–18 months. We use agile sprints to deliver working software every 2 weeks.',
      },
    },
    {
      '@type': 'Question',
      name: 'What technologies does ClickMasters use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "We use modern, proven technologies including React, Next.js, Node.js, Python, Flutter, React Native, PostgreSQL, MongoDB, AWS, Google Cloud, and Azure. We choose the best stack for each project's specific needs.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide post-launch support and maintenance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. ClickMasters provides 24/7 post-launch support, security updates, performance monitoring, and feature development. We offer monthly maintenance plans to keep your software running smoothly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can ClickMasters work with international clients?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We work with clients across the USA, Europe, Middle East, and worldwide. Our team operates across time zones and uses agile project management tools to ensure seamless collaboration regardless of location.',
      },
    },
  ],
};