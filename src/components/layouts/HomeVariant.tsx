import { site } from "@/lib/site";
import { HomeA } from "@/components/layouts/HomeA";
import { HomeB } from "@/components/layouts/HomeB";
import { HomeC } from "@/components/layouts/HomeC";

export function HomeVariant() {
  switch (site.layout) {
    case "B":
      return <HomeB />;
    case "C":
      return <HomeC />;
    case "A":
    default:
      return <HomeA />;
  }
}
