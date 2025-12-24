import site from "@/content/site.json";
import { SiteShell } from "@/components/site/SiteShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
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
              <form
                action="https://formspree.io/f/xwvejjjd"
                method="POST"
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input name="name" placeholder="Your name" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input name="phone" placeholder="(555) 123-4567" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    What needs cleaning?
                  </label>
                  <Textarea
                    name="message"
                    placeholder="Example: driveway cleaning + house wash. Address: ..."
                    rows={5}
                    required
                  />
                </div>

                {/* Honeypot field (spam trap) */}
                <div className="hidden" aria-hidden="true">
                  <label className="sr-only">
                    Don’t fill this out if you’re human:
                    <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                {/* Redirect after submission */}
                <input type="hidden" name="_redirect" value="http://localhost:3000/thanks" />

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
