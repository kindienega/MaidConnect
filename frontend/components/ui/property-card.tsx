"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Bed, Bath, Square, Star, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Property } from "@/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getPropertyImageUrl } from "@/lib/image-utils";

interface PropertyCardProps {
  property: Property;
  className?: string;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export function PropertyCard({
  property,
  className,
  onFavorite,
  isFavorite = false,
}: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: Property["status"]) => {
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
  };

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/property/${property.id}`)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={getPropertyImageUrl(property.images[0])}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Status Badge */}
        <Badge
          className={cn(
            "absolute top-3 left-3 text-white border-0",
            getStatusColor(property.status)
          )}
        >
          {property.status}
        </Badge>

        {/* Favorite Button */}
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white",
            "transition-all duration-200",
            isHovered ? "opacity-100" : "opacity-0"
          )}
          onClick={(e) => {
            e.preventDefault();
            onFavorite?.(property.id);
          }}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            )}
          />
        </Button>

        {/* Property Type */}
        <Badge
          variant="secondary"
          className="absolute bottom-3 left-3 bg-white/90 text-gray-800"
        >
          {property.type}
        </Badge>

        {/* Listing Type */}
        <Badge
          variant="secondary"
          className="absolute bottom-3 right-3 bg-white/90 text-gray-800"
        >
          {property.listingType}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and Price */}
          <div>
            <span className="font-semibold text-lg leading-tight hover:text-primary transition-colors line-clamp-2">
              {property.title}
            </span>
            <p className="text-2xl font-bold text-primary mt-1">
              {formatPrice(property.price)}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">
              {property.location.neighborhood}, {property.location.subCity}
            </span>
          </div>

          {/* Features */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {property.features.bedrooms && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.features.bedrooms}</span>
              </div>
            )}
            {property.features.bathrooms && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.features.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.features.area} m²</span>
            </div>
          </div>

          {/* Rating and Views */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="font-medium">{property.rating}</span>
              <span className="text-muted-foreground ml-1">
                ({property.reviews.length} reviews)
              </span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Eye className="h-4 w-4 mr-1" />
              <span>{property.views || 0} views</span>
            </div>
          </div>

          {/* Owner Info */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {property.owner.name.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium">{property.owner.name}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {property.owner.role !== "SuperAdmin"
                ? property.owner.role
                : "Broker"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

