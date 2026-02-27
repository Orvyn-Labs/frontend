"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConnectPrompt } from "@/components/web3/ConnectPrompt";
import { NetworkBadge } from "@/components/web3/NetworkBadge";
import { TxButton } from "@/components/web3/TxButton";
import { StakingStats } from "@/components/staking/StakingStats";
import { StakeForm } from "@/components/staking/StakeForm";
import { UnstakeForm } from "@/components/staking/UnstakeForm";
import { useStaking } from "@/hooks/useStaking";
import { useStakeWrite } from "@/hooks/useStakeWrite";
import { formatDkt } from "@/lib/utils";
import { FadeIn, StaggerContainer, StaggerItem, ParallaxBackground } from "@/components/ui/motion";

function ClaimYieldSection({
  pendingYield,
  onSuccess,
}: {
  pendingYield: bigint | undefined;
  onSuccess: () => void;
}) {
  const { claimYield, reset, txState, isSuccess, currentAction } = useStakeWrite();

  useEffect(() => {
    if (isSuccess && currentAction === "claimYield") {
      onSuccess();
      const t = setTimeout(reset, 1500);
      return () => clearTimeout(t);
    }
  }, [isSuccess, currentAction]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card className="glass-morphism h-full border-white/5 hover:border-green-500/20 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          Claim Yield
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-1 items-center justify-center py-6 px-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 shadow-inner">
          <span className="text-[10px] uppercase tracking-widest font-black text-green-400/70">Accumulated Rewards</span>
          <span className="font-black text-3xl text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]">
            {pendingYield !== undefined ? formatDkt(pendingYield) : "—"}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed text-center italic">
          Simulated DKT yield is distributed via the global reward index (O(1) algorithm).
          Claiming transfers your accumulated DKT to your wallet.
        </p>
        <TxButton
          txState={txState as "idle" | "pending" | "confirming" | "success" | "error"}
          idleLabel="Claim Yield"
          confirmingLabel="Claiming yield..."
          disabled={!pendingYield || pendingYield === 0n || txState === "pending" || txState === "confirming"}
          onClick={async () => {
            try {
              await claimYield();
            } catch {}
          }}
          className="w-full h-11 glow-green rounded-xl font-bold tracking-tight"
        />
      </CardContent>
    </Card>
  );
}

export default function StakePage() {
  const { isConnected } = useAccount();
  const stakingData = useStaking();
  const { stakedBalance, pendingYield, dktBalance, dktAllowance, isLocked, lockExpiry, refetch } = stakingData;

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <ParallaxBackground />
        <FadeIn>
          <ConnectPrompt
            title="Connect to stake DKT"
            description="Connect your wallet to stake Dikti Tokens and earn simulated yield rewards."
          />
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
      <ParallaxBackground />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Stake DKT</h1>
              <p className="text-muted-foreground text-sm font-medium">
                Stake Dikti Tokens to earn simulated DKT yield.
              </p>
            </div>
            <NetworkBadge className="self-start sm:self-auto" />
          </div>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={0.1}>
          <StakingStats data={stakingData} />
        </FadeIn>

        {/* Actions */}
        <StaggerContainer delay={0.2} staggerDelay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stake */}
            <StaggerItem>
              <Card className="glass-morphism h-full border-white/5 hover:border-blue-500/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Stake Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StakeForm
                    dktBalance={dktBalance}
                    dktAllowance={dktAllowance}
                    onSuccess={refetch}
                  />
                </CardContent>
              </Card>
            </StaggerItem>

            {/* Unstake */}
            <StaggerItem>
              <Card className="glass-morphism h-full border-white/5 hover:border-violet-500/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    Unstake Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UnstakeForm
                    stakedBalance={stakedBalance}
                    isLocked={isLocked}
                    lockExpiry={lockExpiry}
                    onSuccess={refetch}
                  />
                </CardContent>
              </Card>
            </StaggerItem>

            {/* Claim Yield */}
            <StaggerItem>
              <ClaimYieldSection pendingYield={pendingYield} onSuccess={refetch} />
            </StaggerItem>
          </div>
        </StaggerContainer>

        <Separator className="opacity-5" />

        {/* Info box */}
        <FadeIn delay={0.5}>
          <div className="rounded-3xl border border-blue-500/10 bg-blue-500/5 p-8 text-sm text-muted-foreground space-y-4 relative overflow-hidden group backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/20 transition-all" />
            <p className="font-bold text-foreground flex items-center gap-3 text-base">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              Protocol Logic & Benchmarking
            </p>
            <p className="leading-relaxed text-sm">
              DKT tokens are locked in the <code className="text-xs bg-white/5 px-2 py-0.5 border border-white/10 rounded text-blue-400 font-mono">StakingVault</code> for the lock
              period. The <code className="text-xs bg-white/5 px-2 py-0.5 border border-white/10 rounded text-violet-400 font-mono">YieldDistributor</code> uses a global reward index
              to track each staker&apos;s share in <span className="text-white font-black italic">O(1) time</span> — gas cost remains fixed as the network scales.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
