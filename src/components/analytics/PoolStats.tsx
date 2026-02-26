"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEth, formatDkt } from "@/lib/utils";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Banknote, BarChart3, Coins, FlaskConical } from "lucide-react";

export function PoolStats() {
  const { totalDonations, totalYieldDistributed, totalPool, totalStaked, projectCount, currentEpoch, isLoading } =
    useAnalytics();

  const stats = [
    { icon: Banknote, label: "Total Donations", value: totalDonations, format: formatEth, color: "text-blue-400" },
    { icon: BarChart3, label: "Yield Distributed", value: totalYieldDistributed, format: formatEth, color: "text-green-400" },
    { icon: Coins, label: "Total Staked", value: totalStaked, format: formatDkt, color: "text-violet-400" },
    { icon: FlaskConical, label: "Projects Created", value: projectCount !== undefined ? BigInt(projectCount) : undefined, format: (v: bigint) => v.toString(), color: "text-amber-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, value, format, color }) => (
        <Card key={label}>
          <CardContent className="pt-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon className={`h-3.5 w-3.5 ${color}`} />
              {label}
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <p className={`text-lg font-bold ${color}`}>
                {value !== undefined ? format(value) : "—"}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
