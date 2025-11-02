import { getMostViewedProperties } from "@/lib/data-service";
import { PropertyShowcase } from "./property-showcase";

async function MostViewedProperties() {
  const properties = await getMostViewedProperties();

  return (
    <PropertyShowcase
      title="Most Viewed Listings"
      properties={properties}
      viewAllLink="/properties?sort=views"
    />
  );
}

export default MostViewedProperties;

