import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Subscriber, SubscriberStatus } from "@/data/subscribers";
import { cn } from "@/lib/utils";

const STATUSES: SubscriberStatus[] = ["Active", "Inactive", "Unsubscribed"];

interface AddSubscriberModalProps {
  onClose: () => void;
  onCreate: (subscriber: Subscriber) => void;
}

export function AddSubscriberModal({ onClose, onCreate }: AddSubscriberModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscriberStatus>("Active");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const canSubmit = name.trim() !== "" && /\S+@\S+\.\S+/.test(email);

  function handleSubmit() {
    onCreate({
      id: `s${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      status,
      joinedDate: "Just now",
      engagement: "Medium",
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
        aria-label="Add subscriber"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-semibold">Add Subscriber</h2>
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
              placeholder="e.g. Jordan Blake"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan@company.com"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-foreground">Status</span>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2 text-sm font-medium",
                    status === s
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
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
            Add Subscriber
          </button>
        </div>
      </div>
    </div>
  );
}
