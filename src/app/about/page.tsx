import type { Metadata } from "next";
import { site } from "@/lib/site";
import { SiteShell } from "@/components/site/SiteShell";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${site.businessName} — local, licensed & insured exterior cleaning in ${site.city}.`,
};

export default function AboutPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">About</h1>
          <p className="text-lg text-muted-foreground">{site.about.headline}</p>
        </div>

        <Card className="mt-10 rounded-3xl">
          <CardContent className="space-y-4 pt-6 text-muted-foreground">
            <p>{site.about.body}</p>
            <p>
              Service areas:{" "}
              <span className="font-medium text-foreground">
                {site.serviceAreas.join(", ")}
              </span>
            </p>
          </CardContent>
        </Card>
      </main>
    </SiteShell>
  );
}
