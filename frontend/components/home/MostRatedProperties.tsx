import { getMostRatedProperties } from "@/lib/data-service";
import { PropertyShowcase } from "./property-showcase";

async function MostRatedProperties() {
  const properties = await getMostRatedProperties();

  return (
    <PropertyShowcase
      title="Most Rated Listings"
      properties={properties}
      viewAllLink="/properties?sort=rating"
    />
  );
}

export default MostRatedProperties;
