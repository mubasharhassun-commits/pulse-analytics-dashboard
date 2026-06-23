import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { performanceData, type PerformancePoint } from "@/data/mock";

interface PerformanceChartProps {
  data?: PerformancePoint[];
  description?: string;
}

export function PerformanceChart({ data = performanceData.slice(-30), description = "Last 30 days" }: PerformanceChartProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Email Performance</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" /> Opens
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-info" /> Clicks
          </span>
        </div>
      </CardHeader>
      <div className="h-72 px-2 pb-4 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="opens" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6d28d9" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6d28d9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="clicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              interval={Math.max(0, Math.ceil(data.length / 7) - 1)}
            />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="opens"
              stroke="#6d28d9"
              strokeWidth={2}
              fill="url(#opens)"
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#2563eb"
              strokeWidth={2}
              fill="url(#clicks)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
