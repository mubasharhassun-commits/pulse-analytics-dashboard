export type CampaignStatus = "Sent" | "Draft" | "Scheduled" | "Sending";

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  sent: number;
  openRate: number;
  clickRate: number;
  date: string;
}

export const campaigns: Campaign[] = [
  { id: "c1", name: "Black Friday Early Access", status: "Sent", sent: 42850, openRate: 48.2, clickRate: 7.4, date: "Jun 14, 2026" },
  { id: "c2", name: "Weekly Newsletter #48", status: "Sent", sent: 38120, openRate: 39.6, clickRate: 5.1, date: "Jun 12, 2026" },
  { id: "c3", name: "Product Launch — v2", status: "Sending", sent: 12400, openRate: 31.8, clickRate: 6.0, date: "Jun 17, 2026" },
  { id: "c4", name: "Re-engagement: Inactive Users", status: "Scheduled", sent: 0, openRate: 0, clickRate: 0, date: "Jun 21, 2026" },
  { id: "c5", name: "Customer Survey Q2", status: "Sent", sent: 29870, openRate: 44.1, clickRate: 8.2, date: "Jun 9, 2026" },
  { id: "c6", name: "Weekly Newsletter #47", status: "Sent", sent: 37640, openRate: 40.3, clickRate: 4.9, date: "Jun 5, 2026" },
  { id: "c7", name: "Summer Sale Preview", status: "Draft", sent: 0, openRate: 0, clickRate: 0, date: "—" },
  { id: "c8", name: "Onboarding: Day 3 Tips", status: "Sent", sent: 8540, openRate: 52.7, clickRate: 11.3, date: "Jun 2, 2026" },
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const TODAY = new Date("2026-06-19");

export interface PerformancePoint {
  day: string;
  opens: number;
  clicks: number;
}

// 90 days of history ending today, so the dashboard (last 30) and Reports
// page (7/30/90) can both slice the same underlying series.
export const performanceData: PerformancePoint[] = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(TODAY);
  date.setDate(date.getDate() - (89 - i));
  const dayIndex = i + 1;
  const opens = Math.round(38 + seededRandom(dayIndex) * 10 + Math.sin(dayIndex / 4) * 4);
  const clicks = Math.round(opens * (0.12 + seededRandom(dayIndex * 2) * 0.05));
  return {
    day: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    opens,
    clicks,
  };
});
