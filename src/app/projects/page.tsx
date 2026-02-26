"use client";

import { useProjects } from "@/hooks/useProjects";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { NetworkBadge } from "@/components/web3/NetworkBadge";

export default function ProjectsPage() {
  const { projects, isLoading, projectCount } = useProjects();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Research Projects</h1>
            <NetworkBadge />
          </div>
          <p className="text-muted-foreground text-sm">
            {isLoading ? "Loading..." : `${projectCount} project${projectCount !== 1 ? "s" : ""} on-chain`}
          </p>
        </div>
      </div>

      {/* Grid */}
      <ProjectGrid projects={projects} isLoading={isLoading} />
    </div>
  );
}
