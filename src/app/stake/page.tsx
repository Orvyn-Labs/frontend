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

function ClaimYieldSection({
  pendingYield,
  onSuccess,
}: {
  pendingYield: bigint | undefined;
  onSuccess: () => void;
}) {
  const { claimYield, txState, currentAction } = useStakeWrite();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Claim Yield</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Pending yield:</span>
          <span className="font-semibold text-green-400">
            {pendingYield !== undefined ? formatEth(pendingYield) : "—"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
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
          className="w-full"
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold">Stake DKT</h1>
          <p className="text-muted-foreground text-sm">
            Stake Dikti Tokens to earn simulated ETH yield.
          </p>
        </div>
        <NetworkBadge className="ml-auto" />
      </div>

      {/* Stats */}
      <StakingStats data={stakingData} />

      {/* Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stake */}
        <Card>
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

        {/* Unstake */}
        <Card>
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

        {/* Claim Yield */}
        <ClaimYieldSection pendingYield={pendingYield} onSuccess={refetch} />
      </div>

      <Separator />

      {/* Info box */}
      <div className="rounded-lg border border-border bg-card/30 p-4 text-sm text-muted-foreground space-y-1">
        <p className="font-medium text-foreground">How staking works</p>
        <p>
          DKT tokens are locked in the <code className="text-xs bg-muted px-1 rounded">StakingVault</code> for the lock
          period. The <code className="text-xs bg-muted px-1 rounded">YieldDistributor</code> uses a global reward index
          to track each staker&apos;s share in O(1) time — gas cost stays constant regardless of
          the number of stakers (thesis scaling benchmark).
        </p>
      </div>
    </div>
  );
}
