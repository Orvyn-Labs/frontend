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
import { FadeIn, StaggerContainer, StaggerItem, ParallaxBackground } from "@/components/ui/motion";

interface Props {
  params: Promise<{ address: string }>;
}

export default function ProjectDetailPage({ params }: Props) {
  const { address: projectAddress } = use(params);
  const addr = projectAddress as `0x${string}`;

  const { address: userAddress, isConnected } = useAccount();

  const { title, researcher, goalAmount, deadline, totalRaised, status, myContribution, poolBalance, isLoading, refetch } =
    useProject(addr);

  const [refundTxHash, setRefundTxHash] = useState<`0x${string}` | undefined>();
  const [withdrawTxHash, setWithdrawTxHash] = useState<`0x${string}` | undefined>();

  const { writeContractAsync: claimRefundWrite, isPending: refundPending } = useWriteContract();
  const { isLoading: refundConfirming, isSuccess: refundSuccess } = useWaitForTransactionReceipt({ hash: refundTxHash });

  const { writeContractAsync: withdrawWrite, isPending: withdrawPending } = useWriteContract();
  const { isLoading: withdrawConfirming, isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawTxHash });

  const [finalizeTxHash, setFinalizeTxHash] = useState<`0x${string}` | undefined>();
  const { writeContractAsync: finalizeWrite, isPending: finalizePending } = useWriteContract();
  const { isLoading: finalizeConfirming, isSuccess: finalizeSuccess } = useWaitForTransactionReceipt({ hash: finalizeTxHash });

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

  async function handleFinalize() {
    const hash = await finalizeWrite({
      address: addr,
      abi: ResearchProjectAbi,
      functionName: "finalize",
    });
    setFinalizeTxHash(hash);
    refetch();
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <ParallaxBackground />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-14 w-2/3" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
          <div className="lg:col-span-2">
            <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  const expired = deadline ? isExpired(deadline) : false;
  const isResearcher = userAddress && researcher && userAddress.toLowerCase() === researcher.toLowerCase();
  
  const goalMet = totalRaised !== undefined && goalAmount !== undefined && totalRaised >= goalAmount;
  const canFinalize = status === ProjectStatus.Active && (goalMet || expired);
  
  const canRefund = status === ProjectStatus.Failed && myContribution && myContribution > 0n;
  const canWithdraw = status === ProjectStatus.Succeeded && isResearcher && (poolBalance ?? 0n) > 0n;

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
      <ParallaxBackground />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 relative">
        <FadeIn>
          <Link 
            href="/projects" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-blue-400 transition-colors group mb-6"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Project Registry
          </Link>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
              <NetworkBadge />
              {status !== undefined && (
                <Badge variant="outline" className={`${statusColor(status)} px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] border-white/5`}>
                  {statusLabel(status)}
                </Badge>
              )}
            </div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.1] max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              {title ?? "Loading Research Project..."}
            </h1>
            <div className="flex items-center gap-3">
              <p className="font-mono text-[10px] text-white/40 bg-white/5 inline-block px-4 py-2 rounded-xl border border-white/5 uppercase tracking-widest font-black">
                Registry ID: {addr.slice(0, 10)}...{addr.slice(-8)}
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Project info */}
          <div className="lg:col-span-2 space-y-10">
            <FadeIn delay={0.1}>
              <Card className="glass-morphism border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <div className="p-10 space-y-10">
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Funding Distribution
                    </h3>
                    {totalRaised !== undefined && goalAmount !== undefined ? (
                      <div className="p-8 rounded-[1.5rem] bg-white/5 border border-white/5 shadow-inner">
                        <FundingProgress raised={totalRaised} goal={goalAmount} />
                      </div>
                    ) : (
                      <Skeleton className="h-10 w-full" />
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <p className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em] flex items-center gap-2.5 opacity-60">
                        <Target className="h-3.5 w-3.5 text-blue-400" /> Research Goal
                      </p>
                      <p className="text-3xl font-black tracking-tight">{goalAmount !== undefined ? formatDkt(goalAmount) : "—"}</p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em] flex items-center gap-2.5 opacity-60">
                        <Wallet className="h-3.5 w-3.5 text-green-400" /> Direct Donations
                      </p>
                      <p className="text-3xl font-black tracking-tight text-blue-400">{totalRaised !== undefined ? formatDkt(totalRaised) : "—"}</p>
                    </div>
                    {(poolBalance !== undefined && poolBalance > 0n) && (
                      <div className="space-y-4 col-span-full p-6 rounded-2xl bg-green-500/5 border border-green-500/10">
                        <p className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em] flex items-center gap-2.5 opacity-60">
                          <TrendingUp className="h-3.5 w-3.5 text-green-400" /> Yield Routing (FundingPool)
                        </p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-4xl font-black tracking-tight text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                            {formatDkt(poolBalance)}
                          </p>
                          <span className="text-[10px] font-black uppercase tracking-widest text-green-400/50">Simulated DKT Yield</span>
                        </div>
                        <p className="text-[11px] text-white/30 italic">Automated DKT routing from protocol staker yield splits</p>
                      </div>
                    )}
                    <div className="space-y-3">
                      <p className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em] flex items-center gap-2.5 opacity-60">
                        <User className="h-3.5 w-3.5 text-violet-400" /> Principal Researcher
                      </p>
                      <p className="font-mono text-xs font-black bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 inline-block text-white/80">{researcher ? shortenAddress(researcher, 6) : "—"}</p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em] flex items-center gap-2.5 opacity-60">
                        <Clock className="h-3.5 w-3.5 text-amber-400" /> Registry Deadline
                      </p>
                      <p className={`text-sm font-black tracking-wide ${expired ? "text-red-400" : "text-white/90"}`}>
                        {deadline !== undefined ? formatDeadline(deadline) : "—"}
                        {expired && <span className="ml-2 opacity-50 font-medium">(REGISTRY EXPIRED)</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </FadeIn>

            {/* Researcher/Protocol actions */}
            {isConnected && (canRefund || canWithdraw || canFinalize) && (
              <FadeIn delay={0.2}>
                <Card className="glass-morphism border-white/10 rounded-[2.5rem] overflow-hidden glow-blue">
                  <CardHeader className="bg-white/5 border-b border-white/5 py-6 px-10">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Protocol Execution Hub</CardTitle>
                  </CardHeader>
                  <CardContent className="p-10 space-y-8">
                    {myContribution !== undefined && myContribution > 0n && (
                      <div className="flex items-center justify-between py-6 px-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Your Commitment:</span>
                        <span className="font-black text-2xl text-blue-400">{formatDkt(myContribution)}</span>
                      </div>
                    )}

                    {canFinalize && (
                      <div className="space-y-6">
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                          {goalMet 
                            ? "Goal achieved! The project is eligible for protocol finalization to secure funds."
                            : "Deadline passed. The project state must be finalized to enable refunds."}
                        </p>
                        <TxButton
                          txState={
                            finalizePending ? "pending" :
                            finalizeConfirming ? "confirming" :
                            finalizeSuccess ? "success" : "idle"
                          }
                          idleLabel="Finalize Protocol State"
                          onClick={handleFinalize}
                          className="w-full h-14 rounded-2xl font-black uppercase tracking-widest glow shadow-blue-500/20"
                        />
                      </div>
                    )}

                    {canRefund && (
                      <div className="space-y-6">
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                          Registry threshold not met. As an authorized donor, you are entitled to a full protocol refund of your DKT commitment.
                        </p>
                        <TxButton
                          txState={
                            refundPending ? "pending" :
                            refundConfirming ? "confirming" :
                            refundSuccess ? "success" : "idle"
                          }
                          idleLabel="Claim Protocol Refund"
                          onClick={handleClaimRefund}
                          variant="outline"
                          className="w-full h-14 rounded-2xl font-black uppercase tracking-widest border-white/10 hover:bg-white/5 transition-all"
                        />
                      </div>
                    )}

                    {canWithdraw && (
                      <div className="space-y-6">
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                          Funding threshold achieved! As the verified researcher, you may now execute the withdrawal of the aggregated project funds.
                        </p>
                        <TxButton
                          txState={
                            withdrawPending ? "pending" :
                            withdrawConfirming ? "confirming" :
                            withdrawSuccess ? "success" : "idle"
                          }
                          idleLabel="Execute Fund Withdrawal"
                          onClick={handleWithdraw}
                          className="w-full h-14 rounded-2xl font-black uppercase tracking-widest glow shadow-blue-500/20"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </FadeIn>
            )}
          </div>

          {/* Right: Donate */}
          <div className="space-y-8">
            <FadeIn delay={0.3}>
              <Card className="glass-morphism border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="bg-blue-500/10 border-b border-blue-500/10 py-8 px-8">
                  <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    Fund Research
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <DonateForm
                    projectAddress={addr}
                    status={status ?? 0}
                    onSuccess={refetch}
                  />
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 text-[9px] text-muted-foreground uppercase tracking-[0.3em] font-black space-y-5">
                <div className="flex items-center justify-between">
                  <span>Security Audit</span>
                  <span className="text-amber-500/50">In Progress</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Network ID</span>
                  <span className="text-white/60">Base Sepolia</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Logic Standard</span>
                  <span className="text-white/60">UUPS Proxy</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
