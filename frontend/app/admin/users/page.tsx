"use client";

import { useUsers } from "@/hooks/useUsers";
import UsersTable from "@/components/admin/UsersTable";
import { BrandLoader } from "@/components/ui/brand-loader";
import Error from "./error";

export default function UsersPage() {
  const { users, isLoading, error } = useUsers();

  if (isLoading) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-center h-96">
            <BrandLoader />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <Error error={error} reset={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <UsersTable users={users} />
        </div>
      </div>
    </div>
  );
}
