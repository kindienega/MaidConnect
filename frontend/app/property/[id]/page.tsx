"use client";

import { notFound } from "next/navigation";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Star,
  Heart,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ImageGallery } from "@/components/ui/image-gallery";
import { ContactButtons } from "@/components/ui/contact-buttons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useTelegramStore } from "@/store/telegram";
import { useProperty } from "@/hooks/useProperty";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLoader } from "@/components/ui/brand-loader";
import {
  formatPrice,
  getStatusColor,
  getListingTypeColor,
} from "@/utils/helper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a stable QueryClient instance outside the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: true,
    },
  },
});

interface PropertyDetailPageProps {
  params: { id: string };
}

function PropertyDetailContent({ params }: PropertyDetailPageProps) {
  const { isInTelegram, showBottomNav } = useTelegramStore();
  const { property, isLoading, error } = useProperty(params.id);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  console.log(
    isAuthenticated,
    "From property detail page for telegram users about auth"
  );
  console.log(
    isInTelegram,
    "From property detail page for telegram users about init"
  );

  // Check authentication - wait for Telegram context to be initialized
  useEffect(() => {
    // Only redirect if we're sure the user is not in Telegram (isInTelegram === false)
    // and not authenticated
    if (isAuthenticated === false && isInTelegram === false) {
      router.push("/login");
    }
  }, [isAuthenticated, isInTelegram, router]);

  // Show loading while checking authentication and Telegram context
  if (isAuthenticated === undefined || isInTelegram === undefined) {
    return <BrandLoader />;
  }

  // Redirect to login only if not authenticated AND not in Telegram
  if (isAuthenticated === false && isInTelegram === false) {
    router.push("/login");
    return <BrandLoader />;
  }

  // Show loading while fetching property data
  if (isLoading || property === undefined) {
    return <BrandLoader />;
  }

  // Show notFound only if property is null (not found in backend)
  if (property === null) {
    console.log("Property not found");
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        <div
          className={`min-h-screen bg-gray-50 ${showBottomNav ? "pb-20" : ""}`}
        >
          {/* Header */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    {property.title}
                  </h1>
                </div>
                <div className="flex items-center space-x-2 sm:mt-0 mt-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Image Gallery */}
                <Card>
                  <CardContent className="p-6">
                    <ImageGallery
                      images={property.images}
                      title={property.title}
                    />
                  </CardContent>
                </Card>

                {/* Price and Status */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-3xl font-bold text-green-600">
                          {formatPrice(property.price)}
                        </div>
                        <div className="text-sm font-bold text-gray-600 mt-1">
                          {formatPrice(property.pricePerSquareMeter)} per m²
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(property.status)}>
                          {property.status}
                        </Badge>
                        <Badge
                          className={getListingTypeColor(property.listingType)}
                        >
                          For {property.listingType}
                        </Badge>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b">
                      {property.features.bedrooms && (
                        <div className="flex items-center">
                          <Bed className="h-5 w-5 text-gray-600 mr-2" />
                          <span className="text-sm">
                            {property.features.bedrooms} Bedrooms
                          </span>
                        </div>
                      )}
                      {property.features.bathrooms && (
                        <div className="flex items-center">
                          <Bath className="h-5 w-5 text-gray-600 mr-2" />
                          <span className="text-sm">
                            {property.features.bathrooms} Bathrooms
                          </span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Square className="h-5 w-5 text-gray-600 mr-2" />
                        <span className="text-sm">
                          {property.features.area} m²
                        </span>
                      </div>
                      {property.features.parking && (
                        <div className="flex items-center">
                          <Car className="h-5 w-5 text-gray-600 mr-2" />
                          <span className="text-sm">Parking</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Description</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {property.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Reviews */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Reviews</h2>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-500 mr-1" />
                        <span className="font-medium">{property.rating}</span>
                        <span className="text-gray-600 ml-1">
                          ({property.reviews.length} reviews)
                        </span>
                      </div>
                    </div>

                    {property.reviews.length === 0 ? (
                      <p className="text-gray-500">No reviews yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {property.reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">
                                {review.userName}
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span className="text-sm">
                                  {review.rating}/5
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-2">
                              {review.comment}
                            </p>
                            <div className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                }
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Owner */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Contact Owner
                    </h3>
                    <div className="flex items-center mb-4">
                      <Link href={`/brokers/${property.owner.id}`}>
                        <Avatar className="w-12 h-12 mr-3 cursor-pointer hover:opacity-80 transition-opacity">
                          <AvatarImage
                            src={property.owner.profilePhoto}
                            alt={property.owner.name}
                          />
                          <AvatarFallback className="text-lg font-medium text-primary">
                            {property.owner.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div>
                        <Link
                          href={`/brokers/${property.owner.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {property.owner.name}
                        </Link>
                        <div className="text-sm text-gray-600">
                          {property.owner.role === "SuperAdmin" ||
                          property.owner.role === "Admin"
                            ? "Broker"
                            : property.owner.role}
                        </div>
                      </div>
                    </div>

                    <ContactButtons
                      phone={property.owner.phone}
                      email={property.owner.email}
                      brokerId={property.owner.id}
                    />
                  </CardContent>
                </Card>

                {/* Property Details */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Property Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type</span>
                        <span className="font-medium capitalize">
                          {property.type}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className="font-medium">{property.status}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-gray-600">Listed</span>
                        <span className="font-medium">
                          {new Date(property.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-gray-600">Views</span>
                        <span className="font-medium">{property.views}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Location</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-sm">
                          {property.location.neighborhood}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 ml-6">
                        {property.location.subCity}, {property.location.city}
                      </div>
                      <div className="text-sm text-gray-600 ml-6">
                        {property.location.region}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PropertyDetailPage(props: PropertyDetailPageProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <PropertyDetailContent {...props} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

