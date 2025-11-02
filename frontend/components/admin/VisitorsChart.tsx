"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
  { date: "2024-04-01", webApp: 222, telegramApp: 150 },
  { date: "2024-04-02", webApp: 97, telegramApp: 180 },
  { date: "2024-04-03", webApp: 167, telegramApp: 120 },
  { date: "2024-04-04", webApp: 242, telegramApp: 260 },
  { date: "2024-04-05", webApp: 373, telegramApp: 290 },
  { date: "2024-04-06", webApp: 301, telegramApp: 340 },
  { date: "2024-04-07", webApp: 245, telegramApp: 180 },
  { date: "2024-04-08", webApp: 409, telegramApp: 320 },
  { date: "2024-04-09", webApp: 59, telegramApp: 110 },
  { date: "2024-04-10", webApp: 261, telegramApp: 190 },
  { date: "2024-04-11", webApp: 327, telegramApp: 350 },
  { date: "2024-04-12", webApp: 292, telegramApp: 210 },
  { date: "2024-04-13", webApp: 342, telegramApp: 380 },
  { date: "2024-04-14", webApp: 137, telegramApp: 220 },
  { date: "2024-04-15", webApp: 120, telegramApp: 170 },
  { date: "2024-04-16", webApp: 138, telegramApp: 190 },
  { date: "2024-04-17", webApp: 446, telegramApp: 360 },
  { date: "2024-04-18", webApp: 364, telegramApp: 410 },
  { date: "2024-04-19", webApp: 243, telegramApp: 180 },
  { date: "2024-04-20", webApp: 89, telegramApp: 150 },
  { date: "2024-04-21", webApp: 137, telegramApp: 200 },
  { date: "2024-04-22", webApp: 224, telegramApp: 170 },
  { date: "2024-04-23", webApp: 138, telegramApp: 230 },
  { date: "2024-04-24", webApp: 387, telegramApp: 290 },
  { date: "2024-04-25", webApp: 215, telegramApp: 250 },
  { date: "2024-04-26", webApp: 75, telegramApp: 130 },
  { date: "2024-04-27", webApp: 383, telegramApp: 420 },
  { date: "2024-04-28", webApp: 122, telegramApp: 180 },
  { date: "2024-04-29", webApp: 315, telegramApp: 240 },
  { date: "2024-04-30", webApp: 454, telegramApp: 380 },
  { date: "2025-01-01", webApp: 165, telegramApp: 220 },
  { date: "2025-01-02", webApp: 293, telegramApp: 310 },
  { date: "2025-01-03", webApp: 247, telegramApp: 190 },
  { date: "2025-01-04", webApp: 385, telegramApp: 420 },
  { date: "2025-01-05", webApp: 481, telegramApp: 390 },
  { date: "2025-01-06", webApp: 498, telegramApp: 520 },
  { date: "2025-01-07", webApp: 388, telegramApp: 300 },
  { date: "2025-01-08", webApp: 149, telegramApp: 210 },
  { date: "2025-01-09", webApp: 227, telegramApp: 180 },
  { date: "2025-01-10", webApp: 293, telegramApp: 330 },
  { date: "2025-01-11", webApp: 335, telegramApp: 270 },
  { date: "2025-01-12", webApp: 197, telegramApp: 240 },
  { date: "2025-01-13", webApp: 197, telegramApp: 160 },
  { date: "2025-01-14", webApp: 448, telegramApp: 490 },
  { date: "2025-01-15", webApp: 473, telegramApp: 380 },
  { date: "2025-01-16", webApp: 338, telegramApp: 400 },
  { date: "2025-01-17", webApp: 499, telegramApp: 420 },
  { date: "2025-01-18", webApp: 315, telegramApp: 350 },
  { date: "2025-01-19", webApp: 235, telegramApp: 180 },
  { date: "2025-01-20", webApp: 177, telegramApp: 230 },
  { date: "2025-01-21", webApp: 82, telegramApp: 140 },
  { date: "2025-01-22", webApp: 81, telegramApp: 120 },
  { date: "2025-01-23", webApp: 252, telegramApp: 290 },
  { date: "2025-01-24", webApp: 294, telegramApp: 220 },
  { date: "2025-01-25", webApp: 201, telegramApp: 250 },
  { date: "2025-01-26", webApp: 213, telegramApp: 170 },
  { date: "2025-01-27", webApp: 420, telegramApp: 460 },
  { date: "2025-01-28", webApp: 233, telegramApp: 190 },
  { date: "2025-01-29", webApp: 78, telegramApp: 130 },
  { date: "2025-01-30", webApp: 340, telegramApp: 280 },
  { date: "2025-01-31", webApp: 178, telegramApp: 230 },
  { date: "2025-02-01", webApp: 178, telegramApp: 200 },
  { date: "2025-02-02", webApp: 470, telegramApp: 410 },
  { date: "2025-02-03", webApp: 103, telegramApp: 160 },
  { date: "2025-02-04", webApp: 439, telegramApp: 380 },
  { date: "2025-02-05", webApp: 88, telegramApp: 140 },
  { date: "2025-02-06", webApp: 294, telegramApp: 250 },
  { date: "2025-02-07", webApp: 323, telegramApp: 370 },
  { date: "2025-02-08", webApp: 385, telegramApp: 320 },
  { date: "2025-02-09", webApp: 438, telegramApp: 480 },
  { date: "2025-02-10", webApp: 155, telegramApp: 200 },
  { date: "2025-02-11", webApp: 92, telegramApp: 150 },
  { date: "2025-02-12", webApp: 492, telegramApp: 420 },
  { date: "2025-02-13", webApp: 81, telegramApp: 130 },
  { date: "2025-02-14", webApp: 426, telegramApp: 380 },
  { date: "2025-02-15", webApp: 307, telegramApp: 350 },
  { date: "2025-02-16", webApp: 371, telegramApp: 310 },
  { date: "2025-02-17", webApp: 475, telegramApp: 520 },
  { date: "2025-02-18", webApp: 107, telegramApp: 170 },
  { date: "2025-02-19", webApp: 341, telegramApp: 290 },
  { date: "2025-02-20", webApp: 408, telegramApp: 450 },
  { date: "2025-02-21", webApp: 169, telegramApp: 210 },
  { date: "2025-02-22", webApp: 317, telegramApp: 270 },
  { date: "2025-02-23", webApp: 480, telegramApp: 530 },
  { date: "2025-02-24", webApp: 132, telegramApp: 180 },
  { date: "2025-02-25", webApp: 141, telegramApp: 190 },
  { date: "2025-02-26", webApp: 434, telegramApp: 380 },
  { date: "2025-02-27", webApp: 448, telegramApp: 490 },
  { date: "2025-02-28", webApp: 149, telegramApp: 200 },
  { date: "2025-02-29", webApp: 103, telegramApp: 160 },
  { date: "2025-03-01", webApp: 446, telegramApp: 400 },
];

const chartConfig = {
  views: {
    label: "Page Views",
  },
  webApp: {
    label: "Web App",
    color: "#3b82f6", // Blue color for Web App
  },
  telegramApp: {
    label: "Telegram App",
    color: "#10b981", // Green color for Telegram App
  },
} satisfies ChartConfig;

export function VisitorsChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("webApp");
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
      webApp: filteredData.reduce((acc, curr) => acc + curr.webApp, 0),
      telegramApp: filteredData.reduce(
        (acc, curr) => acc + curr.telegramApp,
        0
      ),
    }),
    [filteredData]
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>App Visitors</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total visitors for the last 3 months
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
          <BarChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
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
            <Bar
              dataKey={activeChart}
              fill={activeChart === "webApp" ? "#3b82f6" : "#10b981"}
            />
          </BarChart>
        </ChartContainer>

        {/* Summary Stats */}
        <div className="flex gap-4 mt-4 pt-4 border-t">
          {["webApp", "telegramApp"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative flex flex-1 flex-col justify-center gap-1 border rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted/25"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
