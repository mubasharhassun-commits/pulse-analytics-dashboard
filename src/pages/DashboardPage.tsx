import { useState } from "react";
import { StatCard } from "@/components/StatCard";
import { PerformanceChart } from "@/components/PerformanceChart";
import { CampaignsTable } from "@/components/CampaignsTable";
import { TopCampaigns } from "@/components/TopCampaigns";
import { CampaignWizard } from "@/components/CampaignWizard";
import { useData } from "@/store/DataContext";

export function DashboardPage() {
  const { campaigns, addCampaign, stats } = useData();
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Subscribers"
          value={stats.totalSubscribers.toLocaleString()}
          change={stats.totalSubscribersChange}
          trend={stats.totalSubscribersChange >= 0 ? "up" : "down"}
        />
        <StatCard
          title="Open Rate"
          value={`${stats.openRate.toFixed(1)}%`}
          change={stats.openRateChange}
          trend={stats.openRateChange >= 0 ? "up" : "down"}
        />
        <StatCard
          title="Click Rate"
          value={`${stats.clickRate.toFixed(1)}%`}
          change={stats.clickRateChange}
          trend={stats.clickRateChange >= 0 ? "up" : "down"}
        />
        <StatCard
          title="Unsubscribes"
          value={stats.unsubscribes.toLocaleString()}
          change={stats.unsubscribesChange}
          trend={stats.unsubscribesChange >= 0 ? "up" : "down"}
          positive={stats.unsubscribesChange <= 0}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <TopCampaigns campaigns={campaigns} />
      </div>

      <CampaignsTable
        campaigns={campaigns.slice(0, 8)}
        onNewCampaign={() => setWizardOpen(true)}
      />

      {wizardOpen && (
        <CampaignWizard onClose={() => setWizardOpen(false)} onCreate={addCampaign} />
      )}
    </>
  );
}
