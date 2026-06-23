import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { SummaryCard } from "@/components/SummaryCard";
import { CampaignsTable } from "@/components/CampaignsTable";
import { CampaignWizard } from "@/components/CampaignWizard";
import { useData } from "@/store/DataContext";
import type { CampaignStatus } from "@/data/mock";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: Array<"All" | CampaignStatus> = ["All", "Sent", "Sending", "Scheduled", "Draft"];

export function CampaignsPage() {
  const { campaigns, addCampaign } = useData();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [status, setStatus] = useState<"All" | CampaignStatus>("All");
  const [wizardOpen, setWizardOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return campaigns.filter((c) => {
      const matchesSearch = q === "" || c.name.toLowerCase().includes(q);
      const matchesStatus = status === "All" || c.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, search, status]);

  const sentCampaigns = campaigns.filter((c) => c.sent > 0);
  const totalSent = sentCampaigns.reduce((sum, c) => sum + c.sent, 0);
  const avgOpenRate = totalSent
    ? sentCampaigns.reduce((sum, c) => sum + c.sent * c.openRate, 0) / totalSent
    : 0;
  const avgClickRate = totalSent
    ? sentCampaigns.reduce((sum, c) => sum + c.sent * c.clickRate, 0) / totalSent
    : 0;
  const scheduledCount = campaigns.filter((c) => c.status === "Scheduled" || c.status === "Sending").length;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total Campaigns" value={campaigns.length.toString()} />
        <SummaryCard label="Avg. Open Rate" value={`${avgOpenRate.toFixed(1)}%`} />
        <SummaryCard label="Avg. Click Rate" value={`${avgClickRate.toFixed(1)}%`} />
        <SummaryCard label="In Progress / Scheduled" value={scheduledCount.toString()} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 sm:w-64"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium",
                status === s
                  ? "bg-accent text-white"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <CampaignsTable
        campaigns={filtered}
        onNewCampaign={() => setWizardOpen(true)}
        title="All Campaigns"
      />

      {wizardOpen && (
        <CampaignWizard onClose={() => setWizardOpen(false)} onCreate={addCampaign} />
      )}
    </>
  );
}
