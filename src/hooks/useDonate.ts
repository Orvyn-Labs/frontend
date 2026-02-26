"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { ResearchProjectAbi } from "@/lib/abis";

export function useDonate(projectAddress: `0x${string}`) {
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const { writeContractAsync, isPending: isWritePending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // donate() is payable on the ResearchProject itself — no args, just value
  async function donate(ethAmount: string) {
    try {
      const hash = await writeContractAsync({
        address: projectAddress,
        abi: ResearchProjectAbi,
        functionName: "donate",
        value: parseEther(ethAmount),
      });
      setTxHash(hash);
      return hash;
    } catch (err) {
      console.error("Donate error:", err);
      throw err;
    }
  }

  const txState =
    isWritePending ? "pending" :
    isConfirming ? "confirming" :
    isSuccess ? "success" :
    writeError ? "error" :
    "idle";

  return { donate, txState, txHash, receipt, isSuccess };
}
