"use client";

import { useReadContracts } from "wagmi";
import { useAccount, useChainId } from "wagmi";
import { ResearchProjectAbi, FundingPoolAbi } from "@/lib/abis";
import { getContracts } from "@/lib/contracts";

export function useProject(projectAddress: `0x${string}`) {
  const { address } = useAccount();
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  // Build flat contracts array — wagmi strict typing works best with a stable shape
  // Indices:  0=title 1=researcher 2=fundingGoal 3=deadline 4=totalRaised 5=status 6=fundingPool
  //           7=donorContribution (if connected) 8=projectBalance
  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      { address: projectAddress, abi: ResearchProjectAbi, functionName: "title" as const },
      { address: projectAddress, abi: ResearchProjectAbi, functionName: "researcher" as const },
      { address: projectAddress, abi: ResearchProjectAbi, functionName: "fundingGoal" as const },
      { address: projectAddress, abi: ResearchProjectAbi, functionName: "deadline" as const },
      { address: projectAddress, abi: ResearchProjectAbi, functionName: "totalRaised" as const },
      { address: projectAddress, abi: ResearchProjectAbi, functionName: "status" as const },
      { address: projectAddress, abi: ResearchProjectAbi, functionName: "fundingPool" as const },
      { address: projectAddress, abi: ResearchProjectAbi, functionName: "donorContribution" as const, args: [(address ?? "0x0000000000000000000000000000000000000000") as `0x${string}`] as const },
      { address: contracts.fundingPool, abi: FundingPoolAbi, functionName: "projectBalance" as const, args: [projectAddress] as const },
    ] as const,
  });

  const title = data?.[0]?.result as string | undefined;
  const researcher = data?.[1]?.result as `0x${string}` | undefined;
  const fundingGoal = data?.[2]?.result as bigint | undefined;
  const deadline = data?.[3]?.result as bigint | undefined;
  const totalRaised = data?.[4]?.result as bigint | undefined;
  const status = data?.[5]?.result as number | undefined;
  const fundingPool = data?.[6]?.result as `0x${string}` | undefined;
  const myContribution = address ? (data?.[7]?.result as bigint | undefined) : undefined;
  const poolBalance = data?.[8]?.result as bigint | undefined;

  return {
    title,
    researcher,
    fundingGoal,
    deadline,
    totalRaised,
    status,
    fundingPool,
    myContribution,
    poolBalance,
    isLoading,
    refetch,
  };
}
