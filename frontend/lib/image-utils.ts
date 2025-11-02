/**
 * Constructs the full URL for property images
 * @param imagePath - The relative image path from the API
 * @returns The full URL for the image
 */
export const getPropertyImageUrl = (imagePath: string): string => {
  if (!imagePath) return "/placeholder-property.jpg";

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Construct full URL using backend URL
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3334/api/v1";
  const baseUrl = backendUrl.replace("/api/v1", "").replace(/\/+$/, "");
  const fullUrl = `${baseUrl}/images/properties/${imagePath}`;

  // Validate the URL before returning
  try {
    new URL(fullUrl);
    return fullUrl;
  } catch (error) {
    console.error("Invalid URL constructed:", fullUrl, error);
    return "/placeholder-property.jpg";
  }
};
