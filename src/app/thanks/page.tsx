import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ThanksPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Request Received</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Thanks! We’ll reach out shortly with your quote and next available
          times.
        </p>

        <div className="mt-10">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </main>
    </SiteShell>
  );
}
