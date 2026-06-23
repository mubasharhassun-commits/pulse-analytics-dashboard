import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleSwitch } from "@/components/ui/toggle";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Asia/Karachi",
  "Asia/Dubai",
];

export function SettingsPage() {
  const [senderName, setSenderName] = useState("Pulse Analytics");
  const [senderEmail, setSenderEmail] = useState("hello@pulse-analytics.com");
  const [replyTo, setReplyTo] = useState("support@pulse-analytics.com");
  const [timezone, setTimezone] = useState("America/New_York");

  const [notifyOnComplete, setNotifyOnComplete] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);

  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="max-w-2xl space-y-5">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Sending Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Sender name</span>
            <input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Sender email</span>
            <input
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Reply-to email</span>
            <input
              value={replyTo}
              onChange={(e) => setReplyTo(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Timezone</span>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Campaign completion alerts</p>
              <p className="text-xs text-muted-foreground">Email me when a campaign finishes sending</p>
            </div>
            <ToggleSwitch checked={notifyOnComplete} onChange={() => setNotifyOnComplete((v) => !v)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Weekly performance summary</p>
              <p className="text-xs text-muted-foreground">A recap of opens, clicks, and growth every Monday</p>
            </div>
            <ToggleSwitch checked={weeklySummary} onChange={() => setWeeklySummary((v) => !v)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Product updates & tips</p>
              <p className="text-xs text-muted-foreground">Occasional emails about new Pulse features</p>
            </div>
            <ToggleSwitch checked={productUpdates} onChange={() => setProductUpdates((v) => !v)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90"
        >
          Save changes
        </button>
        {saved && <span className="text-sm font-medium text-success">Saved</span>}
      </div>
    </div>
  );
}
