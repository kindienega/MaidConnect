"use client";

import { useAdminApi } from "@/hooks/useAdminApi";
import { Table, FilterBar, ExportButton } from "@/components/admin";
import { useEffect } from "react";

export default function TransactionsPage() {
  const { transactions, fetchTransactions, filters, setFilters, loading } =
    useAdminApi();

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <FilterBar
        filters={filters}
        onChange={setFilters}
        options={{
          status: ["All", "Success", "Failed", "Pending", "Refunded"],
          paymentMethod: ["All", "Card", "Bank", "Mobile"],
        }}
      />
      <ExportButton data={transactions} filename="transactions.csv" />
      <Table
        columns={[
          { label: "Transaction ID", key: "transactionId" },
          { label: "User", key: "user" },
          { label: "Listing/Service", key: "listingOrService" },
          { label: "Amount", key: "amount" },
          { label: "Status", key: "status" },
          { label: "Payment Method", key: "paymentMethod" },
          { label: "Timestamp", key: "timestamp" },
        ]}
        data={transactions}
        loading={loading}
      />
    </div>
  );
}
