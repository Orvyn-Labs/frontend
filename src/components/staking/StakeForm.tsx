"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TxButton } from "@/components/web3/TxButton";
import { useStakeWrite } from "@/hooks/useStakeWrite";
import { useProjects } from "@/hooks/useProjects";
import { parseUnits } from "viem";

const ZERO_ADDR = "0x0000000000000000000000000000000000000000" as `0x${string}`;

interface StakeFormProps {
  dktBalance: bigint | undefined;
  dktAllowance: bigint | undefined;
  onSuccess?: () => void;
}

export function StakeForm({ dktBalance, dktAllowance, onSuccess }: StakeFormProps) {
  const [amount, setAmount] = useState("");
  const [donatePercent, setDonatePercent] = useState(0);
  const [selectedProject, setSelectedProject] = useState<`0x${string}` | "">("");

  // Keep a ref to pending stake args so we can auto-execute stake after approve confirms
  const pendingStakeRef = useRef<{ amount: string; target: `0x${string}`; bps: number } | null>(null);

  const { approveDkt, stake, reset, txState, isSuccess, currentAction } = useStakeWrite();
  const { projects, isLoading: loadingProjects } = useProjects();

  const activeProjects = projects.filter((p) => p.status === 0);

  const amountWei = amount ? parseUnits(amount, 18) : 0n;
  const needsApproval = dktAllowance !== undefined && amountWei > dktAllowance;
  const hasBalance = dktBalance !== undefined && amountWei <= dktBalance && amountWei > 0n;
  const donateBps = Math.round(donatePercent * 100);
  const isDonating = donateBps > 0;
  const projectValid = !isDonating || selectedProject !== "";
  const isActionPending = txState === "pending" || txState === "confirming";

  const canSubmit = !!amount && hasBalance && projectValid && !isActionPending && txState !== "success";

  // After approve confirms → automatically proceed to stake
  useEffect(() => {
    if (isSuccess && currentAction === "approve" && pendingStakeRef.current) {
      const { amount: a, target, bps } = pendingStakeRef.current;
      pendingStakeRef.current = null;
      // Small delay to let UI show "Done!" briefly, then stake
      setTimeout(() => {
        stake(a, target, bps).catch(() => {});
      }, 500);
    }
  }, [isSuccess, currentAction]); // eslint-disable-line react-hooks/exhaustive-deps

  // After stake confirms → refetch + reset form
  useEffect(() => {
    if (isSuccess && currentAction === "stake") {
      onSuccess?.();
      const t = setTimeout(() => {
        setAmount("");
        setDonatePercent(0);
        setSelectedProject("");
        reset();
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [isSuccess, currentAction]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit() {
    if (!canSubmit) return;
    const target = isDonating ? (selectedProject as `0x${string}`) : ZERO_ADDR;

    try {
      if (needsApproval) {
        // Store args, then approve — useEffect will auto-stake after confirm
        pendingStakeRef.current = { amount, target, bps: donateBps };
        await approveDkt(amount);
      } else {
        await stake(amount, target, donateBps);
      }
    } catch {
      // error surfaced via txState
    }
  }

  // Compute button label based on current state
  function getIdleLabel() {
    if (needsApproval) return `Approve ${amount || "?"} DKT`;
    return "Stake DKT";
  }

  // During approve step, show a custom confirming label
  const confirmingLabel =
    currentAction === "approve" ? "Approving… (stake will follow)" : "Staking…";

  return (
    <div className="space-y-5">
      {/* Amount */}
      <div className="space-y-1.5">
        <Label htmlFor="stake-amount">Amount (DKT)</Label>
        <Input
          id="stake-amount"
          type="number"
          placeholder="100"
          min="0"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isActionPending}
        />
        {dktBalance !== undefined && (
          <button
            type="button"
            className="text-xs text-blue-400 hover:underline"
            onClick={() => setAmount((Number(dktBalance) / 1e18).toString())}
          >
            Max: {(Number(dktBalance) / 1e18).toLocaleString()} DKT
          </button>
        )}
      </div>

      {/* Yield-split slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="donate-slider">Donate yield to research</Label>
          <span className="text-sm font-semibold text-blue-400">{donatePercent}%</span>
        </div>
        <input
          id="donate-slider"
          type="range"
          min={0}
          max={100}
          step={5}
          value={donatePercent}
          onChange={(e) => setDonatePercent(Number(e.target.value))}
          disabled={isActionPending}
          className="w-full accent-blue-500 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-white/40">
          <span>0% (all to you)</span>
          <span>100% (all to project)</span>
        </div>
      </div>

      {/* Project selector */}
      {isDonating && (
        <div className="space-y-1.5">
          <Label htmlFor="project-select">Target research project</Label>
          {loadingProjects ? (
            <p className="text-xs text-white/40">Loading projects…</p>
          ) : activeProjects.length === 0 ? (
            <p className="text-xs text-yellow-400">No active projects available.</p>
          ) : (
            <select
              id="project-select"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value as `0x${string}`)}
              disabled={isActionPending}
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="bg-gray-900">— select a project —</option>
              {activeProjects.map((p) => (
                <option key={p.address} value={p.address} className="bg-gray-900">
                  {p.title} ({p.address.slice(0, 6)}…{p.address.slice(-4)})
                </option>
              ))}
            </select>
          )}
          {isDonating && !projectValid && (
            <p className="text-xs text-red-400">Select a project to donate yield to.</p>
          )}
        </div>
      )}

      {/* Split summary */}
      {isDonating && donatePercent < 100 && (
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70 space-y-1">
          <div className="flex justify-between">
            <span>You receive</span>
            <span className="font-semibold text-green-400">{100 - donatePercent}% of yield</span>
          </div>
          <div className="flex justify-between">
            <span>Project receives</span>
            <span className="font-semibold text-blue-400">{donatePercent}% of yield</span>
          </div>
        </div>
      )}
      {donatePercent === 100 && (
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-xs text-blue-300">
          100% of your yield will be donated to the selected project.
        </div>
      )}

      {needsApproval && amount && !isActionPending && (
        <p className="text-xs text-yellow-400">
          Approval needed first — stake will execute automatically after approval confirms.
        </p>
      )}

      <TxButton
        txState={txState}
        idleLabel={getIdleLabel()}
        confirmingLabel={confirmingLabel}
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="w-full"
      />

      {!hasBalance && amount && amountWei > 0n && (
        <p className="text-xs text-red-400">Insufficient DKT balance.</p>
      )}
    </div>
  );
}
