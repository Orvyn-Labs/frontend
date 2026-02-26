"use client";

import { useState, useMemo } from "react";
import { useProjects } from "@/hooks/useProjects";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { NetworkBadge } from "@/components/web3/NetworkBadge";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { useAccount } from "wagmi";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";

export default function ProjectsPage() {
  const { projects, isLoading, projectCount, refetch } = useProjects();
  const { isConnected } = useAccount();
  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.researcher.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 min-h-screen">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight">Projects</h1>
              <NetworkBadge />
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              Browse and fund decentralized research on Base. Each project is a self-contained smart contract.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-400 transition-colors" />
              <Input
                placeholder="Search projects..."
                className="pl-10 glass-morphism border-white/5 focus:border-blue-500/50 transition-all shadow-inner"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {isConnected && (
              <CreateProjectDialog onCreated={refetch} />
            )}
          </div>
        </div>
      </FadeIn>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
            {isLoading ? "Fetching data..." : `Found ${filteredProjects.length} on-chain projects`}
          </p>
          {!isLoading && search && (
            <button 
              onClick={() => setSearch("")}
              className="text-xs text-blue-400 hover:underline font-bold"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        <ProjectGrid projects={filteredProjects} isLoading={isLoading} />
      </div>

      {!isLoading && filteredProjects.length === 0 && search && (
        <FadeIn>
          <div className="text-center py-20 glass-morphism rounded-3xl border-dashed border-white/10">
            <p className="text-muted-foreground">No projects matching &quot;{search}&quot;</p>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
