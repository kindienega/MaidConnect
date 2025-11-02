"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const chartData = [
  { date: "2024-04-01", sale: 12500, rent: 8500 },
  { date: "2024-04-02", sale: 9800, rent: 9200 },
  { date: "2024-04-03", sale: 15600, rent: 7800 },
  { date: "2024-04-04", sale: 18900, rent: 11200 },
  { date: "2024-04-05", sale: 23400, rent: 13500 },
  { date: "2024-04-06", sale: 20100, rent: 14200 },
  { date: "2024-04-07", sale: 17800, rent: 9800 },
  { date: "2024-04-08", sale: 26700, rent: 15800 },
  { date: "2024-04-09", sale: 8900, rent: 7200 },
  { date: "2024-04-10", sale: 19800, rent: 11800 },
  { date: "2024-04-11", sale: 22300, rent: 16200 },
  { date: "2024-04-12", sale: 18700, rent: 12800 },
  { date: "2024-04-13", sale: 24500, rent: 17800 },
  { date: "2024-04-14", sale: 12300, rent: 9800 },
  { date: "2024-04-15", sale: 11200, rent: 8200 },
  { date: "2024-04-16", sale: 13400, rent: 10200 },
  { date: "2024-04-17", sale: 28900, rent: 19800 },
  { date: "2024-04-18", sale: 23400, rent: 21500 },
  { date: "2024-04-19", sale: 18700, rent: 11800 },
  { date: "2024-04-20", sale: 7600, rent: 8200 },
  { date: "2024-04-21", sale: 13400, rent: 12500 },
  { date: "2024-04-22", sale: 19800, rent: 14200 },
  { date: "2024-04-23", sale: 13400, rent: 13800 },
  { date: "2024-04-24", sale: 24500, rent: 17800 },
  { date: "2024-04-25", sale: 18900, rent: 15800 },
  { date: "2024-04-26", sale: 8900, rent: 9200 },
  { date: "2024-04-27", sale: 26700, rent: 19800 },
  { date: "2024-04-28", sale: 12300, rent: 11800 },
  { date: "2024-04-29", sale: 22300, rent: 15800 },
  { date: "2024-04-30", sale: 28900, rent: 19800 },
  { date: "2025-01-01", sale: 15600, rent: 12800 },
  { date: "2025-01-02", sale: 23400, rent: 17800 },
  { date: "2025-01-03", sale: 19800, rent: 14200 },
  { date: "2025-01-04", sale: 26700, rent: 19800 },
  { date: "2025-01-05", sale: 31200, rent: 22500 },
  { date: "2025-01-06", sale: 33400, rent: 24500 },
  { date: "2025-01-07", sale: 26700, rent: 17800 },
  { date: "2025-01-08", sale: 13400, rent: 12800 },
  { date: "2025-01-09", sale: 19800, rent: 14200 },
  { date: "2025-01-10", sale: 23400, rent: 17800 },
  { date: "2025-01-11", sale: 24500, rent: 19800 },
  { date: "2025-01-12", sale: 17800, rent: 15800 },
  { date: "2025-01-13", sale: 17800, rent: 12800 },
  { date: "2025-01-14", sale: 28900, rent: 22500 },
  { date: "2025-01-15", sale: 31200, rent: 19800 },
  { date: "2025-01-16", sale: 24500, rent: 21500 },
  { date: "2025-01-17", sale: 33400, rent: 22500 },
  { date: "2025-01-18", sale: 22300, rent: 19800 },
  { date: "2025-01-19", sale: 19800, rent: 14200 },
  { date: "2025-01-20", sale: 16700, rent: 15800 },
  { date: "2025-01-21", sale: 8900, rent: 10200 },
  { date: "2025-01-22", sale: 8700, rent: 9200 },
  { date: "2025-01-23", sale: 22300, rent: 17800 },
  { date: "2025-01-24", sale: 24500, rent: 15800 },
  { date: "2025-01-25", sale: 18900, rent: 15800 },
  { date: "2025-01-26", sale: 19800, rent: 14200 },
  { date: "2025-01-27", sale: 28900, rent: 22500 },
  { date: "2025-01-28", sale: 19800, rent: 14200 },
  { date: "2025-01-29", sale: 8900, rent: 9200 },
  { date: "2025-01-30", sale: 24500, rent: 19800 },
  { date: "2025-01-31", sale: 17800, rent: 15800 },
  { date: "2025-02-01", sale: 17800, rent: 15800 },
  { date: "2025-02-02", sale: 31200, rent: 22500 },
  { date: "2025-02-03", sale: 12300, rent: 12800 },
  { date: "2025-02-04", sale: 28900, rent: 19800 },
  { date: "2025-02-05", sale: 8900, rent: 10200 },
  { date: "2025-02-06", sale: 24500, rent: 17800 },
  { date: "2025-02-07", sale: 26700, rent: 19800 },
  { date: "2025-02-08", sale: 26700, rent: 19800 },
  { date: "2025-02-09", sale: 31200, rent: 22500 },
  { date: "2025-02-10", sale: 15600, rent: 15800 },
  { date: "2025-02-11", sale: 12300, rent: 12800 },
  { date: "2025-02-12", sale: 33400, rent: 22500 },
  { date: "2025-02-13", sale: 8900, rent: 9200 },
  { date: "2025-02-14", sale: 28900, rent: 19800 },
  { date: "2025-02-15", sale: 24500, rent: 19800 },
  { date: "2025-02-16", sale: 26700, rent: 19800 },
  { date: "2025-02-17", sale: 31200, rent: 22500 },
  { date: "2025-02-18", sale: 12300, rent: 12800 },
  { date: "2025-02-19", sale: 24500, rent: 17800 },
  { date: "2025-02-20", sale: 28900, rent: 22500 },
  { date: "2025-02-21", sale: 16700, rent: 15800 },
  { date: "2025-02-22", sale: 24500, rent: 19800 },
  { date: "2025-02-23", sale: 31200, rent: 22500 },
  { date: "2025-02-24", sale: 13400, rent: 14200 },
  { date: "2025-02-25", sale: 14200, rent: 14200 },
  { date: "2025-02-26", sale: 28900, rent: 19800 },
  { date: "2025-02-27", sale: 28900, rent: 22500 },
  { date: "2025-02-28", sale: 13400, rent: 15800 },
  { date: "2025-02-29", sale: 12300, rent: 12800 },
  { date: "2025-03-01", sale: 28900, rent: 19800 },
];

const chartConfig = {
  views: {
    label: "Page Views",
  },
  sale: {
    label: "Property Sales",
    color: "#3b82f6", // Blue color for sales
  },
  rent: {
    label: "Property Rentals",
    color: "#10b981", // Green color for rentals
  },
} satisfies ChartConfig;

export function Chart() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2025-03-01");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const total = React.useMemo(
    () => ({
      sale: filteredData.reduce((acc, curr) => acc + curr.sale, 0),
      rent: filteredData.reduce((acc, curr) => acc + curr.rent, 0),
    }),
    [filteredData]
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Property sales and rental revenue for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <div className="flex justify-end">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              // size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillSale" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillRent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Area
              dataKey="rent"
              type="natural"
              fill="url(#fillRent)"
              stroke="#10b981"
              stackId="a"
            />
            <Area
              dataKey="sale"
              type="natural"
              fill="url(#fillSale)"
              stroke="#3b82f6"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

