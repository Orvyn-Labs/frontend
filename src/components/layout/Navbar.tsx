"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract } from "wagmi";
import { useChainId } from "wagmi";
import { cn, formatDkt } from "@/lib/utils";
import { DiktiTokenAbi } from "@/lib/abis";
import { getContracts } from "@/lib/contracts";
import { FlaskConical } from "lucide-react";

const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/stake", label: "Stake DKT" },
  { href: "/analytics", label: "Analytics" },
];

function DktBalance() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  const { data: balance } = useReadContract({
    address: contracts.diktiToken,
    abi: DiktiTokenAbi,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: isConnected && !!address },
  });

  if (!isConnected || balance === undefined) return null;

  return (
    <span className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground border border-border rounded-full px-3 py-1">
      <span className="w-2 h-2 rounded-full bg-blue-500" />
      {formatDkt(balance)}
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-black text-xl tracking-tighter group shrink-0">
            <div className="bg-blue-500 rounded-lg p-1 group-hover:rotate-12 transition-transform duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <FlaskConical className="h-5 w-5 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 group-hover:to-blue-400 transition-all">Orvyn-Labs</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/5">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200",
                  pathname.startsWith(href)
                    ? "text-white bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            <DktBalance />
            <div className="scale-90 sm:scale-100 origin-right">
              <ConnectButton
                accountStatus="avatar"
                chainStatus="icon"
                showBalance={false}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
