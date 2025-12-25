"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { SiteShell } from "@/components/site/SiteShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ContactClient() {
  const redirectUrl = (site as any)?.forms?.redirectUrl ?? "/thanks";

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const form = e.currentTarget;

      const gotchaDomValue = (
        form.querySelector('input[name="_gotcha"]') as HTMLInputElement
      )?.value;

      if (gotchaDomValue) {
        window.location.href = redirectUrl;
        return;
      }

      const formData = new FormData(form);

      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();
      const gotcha = String(formData.get("_gotcha") || "").trim();

      if (!name || !phone || !email || !message) {
        setError("Please fill out all fields.");
        setSubmitting(false);
        return;
      }

      if (!isValidEmail(email)) {
        setError("Please enter a valid email address.");
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          message,
          _gotcha: gotcha,
          subject: `New Quote Request — ${site.businessName}`,
          businessName: site.businessName,
        }),
      });

      if (res.ok) {
        window.location.href = redirectUrl;
        return;
      }

      let data: any = null;
      try {
        data = await res.json();
      } catch {}

      setError(
        data?.error ||
          "Something went wrong. Please call or email us instead."
      );
    } catch {
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
                  href={`tel:${String(site.phone).replace(/[^0-9]/g, "")}`}
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
                <a href={`tel:${String(site.phone).replace(/[^0-9]/g, "")}`}>
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
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                  />
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
                  <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
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
