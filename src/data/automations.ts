export type AutomationStatus = "Active" | "Paused";

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  steps: number;
  status: AutomationStatus;
  enrolled: number;
  completionRate: number;
}

export const automations: Automation[] = [
  {
    id: "a1",
    name: "Welcome Series",
    trigger: "New subscriber joins",
    steps: 3,
    status: "Active",
    enrolled: 1840,
    completionRate: 78,
  },
  {
    id: "a2",
    name: "Abandoned Browse",
    trigger: "Visits pricing page, no signup in 24h",
    steps: 2,
    status: "Active",
    enrolled: 920,
    completionRate: 54,
  },
  {
    id: "a3",
    name: "Re-engagement: Inactive",
    trigger: "No opens in 30 days",
    steps: 3,
    status: "Paused",
    enrolled: 3120,
    completionRate: 31,
  },
  {
    id: "a4",
    name: "Post-Purchase Follow-up",
    trigger: "Completes a purchase",
    steps: 2,
    status: "Active",
    enrolled: 640,
    completionRate: 89,
  },
  {
    id: "a5",
    name: "Win-back Churned Users",
    trigger: "Unsubscribed 90+ days ago",
    steps: 1,
    status: "Paused",
    enrolled: 410,
    completionRate: 12,
  },
];
