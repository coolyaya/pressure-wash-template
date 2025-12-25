import raw from "@/content/site.json";

export const site = raw as {
  businessName: string;
  tagline: string;
  phone: string;
  email: string;
  city: string;
  serviceAreas: string[];
  primaryCta: string;
  nav: { label: string; href: string }[];
  hero: { headline: string; subheadline: string; bullets: string[] };
  services: { title: string; desc: string }[];
  reviews: { name: string; text: string }[];
  about: { headline: string; body: string };
  faq: { q: string; a: string }[];
  footer: { hours: string; license: string; copyright: string };
  forms: { redirectUrl: string };
  seo?: {
    siteUrl?: string;
    defaultTitle?: string;
    defaultDescription?: string;
    ogImage?: string;
  };
};
