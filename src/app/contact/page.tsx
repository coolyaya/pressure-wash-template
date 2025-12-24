"use client";

import { useState } from "react";
import site from "@/content/site.json";
import { SiteShell } from "@/components/site/SiteShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const formAction =
    (site as any)?.forms?.quoteFormAction ?? "https://formspree.io/f/xwvejjjd";

  const redirectUrl =
    (site as any)?.forms?.redirectUrl ??
    "https://pressure-wash-template.vercel.app/thanks";

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const form = e.currentTarget;

      // Basic honeypot check (extra protection)
      const gotcha = (form.querySelector('input[name="_gotcha"]') as HTMLInputElement)
        ?.value;
      if (gotcha) {
        // silently succeed to waste bot time
        window.location.href = redirectUrl;
        return;
      }

      const formData = new FormData(form);

      const res = await fetch(formAction, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (res.ok) {
        // ✅ GUARANTEED redirect
        window.location.href = redirectUrl;
        return;
      }

      // If not ok, try to parse response for debugging
      let data: any = null;
      try {
        data = await res.json();
      } catch {}

      setError(
        data?.errors?.[0]?.message ||
          "Something went wrong. Please call or email us instead."
      );
    } catch (err) {
      setError("Network error. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  }

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
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ✅ Helps deliverability and inbox organization */}
                <input
                  type="hidden"
                  name="_subject"
                  value={`New Quote Request — ${site.businessName}`}
                />

                {/* ✅ Formspree still receives this; we just don’t rely on it */}
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

                {error && (
                  <p className="text-sm text-red-600">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Submitting..." : "Get My Quote"}
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
