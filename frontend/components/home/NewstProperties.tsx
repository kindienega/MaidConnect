import { getNewestProperites } from "@/lib/data-service";
import { PropertyShowcase } from "./property-showcase";
import { wait } from "@/utils/helper";

async function NewstProperties() {
  const properites = await getNewestProperites();

  return (
    <PropertyShowcase
      title="New Real Estates"
      properties={properites}
      viewAllLink="/properties?sort=newest"
    />
  );
}

export default NewstProperties;

