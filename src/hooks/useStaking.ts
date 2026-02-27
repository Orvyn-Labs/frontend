"use client";

import { useReadContracts } from "wagmi";
import { useAccount, useChainId } from "wagmi";
import { useCallback } from "react";
import { getContracts } from "@/lib/contracts";
import { StakingVaultAbi, YieldDistributorAbi, DiktiTokenAbi } from "@/lib/abis";

const ZERO_ADDR = "0x0000000000000000000000000000000000000000" as `0x${string}`;

export interface YieldSplit {
  targetProject: `0x${string}`;
  donateBps: number;
}

export function useStaking() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  // Use zero address as placeholder when not connected — results are discarded anyway
  const user = address ?? ZERO_ADDR;

  const { data, isLoading, refetch: _refetch } = useReadContracts({
    contracts: [
      // 0 — global
      { address: contracts.stakingVault, abi: StakingVaultAbi, functionName: "totalStaked" as const },
      // 1 — global
      { address: contracts.stakingVault, abi: StakingVaultAbi, functionName: "lockPeriod" as const },
      // 2 — user staked balance
      { address: contracts.stakingVault, abi: StakingVaultAbi, functionName: "stakedBalance" as const, args: [user] as const },
      // 3 — user lock expiry
      { address: contracts.stakingVault, abi: StakingVaultAbi, functionName: "lockExpiry" as const, args: [user] as const },
      // 4 — user pending yield
      { address: contracts.yieldDistributor, abi: YieldDistributorAbi, functionName: "pendingYield" as const, args: [user] as const },
      // 5 — user DKT wallet balance
      { address: contracts.diktiToken, abi: DiktiTokenAbi, functionName: "balanceOf" as const, args: [user] as const },
      // 6 — user DKT allowance for staking vault
      { address: contracts.diktiToken, abi: DiktiTokenAbi, functionName: "allowance" as const, args: [user, contracts.stakingVault] as const },
      // 7 — user yield-split config
      { address: contracts.yieldDistributor, abi: YieldDistributorAbi, functionName: "yieldSplit" as const, args: [user] as const },
    ] as const,
    query: { enabled: isConnected },
  });

  const totalStaked = data?.[0]?.result as bigint | undefined;
  const lockPeriod = data?.[1]?.result as bigint | undefined;
  const stakedBalance = isConnected ? (data?.[2]?.result as bigint | undefined) : undefined;
  const lockExpiry = isConnected ? (data?.[3]?.result as bigint | undefined) : undefined;
  const pendingYield = isConnected ? (data?.[4]?.result as bigint | undefined) : undefined;
  const dktBalance = isConnected ? (data?.[5]?.result as bigint | undefined) : undefined;
  const dktAllowance = isConnected ? (data?.[6]?.result as bigint | undefined) : undefined;
  const yieldSplitRaw = isConnected ? (data?.[7]?.result as { targetProject: `0x${string}`; donateBps: number } | undefined) : undefined;

  const yieldSplit: YieldSplit | undefined = yieldSplitRaw
    ? { targetProject: yieldSplitRaw.targetProject, donateBps: yieldSplitRaw.donateBps }
    : undefined;

  const isLocked = lockExpiry !== undefined && lockExpiry > BigInt(Math.floor(Date.now() / 1000));

  // Stable refetch — wrapped in useCallback so it's a stable reference for useEffect deps
  const refetch = useCallback(() => {
    return _refetch();
  }, [_refetch]);

  return {
    totalStaked,
    lockPeriod,
    stakedBalance,
    lockExpiry,
    pendingYield,
    dktBalance,
    dktAllowance,
    yieldSplit,
    isLocked,
    isLoading,
    refetch,
  };
}
