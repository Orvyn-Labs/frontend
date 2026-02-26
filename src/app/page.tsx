import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, BarChart3, Coins, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: FlaskConical,
    title: "Fund Research",
    description:
      "Donate ETH directly to research projects. Funds are held in a smart contract pool and released when funding goals are met.",
  },
  {
    icon: Coins,
    title: "Stake DKT Tokens",
    description:
      "Stake Dikti Tokens to earn simulated yield rewards. The O(1) reward-index algorithm ensures fair distribution regardless of participant count.",
  },
  {
    icon: BarChart3,
    title: "Gas Analytics",
    description:
      "Track real-time gas consumption across all platform operations. L2 execution gas and L1 blob fees are captured for thesis benchmarking.",
  },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6 pt-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Deployed on Base Sepolia Testnet
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Decentralized Research
          <br />
          <span className="text-blue-500">Crowdfunding Platform</span>
        </h1>

        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          DChain enables researchers to raise funds through blockchain-based crowdfunding.
          Built on Base Network as part of a bachelor thesis analyzing smart contract
          gas consumption and performance at scale.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/projects">
              Browse Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/stake">Stake DKT</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/analytics">View Analytics</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="bg-card/50">
            <CardHeader className="pb-3">
              <div className="rounded-lg bg-blue-500/10 w-10 h-10 flex items-center justify-center mb-2">
                <Icon className="h-5 w-5 text-blue-500" />
              </div>
              <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Architecture note */}
      <section className="rounded-xl border border-border bg-card/30 p-6 space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          Thesis Architecture
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
          {[
            { label: "L1 — Direct Donation", detail: "FundingPool.donate()", color: "text-blue-400" },
            { label: "L2 — Staking Operations", detail: "StakingVault.stake()", color: "text-violet-400" },
            { label: "L3 — Simulated Yield", detail: "YieldDistributor.claimYield()", color: "text-amber-400" },
            { label: "L4 — Contract Deployment", detail: "ProjectFactory.createProject()", color: "text-red-400" },
          ].map(({ label, detail, color }) => (
            <div key={label} className="space-y-1">
              <p className={`font-medium ${color}`}>{label}</p>
              <p className="text-muted-foreground font-mono text-xs">{detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
