"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useChainId } from "wagmi";
import { parseUnits } from "viem";
import { getContracts } from "@/lib/contracts";
import { StakingVaultAbi, YieldDistributorAbi, DiktiTokenAbi } from "@/lib/abis";

type Action = "approve" | "stake" | "unstake" | "claimYield" | null;

export function useStakeWrite() {
  const chainId = useChainId();
  const contracts = getContracts(chainId);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [currentAction, setCurrentAction] = useState<Action>(null);

  const { writeContractAsync, isPending: isWritePending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  async function approveDkt(amount: string) {
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

  async function stake(amount: string) {
    setCurrentAction("stake");
    const hash = await writeContractAsync({
      address: contracts.stakingVault,
      abi: StakingVaultAbi,
      functionName: "stake",
      args: [parseUnits(amount, 18)],
    });
    setTxHash(hash);
    return hash;
  }

  async function unstake(amount: string) {
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
    setCurrentAction("claimYield");
    const hash = await writeContractAsync({
      address: contracts.yieldDistributor,
      abi: YieldDistributorAbi,
      functionName: "claimYield",
    });
    setTxHash(hash);
    return hash;
  }

  const txState =
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
    txState,
    txHash,
    currentAction,
    isSuccess,
  };
}
