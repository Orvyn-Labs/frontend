export const ResearchProjectAbi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  // ── View ──
  { type: "function", name: "researcher", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
  { type: "function", name: "title", inputs: [], outputs: [{ name: "", type: "string" }], stateMutability: "view" },
  { type: "function", name: "goalAmount", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "totalRaised", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "deadline", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "status", inputs: [], outputs: [{ name: "", type: "uint8" }], stateMutability: "view" },
  { type: "function", name: "projectId", inputs: [], outputs: [{ name: "", type: "bytes32" }], stateMutability: "view" },
  { type: "function", name: "fundsWithdrawn", inputs: [], outputs: [{ name: "", type: "bool" }], stateMutability: "view" },
  { type: "function", name: "fundingPool", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
  { type: "function", name: "dkt", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
  { type: "function", name: "donations", inputs: [{ name: "donor", type: "address" }], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "isActive", inputs: [], outputs: [{ name: "", type: "bool" }], stateMutability: "view" },
  { type: "function", name: "timeRemaining", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "fundingProgress", inputs: [], outputs: [{ name: "bps", type: "uint256" }], stateMutability: "view" },
  {
    type: "function", name: "projectInfo", inputs: [],
    outputs: [
      { name: "_researcher", type: "address" },
      { name: "_title", type: "string" },
      { name: "_goal", type: "uint256" },
      { name: "_raised", type: "uint256" },
      { name: "_deadline", type: "uint256" },
      { name: "_status", type: "uint8" },
      { name: "_goalMet", type: "bool" },
    ],
    stateMutability: "view",
  },
  // ── Write ──
  // initialize now takes _dkt as 3rd arg (before _title)
  { type: "function", name: "initialize", inputs: [{ name: "_researcher", type: "address" }, { name: "_fundingPool", type: "address" }, { name: "_dkt", type: "address" }, { name: "_title", type: "string" }, { name: "_goalAmount", type: "uint256" }, { name: "_duration", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  // donate(uint256) — ERC-20 transferFrom, NOT payable. Caller must approve first.
  { type: "function", name: "donate", inputs: [{ name: "amount", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "finalize", inputs: [], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "claimRefund", inputs: [], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "withdrawFunds", inputs: [{ name: "amount", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "cancel", inputs: [], outputs: [], stateMutability: "nonpayable" },
  // ── Events ──
  { type: "event", name: "DonationReceived", inputs: [{ name: "donor", type: "address", indexed: true }, { name: "amount", type: "uint256", indexed: false }, { name: "totalRaised", type: "uint256", indexed: false }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "GoalReached", inputs: [{ name: "totalRaised", type: "uint256", indexed: false }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "ProjectFinalized", inputs: [{ name: "status", type: "uint8", indexed: false }, { name: "totalRaised", type: "uint256", indexed: false }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "FundsWithdrawn", inputs: [{ name: "researcher", type: "address", indexed: true }, { name: "amount", type: "uint256", indexed: false }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "RefundClaimed", inputs: [{ name: "donor", type: "address", indexed: true }, { name: "amount", type: "uint256", indexed: false }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "ProjectCancelled", inputs: [{ name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
] as const;
