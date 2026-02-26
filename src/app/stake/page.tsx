"use client";

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
import { formatEth } from "@/lib/utils";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

function ClaimYieldSection({
  pendingYield,
  onSuccess,
}: {
  pendingYield: bigint | undefined;
  onSuccess: () => void;
}) {
  const { claimYield, txState } = useStakeWrite();

  return (
    <Card className="glass-morphism h-full">
      <CardHeader>
        <CardTitle className="text-base">Claim Yield</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm bg-green-500/10 p-3 rounded-xl border border-green-500/20">
          <span className="text-muted-foreground">Pending yield:</span>
          <span className="font-bold text-lg text-green-400">
            {pendingYield !== undefined ? formatEth(pendingYield) : "—"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Simulated ETH yield is distributed via the global reward index (O(1) algorithm).
          Claiming transfers your accumulated ETH to your wallet.
        </p>
        <TxButton
          txState={txState as "idle" | "pending" | "confirming" | "success" | "error"}
          idleLabel="Claim Yield"
          confirmingLabel="Claiming yield..."
          disabled={!pendingYield || pendingYield === 0n}
          onClick={async () => {
            try {
              await claimYield();
              onSuccess();
            } catch {}
          }}
          className="w-full glow"
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ConnectPrompt
          title="Connect to stake DKT"
          description="Connect your wallet to stake Dikti Tokens and earn simulated yield rewards."
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Stake DKT</h1>
            <p className="text-muted-foreground text-sm">
              Stake Dikti Tokens to earn simulated ETH yield.
            </p>
          </div>
          <NetworkBadge className="ml-auto" />
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.1}>
        <StakingStats data={stakingData} />
      </FadeIn>

      {/* Actions */}
      <StaggerContainer delay={0.2}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stake */}
          <StaggerItem>
            <Card className="glass-morphism h-full">
              <CardHeader>
                <CardTitle className="text-base">Stake Tokens</CardTitle>
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
            <Card className="glass-morphism h-full">
              <CardHeader>
                <CardTitle className="text-base">Unstake Tokens</CardTitle>
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

      <Separator className="opacity-10" />

      {/* Info box */}
      <FadeIn delay={0.5}>
        <div className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-6 text-sm text-muted-foreground space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/20 transition-all" />
          <p className="font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Protocol Logic & Benchmarking
          </p>
          <p className="leading-relaxed">
            DKT tokens are locked in the <code className="text-xs bg-white/5 px-1.5 py-0.5 border border-white/5 rounded text-blue-400 font-mono">StakingVault</code> for the lock
            period. The <code className="text-xs bg-white/5 px-1.5 py-0.5 border border-white/5 rounded text-violet-400 font-mono">YieldDistributor</code> uses a global reward index
            to track each staker&apos;s share in <span className="text-foreground font-bold italic">O(1) time</span> — gas cost remains fixed as the network scales.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
