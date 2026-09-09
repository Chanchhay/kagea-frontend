const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Find Job",
  description: "Discover jobs, build your professional profile, and prepare for interviews",
  url: siteUrl,
  logo: `${siteUrl}/images/brand/logo-light.png`,
  address: {
    "@type": "PostalAddress",
    addressCountry: "KH",
    addressLocality: "Phnom Penh",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    email: "support@findjob.com",
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Find Job",
  url: siteUrl,
  description: "Find jobs in Cambodia, build a professional profile, and practice AI-powered interviews.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/jobs?keyword={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const jobPostingSchema = (job: {
  id: string;
  title: string;
  description: string;
  location?: string;
  companyName: string;
  salary?: { min?: number; max?: number; currency?: string };
  publishedAt?: string;
  expiresAt?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: job.title,
  description: job.description,
  identifier: {
    "@type": "PropertyValue",
    name: "Find Job",
    value: job.id,
  },
  datePosted: job.publishedAt || new Date().toISOString(),
  validThrough: job.expiresAt,
  employmentType: "FULL_TIME",
  hiringOrganization: {
    "@type": "Organization",
    name: job.companyName,
  },
  jobLocation: job.location
    ? {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: job.location,
          addressCountry: "KH",
        },
      }
    : undefined,
  baseSalary: job.salary
    ? {
        "@type": "PriceSpecification",
        priceCurrency: job.salary.currency || "USD",
        price: `${job.salary.min || 0}-${job.salary.max || 0}`,
      }
    : undefined,
  url: `${siteUrl}/jobs/${job.id}`,
});

export const faqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Find Job Cambodia",
  description: "Job search and recruitment platform for Cambodia",
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressCountry: "KH",
    addressLocality: "Phnom Penh",
  },
  areaServed: {
    "@type": "Country",
    name: "Cambodia",
  },
};
