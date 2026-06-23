import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { SummaryCard } from "@/components/SummaryCard";
import { PerformanceChart } from "@/components/PerformanceChart";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/store/DataContext";
import { performanceData } from "@/data/mock";
import { cn } from "@/lib/utils";

const RANGES = [7, 30, 90] as const;
type Range = (typeof RANGES)[number];

type SortKey = "name" | "sent" | "openRate" | "clickRate";

interface SortHeaderProps {
  k: SortKey;
  label: string;
  sortKey: SortKey;
  sortAsc: boolean;
  onSort: (key: SortKey) => void;
}

function SortHeader({ k, label, sortKey, sortAsc, onSort }: SortHeaderProps) {
  const active = sortKey === k;
  return (
    <th className="px-5 py-3 font-medium">
      <button onClick={() => onSort(k)} className="flex items-center gap-1 hover:text-foreground">
        {label}
        {active ? (
          sortAsc ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
        )}
      </button>
    </th>
  );
}

export function ReportsPage() {
  const { campaigns } = useData();
  const [range, setRange] = useState<Range>(30);
  const [sortKey, setSortKey] = useState<SortKey>("openRate");
  const [sortAsc, setSortAsc] = useState(false);

  const rangeData = useMemo(() => performanceData.slice(-range), [range]);
  const avgOpens = rangeData.reduce((sum, d) => sum + d.opens, 0) / rangeData.length;
  const avgClicks = rangeData.reduce((sum, d) => sum + d.clicks, 0) / rangeData.length;
  const bestDay = rangeData.reduce((best, d) => (d.opens > best.opens ? d : best), rangeData[0]);

  const sentCampaigns = useMemo(() => campaigns.filter((c) => c.sent > 0), [campaigns]);

  const sorted = useMemo(() => {
    const copy = [...sentCampaigns];
    copy.sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
      return (a[sortKey] - b[sortKey]) * dir;
    });
    return copy;
  }, [sentCampaigns, sortKey, sortAsc]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">Date range</h2>
        <div className="flex gap-1.5">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium",
                range === r ? "bg-accent text-white" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Avg. Open Rate" value={`${avgOpens.toFixed(1)}%`} caption={`Over last ${range} days`} />
        <SummaryCard label="Avg. Click Rate" value={`${avgClicks.toFixed(1)}%`} caption={`Over last ${range} days`} />
        <SummaryCard label="Best Day" value={bestDay ? `${bestDay.opens}% opens` : "—"} caption={bestDay?.day} />
      </div>

      <PerformanceChart data={rangeData} description={`Last ${range} days`} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Campaign Comparison</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <SortHeader k="name" label="Campaign Name" sortKey={sortKey} sortAsc={sortAsc} onSort={handleSort} />
                <SortHeader k="sent" label="Sent" sortKey={sortKey} sortAsc={sortAsc} onSort={handleSort} />
                <SortHeader k="openRate" label="Open Rate" sortKey={sortKey} sortAsc={sortAsc} onSort={handleSort} />
                <SortHeader k="clickRate" label="Click Rate" sortKey={sortKey} sortAsc={sortAsc} onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3.5 font-medium text-foreground">{c.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{c.sent.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{c.openRate}%</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{c.clickRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
