import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { campaigns as initialCampaigns, type Campaign } from "@/data/mock";
import {
  subscribers as initialSubscribers,
  BASE_SUBSCRIBER_COUNT,
  BASE_UNSUBSCRIBE_COUNT,
  PREVIOUS_PERIOD,
  type Subscriber,
} from "@/data/subscribers";
import { automations as initialAutomations, type Automation } from "@/data/automations";

export interface DashboardStats {
  totalSubscribers: number;
  totalSubscribersChange: number;
  openRate: number;
  openRateChange: number;
  clickRate: number;
  clickRateChange: number;
  unsubscribes: number;
  unsubscribesChange: number;
}

interface DataContextValue {
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  subscribers: Subscriber[];
  addSubscriber: (subscriber: Subscriber) => void;
  automations: Automation[];
  toggleAutomation: (id: string) => void;
  addAutomation: (automation: Automation) => void;
  stats: DashboardStats;
}

const DataContext = createContext<DataContextValue | null>(null);

function pctChange(current: number, previous: number) {
  return ((current - previous) / previous) * 100;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [automations, setAutomations] = useState<Automation[]>(initialAutomations);

  const stats = useMemo<DashboardStats>(() => {
    const sentCampaigns = campaigns.filter((c) => c.sent > 0);
    const totalSent = sentCampaigns.reduce((sum, c) => sum + c.sent, 0);
    const openRate = totalSent
      ? sentCampaigns.reduce((sum, c) => sum + c.sent * c.openRate, 0) / totalSent
      : 0;
    const clickRate = totalSent
      ? sentCampaigns.reduce((sum, c) => sum + c.sent * c.clickRate, 0) / totalSent
      : 0;

    const unsubscribedSample = subscribers.filter((s) => s.status === "Unsubscribed").length;
    const totalSubscribers = BASE_SUBSCRIBER_COUNT + subscribers.length;
    const unsubscribes = BASE_UNSUBSCRIBE_COUNT + unsubscribedSample;

    return {
      totalSubscribers,
      totalSubscribersChange: pctChange(totalSubscribers, PREVIOUS_PERIOD.subscriberCount),
      openRate,
      openRateChange: pctChange(openRate, PREVIOUS_PERIOD.openRate),
      clickRate,
      clickRateChange: pctChange(clickRate, PREVIOUS_PERIOD.clickRate),
      unsubscribes,
      unsubscribesChange: pctChange(unsubscribes, PREVIOUS_PERIOD.unsubscribes),
    };
  }, [campaigns, subscribers]);

  const value: DataContextValue = {
    campaigns,
    addCampaign: (campaign) => setCampaigns((prev) => [campaign, ...prev]),
    subscribers,
    addSubscriber: (subscriber) => setSubscribers((prev) => [subscriber, ...prev]),
    automations,
    toggleAutomation: (id) =>
      setAutomations((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: a.status === "Active" ? "Paused" : "Active" } : a,
        ),
      ),
    addAutomation: (automation) => setAutomations((prev) => [automation, ...prev]),
    stats,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- context hook lives alongside its provider
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
