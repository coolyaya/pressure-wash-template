import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export function HomeB() {
  return (
    <main>
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm text-muted-foreground">
              {site.city} • Licensed & Insured • Free Quotes
            </div>

            <h1 className="text-5xl font-black tracking-tight md:text-6xl">
              {site.hero.headline}
            </h1>

            <p className="text-lg text-muted-foreground">
              {site.hero.subheadline}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/contact">{site.primaryCta}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}>
                  Call {site.phone}
                </a>
              </Button>
            </div>
          </div>

          <div className="relative aspect-4/3 overflow-hidden rounded-3xl border bg-muted">
            <Image
              src={site.assets.heroImage}
              alt={`${site.businessName} pressure washing`}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* CALL STRIP */}
      <section className="border-y bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <div className="text-lg font-semibold">
            Same-week availability in {site.city}
          </div>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">{site.primaryCta}</Link>
          </Button>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">What We Clean</h2>
        <p className="mt-2 text-muted-foreground">
          Everything needed to keep your property looking its best.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {site.services.map((s) => (
            <Card key={s.title} className="rounded-3xl">
              <CardHeader>
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {s.desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* REVIEWS + CTA (same as A or simplified) */}
    </main>
  );
}
