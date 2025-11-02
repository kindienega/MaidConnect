"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, MapPin, Phone, MessageCircle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
import { cn } from "@/lib/utils";

interface BrokerCardProps {
  broker: User;
  className?: string;
}

export function BrokerCard({ broker, className }: BrokerCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/brokers/${broker.id}`)}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <Avatar
              className="h-16 w-16 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/brokers/${broker.id}`);
              }}
            >
              <AvatarImage src={broker.profilePhoto} alt={broker.name} />
              <AvatarFallback className="text-lg font-semibold">
                {broker.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-lg">{broker.name}</h3>
                {broker.isVerified && (
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                )}
              </div>

              <div className="flex items-center space-x-1 mt-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-medium">{broker.rating}</span>
                <span className="text-muted-foreground text-sm">
                  ({broker.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {broker.description}
          </p>

          {/* Specialties */}
          <div className="flex flex-wrap gap-2">
            {broker.specialties?.map((specialty: string) => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-3 border-t border-b">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {broker.activeListings}
              </div>
              <div className="text-xs text-muted-foreground">
                Active Listings
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {broker.completedDeals}
              </div>
              <div className="text-xs text-muted-foreground">
                Completed Deals
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {broker.yearsOfExperience || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Years Experience
              </div>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(`tel:${broker.phone}`)}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => router.push(`/messages?broker=${broker.id}`)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>

          {/* Join Date */}
          <div className="text-xs text-muted-foreground text-center">
            Member since{" "}
            {broker.createdAt
              ? new Date(String(broker.createdAt)).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              : "N/A"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

