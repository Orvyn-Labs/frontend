"use client";

import { use } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useChainId } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { FundingProgress } from "@/components/projects/FundingProgress";
import { DonateForm } from "@/components/projects/DonateForm";
import { TxButton } from "@/components/web3/TxButton";
import { NetworkBadge } from "@/components/web3/NetworkBadge";
import {
  shortenAddress,
  formatDeadline,
  formatEth,
  statusLabel,
  statusColor,
  isExpired,
  ProjectStatus,
} from "@/lib/utils";
import { useProject } from "@/hooks/useProject";
import { getContracts } from "@/lib/contracts";
import { FundingPoolAbi } from "@/lib/abis";
import { User, Clock, Target, Wallet } from "lucide-react";
import { useState } from "react";

interface Props {
  params: Promise<{ address: string }>;
}

export default function ProjectDetailPage({ params }: Props) {
  const { address: projectAddress } = use(params);
  const addr = projectAddress as `0x${string}`;

  const { address: userAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  const { title, researcher, fundingGoal, deadline, totalRaised, status, myContribution, isLoading, refetch } =
    useProject(addr);

  const [refundTxHash, setRefundTxHash] = useState<`0x${string}` | undefined>();
  const [withdrawTxHash, setWithdrawTxHash] = useState<`0x${string}` | undefined>();

  const { writeContractAsync: claimRefundWrite, isPending: refundPending } = useWriteContract();
  const { isLoading: refundConfirming, isSuccess: refundSuccess } = useWaitForTransactionReceipt({ hash: refundTxHash });

  const { writeContractAsync: withdrawWrite, isPending: withdrawPending } = useWriteContract();
  const { isLoading: withdrawConfirming, isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawTxHash });

  async function handleClaimRefund() {
    const hash = await claimRefundWrite({
      address: contracts.fundingPool,
      abi: FundingPoolAbi,
      functionName: "claimRefund",
      args: [addr],
    });
    setRefundTxHash(hash);
    refetch();
  }

  async function handleWithdraw() {
    const hash = await withdrawWrite({
      address: contracts.fundingPool,
      abi: FundingPoolAbi,
      functionName: "withdrawProjectFunds",
      args: [addr],
    });
    setWithdrawTxHash(hash);
    refetch();
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  const expired = deadline ? isExpired(deadline) : false;
  const isResearcher = userAddress && researcher && userAddress.toLowerCase() === researcher.toLowerCase();
  const canRefund = status === ProjectStatus.Refunding && myContribution && myContribution > 0n;
  const canWithdraw = status === ProjectStatus.Successful && isResearcher;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <NetworkBadge />
          {status !== undefined && (
            <Badge variant="outline" className={statusColor(status)}>
              {statusLabel(status)}
            </Badge>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">{title ?? "Loading..."}</h1>
        <p className="font-mono text-xs text-muted-foreground">{addr}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Project info */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Funding Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {totalRaised !== undefined && fundingGoal !== undefined ? (
                <FundingProgress raised={totalRaised} goal={fundingGoal} />
              ) : (
                <Skeleton className="h-8 w-full" />
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5" /> Funding Goal
                  </p>
                  <p className="font-semibold">{fundingGoal !== undefined ? formatEth(fundingGoal) : "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5" /> Total Raised
                  </p>
                  <p className="font-semibold text-blue-400">{totalRaised !== undefined ? formatEth(totalRaised) : "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" /> Researcher
                  </p>
                  <p className="font-mono text-xs">{researcher ? shortenAddress(researcher) : "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Deadline
                  </p>
                  <p className={`text-sm ${expired ? "text-red-400" : ""}`}>
                    {deadline !== undefined ? formatDeadline(deadline) : "—"}
                    {expired && " (expired)"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Researcher actions */}
          {isConnected && (canRefund || canWithdraw) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {myContribution !== undefined && myContribution > 0n && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Your contribution:</span>
                    <span className="font-medium">{formatEth(myContribution)}</span>
                  </div>
                )}

                {canRefund && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        This project failed. You can claim your refund.
                      </p>
                      <TxButton
                        txState={
                          refundPending ? "pending" :
                          refundConfirming ? "confirming" :
                          refundSuccess ? "success" : "idle"
                        }
                        idleLabel="Claim Refund"
                        onClick={handleClaimRefund}
                        variant="outline"
                        className="w-full"
                      />
                    </div>
                  </>
                )}

                {canWithdraw && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Funding goal reached! Withdraw your funds.
                      </p>
                      <TxButton
                        txState={
                          withdrawPending ? "pending" :
                          withdrawConfirming ? "confirming" :
                          withdrawSuccess ? "success" : "idle"
                        }
                        idleLabel="Withdraw Funds"
                        onClick={handleWithdraw}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Donate */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fund This Research</CardTitle>
            </CardHeader>
            <CardContent>
              <DonateForm
                projectAddress={addr}
                status={status ?? 0}
                onSuccess={refetch}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
