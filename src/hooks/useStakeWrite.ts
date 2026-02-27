"use client";

import { useState, useCallback } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useChainId } from "wagmi";
import { parseUnits } from "viem";
import { getContracts } from "@/lib/contracts";
import { StakingVaultAbi, YieldDistributorAbi, DiktiTokenAbi } from "@/lib/abis";

export type StakeAction = "approve" | "stake" | "unstake" | "claimYield" | null;

export function useStakeWrite() {
  const chainId = useChainId();
  const contracts = getContracts(chainId);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [currentAction, setCurrentAction] = useState<StakeAction>(null);

  const { writeContractAsync, isPending: isWritePending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const reset = useCallback(() => {
    setTxHash(undefined);
    setCurrentAction(null);
  }, []);

  async function approveDkt(amount: string) {
    reset(); // clear any previous state
    setCurrentAction("approve");
    const hash = await writeContractAsync({
      address: contracts.diktiToken,
      abi: DiktiTokenAbi,
      functionName: "approve",
      args: [contracts.stakingVault, parseUnits(amount, 18)],
    });
    setTxHash(hash);
    return hash;
  }

  async function stake(amount: string, targetProject: `0x${string}`, donateBps: number) {
    reset();
    setCurrentAction("stake");
    const hash = await writeContractAsync({
      address: contracts.stakingVault,
      abi: StakingVaultAbi,
      functionName: "stake",
      args: [parseUnits(amount, 18), targetProject, donateBps],
    });
    setTxHash(hash);
    return hash;
  }

  async function unstake(amount: string) {
    reset();
    setCurrentAction("unstake");
    const hash = await writeContractAsync({
      address: contracts.stakingVault,
      abi: StakingVaultAbi,
      functionName: "unstake",
      args: [parseUnits(amount, 18)],
    });
    setTxHash(hash);
    return hash;
  }

  async function claimYield() {
    reset();
    setCurrentAction("claimYield");
    const hash = await writeContractAsync({
      address: contracts.yieldDistributor,
      abi: YieldDistributorAbi,
      functionName: "claimYield",
    });
    setTxHash(hash);
    return hash;
  }

  const txState: "idle" | "pending" | "confirming" | "success" | "error" =
    isWritePending ? "pending" :
    isConfirming ? "confirming" :
    isSuccess ? "success" :
    writeError ? "error" :
    "idle";

  return {
    approveDkt,
    stake,
    unstake,
    claimYield,
    reset,
    txState,
    txHash,
    currentAction,
    isSuccess,
  };
}
