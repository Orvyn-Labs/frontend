import { Progress } from "@/components/ui/progress";
import { fundingPercent, formatDkt } from "@/lib/utils";

interface FundingProgressProps {
  raised: bigint;
  goal: bigint;
  showAmounts?: boolean;
}

export function FundingProgress({ raised, goal, showAmounts = true }: FundingProgressProps) {
  const pct = fundingPercent(raised, goal);

  return (
    <div className="space-y-2">
      <Progress value={pct} className="h-2" />
      {showAmounts && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatDkt(raised)} raised</span>
          <span className="font-medium text-foreground">{pct.toFixed(1)}%</span>
          <span>goal: {formatDkt(goal)}</span>
        </div>
      )}
    </div>
  );
}
