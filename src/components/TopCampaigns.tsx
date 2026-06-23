import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Campaign } from "@/data/mock";

interface TopCampaignsProps {
  campaigns: Campaign[];
}

export function TopCampaigns({ campaigns }: TopCampaignsProps) {
  const top = [...campaigns]
    .filter((c) => c.sent > 0)
    .sort((a, b) => b.openRate - a.openRate)
    .slice(0, 5);

  const max = Math.max(...top.map((c) => c.openRate), 1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Top Performing Campaigns</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {top.map((c) => (
          <div key={c.id}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="truncate pr-2 text-foreground">{c.name}</span>
              <span className="shrink-0 font-medium text-muted-foreground">
                {c.openRate}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-accent"
                style={{ width: `${(c.openRate / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
