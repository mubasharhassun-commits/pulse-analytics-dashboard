import { useState } from "react";
import { Plus, Zap } from "lucide-react";
import { SummaryCard } from "@/components/SummaryCard";
import { CreateAutomationModal } from "@/components/CreateAutomationModal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleSwitch } from "@/components/ui/toggle";
import { useData } from "@/store/DataContext";

export function AutomationsPage() {
  const { automations, toggleAutomation, addAutomation } = useData();
  const [modalOpen, setModalOpen] = useState(false);

  const activeCount = automations.filter((a) => a.status === "Active").length;
  const totalEnrolled = automations.reduce((sum, a) => sum + a.enrolled, 0);
  const avgCompletion = automations.length
    ? automations.reduce((sum, a) => sum + a.completionRate, 0) / automations.length
    : 0;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total Automations" value={automations.length.toString()} />
        <SummaryCard label="Active" value={activeCount.toString()} caption={`of ${automations.length}`} />
        <SummaryCard label="Total Enrolled" value={totalEnrolled.toLocaleString()} />
        <SummaryCard label="Avg. Completion Rate" value={`${avgCompletion.toFixed(0)}%`} />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">Workflows</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-white hover:bg-accent/90"
        >
          <Plus className="h-4 w-4" /> Create Automation
        </button>
      </div>

      <div className="space-y-3">
        {automations.map((a) => (
          <Card key={a.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Zap className="h-4.5 w-4.5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">{a.name}</h3>
                  <Badge variant={a.status === "Active" ? "success" : "neutral"}>{a.status}</Badge>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{a.trigger}</p>
                <p className="mt-1 text-xs text-muted-foreground">{a.steps} step sequence</p>
              </div>
            </div>

            <div className="flex items-center gap-6 sm:gap-10">
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{a.enrolled.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">enrolled</p>
              </div>
              <div className="w-28">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Completion</span>
                  <span className="font-medium text-foreground">{a.completionRate}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full bg-accent"
                    style={{ width: `${a.completionRate}%` }}
                  />
                </div>
              </div>
              <ToggleSwitch
                checked={a.status === "Active"}
                onChange={() => toggleAutomation(a.id)}
                label={`Toggle ${a.name}`}
              />
            </div>
          </Card>
        ))}
      </div>

      {modalOpen && (
        <CreateAutomationModal onClose={() => setModalOpen(false)} onCreate={addAutomation} />
      )}
    </>
  );
}
