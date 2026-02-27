"use client";

import { useState, useCallback, useRef } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useChainId, useReadContract } from "wagmi";
import { parseUnits } from "viem";
import { ResearchProjectAbi, DiktiTokenAbi } from "@/lib/abis";
import { getContracts } from "@/lib/contracts";

export type DonateAction = "approve" | "donate" | null;

export function useDonate(projectAddress: `0x${string}`, donorAddress?: `0x${string}`) {
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [currentAction, setCurrentAction] = useState<DonateAction>(null);

  // Pending donate args — stored so we can auto-fire after approve confirms
  const pendingDonateRef = useRef<string | null>(null);

  const { writeContractAsync, isPending: isWritePending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Read current DKT allowance for the project contract
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: contracts.diktiToken,
    abi: DiktiTokenAbi,
    functionName: "allowance",
    args: donorAddress ? [donorAddress, projectAddress] : undefined,
    query: { enabled: !!donorAddress },
  });

  const reset = useCallback(() => {
    setTxHash(undefined);
    setCurrentAction(null);
    pendingDonateRef.current = null;
  }, []);

  /**
   * Step 1: Approve project contract to spend `dktAmount` DKT.
   * Step 2: donate() is called automatically once approve confirms — handled in DonateForm.
   */
  async function approveDkt(dktAmount: string) {
    reset();
    setCurrentAction("approve");
    const amountWei = parseUnits(dktAmount, 18);
    const hash = await writeContractAsync({
      address: contracts.diktiToken,
      abi: DiktiTokenAbi,
      functionName: "approve",
      args: [projectAddress, amountWei],
    });
    pendingDonateRef.current = dktAmount;
    setTxHash(hash);
    return hash;
  }

  /**
   * Step 2: Donate `dktAmount` DKT to the project.
   * Caller must have approved the project contract first.
   */
  async function donate(dktAmount: string) {
    reset();
    setCurrentAction("donate");
    const amountWei = parseUnits(dktAmount, 18);
    const hash = await writeContractAsync({
      address: projectAddress,
      abi: ResearchProjectAbi,
      functionName: "donate",
      args: [amountWei],
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

  const needsApprove = (dktAmount: string): boolean => {
    if (!allowance) return true;
    try {
      return (allowance as bigint) < parseUnits(dktAmount, 18);
    } catch {
      return true;
    }
  };

  return {
    approveDkt,
    donate,
    reset,
    txState,
    txHash,
    currentAction,
    isSuccess,
    needsApprove,
    allowance: allowance as bigint | undefined,
    refetchAllowance,
    pendingDonateRef,
  };
}
