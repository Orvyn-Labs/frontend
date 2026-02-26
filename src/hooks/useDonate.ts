"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useChainId } from "wagmi";
import { parseEther } from "viem";
import { getContracts } from "@/lib/contracts";
import { FundingPoolAbi } from "@/lib/abis";

export function useDonate(projectAddress: `0x${string}`) {
  const chainId = useChainId();
  const contracts = getContracts(chainId);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const { writeContractAsync, isPending: isWritePending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  async function donate(ethAmount: string) {
    try {
      const hash = await writeContractAsync({
        address: contracts.fundingPool,
        abi: FundingPoolAbi,
        functionName: "donate",
        args: [projectAddress],
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
