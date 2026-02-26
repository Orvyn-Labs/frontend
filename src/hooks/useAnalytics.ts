"use client";

import { useReadContracts } from "wagmi";
import { useChainId } from "wagmi";
import { getContracts } from "@/lib/contracts";
import { FundingPoolAbi, StakingVaultAbi, YieldDistributorAbi, ProjectFactoryAbi } from "@/lib/abis";

// Static gas snapshot data from `forge snapshot` — used for the complexity table
// Values are in gas units (L2 execution gas)
export const GAS_SNAPSHOT = [
  { fn: "FundingPool.donate()", layer: "L1", gasUsed: 52_800, category: "donation" },
  { fn: "FundingPool.claimRefund()", layer: "L1", gasUsed: 38_200, category: "donation" },
  { fn: "FundingPool.allocateFunds()", layer: "L2", gasUsed: 71_500, category: "admin" },
  { fn: "StakingVault.stake()", layer: "L2", gasUsed: 98_400, category: "staking" },
  { fn: "StakingVault.unstake()", layer: "L2", gasUsed: 85_300, category: "staking" },
  { fn: "YieldDistributor.claimYield()", layer: "L3", gasUsed: 67_100, category: "yield" },
  { fn: "YieldDistributor.advanceEpoch()", layer: "L3", gasUsed: 58_900, category: "admin" },
  { fn: "ProjectFactory.createProject()", layer: "L4", gasUsed: 342_000, category: "factory" },
];

export const LAYER_COLORS: Record<string, string> = {
  L1: "#3b82f6",   // blue
  L2: "#8b5cf6",   // violet
  L3: "#f59e0b",   // amber
  L4: "#ef4444",   // red
};

export function useAnalytics() {
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  const { data, isLoading } = useReadContracts({
    contracts: [
      { address: contracts.fundingPool, abi: FundingPoolAbi, functionName: "totalDonations" },
      { address: contracts.fundingPool, abi: FundingPoolAbi, functionName: "totalYieldDistributed" },
      { address: contracts.fundingPool, abi: FundingPoolAbi, functionName: "totalPool" },
      { address: contracts.stakingVault, abi: StakingVaultAbi, functionName: "totalStaked" },
      { address: contracts.yieldDistributor, abi: YieldDistributorAbi, functionName: "currentEpoch" },
      { address: contracts.yieldDistributor, abi: YieldDistributorAbi, functionName: "rewardIndex" },
      { address: contracts.projectFactory, abi: ProjectFactoryAbi, functionName: "totalProjects" },
    ],
  });

  return {
    totalDonations: data?.[0]?.result as bigint | undefined,
    totalYieldDistributed: data?.[1]?.result as bigint | undefined,
    totalPool: data?.[2]?.result as bigint | undefined,
    totalStaked: data?.[3]?.result as bigint | undefined,
    currentEpoch: data?.[4]?.result as bigint | undefined,
    rewardIndex: data?.[5]?.result as bigint | undefined,
    projectCount: data?.[6]?.result as bigint | undefined,
    isLoading,
    gasSnapshot: GAS_SNAPSHOT,
  };
}
