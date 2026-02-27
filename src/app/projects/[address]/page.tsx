"use client";

import { use } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
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
  formatDkt,
  statusLabel,
  statusColor,
  isExpired,
  ProjectStatus,
} from "@/lib/utils";
import { useProject } from "@/hooks/useProject";
import { ResearchProjectAbi } from "@/lib/abis";
import { User, Clock, Target, Wallet, ArrowLeft, TrendingUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

interface Props {
  params: Promise<{ address: string }>;
}

export default function ProjectDetailPage({ params }: Props) {
  const { address: projectAddress } = use(params);
  const addr = projectAddress as `0x${string}`;

  const { address: userAddress, isConnected } = useAccount();

  const { title, researcher, goalAmount, deadline, totalRaised, status, myContribution, fundsWithdrawn, poolBalance, isLoading, refetch } =
    useProject(addr);

  const [refundTxHash, setRefundTxHash] = useState<`0x${string}` | undefined>();
  const [withdrawTxHash, setWithdrawTxHash] = useState<`0x${string}` | undefined>();

  const { writeContractAsync: claimRefundWrite, isPending: refundPending } = useWriteContract();
  const { isLoading: refundConfirming, isSuccess: refundSuccess } = useWaitForTransactionReceipt({ hash: refundTxHash });

  const { writeContractAsync: withdrawWrite, isPending: withdrawPending } = useWriteContract();
  const { isLoading: withdrawConfirming, isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawTxHash });

  async function handleClaimRefund() {
    const hash = await claimRefundWrite({
      address: addr,
      abi: ResearchProjectAbi,
      functionName: "claimRefund",
    });
    setRefundTxHash(hash);
    refetch();
  }

  async function handleWithdraw() {
    // Pass poolBalance — the actual DKT allocation for this project in FundingPool.
    // This includes both direct donations forwarded on finalize() and yield routed by stakers.
    const hash = await withdrawWrite({
      address: addr,
      abi: ResearchProjectAbi,
      functionName: "withdrawFunds",
      args: [poolBalance ?? 0n],
    });
    setWithdrawTxHash(hash);
    refetch();
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-2/3" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  const expired = deadline ? isExpired(deadline) : false;
  const isResearcher = userAddress && researcher && userAddress.toLowerCase() === researcher.toLowerCase();
  const canRefund = status === ProjectStatus.Failed && myContribution && myContribution > 0n;
  const canWithdraw = status === ProjectStatus.Succeeded && isResearcher && !fundsWithdrawn;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 min-h-screen">
      <FadeIn>
        <Link 
          href="/projects" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-400 transition-colors group mb-4"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <NetworkBadge />
            {status !== undefined && (
              <Badge variant="outline" className={`${statusColor(status)} px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]`}>
                {statusLabel(status)}
              </Badge>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">{title ?? "Loading..."}</h1>
          <p className="font-mono text-xs text-muted-foreground bg-white/5 inline-block px-3 py-1.5 rounded-lg border border-white/5">{addr}</p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Project info */}
        <div className="lg:col-span-2 space-y-8">
          <FadeIn delay={0.1}>
            <Card className="glass-morphism border-none shadow-2xl shadow-blue-500/5 rounded-3xl overflow-hidden">
              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-60">Funding Progress</h3>
                  {totalRaised !== undefined && goalAmount !== undefined ? (
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                      <FundingProgress raised={totalRaised} goal={goalAmount} />
                    </div>
                  ) : (
                    <Skeleton className="h-8 w-full" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs uppercase font-black tracking-widest flex items-center gap-2">
                      <Target className="h-3.5 w-3.5 text-blue-400" /> Goal
                    </p>
                    <p className="text-2xl font-black">{goalAmount !== undefined ? formatDkt(goalAmount) : "—"}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs uppercase font-black tracking-widest flex items-center gap-2">
                      <Wallet className="h-3.5 w-3.5 text-green-400" /> Direct Donations
                    </p>
                    <p className="text-2xl font-black text-blue-400">{totalRaised !== undefined ? formatDkt(totalRaised) : "—"}</p>
                  </div>
                  {(poolBalance !== undefined && poolBalance > 0n) && (
                    <div className="space-y-2 col-span-2">
                      <p className="text-muted-foreground text-xs uppercase font-black tracking-widest flex items-center gap-2">
                        <TrendingUp className="h-3.5 w-3.5 text-green-400" /> Yield Donations (FundingPool)
                      </p>
                      <p className="text-xl font-black text-green-400">{formatDkt(poolBalance)}</p>
                      <p className="text-xs text-white/40">DKT routed from staker yield splits</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs uppercase font-black tracking-widest flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-violet-400" /> Researcher
                    </p>
                    <p className="font-mono text-sm font-bold bg-white/5 px-2 py-1 rounded border border-white/5">{researcher ? shortenAddress(researcher) : "—"}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs uppercase font-black tracking-widest flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-amber-400" /> Deadline
                    </p>
                    <p className={`text-sm font-bold ${expired ? "text-red-400" : ""}`}>
                      {deadline !== undefined ? formatDeadline(deadline) : "—"}
                      {expired && " (expired)"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </FadeIn>

          {/* Researcher actions */}
          {isConnected && (canRefund || canWithdraw) && (
            <FadeIn delay={0.2}>
              <Card className="glass-morphism border-none rounded-3xl overflow-hidden glow">
                <CardHeader className="bg-white/5 border-b border-white/5">
                  <CardTitle className="text-base font-black uppercase tracking-widest">Protocol Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {myContribution !== undefined && myContribution > 0n && (
                    <div className="flex items-center justify-between text-sm bg-white/5 p-4 rounded-2xl border border-white/5">
                      <span className="text-muted-foreground">Your contribution:</span>
                      <span className="font-black text-blue-400">{formatDkt(myContribution)}</span>
                    </div>
                  )}

                  {canRefund && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        This project did not reach its goal. As a donor, you are entitled to a full refund of your DKT.
                      </p>
                      <TxButton
                        txState={
                          refundPending ? "pending" :
                          refundConfirming ? "confirming" :
                          refundSuccess ? "success" : "idle"
                        }
                        idleLabel="Claim My Refund"
                        onClick={handleClaimRefund}
                        variant="outline"
                        className="w-full h-12 rounded-2xl font-bold"
                      />
                    </div>
                  )}

                  {canWithdraw && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Funding goal reached! As the researcher, you can now withdraw the raised funds to your wallet.
                      </p>
                      <TxButton
                        txState={
                          withdrawPending ? "pending" :
                          withdrawConfirming ? "confirming" :
                          withdrawSuccess ? "success" : "idle"
                        }
                        idleLabel="Withdraw Project Funds"
                        onClick={handleWithdraw}
                        className="w-full h-12 rounded-2xl font-bold glow"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          )}
        </div>

        {/* Right: Donate */}
        <div className="space-y-6">
          <FadeIn delay={0.3}>
            <Card className="glass-morphism border-none rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/5">
              <CardHeader className="bg-blue-500/10 border-b border-blue-500/10">
                <CardTitle className="text-lg font-black tracking-tight">Fund Research</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <DonateForm
                  projectAddress={addr}
                  status={status ?? 0}
                  onSuccess={refetch}
                />
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-[10px] text-muted-foreground uppercase tracking-widest font-black space-y-4">
              <p>Security Audit: Pending</p>
              <p>Network: Base Sepolia</p>
              <p>Standard: ERC-1967 Proxy</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
