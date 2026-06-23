import { ArrowDown, ArrowUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  /** Whether the trend direction is the desired one (e.g. unsubscribes going up is bad). Defaults to trend === "up". */
  positive?: boolean;
}

export function StatCard({ title, value, change, trend, positive }: StatCardProps) {
  const isPositive = positive ?? trend === "up";
  const Arrow = trend === "up" ? ArrowUp : ArrowDown;

  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-2xl font-semibold text-foreground">{value}</span>
        <span
          className={cn(
            "flex items-center gap-0.5 text-sm font-medium",
            isPositive ? "text-success" : "text-danger",
          )}
        >
          <Arrow className="h-3.5 w-3.5" />
          {Math.abs(change).toFixed(1)}%
        </span>
      </div>
    </Card>
  );
}
