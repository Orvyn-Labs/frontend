import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatEther, formatUnits } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Shorten an address to 0x1234...5678
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Format ETH with configurable decimal places
export function formatEth(value: bigint, decimals = 4): string {
  const formatted = formatEther(value);
  const num = parseFloat(formatted);
  if (num === 0) return "0 ETH";
  if (num < 0.0001) return "< 0.0001 ETH";
  return `${num.toFixed(decimals)} ETH`;
}

// Format DKT token amount (18 decimals)
export function formatDkt(value: bigint, decimals = 2): string {
  const formatted = formatUnits(value, 18);
  const num = parseFloat(formatted);
  return `${num.toLocaleString(undefined, { maximumFractionDigits: decimals })} DKT`;
}

// Format a funding progress as percentage
export function fundingPercent(raised: bigint, goal: bigint): number {
  if (goal === 0n) return 0;
  return Math.min(100, Number((raised * 10000n) / goal) / 100);
}

// Format a Unix timestamp to locale date string
export function formatDeadline(timestamp: bigint | number): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Check if a deadline has passed
export function isExpired(deadline: bigint | number): boolean {
  return Date.now() / 1000 > Number(deadline);
}

// Project status enum (matches Solidity: Active=0, Succeeded=1, Failed=2, Cancelled=3)
export enum ProjectStatus {
  Active = 0,
  Succeeded = 1,
  Failed = 2,
  Cancelled = 3,
}

export function statusLabel(status: number): string {
  switch (status) {
    case ProjectStatus.Active: return "Active";
    case ProjectStatus.Succeeded: return "Succeeded";
    case ProjectStatus.Failed: return "Failed";
    case ProjectStatus.Cancelled: return "Cancelled";
    default: return "Unknown";
  }
}

export function statusColor(status: number): string {
  switch (status) {
    case ProjectStatus.Active: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case ProjectStatus.Succeeded: return "bg-green-500/20 text-green-400 border-green-500/30";
    case ProjectStatus.Failed: return "bg-red-500/20 text-red-400 border-red-500/30";
    case ProjectStatus.Cancelled: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

// Gas formatting helpers for the analytics dashboard
export function formatGas(gas: bigint | number): string {
  return Number(gas).toLocaleString();
}

export function formatGwei(wei: bigint): string {
  const gwei = Number(wei) / 1e9;
  return `${gwei.toFixed(4)} Gwei`;
}
