import { getMostRatedBrokers } from "@/lib/data-service";
import { BrokerShowcase } from "./broker-showcase";

async function MostRatedBrokers() {
  const brokers = await getMostRatedBrokers();
  return (
    <BrokerShowcase
      title="Most Rated Brokers"
      brokers={brokers}
      viewAllLink="/brokers?sort=newest"
    />
  );
}

export default MostRatedBrokers;

