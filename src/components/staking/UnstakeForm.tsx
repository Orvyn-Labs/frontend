"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TxButton } from "@/components/web3/TxButton";
import { useStakeWrite } from "@/hooks/useStakeWrite";
import { parseUnits } from "viem";
import { formatDeadline } from "@/lib/utils";

interface UnstakeFormProps {
  stakedBalance: bigint | undefined;
  isLocked: boolean;
  lockExpiry: bigint | undefined;
  onSuccess?: () => void;
}

export function UnstakeForm({ stakedBalance, isLocked, lockExpiry, onSuccess }: UnstakeFormProps) {
  const [amount, setAmount] = useState("");
  const { unstake, reset, txState, isSuccess, currentAction } = useStakeWrite();

  const amountWei = amount ? parseUnits(amount, 18) : 0n;
  const hasBalance = stakedBalance !== undefined && amountWei <= stakedBalance && amountWei > 0n;
  const isActionPending = txState === "pending" || txState === "confirming";

  useEffect(() => {
    if (isSuccess && currentAction === "unstake") {
      onSuccess?.();
      const t = setTimeout(() => {
        setAmount("");
        reset();
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [isSuccess, currentAction]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleUnstake() {
    if (!amount || isLocked || !hasBalance) return;
    try {
      await unstake(amount);
    } catch {
      // surfaced via txState
    }
  }

  return (
    <div className="space-y-4">
      {isLocked && lockExpiry && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-400">
          Tokens are locked until {formatDeadline(lockExpiry)}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="unstake-amount">Amount (DKT)</Label>
        <Input
          id="unstake-amount"
          type="number"
          placeholder="100"
          min="0"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isActionPending || isLocked}
        />
        {stakedBalance !== undefined && (
          <button
            type="button"
            className="text-xs text-blue-400 hover:underline"
            onClick={() => setAmount((Number(stakedBalance) / 1e18).toString())}
            disabled={isLocked}
          >
            Max: {(Number(stakedBalance) / 1e18).toLocaleString()} DKT
          </button>
        )}
      </div>

      <TxButton
        txState={txState as "idle" | "pending" | "confirming" | "success" | "error"}
        idleLabel="Unstake DKT"
        disabled={!amount || isLocked || !hasBalance || isActionPending}
        onClick={handleUnstake}
        variant="outline"
        className="w-full"
      />
    </div>
  );
}
