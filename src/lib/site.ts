import raw from "@/content/site.json";

export type Site = {
  theme: {
    brand: {
      primary: string;
      primaryForeground: string;
      accent: string;
      accentForeground: string;
    };
    radius: string;
  };

  assets: {
    logoText: string;
    heroImage: string;
  };

  businessName: string;
  tagline: string;
  phone: string;
  email: string;
  city: string;
  serviceAreas: string[];
  primaryCta: string;

  forms: {
    redirectUrl: string;
  };

  nav: {
    label: string;
    href: string;
  }[];

  seo: {
    siteUrl: string;
    defaultTitle: string;
    defaultDescription: string;
    ogImage: string;
  };

  hero: {
    headline: string;
    subheadline: string;
    bullets: string[];
  };

  services: {
    title: string;
    desc: string;
  }[];

  reviews: {
    name: string;
    text: string;
  }[];

  about: {
    headline: string;
    body: string;
  };

  faq: {
    q: string;
    a: string;
  }[];

  footer: {
    hours: string;
    license: string;
    copyright: string;
  };
};

// Fail fast in dev/build if site.json is missing core fields.
// (Type assertions alone won't catch runtime config mistakes.)
function assertSiteConfig(input: unknown): asserts input is Site {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid site.json (not an object).");
  }

  const s = input as Record<string, unknown>;

  const requiredTopLevel = ["businessName", "phone", "email", "seo", "assets", "theme"];
  for (const key of requiredTopLevel) {
    if (s[key] == null) throw new Error(`Missing site.${key} in site.json`);
  }

  const seo = s["seo"] as Record<string, unknown>;
  for (const key of ["siteUrl", "defaultTitle", "defaultDescription", "ogImage"]) {
    if (!seo || seo[key] == null || seo[key] === "") {
      throw new Error(`Missing site.seo.${key} in site.json`);
    }
  }

  const assets = s["assets"] as Record<string, unknown>;
  for (const key of ["logoText", "heroImage"]) {
    if (!assets || assets[key] == null || assets[key] === "") {
      throw new Error(`Missing site.assets.${key} in site.json`);
    }
  }

  const theme = s["theme"] as Record<string, unknown>;
  if (!theme || theme["radius"] == null || theme["radius"] === "") {
    throw new Error("Missing site.theme.radius in site.json");
  }
  const brand = theme["brand"] as Record<string, unknown>;
  for (const key of [
    "primary",
    "primaryForeground",
    "accent",
    "accentForeground",
  ]) {
    if (!brand || brand[key] == null || brand[key] === "") {
      throw new Error(`Missing site.theme.brand.${key} in site.json`);
    }
  }
}

assertSiteConfig(raw);

export const site: Site = raw;
