"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Save,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/auth";
import { useTelegramStore } from "@/store/telegram";
import { getPropertyImageUrl } from "@/lib/image-utils";

import { useOwnProperties } from "@/hooks/useOwnProperties";
import {
  useUpdateOwnPropertyStatus,
  useUpdateOwnProperty,
  useDeleteOwnProperty,
} from "@/hooks/useOwnPropertyActions";
import { Property } from "@/types";
import PropertyDetailModal from "./PropertyDetailModal";

// Using the Property type from @/types

export function ManageTab() {
  const { user } = useAuthStore();
  const { showBottomNav } = useTelegramStore();
  const router = useRouter();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "apartment" as "apartment" | "house" | "commercial" | "office",
    listingType: "sale" as "sale" | "rent",
    status: "Active" as "Active" | "Rented" | "Sold",
    bedrooms: "",
    bathrooms: "",
    area: "",
    region: "",
    city: "",
    subCity: "",
    neighborhood: "",
  });

  // Fetch own properties using the hook
  const { properties, isLoading, error } = useOwnProperties(
    { page, limit },
    user?.id || ""
  );

  // Property status update mutation
  const updatePropertyStatus = useUpdateOwnPropertyStatus();

  // Property update mutation
  const updateProperty = useUpdateOwnProperty();

  // Property delete mutation
  const deleteProperty = useDeleteOwnProperty();

  // Update selectedProperty when properties data changes (e.g., after status update)
  useEffect(() => {
    if (selectedProperty && properties) {
      const updatedProperty = properties.find(
        (p) => p.id === selectedProperty.id
      );
      if (updatedProperty) {
        setSelectedProperty(updatedProperty);
        // Also update the edit form to reflect the new status
        setEditForm((prev) => ({
          ...prev,
          status: updatedProperty.status,
        }));
      }
    }
  }, [properties, selectedProperty]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isViewModalOpen || isEditModalOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.classList.add("modal-open");
      // Restore scroll position
      document.body.style.top = `-${scrollY}px`;
    } else {
      // Restore scroll position when modal closes
      const scrollY = document.body.style.top;
      document.body.classList.remove("modal-open");
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      const scrollY = document.body.style.top;
      document.body.classList.remove("modal-open");
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    };
  }, [isViewModalOpen, isEditModalOpen]);

  // Properties are now fetched from the useOwnProperties hook

  const handleView = (property: Property) => {
    setSelectedProperty(property);
    setIsViewModalOpen(true);
  };

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    // Initialize edit form with current property data
    setEditForm({
      title: property.title,
      description: property.description,
      price: property.price.toString(),
      type: property.type,
      listingType: property.listingType,
      status: property.status,
      bedrooms: property.features.bedrooms?.toString() || "",
      bathrooms: property.features.bathrooms?.toString() || "",
      area: property.features.area.toString(),
      region: property.location.region,
      city: property.location.city,
      subCity: property.location.subCity,
      neighborhood: property.location.neighborhood,
    });
    setIsEditModalOpen(true);
    setIsEditing(false);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedProperty(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProperty(null);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedProperty) return;

    console.log("Current editForm state:", editForm);

    try {
      // Prepare the update data from the form
      const updateData = {
        ...selectedProperty,
        title: editForm.title,
        description: editForm.description,
        price: parseFloat(editForm.price),
        type: editForm.type as "apartment" | "house" | "commercial" | "office",
        listingType: editForm.listingType as "sale" | "rent",
        status: editForm.status as "Active" | "Rented" | "Sold",
        features: {
          ...selectedProperty.features,
          bedrooms: editForm.bedrooms ? parseInt(editForm.bedrooms) : undefined,
          bathrooms: editForm.bathrooms
            ? parseInt(editForm.bathrooms)
            : undefined,
          area: parseFloat(editForm.area),
        },
        location: {
          ...selectedProperty.location,
          region: editForm.region,
          city: editForm.city,
          subCity: editForm.subCity,
          neighborhood: editForm.neighborhood,
        },
      };

      console.log("Sending update data:", updateData);

      // Call the update mutation
      await updateProperty.mutateAsync({
        propertyId: selectedProperty.id,
        data: updateData,
      });

      // Exit editing mode
      setIsEditing(false);

      // The useOwnProperties hook will automatically refetch and update the UI
    } catch (error) {
      // Error is handled by the mutation hook (toast will be shown)
      console.error("Failed to update property:", error);
    }
  };

  const handleActivateProperty = async () => {
    if (!selectedProperty) return;

    try {
      await updatePropertyStatus.mutateAsync(selectedProperty.id);
      // Modal stays open - user can see the updated status
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Failed to activate property:", error);
    }
  };

  const handleMarkAsRentedOrSold = async () => {
    if (!selectedProperty) return;

    try {
      await updatePropertyStatus.mutateAsync(selectedProperty.id);
      // Modal stays open - user can see the updated status
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Failed to mark property as rented/sold:", error);
    }
  };

  const handleListingTypeChange = (newListingType: "sale" | "rent") => {
    setEditForm((prev) => ({
      ...prev,
      listingType: newListingType,
      status: "Active", // Always set status to Active when listing type changes
    }));
  };

  const handleDelete = async (property: Property) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${property.title}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteProperty.mutateAsync(property.id);
        // The useOwnProperties hook will automatically refetch and update the UI
      } catch (error) {
        // Error is handled by the mutation hook (toast will be shown)
        console.error("Failed to delete property:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Property Management Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Property Management</CardTitle>
              <CardDescription>
                Manage your property listings and deals
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/properties/add")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search properties..." className="pl-10" />
            </div>
          </div>

          {/* Properties List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading properties...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <Building2 className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-red-600">
                  Error Loading Properties
                </h3>
                <p className="text-muted-foreground mb-4">
                  {error.message ||
                    "Failed to load properties. Please try again."}
                </p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : properties && properties.length > 0 ? (
              properties.map((property) => (
                <Card key={property.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {property.title}
                          </h3>
                          <Badge
                            variant={
                              property.status === "Active"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {property.status}
                          </Badge>
                          <Badge
                            className={
                              property.moderationStatus === "approved"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : property.moderationStatus === "pending"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : property.moderationStatus === "rejected"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                            }
                          >
                            {property.moderationStatus || "pending"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Type:</span>{" "}
                            {property.type}
                          </div>
                          <div>
                            <span className="font-medium">Price:</span> $
                            {property.price.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span>{" "}
                            {property.location.neighborhood},{" "}
                            {property.location.subCity}
                          </div>
                          <div>
                            <span className="font-medium">Area:</span>{" "}
                            {property.features.area} sqm
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span>
                            {property.features.bedrooms || 0} bedrooms
                          </span>
                          <span>
                            {property.features.bathrooms || 0} bathrooms
                          </span>
                          <span>
                            Listed:{" "}
                            {new Date(property.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-2 mt-4 lg:mt-0 lg:ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(property)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(property)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(property)}
                          disabled={deleteProperty.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : null}
          </div>

          {(!properties || properties.length === 0) && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Properties Listed
              </h3>
              <p className="text-muted-foreground mb-4">
                You haven't added any properties yet. Start by adding your first
                listing.
              </p>
              <Button onClick={() => router.push("/properties/add")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Property
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties?.length || 0}</div>
            <p className="text-xs text-muted-foreground">All your listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties?.filter((p) => p.status === "Active").length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties?.filter((p) => p.moderationStatus === "pending")
                .length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ETB{" "}
              {properties
                ? properties
                    .reduce((sum, p) => sum + p.price, 0)
                    .toLocaleString()
                : "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined listing value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        onEdit={handleEdit}
        showActions={true}
      />

      {/* Edit Property Modal */}
      {isEditModalOpen && selectedProperty && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ margin: 0, padding: 0 }}
        >
          <div
            className={`bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden ${
              showBottomNav ? "mb-20" : ""
            }`}
          >
            {/* Fixed Header */}
            <div className="flex items-center justify-between p-6 border-b bg-white sticky top-0 z-10">
              <h2 className="text-2xl font-bold">Edit Property</h2>
              <Button variant="ghost" size="sm" onClick={handleCloseEditModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto scrollbar-hide max-h-[calc(90vh-80px)]">
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Property Title</Label>
                        <Input
                          id="title"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Property Type</Label>
                        <Select
                          disabled={!isEditing}
                          defaultValue={selectedProperty.type}
                          onValueChange={(
                            value:
                              | "apartment"
                              | "house"
                              | "commercial"
                              | "office"
                          ) =>
                            setEditForm((prev) => ({ ...prev, type: value }))
                          }
                        >
                          <SelectTrigger
                            className={!isEditing ? "bg-muted" : ""}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="commercial">
                              Commercial
                            </SelectItem>
                            <SelectItem value="office">Office</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="listingType">Listing Type</Label>
                        <Select
                          disabled={!isEditing}
                          defaultValue={selectedProperty.listingType}
                          onValueChange={handleListingTypeChange}
                        >
                          <SelectTrigger
                            className={!isEditing ? "bg-muted" : ""}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rent">For Rent</SelectItem>
                            <SelectItem value="sale">For Sale</SelectItem>
                          </SelectContent>
                        </Select>
                        {isEditing && (
                          <p className="text-xs text-blue-600">
                            Status will automatically be set to "Active" when
                            listing type changes
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              price: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="region">Region</Label>
                        <Input
                          id="region"
                          value={editForm.region}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              region: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={editForm.city}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="neighborhood">Neighborhood</Label>
                        <Input
                          id="neighborhood"
                          value={editForm.neighborhood}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              neighborhood: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subCity">Sub City</Label>
                        <Input
                          id="subCity"
                          value={editForm.subCity}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              subCity: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          value={editForm.bedrooms}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              bedrooms: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          value={editForm.bathrooms}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              bathrooms: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area">Area (sqm)</Label>
                        <Input
                          id="area"
                          value={editForm.area}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              area: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select disabled={true} value={editForm.status}>
                          <SelectTrigger className="bg-muted cursor-not-allowed">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Rented">Rented</SelectItem>
                            <SelectItem value="Sold">Sold</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Status is automatically managed based on listing type
                          changes
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Property Images */}
                <Card>
                  <CardHeader>
                    <CardTitle>Property Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedProperty.images?.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={getPropertyImageUrl(image)}
                            alt={`Property ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          {isEditing && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center">
                          <div className="text-center">
                            <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Add Image</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  {/* Left side - Status Change Button */}
                  {!isEditing && (
                    <div>
                      {selectedProperty.status === "Sold" ||
                      selectedProperty.status === "Rented" ? (
                        <Button
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                          onClick={handleActivateProperty}
                          disabled={updatePropertyStatus.isPending}
                        >
                          {updatePropertyStatus.isPending
                            ? "Activating..."
                            : "Activate"}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                          onClick={handleMarkAsRentedOrSold}
                          disabled={updatePropertyStatus.isPending}
                        >
                          {updatePropertyStatus.isPending
                            ? "Updating..."
                            : selectedProperty.listingType === "rent"
                            ? "Mark as Rented"
                            : "Mark as Sold"}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Right side - Edit/Save Buttons */}
                  <div className="flex space-x-2">
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Property
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveEdit}
                          disabled={updateProperty.isPending}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {updateProperty.isPending
                            ? "Saving..."
                            : "Save Changes"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
