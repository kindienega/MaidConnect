"use client";
import { useState } from "react";
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
];

const propertyPurposes = [
  { value: "buy", label: "To Buy" },
  { value: "rent", label: "To Rent" },
  { value: "both", label: "For Both" },
];

export default function RequestPropertyPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    propertyType: "apartment",
    propertyPurpose: "rent",
    budgetMin: "",
    budgetMax: "",
    area: "",
    location: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Redirect to login if not authenticated
  // if (isAuthenticated === false) {
  //   router.replace("/login");
  //   return null;
  // }

  // if (isAuthenticated === undefined) {
  //   return null; // Loading state
  // }

  const formatNumber = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, "");
    // Add commas for thousands separator
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Apply number formatting for budget fields
    if (name === "budgetMin" || name === "budgetMax") {
      const formattedValue = formatNumber(value);
      setForm((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Validate budget range
    if (form.budgetMin && form.budgetMax) {
      const minBudget = parseInt(form.budgetMin.replace(/,/g, ""));
      const maxBudget = parseInt(form.budgetMax.replace(/,/g, ""));

      if (minBudget >= maxBudget) {
        toast.error("Minimum budget must be less than maximum budget");
        setSubmitting(false);
        return;
      }
    }

    try {
      const response = await axiosInstance.post("/api/request-property", form);

      if (response.data.success) {
        toast.success(
          "Your property request has been submitted successfully! We'll contact you soon."
        );
        setForm({
          name: "",
          email: "",
          phone: "",
          propertyType: "apartment",
          propertyPurpose: "rent",
          budgetMin: "",
          budgetMax: "",
          area: "",
          location: "",
          description: "",
        });
      }
    } catch (error) {
      console.error("Error submitting property request:", error);
      toast.error("Failed to submit property request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="max-w-4xl w-full">
        <Card className="w-full shadow-xl border-2 border-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary mb-2">
              Request Property
            </CardTitle>
            <p className="text-muted-foreground">
              Tell us what you're looking for and we'll help you find it.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleInput}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleInput}
                    required
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleInput}
                    required
                    placeholder="+251911234567"
                  />
                </div>
                <div>
                  <Label>Property Type *</Label>
                  <Select
                    value={form.propertyType}
                    onValueChange={(v) => handleSelect("propertyType", v)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
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
                  <Label>Property Purpose *</Label>
                  <Select
                    value={form.propertyPurpose}
                    onValueChange={(v) => handleSelect("propertyPurpose", v)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyPurposes.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-base font-medium">
                    Budget Range (ETB)
                  </Label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-muted-foreground">
                        Min
                      </Label>
                      <Input
                        name="budgetMin"
                        type="text"
                        value={form.budgetMin}
                        onChange={handleInput}
                        placeholder="500,000"
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-muted-foreground">
                        Max
                      </Label>
                      <Input
                        name="budgetMax"
                        type="text"
                        value={form.budgetMax}
                        onChange={handleInput}
                        placeholder="1,000,000"
                        className="w-32"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Preferred Area (sqm)</Label>
                  <Input
                    name="area"
                    type="number"
                    value={form.area}
                    onChange={handleInput}
                    placeholder="120"
                    min="0"
                  />
                </div>
                <div>
                  <Label>Preferred Location</Label>
                  <Input
                    name="location"
                    value={form.location}
                    onChange={handleInput}
                    placeholder="Bole, Gerji, etc."
                  />
                </div>
              </div>
              <div>
                <Label>Detailed Requirements</Label>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleInput}
                  required
                  placeholder="Describe what you're looking for in detail. Include preferences for bedrooms, bathrooms, amenities, etc."
                  rows={4}
                />
              </div>
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Property Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

