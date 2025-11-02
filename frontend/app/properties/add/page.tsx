"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { usePropertiesStore } from "@/store/properties";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const propertyTypes = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "commercial", label: "Commercial" },
  { value: "office", label: "Office" },
]; // Updated with Office option

const listingTypes = [
  { value: "rent", label: "For Rent" },
  { value: "sale", label: "For Sale" },
];

export default function AddPropertyPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [images, setImages] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    pricePerSquareMeter: "",
    region: "",
    city: "",
    subCity: "",
    landMark: "",
    type: "apartment",
    listingType: "sale",
    status: "Active",
    bedrooms: "",
    bathrooms: "",
    area: "",
    parking: false,
  });
  const [submitting, setSubmitting] = useState(false);

  console.log(user);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === undefined) {
    return null; // or a loader
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const input = e.target as HTMLInputElement;
      setForm((prev) => ({
        ...prev,
        [name]: input.checked,
      }));
    } else if (name === "price" || name === "pricePerSquareMeter") {
      // Format price with commas - only allow numeric input
      const numericValue = value.replace(/,/g, "");
      if (numericValue === "" || /^\d+$/.test(numericValue)) {
        const formattedValue =
          numericValue === "" ? "" : parseInt(numericValue).toLocaleString();
        setForm((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
      }
      // If input contains non-numeric characters (except commas), ignore the change
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelect = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const newImages = [...images];
      newImages[index] = e.target.files[0];
      setImages(newImages);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create FormData for multipart upload
      const formData = new FormData();

      // Add property data with proper structure
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price.replace(/,/g, "")); // Remove commas for API
      formData.append(
        "pricePerSquareMeter",
        form.pricePerSquareMeter.replace(/,/g, "")
      ); // Remove commas for API
      // Also try alternative naming for compatibility
      formData.append(
        "price_per_square_meter",
        form.pricePerSquareMeter.replace(/,/g, "")
      );
      formData.append("type", form.type);
      formData.append("status", form.status); // Always send as 'Active'
      formData.append("listingType", form.listingType);

      // Add location fields individually
      formData.append("location[region]", form.region);
      formData.append("location[city]", form.city);
      formData.append("location[subCity]", form.subCity);
      formData.append("location[neighborhood]", form.landMark);

      // Add features fields individually
      formData.append("features[bedrooms]", form.bedrooms);
      formData.append("features[bathrooms]", form.bathrooms);
      formData.append("features[area]", form.area);
      formData.append("features[parking]", form.parking.toString());

      // Add images (filter out null values)
      const validImages = images.filter(
        (image): image is File => image !== null
      );
      if (validImages.length > 0) {
        validImages.forEach((image) => {
          formData.append("images", image);
        });
      }

      // Debug: Log FormData contents
      console.log("FormData contents:");
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      // Validate required fields before submission
      if (!form.pricePerSquareMeter || form.pricePerSquareMeter.trim() === "") {
        toast.error("Price per square meter is required");
        setSubmitting(false);
        return;
      }

      // Use the createProperty function from the store with FormData
      const { createProperty } = usePropertiesStore.getState();
      console.log(formData.get("pricePerSquareMeter"), "from the page");
      const createdProperty = await createProperty(formData);

      // Show success message
      toast.success("Property created successfully!");

      // Navigate to the property detail page using the returned property ID
      router.push(
        `/property/${createdProperty.id || (createdProperty as any)._id}`
      );
    } catch (error: any) {
      console.error("Error creating property:", error);
      toast.error(
        error.message || "Failed to create property. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="max-w-4xl w-full">
        {/* Upgrade Message for Users trying to access Add Property */}
        {user && user.role === "User" && (
          <Card className="w-full shadow-xl border-2 border-primary/10 mb-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary mb-2">
                Upgrade Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Please upgrade to broker to post properties.
              </p>
              <Button onClick={() => router.push("/profile")}>
                Go to Profile
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add Property Form */}
        {user &&
          (user.role === "Admin" ||
            user.role === "Broker" ||
            user.role === "SuperAdmin") && (
            <Card className="w-full shadow-xl border-2 border-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary mb-2">
                  Add New Property
                </CardTitle>
                <p className="text-muted-foreground">
                  Fill in the details below to list a new property.
                </p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        name="title"
                        value={form.title}
                        onChange={handleInput}
                        required
                        placeholder="Modern Apartment"
                      />
                    </div>
                    <div>
                      <Label>Price (ETB)</Label>
                      <Input
                        name="price"
                        value={form.price}
                        onChange={handleInput}
                        required
                        type="text"
                        placeholder="750,000"
                      />
                    </div>
                    <div>
                      <Label>Price per Square Meter (ETB)</Label>
                      <Input
                        name="pricePerSquareMeter"
                        value={form.pricePerSquareMeter}
                        onChange={handleInput}
                        required
                        type="text"
                        placeholder="6,250"
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={form.type}
                        onValueChange={(v) => handleSelect("type", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Listing Type</Label>
                      <Select
                        value={form.listingType}
                        onValueChange={(v) => handleSelect("listingType", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select listing type" />
                        </SelectTrigger>
                        <SelectContent>
                          {listingTypes.map((l) => (
                            <SelectItem key={l.value} value={l.value}>
                              {l.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      {!(
                        form.type === "commercial" || form.type === "office"
                      ) && (
                        <>
                          <div>
                            <Label>Bedrooms (Optional)</Label>
                            <Input
                              name="bedrooms"
                              value={form.bedrooms}
                              onChange={handleInput}
                              type="number"
                              min={0}
                              placeholder="3"
                            />
                          </div>
                          <div>
                            <Label>Bathrooms (Optional)</Label>
                            <Input
                              name="bathrooms"
                              value={form.bathrooms}
                              onChange={handleInput}
                              type="number"
                              min={0}
                              placeholder="2"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div>
                      <Label>Area (sqm)</Label>
                      <Input
                        name="area"
                        value={form.area}
                        onChange={handleInput}
                        type="number"
                        min={0}
                        placeholder="120"
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-6">
                      <input
                        id="parking"
                        name="parking"
                        type="checkbox"
                        checked={form.parking}
                        onChange={handleInput}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="parking">Parking Available</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Region</Label>
                      <Input
                        name="region"
                        value={form.region}
                        onChange={handleInput}
                        required
                        placeholder="Addis Ababa"
                      />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input
                        name="city"
                        value={form.city}
                        onChange={handleInput}
                        required
                        placeholder="Addis Ababa"
                      />
                    </div>
                    <div>
                      <Label>Sub City</Label>
                      <Input
                        name="subCity"
                        value={form.subCity}
                        onChange={handleInput}
                        required
                        placeholder="Bole"
                      />
                    </div>
                    <div>
                      <Label>Land Mark</Label>
                      <Input
                        name="landMark"
                        value={form.landMark}
                        onChange={handleInput}
                        required
                        placeholder="Gerji"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      name="description"
                      value={form.description}
                      onChange={handleInput}
                      required
                      placeholder="A beautifully designed apartment located in the heart of the city with stunning views."
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label>Property Images (up to 5)</Label>
                      <span className="text-sm text-gray-500">
                        {images.filter((img) => img !== null).length}/5 selected
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          {image ? (
                            <div className="relative group">
                              <img
                                src={URL.createObjectURL(image as File)}
                                alt={`Property image ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors">
                              <div className="text-gray-400 text-2xl mb-2">
                                +
                              </div>
                              <div className="text-gray-500 text-sm">
                                Add Image
                              </div>
                              <div className="text-gray-400 text-xs mt-1">
                                Slot {index + 1}
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                  if (
                                    e.target.files &&
                                    e.target.files.length > 0
                                  ) {
                                    const newImages = [...images];
                                    const files = Array.from(e.target.files);

                                    // Find the next available slots starting from the current index
                                    let currentIndex = index;
                                    let fileIndex = 0;

                                    while (
                                      fileIndex < files.length &&
                                      currentIndex < 5
                                    ) {
                                      if (newImages[currentIndex] === null) {
                                        newImages[currentIndex] =
                                          files[fileIndex];
                                        fileIndex++;
                                      }
                                      currentIndex++;
                                    }

                                    setImages(newImages);
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Click on empty slots to add images. You can select
                      multiple images at once - they will fill the next
                      available slots. Maximum 5 images allowed.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={submitting}
                  >
                    {submitting ? "Posting..." : "Post Property"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}

