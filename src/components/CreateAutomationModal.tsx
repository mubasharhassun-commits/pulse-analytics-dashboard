import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Automation } from "@/data/automations";

interface CreateAutomationModalProps {
  onClose: () => void;
  onCreate: (automation: Automation) => void;
}

export function CreateAutomationModal({ onClose, onCreate }: CreateAutomationModalProps) {
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("");
  const [steps, setSteps] = useState(2);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const canSubmit = name.trim() !== "" && trigger.trim() !== "";

  function handleSubmit() {
    onCreate({
      id: `a${Date.now()}`,
      name: name.trim(),
      trigger: trigger.trim(),
      steps,
      status: "Active",
      enrolled: 0,
      completionRate: 0,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Create automation"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-semibold">Create Automation</h2>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cart Abandonment Recovery"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Trigger</span>
            <input
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              placeholder="e.g. Adds item to cart, no checkout in 2h"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              Number of steps: {steps}
            </span>
            <input
              type="range"
              min={1}
              max={5}
              value={steps}
              onChange={(e) => setSteps(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            Create Automation
          </button>
        </div>
      </div>
    </div>
  );
}
