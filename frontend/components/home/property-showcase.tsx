"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/ui/property-card";
import { usePropertiesStore } from "@/store/properties";
import { Property } from "@/types";

interface PropertyShowcaseProps {
  title: string;
  properties: Property[];
  viewAllLink: string;
  loading?: boolean;
}

export function PropertyShowcase({
  title,
  properties,
  viewAllLink,
  loading = false,
}: PropertyShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  // console.log("Most view properties from client", properties);

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3);
      } else if (window.innerWidth >= 768) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  const maxIndex = Math.max(0, properties.length - visibleCards);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 w-64 bg-muted rounded animate-pulse" />
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
            {title}
          </h2>
          <div className="flex items-center space-x-4">
            {/* View All Button */}
            <Button variant="outline" asChild>
              <Link href={viewAllLink}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="relative overflow-x-auto scrollbar-hide">
          <div
            className="flex flex-nowrap gap-6 snap-x snap-mandatory"
            style={{}}
          >
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex-shrink-0 px-3 snap-center"
                style={{ width: `${100 / visibleCards}%`, maxWidth: "350px" }}
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
