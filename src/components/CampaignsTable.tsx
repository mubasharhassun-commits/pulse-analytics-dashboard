import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Campaign, CampaignStatus } from "@/data/mock";

const statusVariant: Record<CampaignStatus, "success" | "neutral" | "info" | "warning"> = {
  Sent: "success",
  Draft: "neutral",
  Scheduled: "info",
  Sending: "warning",
};

interface CampaignsTableProps {
  campaigns: Campaign[];
  onNewCampaign: () => void;
  title?: string;
}

export function CampaignsTable({ campaigns, onNewCampaign, title = "Recent Campaigns" }: CampaignsTableProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-3">
        <CardTitle>{title}</CardTitle>
        <button
          onClick={onNewCampaign}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-white hover:bg-accent/90"
        >
          <Plus className="h-4 w-4" /> New Campaign
        </button>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-5 py-3 font-medium">Campaign Name</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Sent</th>
              <th className="px-5 py-3 font-medium">Open Rate</th>
              <th className="px-5 py-3 font-medium">Click Rate</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3.5 font-medium text-foreground">{c.name}</td>
                <td className="px-5 py-3.5">
                  <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {c.sent ? c.sent.toLocaleString() : "—"}
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {c.openRate ? `${c.openRate}%` : "—"}
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {c.clickRate ? `${c.clickRate}%` : "—"}
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{c.date}</td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                  No campaigns match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
