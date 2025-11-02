"use client";

import { useAdminApi } from "@/hooks/useAdminApi";
import { Chart } from "@/components/admin";
import { useEffect } from "react";
import { BrandLoader } from "@/components/ui/brand-loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PaymentsPage() {
  const { paymentStats, fetchPaymentStats, loading } = useAdminApi();

  useEffect(() => {
    fetchPaymentStats();
  }, []);

  if (loading) return <BrandLoader />;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="px-4 lg:px-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Payments Management
            </h2>
            <p className="text-muted-foreground">
              Monitor payment statistics and revenue analytics
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue (Today)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${paymentStats.today}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue (Month)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${paymentStats.month}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Refund Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {paymentStats.refundRate}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>
              Monthly revenue trends and payment insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Chart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
