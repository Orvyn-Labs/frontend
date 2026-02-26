export const ProjectFactoryAbi = [
  { type: "constructor", inputs: [{ name: "admin", type: "address" }, { name: "implementation", type: "address" }, { name: "fundingPool", type: "address" }], stateMutability: "nonpayable" },
  { type: "function", name: "DEFAULT_ADMIN_ROLE", inputs: [], outputs: [{ name: "", type: "bytes32" }], stateMutability: "view" },
  { type: "function", name: "FACTORY_ADMIN_ROLE", inputs: [], outputs: [{ name: "", type: "bytes32" }], stateMutability: "view" },
  { type: "function", name: "createProject", inputs: [{ name: "title", type: "string" }, { name: "fundingGoal", type: "uint256" }, { name: "deadline", type: "uint256" }], outputs: [{ name: "project", type: "address" }], stateMutability: "nonpayable" },
  { type: "function", name: "getProjects", inputs: [], outputs: [{ name: "", type: "address[]" }], stateMutability: "view" },
  { type: "function", name: "projectCount", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "isProject", inputs: [{ name: "project", type: "address" }], outputs: [{ name: "", type: "bool" }], stateMutability: "view" },
  { type: "function", name: "implementation", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
  { type: "function", name: "fundingPool", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
  { type: "function", name: "hasRole", inputs: [{ name: "role", type: "bytes32" }, { name: "account", type: "address" }], outputs: [{ name: "", type: "bool" }], stateMutability: "view" },
  { type: "event", name: "ProjectCreated", inputs: [{ name: "project", type: "address", indexed: true }, { name: "researcher", type: "address", indexed: true }, { name: "title", type: "string", indexed: false }, { name: "fundingGoal", type: "uint256", indexed: false }, { name: "deadline", type: "uint256", indexed: false }], anonymous: false },
] as const;
