"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";

interface ConnectPromptProps {
  title?: string;
  description?: string;
}

export function ConnectPrompt({
  title = "Connect your wallet",
  description = "Connect your wallet to interact with the DChain research funding platform.",
}: ConnectPromptProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="rounded-full bg-muted p-4">
        <Wallet className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm max-w-xs">{description}</p>
      </div>
      <ConnectButton />
    </div>
  );
}
