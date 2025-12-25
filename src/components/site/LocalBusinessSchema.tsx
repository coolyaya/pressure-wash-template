import { site } from "@/lib/site";

export function LocalBusinessSchema() {
  const baseUrl = site.seo?.siteUrl || "";
  const phoneDigits = site.phone.replace(/[^0-9]/g, "");
  const phone = phoneDigits ? `+1${phoneDigits}` : site.phone;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.businessName,
    description: site.seo?.defaultDescription || site.tagline,
    url: baseUrl,
    telephone: phone,
    email: site.email,
    areaServed: site.serviceAreas,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: "FL",
      addressCountry: "US",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
