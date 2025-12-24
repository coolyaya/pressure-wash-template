import site from "@/content/site.json";
import { SiteShell } from "@/components/site/SiteShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ServicesPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Services</h1>
          <p className="text-lg text-muted-foreground">
            Professional exterior cleaning in {site.city} and nearby areas.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {site.services.map((service) => (
            <Card key={service.title} className="rounded-3xl">
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {service.desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
