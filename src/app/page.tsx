import site from "@/content/site.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <SiteShell>
  <main>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Licensed & Insured</Badge>
              <Badge variant="secondary">Free Quotes</Badge>
              <Badge variant="secondary">Local Service</Badge>
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              {site.hero.headline}
            </h1>
            <p className="text-lg text-muted-foreground">{site.hero.subheadline}</p>

            <ul className="space-y-2 text-sm text-muted-foreground">
              {site.hero.bullets.map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/contact">{site.primaryCta}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}>Call Now</a>
              </Button>
            </div>
          </div>

          {/* Placeholder image */}
          <div className="aspect-4/3 w-full rounded-3xl border bg-muted" />
        </div>
      </section>

      {/* Services */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-10 space-y-2">
            <h2 className="text-3xl font-bold">Services</h2>
            <p className="text-muted-foreground">
              Reliable exterior cleaning for homeowners and small businesses.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
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
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-10 space-y-2">
            <h2 className="text-3xl font-bold">What Customers Say</h2>
            <p className="text-muted-foreground">
              Simple, professional service that gets results.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {site.reviews.map((r) => (
              <Card key={r.name} className="rounded-3xl">
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">“{r.text}”</div>
                  <div className="mt-4 font-medium">{r.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="rounded-3xl border bg-background p-10">
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-3xl font-bold">
                  Get a Fast Quote in Minutes
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Tell us what you need cleaned and we’ll respond quickly with pricing
                  and next available times.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Button size="lg" asChild>
                  <Link href="/contact">{site.primaryCta}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}>
                    {site.phone}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

       </main>
</SiteShell>
    </main>
  );
}
