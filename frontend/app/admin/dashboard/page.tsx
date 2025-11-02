"use client";

import { useAdminApi } from "@/hooks/useAdminApi";
import { useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  DollarSign,
  Home,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chart } from "@/components/admin/Chart";
import { VisitorsChart } from "@/components/admin/VisitorsChart";
import { BrandLoader } from "@/components/ui/brand-loader";

export default function DashboardPage() {
  const { stats, fetchStats, loading } = useAdminApi();

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <BrandLoader />;

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* Section Cards - Matching root dashboard design */}
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.totalUsers?.toLocaleString() || "0"}
              </CardTitle>
              <div className="flex justify-end">
                <Badge variant="outline" className="flex items-center gap-1">
                  <TrendingUp className="size-3" />
                  +12.5%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Growing user base <TrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Registered users this month
              </div>
            </CardContent>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Total Properties</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.totalListings?.toLocaleString() || "0"}
              </CardTitle>
              <div className="flex justify-end">
                <Badge variant="outline" className="flex items-center gap-1">
                  <TrendingUp className="size-3" />
                  +8.2%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Active listings <Building2 className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Properties available for sale/rent
              </div>
            </CardContent>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Total Brokers</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.totalBrokers?.toLocaleString() || "0"}
              </CardTitle>
              <div className="flex justify-end">
                <Badge variant="outline" className="flex items-center gap-1">
                  <TrendingUp className="size-3" />
                  +15.3%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Verified professionals <Users className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Licensed property brokers
              </div>
            </CardContent>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Monthly Revenue</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                $45,250
              </CardTitle>
              <div className="flex justify-end">
                <Badge variant="outline" className="flex items-center gap-1">
                  <TrendingUp className="size-3" />
                  +22.1%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Strong performance <DollarSign className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Exceeds monthly targets
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-6 @xl/main:grid-cols-2">
            <Chart />
            <VisitorsChart />
          </div>
        </div>
      </div>
    </div>
  );
}

