import site from "@/content/site.json";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl border" />
          <div className="leading-tight">
            <div className="font-semibold">{site.businessName}</div>
            <div className="text-sm text-muted-foreground">{site.city}</div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            {site.phone}
          </a>
          <Button asChild>
            <Link href="/contact">{site.primaryCta}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
