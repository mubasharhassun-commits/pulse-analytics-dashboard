import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { SummaryCard } from "@/components/SummaryCard";
import { AddSubscriberModal } from "@/components/AddSubscriberModal";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/store/DataContext";
import type { SubscriberStatus } from "@/data/subscribers";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: Array<"All" | SubscriberStatus> = ["All", "Active", "Inactive", "Unsubscribed"];

const statusVariant: Record<SubscriberStatus, "success" | "neutral" | "danger"> = {
  Active: "success",
  Inactive: "neutral",
  Unsubscribed: "danger",
};

const engagementVariant: Record<string, "success" | "warning" | "neutral"> = {
  High: "success",
  Medium: "warning",
  Low: "neutral",
};

export function SubscribersPage() {
  const { subscribers, addSubscriber, stats } = useData();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [status, setStatus] = useState<"All" | SubscriberStatus>("All");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subscribers.filter((s) => {
      const matchesSearch =
        q === "" || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const matchesStatus = status === "All" || s.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [subscribers, search, status]);

  const activeRate = subscribers.length
    ? (subscribers.filter((s) => s.status === "Active").length / subscribers.length) * 100
    : 0;
  const unsubscribeRate = (stats.unsubscribes / stats.totalSubscribers) * 100;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total Subscribers" value={stats.totalSubscribers.toLocaleString()} />
        <SummaryCard label="Active Rate" value={`${activeRate.toFixed(0)}%`} caption="of recently joined" />
        <SummaryCard label="Unsubscribe Rate" value={`${unsubscribeRate.toFixed(1)}%`} caption="of total list" />
        <SummaryCard label="Recently Joined" value={subscribers.length.toString()} caption="last 60 days" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 sm:w-72"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium",
                status === s ? "bg-accent text-white" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <CardTitle>Recently Joined Subscribers</CardTitle>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-white hover:bg-accent/90"
          >
            <Plus className="h-4 w-4" /> Add Subscriber
          </button>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Engagement</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3.5 font-medium text-foreground">{s.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{s.email}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={statusVariant[s.status]}>{s.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={engagementVariant[s.engagement]}>{s.engagement}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{s.joinedDate}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    No subscribers match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && (
        <AddSubscriberModal onClose={() => setModalOpen(false)} onCreate={addSubscriber} />
      )}
    </>
  );
}
