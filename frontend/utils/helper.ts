export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
  }).format(price);
}

export function getStatusColor(status: string) {
  switch (status) {
    case "Active":
      return "bg-green-500";
    case "Rented":
      return "bg-blue-500";
    case "Sold":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

export function getListingTypeColor(type: string) {
  switch (type) {
    case "sale":
      return "bg-purple-500";
    case "rent":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
}
