import { FlaskConical } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-foreground">DChain Research Funding</span>
          </div>
          <p>
            Bachelor Thesis — Blockchain Performance Analysis on Base Network
          </p>
          <p>Built on Base Sepolia · Powered by wagmi v2 &amp; viem v2</p>
        </div>
      </div>
    </footer>
  );
}
