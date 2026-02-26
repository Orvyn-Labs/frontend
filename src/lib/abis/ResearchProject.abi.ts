export const ResearchProjectAbi = [
  { type: "function", name: "projectInfo", inputs: [], outputs: [{ name: "", type: "tuple", components: [{ name: "title", type: "string" }, { name: "researcher", type: "address" }, { name: "fundingGoal", type: "uint256" }, { name: "deadline", type: "uint256" }, { name: "totalRaised", type: "uint256" }, { name: "status", type: "uint8" }] }], stateMutability: "view" },
  { type: "function", name: "title", inputs: [], outputs: [{ name: "", type: "string" }], stateMutability: "view" },
  { type: "function", name: "researcher", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
  { type: "function", name: "fundingGoal", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "deadline", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "totalRaised", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "status", inputs: [], outputs: [{ name: "", type: "uint8" }], stateMutability: "view" },
  { type: "function", name: "donorContribution", inputs: [{ name: "donor", type: "address" }], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "initialize", inputs: [{ name: "_title", type: "string" }, { name: "_researcher", type: "address" }, { name: "_fundingGoal", type: "uint256" }, { name: "_deadline", type: "uint256" }, { name: "_fundingPool", type: "address" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "finalize", inputs: [], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "fundingPool", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
  { type: "event", name: "ProjectFinalized", inputs: [{ name: "status", type: "uint8", indexed: false }, { name: "totalRaised", type: "uint256", indexed: false }], anonymous: false },
] as const;
