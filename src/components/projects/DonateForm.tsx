"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TxButton } from "@/components/web3/TxButton";
import { ConnectPrompt } from "@/components/web3/ConnectPrompt";
import { useDonate } from "@/hooks/useDonate";
import { ProjectStatus } from "@/lib/utils";

interface DonateFormProps {
  projectAddress: `0x${string}`;
  status: number;
  onSuccess?: () => void;
}

export function DonateForm({ projectAddress, status, onSuccess }: DonateFormProps) {
  const { isConnected, address } = useAccount();
  const [amount, setAmount] = useState("");

  const {
    approveDkt,
    donate,
    reset,
    txState,
    currentAction,
    isSuccess,
    needsApprove,
    refetchAllowance,
    pendingDonateRef,
  } = useDonate(projectAddress, address);

  // After approve confirms → auto-fire donate
  useEffect(() => {
    if (isSuccess && currentAction === "approve" && pendingDonateRef.current) {
      const dktAmount = pendingDonateRef.current;
      refetchAllowance().then(() => {
        donate(dktAmount).catch(() => {});
      });
    }
  }, [isSuccess, currentAction]); // eslint-disable-line react-hooks/exhaustive-deps

  // After donate confirms → notify parent and reset
  useEffect(() => {
    if (isSuccess && currentAction === "donate") {
      onSuccess?.();
      setAmount("");
      const t = setTimeout(reset, 1500);
      return () => clearTimeout(t);
    }
  }, [isSuccess, currentAction]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isConnected) {
    return (
      <ConnectPrompt
        title="Connect to donate"
        description="Connect your wallet to fund this research project."
      />
    );
  }

  if (status !== ProjectStatus.Active) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        This project is no longer accepting donations.
      </p>
    );
  }

  const isValidAmount = !!amount && parseFloat(amount) > 0;
  const requiresApprove = isValidAmount && needsApprove(amount);

  // Label for the button — show "Approve" when approval is needed or in-progress
  const showApproveLabel = currentAction === "approve" || (isValidAmount && requiresApprove);
  const idleLabel = showApproveLabel ? "Approve DKT" : "Donate DKT";
  const confirmingLabel = currentAction === "approve" ? "Approving..." : "Donating...";

  async function handleClick() {
    if (!isValidAmount) return;
    try {
      if (needsApprove(amount)) {
        await approveDkt(amount);
      } else {
        await donate(amount);
      }
    } catch {
      // errors surfaced via txState
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="dkt-amount">Amount (DKT)</Label>
        <Input
          id="dkt-amount"
          type="number"
          placeholder="100"
          min="0"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={txState === "pending" || txState === "confirming"}
        />
        {isValidAmount && (
          <p className="text-xs text-muted-foreground">
            {requiresApprove
              ? "Step 1 of 2: Approve DKT spending, then donate."
              : "Allowance sufficient — ready to donate."}
          </p>
        )}
      </div>
      <TxButton
        txState={txState}
        idleLabel={idleLabel}
        confirmingLabel={confirmingLabel}
        disabled={!isValidAmount || txState === "pending" || txState === "confirming"}
        onClick={handleClick}
        className="w-full"
      />
    </div>
  );
}
