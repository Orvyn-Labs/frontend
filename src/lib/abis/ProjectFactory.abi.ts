export const ProjectFactoryAbi = [
  // constructor now takes _dkt as 4th arg
  { type: "constructor", inputs: [{ name: "admin", type: "address" }, { name: "researchProjectImpl", type: "address" }, { name: "_fundingPool", type: "address" }, { name: "_dkt", type: "address" }], stateMutability: "nonpayable" },
  { type: "function", name: "DEFAULT_ADMIN_ROLE", inputs: [], outputs: [{ name: "", type: "bytes32" }], stateMutability: "view" },
  { type: "function", name: "FACTORY_ADMIN_ROLE", inputs: [], outputs: [{ name: "", type: "bytes32" }], stateMutability: "view" },
  { type: "function", name: "MIN_DURATION", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "MAX_DURATION", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  // createProject takes duration in SECONDS, not an absolute deadline
  { type: "function", name: "createProject", inputs: [{ name: "title", type: "string" }, { name: "goalAmount", type: "uint256" }, { name: "duration", type: "uint256" }], outputs: [{ name: "projectAddr", type: "address" }], stateMutability: "nonpayable" },
  // getProjects is paginated: (offset, limit) → address[]
  { type: "function", name: "getProjects", inputs: [{ name: "offset", type: "uint256" }, { name: "limit", type: "uint256" }], outputs: [{ name: "page", type: "address[]" }], stateMutability: "view" },
  { type: "function", name: "totalProjects", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "allProjects", inputs: [{ name: "", type: "uint256" }], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
  { type: "function", name: "projectsOf", inputs: [{ name: "researcher", type: "address" }], outputs: [{ name: "", type: "address[]" }], stateMutability: "view" },
  { type: "function", name: "currentImplementation", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
  { type: "function", name: "beacon", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
  { type: "function", name: "fundingPool", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
  { type: "function", name: "dkt", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
  { type: "function", name: "hasRole", inputs: [{ name: "role", type: "bytes32" }, { name: "account", type: "address" }], outputs: [{ name: "", type: "bool" }], stateMutability: "view" },
  { type: "event", name: "ProjectCreated", inputs: [{ name: "projectAddress", type: "address", indexed: true }, { name: "researcher", type: "address", indexed: true }, { name: "projectId", type: "bytes32", indexed: true }, { name: "title", type: "string", indexed: false }, { name: "goalAmount", type: "uint256", indexed: false }, { name: "deadline", type: "uint256", indexed: false }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
] as const;
