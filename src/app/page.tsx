"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCard } from "@/components/home/FeatureCard";
import { FlaskConical, BarChart3, Coins } from "lucide-react";

const FEATURES = [
  {
    icon: FlaskConical,
    title: "Fund Research",
    description:
      "Direct DKT contributions to research. Funds are securely managed via FundingPool and only released when goals are achieved.",
  },
  {
    icon: Coins,
    title: "Stake DKT Tokens",
    description:
      "Stake tokens to earn rewards. Our O(1) reward-index algorithm guarantees gas-efficient yield distribution even with thousands of users.",
  },
  {
    icon: BarChart3,
    title: "Gas Benchmarking",
    description:
      "Comprehensive analytics for on-chain operations. Analyze gas consumption across 4 layers of smart contract complexity.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden bg-grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-16">
        
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-sm uppercase tracking-widest text-blue-400 font-bold">Key Platform Features</h2>
            <p className="text-3xl font-bold tracking-tight">Protocol Mechanism Design</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={feature.title} index={i} {...feature} />
            ))}
          </div>
        </div>

        {/* Architecture Grid Section */}
        <section className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl p-8 md:p-12 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all duration-700" />
          
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-50">
              Bachelor Thesis Case Study
            </h2>
            <h3 className="text-3xl font-bold">Benchmark Layers</h3>
            <p className="text-muted-foreground max-w-xl">
              DChain evaluates gas performance across four distinct smart contract complexity layers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                label: "Layer 1", 
                title: "Direct Donation", 
                detail: "FundingPool.donate()", 
                color: "from-blue-500/20 to-blue-400/5", 
                border: "border-blue-500/20" 
              },
              { 
                label: "Layer 2", 
                title: "Staking Operations", 
                detail: "StakingVault.stake()", 
                color: "from-violet-500/20 to-violet-400/5", 
                border: "border-violet-500/20" 
              },
              { 
                label: "Layer 3", 
                title: "Simulated Yield", 
                detail: "YieldDistributor.claimYield()", 
                color: "from-amber-500/20 to-amber-400/5", 
                border: "border-amber-500/20" 
              },
              { 
                label: "Layer 4", 
                title: "Deployment", 
                detail: "ProjectFactory.create()", 
                color: "from-red-500/20 to-red-400/5", 
                border: "border-red-500/20" 
              },
            ].map(({ label, title, detail, color, border }) => (
              <div 
                key={label} 
                className={`p-6 rounded-2xl border ${border} bg-gradient-to-br ${color} space-y-2 hover:scale-105 transition-transform duration-300 backdrop-blur-sm`}
              >
                <span className="text-[10px] font-black tracking-widest uppercase opacity-70">{label}</span>
                <p className="font-bold text-sm tracking-tight">{title}</p>
                <p className="text-muted-foreground font-mono text-[10px] truncate opacity-80">{detail}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
