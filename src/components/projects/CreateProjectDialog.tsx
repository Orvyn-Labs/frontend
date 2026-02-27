"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { parseEther } from "viem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TxButton } from "@/components/web3/TxButton";
import { getContracts } from "@/lib/contracts";
import { ProjectFactoryAbi } from "@/lib/abis";
import { PlusCircle } from "lucide-react";

interface CreateProjectDialogProps {
  onCreated?: () => void;
}

export function CreateProjectDialog({ onCreated }: CreateProjectDialogProps) {
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [goalDkt, setGoalDkt] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const { writeContractAsync, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const txState =
    isPending ? "pending" :
    isConfirming ? "confirming" :
    isSuccess ? "success" :
    writeError ? "error" :
    "idle";

  const isFormValid =
    title.trim().length > 0 &&
    goalDkt.trim().length > 0 && parseFloat(goalDkt) > 0 &&
    durationDays.trim().length > 0 && parseInt(durationDays) > 0;

  async function handleCreate() {
    if (!isFormValid) return;
    try {
      const goalWei = parseEther(goalDkt);
      const durationSeconds = BigInt(Math.floor(parseFloat(durationDays) * 24 * 60 * 60));

      const hash = await writeContractAsync({
        address: contracts.projectFactory,
        abi: ProjectFactoryAbi,
        functionName: "createProject",
        args: [title.trim(), goalWei, durationSeconds],
      });
      setTxHash(hash);
    } catch (err) {
      console.error("CreateProject error:", err);
    }
  }

  function handleOpenChange(val: boolean) {
    // Reset form when dialog closes, unless tx in progress
    if (!val && txState !== "pending" && txState !== "confirming") {
      setTitle("");
      setGoalDkt("");
      setDurationDays("");
      setTxHash(undefined);
    }
    if (val || txState !== "pending") {
      setOpen(val);
    }
  }

  // Close dialog and notify parent after success
  function handleSuccessClose() {
    setOpen(false);
    setTitle("");
    setGoalDkt("");
    setDurationDays("");
    setTxHash(undefined);
    onCreated?.();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Research Project</DialogTitle>
          <DialogDescription>
            Deploy a new crowdfunding project on Base Sepolia. Anyone can create a project.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-green-400 text-center">
              Project created successfully on-chain!
            </p>
            <p className="text-xs text-muted-foreground font-mono text-center break-all">
              tx: {txHash}
            </p>
            <Button className="w-full" onClick={handleSuccessClose}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="project-title">Project Title</Label>
                <Input
                  id="project-title"
                  placeholder="e.g. AI-driven drug discovery for tuberculosis"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={txState === "pending" || txState === "confirming"}
                  maxLength={120}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="goal-dkt">Funding Goal (DKT)</Label>
                <Input
                  id="goal-dkt"
                  type="number"
                  placeholder="1000"
                  min="0"
                  step="1"
                  value={goalDkt}
                  onChange={(e) => setGoalDkt(e.target.value)}
                  disabled={txState === "pending" || txState === "confirming"}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="duration-days">Duration (days)</Label>
                <Input
                  id="duration-days"
                  type="number"
                  placeholder="30"
                  min="1"
                  step="1"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  disabled={txState === "pending" || txState === "confirming"}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 1 day. The deadline is set relative to the block timestamp on creation.
                </p>
              </div>
            </div>

            <DialogFooter>
              <TxButton
                txState={txState as "idle" | "pending" | "confirming" | "success" | "error"}
                idleLabel="Deploy Project"
                disabled={!isFormValid}
                onClick={handleCreate}
                className="w-full"
              />
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
