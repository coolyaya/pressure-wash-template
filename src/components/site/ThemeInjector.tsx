import { site } from "@/lib/site";

export function ThemeInjector() {
  const t = site.theme;
  if (!t) return null;

  const cssVars = `
    html:root {
      --primary: ${t.brand.primary};
      --primary-foreground: ${t.brand.primaryForeground};
      --accent: ${t.brand.accent};
      --accent-foreground: ${t.brand.accentForeground};
      --radius: ${t.radius};
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: cssVars }} />;
}
