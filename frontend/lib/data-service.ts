// import { properties } from "@/data/data";
import { Property, User } from "@/types";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export async function getNewestProperites(): Promise<Property[]> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/properties/approved-properties?sort=-createdAt&page=1&limit=5`,
      {
        next: { revalidate: 300 },
      }
    );
    if (!response.ok) {
      const result = await response.json();
      // console.log(result);
      throw new Error(
        result.message ? result.message : "Something went wrong!"
      );
    }
    const result = await response.json();
    const newProperties = result.data.documents;
    return newProperties;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getMostRatedProperties(): Promise<Property[]> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/properties/approved-properties?sort=-rating&page=1&limit=5`,
      {
        next: { revalidate: 300 },
      }
    );
    if (!response.ok) {
      const result = await response.json();
      // console.log(result);
      throw new Error(
        result.message ? result.message : "Something went wrong!"
      );
    }
    const result = await response.json();
    const mostRatedProperties = result.data.documents;
    return mostRatedProperties;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getMostViewedProperties(): Promise<Property[]> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/properties/approved-properties?sort=-views&page=1&limit=5`,
      {
        next: { revalidate: 300 },
      }
    );
    if (!response.ok) {
      const result = await response.json();
      // console.log(result);
      throw new Error(
        result.message ? result.message : "Something went wrong!"
      );
    }
    const result = await response.json();
    const mostViewedProperties = result.data.documents;
    return mostViewedProperties;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getMostRatedBrokers(): Promise<User[] | []> {
  try {
    const response = await fetch(`${BACKEND_URL}/users/most-rated-brokers`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) {
      const result = await response.json();
      // console.log(result);
      throw new Error(
        result.message ? result.message : "Something went wrong!"
      );
    }
    const result = await response.json();
    const mostRatedBrokers = result.data.documents;
    return mostRatedBrokers;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getNewestBrokers(): Promise<User[] | []> {
  try {
    const response = await fetch(`${BACKEND_URL}/users/newest-brokers`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) {
      const result = await response.json();
      // console.log(result);
      throw new Error(
        result.message ? result.message : "Something went wrong!"
      );
    }
    const result = await response.json();
    const newestBrokers = result.data.documents;
    return newestBrokers;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getBrokers(): Promise<User[] | []> {
  try {
    const response = await fetch(`${BACKEND_URL}/users/brokers`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) {
      const result = await response.json();
      // console.log(result);
      throw new Error(
        result.message ? result.message : "Something went wrong!"
      );
    }
    const result = await response.json();
    const brokers = result.data.documents;
    return brokers;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getBrokerById(id: string): Promise<User | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/users/${id}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      const result = await response.json();
      // console.log(result);
      throw new Error(
        result.message ? result.message : "Something went wrong!"
      );
    }
    const result = await response.json();
    const broker = result.data.document;
    return broker;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// export async function getPropertiesByBroker(
//   brokerId: string
// ): Promise<Property[]> {
//   const brokerProperties = properties.filter((p) => p.owner.id === brokerId);
//   return brokerProperties;
// }

// export async function getProperties(): Promise<Property[]> {
//   try {
//     const response = await fetch(`${BACKEND_URL}/properties`, {
//       next: { revalidate: 300 },
//     });
//     if (!response.ok) {
//       throw new Error("Failed to fetch properties");
//     }
//     const result = await response.json();
//     return result.data.documents;
//   } catch (error) {
//     console.log(error);
//     return [];
//   }
// }

export async function getApprovedProperties(): Promise<Property[]> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/properties/approved-properties`,
      {
        next: { revalidate: 300 },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }
    const result = await response.json();
    console.log(result);
    return result.data.documents;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getApprovedBrokers(): Promise<User[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/users/approved-brokers`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch Brokers");
    }
    const result = await response.json();
    console.log(result);
    return result.data.documents;
  } catch (error) {
    console.log(error);
    return [];
  }
}

