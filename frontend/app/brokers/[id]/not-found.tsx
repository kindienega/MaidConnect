import { NotFound } from "@/components/ui/not-found";

export default function BrokerNotFound() {
  return (
    <NotFound
      title="Oops! No broker found"
      message="We couldn't find a broker with that ID. They might have been removed or the ID might be incorrect."
      showBackButton={true}
      showHomeButton={true}
    />
  );
}
