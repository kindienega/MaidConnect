import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

// Helper function to parse nested FormData
function parseFormData(formData: FormData) {
  const result: any = {};

  const entries = Array.from(formData.entries());
  for (const [key, value] of entries) {
    if (value instanceof File) {
      // Handle files
      if (!result.images) result.images = [];
      result.images.push(value);
    } else {
      // Handle nested fields like "location[region]"
      if (key.includes("[") && key.includes("]")) {
        const match = key.match(/^(\w+)\[(\w+)\]$/);
        if (match) {
          const [, parentKey, childKey] = match;
          if (!result[parentKey]) result[parentKey] = {};
          result[parentKey][childKey] = value;
        }
      } else {
        // Handle regular fields
        result[key] = value;
      }
    }
  }

  return result;
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type");
    let body;
    let isFormData = false;

    if (contentType && contentType.includes("multipart/form-data")) {
      // Handle FormData for file uploads
      const formData = await request.formData();
      body = parseFormData(formData);
      isFormData = true;
    } else {
      // Handle JSON data
      body = await request.json();
    }

    // Get token from cookies
    const cookieStore = cookies();
    let token = cookieStore.get("jwt")?.value;

    // If not in cookies, try to get from Authorization header (Telegram users)
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "");
      }
    }

    // Prepare headers for the backend request
    const headers: HeadersInit = {};

    // Add Authorization header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let response;
    if (isFormData) {
      // Create new FormData for backend with proper structure
      const backendFormData = new FormData();

      // Add basic fields
      backendFormData.append("title", body.title);
      backendFormData.append("description", body.description);
      backendFormData.append("price", body.price);
      backendFormData.append("pricePerSquareMeter", body.pricePerSquareMeter);
      backendFormData.append("type", body.type);
      backendFormData.append("status", body.status);
      backendFormData.append("listingType", body.listingType);

      // Add location object
      if (body.location) {
        backendFormData.append("location[region]", body.location.region);
        backendFormData.append("location[city]", body.location.city);
        backendFormData.append("location[subCity]", body.location.subCity);
        backendFormData.append(
          "location[neighborhood]",
          body.location.neighborhood
        );
      }

      // Add features object
      if (body.features) {
        backendFormData.append("features[bedrooms]", body.features.bedrooms);
        backendFormData.append("features[bathrooms]", body.features.bathrooms);
        backendFormData.append("features[area]", body.features.area);
        backendFormData.append("features[parking]", body.features.parking);
      }

      // Add images
      if (body.images && Array.isArray(body.images)) {
        body.images.forEach((image: File) => {
          backendFormData.append("images", image);
        });
      }

      response = await fetch(`${BACKEND_URL}/properties`, {
        method: "POST",
        headers,
        body: backendFormData,
      });
    } else {
      // Send JSON data
      headers["Content-Type"] = "application/json";
      response = await fetch(`${BACKEND_URL}/properties`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
    }

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || "Failed to create property");
    }

    const result = await response.json();
    const createdProperty = result.data.document;
    console.log("Created property:", createdProperty);

    // Revalidate the properties page to fetch new data
    revalidatePath("/properties");
    revalidatePath("/");

    return Response.json(
      {
        success: true,
        property: createdProperty,
        message: "Property created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Failed to create property",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
