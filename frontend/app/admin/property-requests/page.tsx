"use client";

import { usePropertyRequests } from "@/hooks/usePropertyRequestes";
import PropertyRequestsTable from "@/components/admin/PropertyRequestsTable";
import { BrandLoader } from "@/components/ui/brand-loader";
import Error from "./error";
import { useQueryClient } from "@tanstack/react-query";

export default function PropertyRequestsPage() {
  const {
    properties: propertyRequests,
    isLoading,
    error,
  } = usePropertyRequests();
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["property-requests"] });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BrandLoader />
      </div>
    );
  }

  if (error) {
    return <Error error={error} reset={() => window.location.reload()} />;
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="px-4 lg:px-6">
        <PropertyRequestsTable
          propertyRequests={propertyRequests}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
}
