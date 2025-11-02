"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  X,
  Building,
  Home,
  Warehouse,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PropertyCard } from "@/components/ui/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Property, SearchFilters } from "@/types";
import { useTelegramStore } from "@/store/telegram";

const propertyTypes = [
  { value: "apartment", label: "Apartment", icon: Building },
  { value: "house", label: "House", icon: Home },
  { value: "commercial", label: "Commercial", icon: Warehouse },
  { value: "office", label: "Office", icon: Briefcase },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "popularity", label: "Most Viewed" },
  { value: "rating", label: "Most Rated" },
];

const ITEMS_PER_PAGE = 12;

interface PropertiesClientProps {
  initialProperties: Property[];
}

function PropertiesClient({ initialProperties }: PropertiesClientProps) {
  const { showBottomNav } = useTelegramStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);

  // Filter states
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get("query") || "",
    propertyType: searchParams.get("propertyType") || "",
    location: {
      region: (searchParams.get("location") || "").toLowerCase(),
    },
    priceRange: [0, 500000000], // Increased max price to accommodate higher property prices
    sortBy: (searchParams.get("sort") as any) || "newest",
  });

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useRef<HTMLDivElement>(null);

  // Generate unique locations from properties
  useEffect(() => {
    if (properties.length > 0) {
      const uniqueLocations = new Set<string>();

      properties.forEach((property) => {
        // Add region if available
        if (property.location?.region) {
          uniqueLocations.add(property.location.region.trim().toLowerCase());
        }
        // Add subCity if available
        if (property.location?.subCity) {
          uniqueLocations.add(property.location.subCity.trim().toLowerCase());
        }
        // Add neighborhood if available
        if (property.location?.neighborhood) {
          uniqueLocations.add(
            property.location.neighborhood.trim().toLowerCase()
          );
        }
      });

      // Convert Set to Array and sort alphabetically
      const sortedLocations = Array.from(uniqueLocations).sort();
      setLocations(sortedLocations);
    }
  }, [properties]);

  // Apply filters
  useEffect(() => {
    let filtered = [...properties]; // Use properties directly from state

    if (filters.query) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(filters.query!.toLowerCase()) ||
          p.description.toLowerCase().includes(filters.query!.toLowerCase())
      );
    }

    if (filters.propertyType) {
      filtered = filtered.filter((p) => p.type === filters.propertyType);
    }

    if (filters.location?.region) {
      filtered = filtered.filter((p) => {
        const region = p.location.region?.trim().toLowerCase();
        const subCity = p.location.subCity?.trim().toLowerCase();
        const neighborhood = p.location.neighborhood?.trim().toLowerCase();
        return (
          region === filters.location!.region ||
          subCity === filters.location!.region ||
          neighborhood === filters.location!.region
        );
      });
    }

    if (filters.priceRange) {
      filtered = filtered.filter(
        (p) =>
          p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "newest":
          filtered.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "price_low":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price_high":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "popularity":
          filtered.sort((a, b) => b.viewedBy.length - a.viewedBy.length);
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
      }
    }

    setFilteredProperties(filtered);
    setDisplayedProperties(filtered.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
    setHasMore(filtered.length > ITEMS_PER_PAGE);
  }, [filters, properties]);

  // Infinite scroll observer
  const lastElementRefCallback = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const loadMore = () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;

      let filtered = [...properties];

      // Re-apply filters
      if (filters.query) {
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(filters.query!.toLowerCase()) ||
            p.description.toLowerCase().includes(filters.query!.toLowerCase())
        );
      }
      if (filters.propertyType) {
        filtered = filtered.filter((p) => p.type === filters.propertyType);
      }
      if (filters.location?.region) {
        filtered = filtered.filter((p) => {
          const region = p.location.region?.trim().toLowerCase();
          const subCity = p.location.subCity?.trim().toLowerCase();
          const neighborhood = p.location.neighborhood?.trim().toLowerCase();
          return (
            region === filters.location!.region ||
            subCity === filters.location!.region ||
            neighborhood === filters.location!.region
          );
        });
      }
      if (filters.priceRange) {
        filtered = filtered.filter(
          (p) =>
            p.price >= filters.priceRange![0] &&
            p.price <= filters.priceRange![1]
        );
      }
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "newest":
            filtered.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
            break;
          case "price_low":
            filtered.sort((a, b) => a.price - b.price);
            break;
          case "price_high":
            filtered.sort((a, b) => b.price - a.price);
            break;
          case "popularity":
            filtered.sort((a, b) => b.viewedBy.length - a.viewedBy.length);
            break;
          case "rating":
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        }
      }

      const newItems = filtered.slice(startIndex, endIndex);
      setDisplayedProperties((prev) => [...prev, ...newItems]);
      setCurrentPage(nextPage);
      setHasMore(endIndex < filtered.length);
      setIsLoading(false);
    }, 500);
  };

  const toTitleCase = (text: string) =>
    text
      .toLowerCase()
      .split(" ")
      .filter((s) => s.length > 0)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Update URL params
    const params = new URLSearchParams();
    if (updatedFilters.query) params.set("query", updatedFilters.query);
    if (updatedFilters.propertyType)
      params.set("propertyType", updatedFilters.propertyType);
    if (updatedFilters.location?.region)
      params.set("location", updatedFilters.location.region);
    if (updatedFilters.sortBy) params.set("sort", updatedFilters.sortBy);

    router.push(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      propertyType: "",
      location: { region: "" },
      priceRange: [0, 500000000], // Increased max price to accommodate higher property prices
      sortBy: "newest",
    });
    router.push("/properties");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className={`min-h-screen bg-background ${showBottomNav ? "pb-20" : ""}`}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Properties</h1>
          <p className="text-muted-foreground">
            Discover your perfect property from our extensive collection
          </p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                value={filters.query}
                onChange={(e) => updateFilters({ query: e.target.value })}
                className="pl-10"
              />
            </div>

            {/* Property Type Filter */}
            <Select
              value={filters.propertyType || "all"}
              onValueChange={(value) =>
                updateFilters({ propertyType: value === "all" ? "" : value })
              }
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select
              value={filters.location?.region || "all"}
              onValueChange={(value) =>
                updateFilters({
                  location: { region: value === "all" ? "" : value },
                })
              }
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {toTitleCase(location)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select
              value={filters.sortBy}
              onValueChange={(value) => updateFilters({ sortBy: value as any })}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Advanced Filters Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full lg:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Advanced Filters</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  {/* Price Range */}
                  <div>
                    <Label className="text-base font-medium">Price Range</Label>
                    <div className="mt-2 space-y-4">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) =>
                          updateFilters({
                            priceRange: value as [number, number],
                          })
                        }
                        max={500000000}
                        min={0}
                        step={1000000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{formatPrice(filters.priceRange?.[0] || 0)}</span>
                        <span>
                          {formatPrice(filters.priceRange?.[1] || 500000000)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Property Features */}
                  <div>
                    <Label className="text-base font-medium">Features</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="parking" />
                        <Label htmlFor="parking">Parking Available</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Clear Filters */}
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {displayedProperties.length} properties
          </p>
          {Object.values(filters).some(
            (val) => val && (typeof val === "string" ? val !== "" : true)
          ) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedProperties.map((property, index) => (
            <div
              key={property.id}
              ref={
                index === displayedProperties.length - 1
                  ? lastElementRefCallback
                  : undefined
              }
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {displayedProperties.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No properties found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}

        {/* End of Results */}
        {!hasMore && displayedProperties.length > 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              You've reached the end of the results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertiesClient;
