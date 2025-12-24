import site from "@/content/site.json";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="font-semibold">{site.businessName}</div>
            <div className="text-sm text-muted-foreground">{site.tagline}</div>
          </div>
          <div className="text-sm text-muted-foreground">
            <div>{site.footer.hours}</div>
            <div>{site.footer.license}</div>
          </div>
          <div className="text-sm text-muted-foreground md:text-right">
            <div>{site.footer.copyright}</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
