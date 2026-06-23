import { Card } from "@/components/ui/card";

interface SummaryCardProps {
  label: string;
  value: string;
  caption?: string;
}

export function SummaryCard({ label, value, caption }: SummaryCardProps) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      {caption && <p className="mt-1 text-xs text-muted-foreground">{caption}</p>}
    </Card>
  );
}
