import { getNewestBrokers } from "@/lib/data-service";
import { BrokerShowcase } from "./broker-showcase";

async function NewestBrokers() {
  const brokers = await getNewestBrokers();
  return (
    <BrokerShowcase
      title="New Brokers"
      brokers={brokers}
      viewAllLink="/brokers?sort=newest"
    />
  );
}

export default NewestBrokers;

