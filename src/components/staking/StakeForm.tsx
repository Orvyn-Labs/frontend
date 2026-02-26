"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TxButton } from "@/components/web3/TxButton";
import { useStakeWrite } from "@/hooks/useStakeWrite";
import { parseUnits } from "viem";

interface StakeFormProps {
  dktBalance: bigint | undefined;
  dktAllowance: bigint | undefined;
  onSuccess?: () => void;
}

export function StakeForm({ dktBalance, dktAllowance, onSuccess }: StakeFormProps) {
  const [amount, setAmount] = useState("");
  const { approveDkt, stake, txState, isSuccess } = useStakeWrite();

  const amountWei = amount ? parseUnits(amount, 18) : 0n;
  const needsApproval = dktAllowance !== undefined && amountWei > dktAllowance;
  const hasBalance = dktBalance !== undefined && amountWei <= dktBalance;

  async function handleAction() {
    if (!amount || !hasBalance) return;
    try {
      if (needsApproval) {
        await approveDkt(amount);
      } else {
        await stake(amount);
        setAmount("");
        onSuccess?.();
      }
    } catch {
      // surfaced via txState
    }
  }

  const idleLabel = needsApproval ? `Approve ${amount} DKT` : "Stake DKT";
  const isActionPending = txState === "pending" || txState === "confirming";

  return (
    <div className="space-y-4">
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

      {needsApproval && amount && (
        <p className="text-xs text-yellow-400">
          Step 1 of 2: Approve the StakingVault to spend your DKT first.
        </p>
      )}

      <TxButton
        txState={txState as "idle" | "pending" | "confirming" | "success" | "error"}
        idleLabel={idleLabel}
        disabled={!amount || !hasBalance || isSuccess}
        onClick={handleAction}
        className="w-full"
      />

      {!hasBalance && amount && (
        <p className="text-xs text-red-400">Insufficient DKT balance.</p>
      )}
    </div>
  );
}
