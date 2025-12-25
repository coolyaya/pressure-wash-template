import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import { LocalBusinessSchema } from "@/components/site/LocalBusinessSchema";

export const metadata: Metadata = {
  metadataBase: site.seo?.siteUrl ? new URL(site.seo.siteUrl) : undefined,
  title: {
    default: site.seo?.defaultTitle || site.businessName,
    template: `%s | ${site.businessName}`,
  },
  description: site.seo?.defaultDescription || site.tagline,
  openGraph: {
    title: site.seo?.defaultTitle || site.businessName,
    description: site.seo?.defaultDescription || site.tagline,
    url: site.seo?.siteUrl,
    siteName: site.businessName,
    images: site.seo?.ogImage ? [site.seo.ogImage] : [],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo?.defaultTitle || site.businessName,
    description: site.seo?.defaultDescription || site.tagline,
    images: site.seo?.ogImage ? [site.seo.ogImage] : [],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LocalBusinessSchema />
        {children}
      </body>
    </html>
  );
}
