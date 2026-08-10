import { getStallionNavItems } from "@/lib/data/stallions";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const stallions = await getStallionNavItems().catch(() => []);
  return <HeaderClient stallions={stallions} />;
}
