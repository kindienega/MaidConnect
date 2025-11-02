"use client";

import { useAdminApi } from "@/hooks/useAdminApi";
import { useRouter } from "next/router";
import { Table } from "@/components/admin";
import { useEffect } from "react";

export default function UserPaymentsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { userPayments, fetchUserPayments, loading } = useAdminApi();

  useEffect(() => {
    if (id) fetchUserPayments(id as string);
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Payment Profile</h1>
      <Table
        columns={[
          { label: "Transaction ID", key: "transactionId" },
          { label: "Amount", key: "amount" },
          { label: "Status", key: "status" },
          { label: "Payment Method", key: "paymentMethod" },
          { label: "Timestamp", key: "timestamp" },
        ]}
        data={userPayments}
        loading={loading}
      />
    </div>
  );
}
