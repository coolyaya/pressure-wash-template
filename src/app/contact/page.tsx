import rawSite from "@/content/site.json";
import { SiteShell } from "@/components/site/SiteShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ✅ Extend inferred JSON type to include forms (optional)
const site = rawSite as typeof rawSite & {
  forms?: {
    quoteFormAction?: string;
    redirectUrl?: string;
  };
};

export default function ContactPage() {
  const formAction = site.forms?.quoteFormAction ?? "https://formspree.io/f/xwvejjjd";
  const redirectUrl =
    site.forms?.redirectUrl ?? "https://pressure-wash-template.vercel.app/thanks";

  return (
    <SiteShell>
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
          <p className="text-lg text-muted-foreground">
            Get a fast quote — we respond quickly.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Call or Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <div>
                <div className="text-sm">Phone</div>
                <a
                  className="font-medium text-foreground hover:underline"
                  href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}
                >
                  {site.phone}
                </a>
              </div>

              <div>
                <div className="text-sm">Email</div>
                <a
                  className="font-medium text-foreground hover:underline"
                  href={`mailto:${site.email}`}
                >
                  {site.email}
                </a>
              </div>

              <Button asChild className="mt-2">
                <a href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}>
                  Call Now
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Request a Quote</CardTitle>
            </CardHeader>

            <CardContent>
              <form action={formAction} method="POST" className="space-y-4">
                {/* ✅ Subject improves deliverability */}
                <input
                  type="hidden"
                  name="_subject"
                  value={`New Quote Request — ${site.businessName}`}
                />

                {/* ✅ Redirect reliability: include both */}
                <input type="hidden" name="_redirect" value={redirectUrl} />
                <input type="hidden" name="_next" value={redirectUrl} />

                {/* ✅ Honeypot */}
                <input
                  type="text"
                  name="_gotcha"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* ✅ Metadata */}
                <input type="hidden" name="source" value="website-contact-page" />
                <input type="hidden" name="site" value={site.businessName} />

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="name">
                    Name
                  </label>
                  <Input id="name" name="name" placeholder="Your name" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="phone">
                    Phone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(555) 123-4567"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="message">
                    What needs cleaning?
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Example: driveway cleaning + house wash. Address: ..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Get My Quote
                </Button>
              </form>

              <p className="mt-4 text-xs text-muted-foreground">
                By submitting this form you agree to be contacted by{" "}
                {site.businessName}.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </SiteShell>
  );
}
