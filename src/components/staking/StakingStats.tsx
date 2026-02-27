"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDkt, formatEth, formatDeadline } from "@/lib/utils";
import type { useStaking } from "@/hooks/useStaking";
import { Coins, Lock, TrendingUp, Users, GitBranch } from "lucide-react";

type StakingData = ReturnType<typeof useStaking>;

export function StakingStats({ data }: { data: StakingData }) {
  const { stakedBalance, pendingYield, lockExpiry, totalStaked, dktBalance, isLocked, yieldSplit, isLoading } = data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-4 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const hasActiveSplit = yieldSplit && yieldSplit.donateBps > 0 &&
    yieldSplit.targetProject !== "0x0000000000000000000000000000000000000000";

  const stats = [
    {
      icon: Coins,
      label: "Your Staked",
      value: stakedBalance !== undefined ? formatDkt(stakedBalance) : "—",
      sub: dktBalance !== undefined ? `Wallet: ${formatDkt(dktBalance)}` : "",
      color: "text-blue-400",
    },
    {
      icon: TrendingUp,
      label: "Pending Yield",
      value: pendingYield !== undefined ? formatEth(pendingYield) : "—",
      sub: "Claimable ETH",
      color: "text-green-400",
    },
    {
      icon: Lock,
      label: "Lock Status",
      value: isLocked ? "Locked" : "Unlocked",
      sub: lockExpiry && lockExpiry > 0n ? `Until ${formatDeadline(lockExpiry)}` : "No lock",
      color: isLocked ? "text-yellow-400" : "text-green-400",
    },
    {
      icon: Users,
      label: "Protocol Total",
      value: totalStaked !== undefined ? formatDkt(totalStaked) : "—",
      sub: "Total DKT staked",
      color: "text-violet-400",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, sub, color }) => (
          <Card key={label}>
            <CardContent className="pt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon className={`h-3.5 w-3.5 ${color}`} />
                {label}
              </div>
              <p className={`text-lg font-bold ${color}`}>{value}</p>
              {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active yield-split banner */}
      {hasActiveSplit && yieldSplit && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm">
          <GitBranch className="h-4 w-4 text-blue-400 shrink-0" />
          <span className="text-muted-foreground">Active yield split:</span>
          <span className="font-bold text-blue-400">{yieldSplit.donateBps / 100}%</span>
          <span className="text-muted-foreground">donated to</span>
          <span className="font-mono text-xs bg-white/5 px-2 py-0.5 rounded border border-white/10 text-white/80">
            {yieldSplit.targetProject.slice(0, 8)}…{yieldSplit.targetProject.slice(-6)}
          </span>
          <span className="text-xs text-white/40 ml-auto">locked until full unstake</span>
        </div>
      )}
    </div>
  );
}
