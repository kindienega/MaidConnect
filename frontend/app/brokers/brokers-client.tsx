"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  X,
  Star,
  MessageCircle,
  Phone,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrokerCard } from "@/components/ui/broker-card";
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
import { User } from "@/types";
import { useTelegramStore } from "@/store/telegram";

const specialties = [
  "Residential",
  "Commercial",
  "Luxury Homes",
  "Investment Properties",
  "Land",
  "Rental",
  "New Construction",
  "International Properties",
  "Property Management",
  "Consultation",
];

const experienceLevels = [
  { value: "0-2", label: "0-2 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "6-10", label: "6-10 years" },
  { value: "10+", label: "10+ years" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviews" },
  { value: "experience", label: "Most Experienced" },
  { value: "deals", label: "Most Deals" },
  { value: "listings", label: "Most Listings" },
];

const ITEMS_PER_PAGE = 12;

interface BrokersClientProps {
  initialBrokers: User[];
}

function BrokersClient({ initialBrokers }: BrokersClientProps) {
  const { showBottomNav } = useTelegramStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [brokers, setBrokers] = useState<User[]>(initialBrokers);
  const [filteredBrokers, setFilteredBrokers] = useState<User[]>([]);
  const [displayedBrokers, setDisplayedBrokers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    query: searchParams.get("query") || "",
    specialty: searchParams.get("specialty") || "",
    experienceLevel: searchParams.get("experience") || "",
    minRating: parseFloat(searchParams.get("rating") || "0"),
    verifiedOnly: searchParams.get("verified") === "true",
    sortBy: searchParams.get("sort") || "rating",
  });

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useRef<HTMLDivElement>(null);

  // Initialize filtered brokers
  useEffect(() => {
    setFilteredBrokers(brokers);
  }, [brokers]);

  // Apply filters
  useEffect(() => {
    let filtered = [...brokers];

    if (filters.query) {
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(filters.query.toLowerCase()) ||
          b.description?.toLowerCase().includes(filters.query.toLowerCase()) ||
          b.specialties?.some((s) =>
            s.toLowerCase().includes(filters.query.toLowerCase())
          )
      );
    }

    if (filters.specialty) {
      filtered = filtered.filter((b) =>
        b.specialties?.some(
          (s) => s.toLowerCase() === filters.specialty.toLowerCase()
        )
      );
    }

    if (filters.experienceLevel) {
      const [min, max] = filters.experienceLevel.split("-").map(Number);
      filtered = filtered.filter((b) => {
        const experience = b.yearsOfExperience || 0;
        if (max) {
          return experience >= min && experience <= max;
        } else {
          return experience >= min;
        }
      });
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter((b) => (b.rating || 0) >= filters.minRating);
    }

    if (filters.verifiedOnly) {
      filtered = filtered.filter((b) => b.isVerified);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(String(b.createdAt)).getTime() -
            new Date(String(a.createdAt)).getTime()
        );
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "reviews":
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case "experience":
        filtered.sort(
          (a, b) => (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0)
        );
        break;
      case "deals":
        filtered.sort(
          (a, b) => (b.completedDeals || 0) - (a.completedDeals || 0)
        );
        break;
      case "listings":
        filtered.sort(
          (a, b) => (b.activeListings || 0) - (a.activeListings || 0)
        );
        break;
    }

    setFilteredBrokers(filtered);
    setDisplayedBrokers(filtered.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
    setHasMore(filtered.length > ITEMS_PER_PAGE);
  }, [filters, brokers]);

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

      const newItems = filteredBrokers.slice(startIndex, endIndex);
      setDisplayedBrokers((prev) => [...prev, ...newItems]);
      setCurrentPage(nextPage);
      setHasMore(endIndex < filteredBrokers.length);
      setIsLoading(false);
    }, 500);
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Update URL params
    const params = new URLSearchParams();
    if (updatedFilters.query) params.set("query", updatedFilters.query);
    if (updatedFilters.specialty)
      params.set("specialty", updatedFilters.specialty);
    if (updatedFilters.experienceLevel)
      params.set("experience", updatedFilters.experienceLevel);
    if (updatedFilters.minRating > 0)
      params.set("rating", updatedFilters.minRating.toString());
    if (updatedFilters.verifiedOnly) params.set("verified", "true");
    if (updatedFilters.sortBy) params.set("sort", updatedFilters.sortBy);

    router.push(`/brokers?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      specialty: "",
      experienceLevel: "",
      minRating: 0,
      verifiedOnly: false,
      sortBy: "rating",
    });
    router.push("/brokers");
  };

  return (
    <div
      className={`min-h-screen bg-background ${showBottomNav ? "pb-20" : ""}`}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Real Estate Brokers</h1>
          <p className="text-muted-foreground">
            Connect with experienced and verified real estate professionals
          </p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search brokers by name, specialty..."
                value={filters.query}
                onChange={(e) => updateFilters({ query: e.target.value })}
                className="pl-10"
              />
            </div>

            {/* Specialty Filter */}
            <Select
              value={filters.specialty || "all"}
              onValueChange={(value) =>
                updateFilters({ specialty: value === "all" ? "" : value })
              }
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Experience Level Filter */}
            <Select
              value={filters.experienceLevel || "all"}
              onValueChange={(value) =>
                updateFilters({ experienceLevel: value === "all" ? "" : value })
              }
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experience Levels</SelectItem>
                {experienceLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select
              value={filters.sortBy}
              onValueChange={(value) => updateFilters({ sortBy: value })}
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
                  {/* Minimum Rating */}
                  <div>
                    <Label className="text-base font-medium">
                      Minimum Rating
                    </Label>
                    <div className="mt-2 space-y-4">
                      <Slider
                        value={[filters.minRating]}
                        onValueChange={(value) =>
                          updateFilters({ minRating: value[0] })
                        }
                        max={5}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Any Rating</span>
                        <span>{filters.minRating}★ & above</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Verified Only */}
                  <div>
                    <Label className="text-base font-medium">
                      Verification
                    </Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="verified"
                          checked={filters.verifiedOnly}
                          onCheckedChange={(checked) =>
                            updateFilters({ verifiedOnly: checked === true })
                          }
                        />
                        <Label htmlFor="verified" className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                          Verified Brokers Only
                        </Label>
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
            Showing {displayedBrokers.length} brokers
          </p>
          {(filters.query ||
            filters.specialty ||
            filters.experienceLevel ||
            filters.minRating > 0 ||
            filters.verifiedOnly) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Brokers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedBrokers.map((broker, index) => (
            <div
              key={broker.id}
              ref={
                index === displayedBrokers.length - 1
                  ? lastElementRefCallback
                  : undefined
              }
            >
              <BrokerCard broker={broker} />
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {displayedBrokers.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No brokers found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}

        {/* End of Results */}
        {!hasMore && displayedBrokers.length > 0 && (
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

export default BrokersClient;
