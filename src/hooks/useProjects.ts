"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { useChainId } from "wagmi";
import { getContracts } from "@/lib/contracts";
import { ProjectFactoryAbi, ResearchProjectAbi } from "@/lib/abis";

export interface ProjectData {
  address: `0x${string}`;
  title: string;
  researcher: `0x${string}`;
  /** ProjectStatus enum value: 0=Active, 1=Completed, 2=Cancelled */
  status: number;
  milestoneCount: bigint;
  currentMilestoneIndex: bigint;
  /** Cumulative DKT raised across all milestones */
  totalRaised: bigint;
  /** Current active milestone's goal (DKT) — 0 if no milestones */
  currentGoal: bigint;
  /** Current active milestone's deadline (Unix ts) — 0 if completed/cancelled */
  currentDeadline: bigint;
  /** Current active milestone's raised amount */
  currentRaised: bigint;
}

// 7 reads per project:
//   0: title
//   1: researcher
//   2: projectStatus
//   3: milestoneCount
//   4: currentMilestoneIndex
//   5: totalRaised (view fn)
//   6: currentMilestone (tuple)
const READS_PER_PROJECT = 7;

export function useProjects() {
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  // Step 1: paginated fetch — get up to 100 projects starting at offset 0
  const { data: projectAddresses, isLoading: loadingAddresses, refetch: refetchAddresses } = useReadContract({
    address: contracts.projectFactory,
    abi: ProjectFactoryAbi,
    functionName: "getProjects",
    args: [0n, 100n],
  });

  // Step 2: multicall to read project info from each address
  const projectContracts = (projectAddresses ?? []).flatMap((addr) => [
    { address: addr as `0x${string}`, abi: ResearchProjectAbi, functionName: "title"                 as const },
    { address: addr as `0x${string}`, abi: ResearchProjectAbi, functionName: "researcher"            as const },
    { address: addr as `0x${string}`, abi: ResearchProjectAbi, functionName: "projectStatus"         as const },
    { address: addr as `0x${string}`, abi: ResearchProjectAbi, functionName: "milestoneCount"        as const },
    { address: addr as `0x${string}`, abi: ResearchProjectAbi, functionName: "currentMilestoneIndex" as const },
    { address: addr as `0x${string}`, abi: ResearchProjectAbi, functionName: "totalRaised"           as const },
    { address: addr as `0x${string}`, abi: ResearchProjectAbi, functionName: "currentMilestone"      as const },
  ]);

  const { data: projectData, isLoading: loadingData, refetch: refetchData } = useReadContracts({
    contracts: projectContracts,
    query: { enabled: !!projectAddresses && projectAddresses.length > 0 },
  });

  const projects: ProjectData[] = [];
  if (projectAddresses && projectData) {
    for (let i = 0; i < projectAddresses.length; i++) {
      const base = i * READS_PER_PROJECT;
      const title                = projectData[base]?.result     as string | undefined;
      const researcher           = projectData[base + 1]?.result as `0x${string}` | undefined;
      const status               = projectData[base + 2]?.result as number | undefined;
      const milestoneCount       = projectData[base + 3]?.result as bigint | undefined;
      const currentMilestoneIndex = projectData[base + 4]?.result as bigint | undefined;
      const totalRaised          = projectData[base + 5]?.result as bigint | undefined;
      // currentMilestone returns a tuple
      const currentMs = projectData[base + 6]?.result as
        | { title: string; goal: bigint; deadline: bigint; raised: bigint; votesYes: bigint; votesNo: bigint; proofUri: string; status: number }
        | undefined;

      if (
        title !== undefined &&
        researcher !== undefined &&
        status !== undefined &&
        milestoneCount !== undefined &&
        currentMilestoneIndex !== undefined &&
        totalRaised !== undefined
      ) {
        projects.push({
          address: projectAddresses[i] as `0x${string}`,
          title,
          researcher,
          status,
          milestoneCount,
          currentMilestoneIndex,
          totalRaised,
          currentGoal:     currentMs?.goal     ?? 0n,
          currentDeadline: currentMs?.deadline ?? 0n,
          currentRaised:   currentMs?.raised   ?? 0n,
        });
      }
    }
  }

  async function refetch() {
    await refetchAddresses();
    await refetchData();
  }

  return {
    projects,
    isLoading: loadingAddresses || loadingData,
    projectCount: projectAddresses?.length ?? 0,
    refetch,
  };
}
