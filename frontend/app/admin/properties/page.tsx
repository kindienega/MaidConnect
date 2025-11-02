"use client";

import { useProperties } from "@/hooks/useProperties";
import PropertiesTable from "@/components/admin/PropertiesTable";
import { BrandLoader } from "@/components/ui/brand-loader";
import Error from "./error";
import { useQueryClient } from "@tanstack/react-query";

export default function PropertiesPage() {
  const { properties, isLoading, error } = useProperties();
  const queryClient = useQueryClient();
  console.log(properties, "from propeteis");

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["properties"] });
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
        <PropertiesTable properties={properties} onRefresh={handleRefresh} />
      </div>
    </div>
  );
}
