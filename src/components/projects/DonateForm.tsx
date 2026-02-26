"use client";

import { useState } from "react";
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
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const { donate, txState } = useDonate(projectAddress);

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

  async function handleDonate() {
    if (!amount || parseFloat(amount) <= 0) return;
    try {
      await donate(amount);
      setAmount("");
      onSuccess?.();
    } catch {
      // error is surfaced via txState
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="eth-amount">Amount (ETH)</Label>
        <Input
          id="eth-amount"
          type="number"
          placeholder="0.01"
          min="0"
          step="0.001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={txState === "pending" || txState === "confirming"}
        />
      </div>
      <TxButton
        txState={txState as "idle" | "pending" | "confirming" | "success" | "error"}
        idleLabel="Donate ETH"
        disabled={!amount || parseFloat(amount) <= 0}
        onClick={handleDonate}
        className="w-full"
      />
    </div>
  );
}
