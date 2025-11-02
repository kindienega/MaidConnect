"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Phone,
  MessageCircle,
  CheckCircle,
  MapPin,
  Calendar,
  Building,
  Award,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrokerPropertyCard } from "./broker-property-card";
import { User, Property } from "@/types";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { BrandLoader } from "../ui/brand-loader";

interface BrokerDetailProps {
  broker: User;
  properties?: Property[];
}

export function BrokerDetail({ broker, properties = [] }: BrokerDetailProps) {
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<
    "overview" | "properties" | "reviews"
  >("overview");
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showBusinessCardModal, setShowBusinessCardModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false) router.push("/login");
  }, [isAuthenticated]);

  if (isAuthenticated === undefined || isAuthenticated === false)
    return <BrandLoader />;

  const handleCall = () => {
    window.open(`tel:${broker.phone}`);
  };

  const handleMessage = () => {
    router.push(`/messages?broker=${broker.id}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${broker.name} - Broker Profile`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Broker Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24">
              <AvatarImage src={broker.profilePhoto} alt={broker.name} />
              <AvatarFallback className="text-2xl font-semibold">
                {broker.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Broker Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-bold">{broker.name}</h1>
                {broker.isVerified && (
                  <CheckCircle className="h-6 w-6 text-blue-500" />
                )}
              </div>

              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">
                    {broker.rating || "N/A"}
                  </span>
                  <span className="text-muted-foreground">
                    ({broker.reviewCount || 0} reviews)
                  </span>
                </div>
                <Badge variant="secondary">
                  {broker.role === "SuperAdmin" || broker.role === "Admin"
                    ? "Broker"
                    : broker.role}
                </Badge>
              </div>

              {broker.description && (
                <p className="text-muted-foreground mb-4">
                  {broker.description}
                </p>
              )}

              {/* Specialties */}
              {broker.specialties && broker.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {broker.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Contact Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleCall} className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Call {broker.name}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleMessage}
                  className="flex-1"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="ghost" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">
              {broker.activeListings || 0}
            </div>
            <div className="text-sm text-muted-foreground">Active Listings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">
              {broker.completedDeals || 0}
            </div>
            <div className="text-sm text-muted-foreground">Completed Deals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">
              {broker.yearsOfExperience || "N/A"}
            </div>
            <div className="text-sm text-muted-foreground">
              Years Experience
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
        <Button
          variant={activeTab === "overview" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("overview")}
          className="flex-1"
        >
          Overview
        </Button>
        <Button
          variant={activeTab === "properties" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("properties")}
          className="flex-1"
        >
          Properties ({properties.length})
        </Button>
        <Button
          variant={activeTab === "reviews" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("reviews")}
          className="flex-1"
        >
          Reviews
        </Button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <Card>
            <CardHeader>
              <CardTitle>About {broker.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {broker.description && (
                <p className="text-muted-foreground">{broker.description}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-primary" />
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">{broker.phone}</span>
                    </div>
                    {broker.contactInfo?.whatsapp && (
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path
                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"
                            fill="#25D366"
                          />
                        </svg>
                        <span className="font-medium">
                          {broker.contactInfo.whatsapp}
                        </span>
                      </div>
                    )}
                    {broker.contactInfo?.telegram && (
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path
                            d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
                            fill="#0088cc"
                          />
                        </svg>
                        <span className="font-medium">
                          {broker.contactInfo.telegram}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:border-l md:border-gray-200 md:pl-6">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    Professional Details
                  </h4>
                  <div className="space-y-3">
                    {broker.companyName && (
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <Building className="h-4 w-4 text-gray-600" />
                        <div>
                          <div className="text-xs text-gray-500">Company</div>
                          <div className="font-medium">
                            {broker.companyName}
                          </div>
                        </div>
                      </div>
                    )}
                    {(broker.license || broker.businessCard) && (
                      <div className="flex gap-4">
                        {broker.license && (
                          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <Award className="h-4 w-4 text-gray-600" />
                            <div>
                              <div className="text-xs text-gray-500">
                                License
                              </div>
                              <Image
                                src={broker.license}
                                alt="Broker License"
                                width={128}
                                height={80}
                                className="w-32 h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                                onClick={() => setShowLicenseModal(true)}
                              />
                            </div>
                          </div>
                        )}
                        {broker.businessCard && (
                          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <Award className="h-4 w-4 text-gray-600" />
                            <div>
                              <div className="text-xs text-gray-500">
                                Business Card
                              </div>
                              <Image
                                src={broker.businessCard}
                                alt="Broker Business Card"
                                width={128}
                                height={80}
                                className="w-32 h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                                onClick={() => setShowBusinessCardModal(true)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <div>
                        <div className="text-xs text-gray-500">
                          Member Since
                        </div>
                        <div className="font-medium">
                          {broker.createdAt
                            ? new Date(
                                String(broker.createdAt)
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "properties" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Properties by {broker.name}
            </h3>
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <BrokerPropertyCard
                    key={property.id}
                    property={property}
                    brokerName={broker.name}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="text-lg font-semibold mb-2">
                    No Properties Listed
                  </h4>
                  <p className="text-muted-foreground">
                    {broker.name} hasn't listed any properties yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {!broker.reviews || broker.reviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="text-lg font-semibold mb-2">No Reviews Yet</h4>
                  <p className="text-muted-foreground">
                    Be the first to review {broker.name}'s services.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {broker.reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{review.userName}</div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">{review.rating}/5</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <div className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "2-digit", day: "2-digit" }
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* License Modal */}
      {showLicenseModal && broker.license && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl max-h-full">
            <Image
              src={broker.license}
              alt="Broker License"
              width={1280}
              height={800}
              className="w-full h-auto"
            />
            <Button className="mt-4" onClick={() => setShowLicenseModal(false)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Business Card Modal */}
      {showBusinessCardModal && broker.businessCard && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl max-h-full">
            <Image
              src={broker.businessCard}
              alt="Broker Business Card"
              width={1280}
              height={800}
              className="w-full h-auto"
            />
            <Button
              className="mt-4"
              onClick={() => setShowBusinessCardModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

