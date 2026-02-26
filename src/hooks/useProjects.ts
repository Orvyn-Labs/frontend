"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { useChainId } from "wagmi";
import { getContracts } from "@/lib/contracts";
import { ProjectFactoryAbi, ResearchProjectAbi } from "@/lib/abis";

export interface ProjectData {
  address: `0x${string}`;
  title: string;
  researcher: `0x${string}`;
  goalAmount: bigint;
  deadline: bigint;
  totalRaised: bigint;
  status: number;
}

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
    { address: addr as `0x${string}`, abi: ResearchProjectAbi, functionName: "title" as const },
    { address: addr as `0x${string}`, abi: ResearchProjectAbi, functionName: "researcher" as const },
    { address: addr as `0x${string}`, abi: ResearchProjectAbi, functionName: "goalAmount" as const },
    { address: addr as `0x${string}`, abi: ResearchProjectAbi, functionName: "deadline" as const },
    { address: addr as `0x${string}`, abi: ResearchProjectAbi, functionName: "totalRaised" as const },
    { address: addr as `0x${string}`, abi: ResearchProjectAbi, functionName: "status" as const },
  ]);

  const { data: projectData, isLoading: loadingData, refetch: refetchData } = useReadContracts({
    contracts: projectContracts,
    query: { enabled: !!projectAddresses && projectAddresses.length > 0 },
  });

  const projects: ProjectData[] = [];
  if (projectAddresses && projectData) {
    for (let i = 0; i < projectAddresses.length; i++) {
      const base = i * 6;
      const title = projectData[base]?.result as string | undefined;
      const researcher = projectData[base + 1]?.result as `0x${string}` | undefined;
      const goalAmount = projectData[base + 2]?.result as bigint | undefined;
      const deadline = projectData[base + 3]?.result as bigint | undefined;
      const totalRaised = projectData[base + 4]?.result as bigint | undefined;
      const status = projectData[base + 5]?.result as number | undefined;

      if (
        title !== undefined &&
        researcher !== undefined &&
        goalAmount !== undefined &&
        deadline !== undefined &&
        totalRaised !== undefined &&
        status !== undefined
      ) {
        projects.push({
          address: projectAddresses[i] as `0x${string}`,
          title,
          researcher,
          goalAmount,
          deadline,
          totalRaised,
          status,
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
