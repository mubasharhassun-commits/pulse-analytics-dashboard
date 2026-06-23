import { useEffect, useState } from "react";
import { Check, ChevronLeft, X } from "lucide-react";
import type { Campaign } from "@/data/mock";
import { cn } from "@/lib/utils";

const STEPS = ["Details", "Audience", "Content", "Review"] as const;

const AUDIENCES = [
  { id: "all", label: "All Subscribers", count: "48,250 contacts" },
  { id: "active", label: "Active Users", count: "32,140 contacts" },
  { id: "inactive", label: "Inactive Users", count: "9,800 contacts" },
  { id: "new", label: "New Subscribers (last 30 days)", count: "2,310 contacts" },
];

const TEMPLATES = [
  { id: "newsletter", label: "Newsletter", description: "Weekly digest layout with article blocks" },
  { id: "promo", label: "Promotional", description: "Hero banner, offer, single CTA" },
  { id: "announcement", label: "Product Announcement", description: "Feature highlight with screenshot" },
  { id: "reengagement", label: "Re-engagement", description: "Win-back copy for inactive contacts" },
];

interface WizardState {
  name: string;
  subject: string;
  audience: string | null;
  template: string | null;
  schedule: "now" | "later";
  date: string;
  time: string;
}

const initialState: WizardState = {
  name: "",
  subject: "",
  audience: null,
  template: null,
  schedule: "now",
  date: "",
  time: "",
};

interface CampaignWizardProps {
  onClose: () => void;
  onCreate: (campaign: Campaign) => void;
}

export function CampaignWizard({ onClose, onCreate }: CampaignWizardProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<WizardState>(initialState);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const canAdvance =
    (step === 0 && form.name.trim() !== "" && form.subject.trim() !== "") ||
    (step === 1 && form.audience !== null) ||
    (step === 2 && form.template !== null) ||
    (step === 3 && (form.schedule === "now" || (form.date !== "" && form.time !== "")));

  function handleSubmit() {
    const audience = AUDIENCES.find((a) => a.id === form.audience);
    const scheduled = form.schedule === "later";

    onCreate({
      id: `c${Date.now()}`,
      name: form.name,
      status: scheduled ? "Scheduled" : "Sending",
      sent: 0,
      openRate: 0,
      clickRate: 0,
      date: scheduled
        ? new Date(`${form.date}T${form.time}`).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Just now",
    });
    void audience;
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Create new campaign"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-semibold">New Campaign</h2>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-6 py-4">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  i < step
                    ? "bg-accent text-white"
                    : i === step
                      ? "bg-accent/15 text-accent ring-1 ring-accent"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  i === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2">
          {step === 0 && (
            <div className="space-y-4">
              <Field label="Campaign name">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Summer Sale — 48hr Flash Offer"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </Field>
              <Field label="Subject line">
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. 48 hours only: 30% off everything"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-2">
              {AUDIENCES.map((a) => (
                <OptionCard
                  key={a.id}
                  selected={form.audience === a.id}
                  onClick={() => setForm({ ...form, audience: a.id })}
                  title={a.label}
                  subtitle={a.count}
                />
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              {TEMPLATES.map((t) => (
                <OptionCard
                  key={t.id}
                  selected={form.template === t.id}
                  onClick={() => setForm({ ...form, template: t.id })}
                  title={t.label}
                  subtitle={t.description}
                />
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="rounded-lg border border-border p-4 text-sm">
                <Summary label="Name" value={form.name} />
                <Summary label="Subject" value={form.subject} />
                <Summary
                  label="Audience"
                  value={AUDIENCES.find((a) => a.id === form.audience)?.label ?? ""}
                />
                <Summary
                  label="Template"
                  value={TEMPLATES.find((t) => t.id === form.template)?.label ?? ""}
                  last
                />
              </div>

              <div className="flex gap-2">
                {(["now", "later"] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setForm({ ...form, schedule: option })}
                    className={cn(
                      "flex-1 rounded-lg border px-4 py-2 text-sm font-medium",
                      form.schedule === option
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {option === "now" ? "Send now" : "Schedule for later"}
                  </button>
                ))}
              </div>

              {form.schedule === "later" && (
                <div className="flex gap-3">
                  <Field label="Date">
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                  </Field>
                  <Field label="Time">
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                  </Field>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-0"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance}
              className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canAdvance}
              className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              Create Campaign
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function OptionCard({
  title,
  subtitle,
  selected,
  onClick,
}: {
  title: string;
  subtitle: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left",
        selected ? "border-accent bg-accent/10" : "border-border hover:bg-muted",
      )}
    >
      <span>
        <span className="block text-sm font-medium text-foreground">{title}</span>
        <span className="block text-xs text-muted-foreground">{subtitle}</span>
      </span>
      {selected && (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
          <Check className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}

function Summary({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={cn("flex justify-between py-1.5", !last && "border-b border-border")}>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
