import type { Metadata } from "next";
import { site } from "@/lib/site";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description: `Request a free quote from ${site.businessName}. Fast response and easy scheduling in ${site.city}.`,
};

export default function ContactPage() {
  return <ContactClient />;
}
