import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function HomeC() {
  const topReview = site.reviews[0];

  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-8">
            <div className="text-sm text-muted-foreground">
              {site.businessName} • {site.city}
            </div>

            <h1 className="text-5xl font-bold tracking-tight">
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

            {topReview ? (
              <div className="rounded-3xl border bg-muted/30 p-6">
                <div className="text-sm text-muted-foreground">
                  “{topReview.text}”
                </div>
                <div className="mt-3 font-medium">{topReview.name}</div>
              </div>
            ) : null}
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
    </main>
  );
}
