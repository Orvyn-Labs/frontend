export const FundingPoolAbi = [
  // constructor now takes dkt as 2nd arg
  { type: "constructor", inputs: [{ name: "admin", type: "address" }, { name: "_dkt", type: "address" }], stateMutability: "nonpayable" },
  { type: "function", name: "DEFAULT_ADMIN_ROLE", inputs: [], outputs: [{ name: "", type: "bytes32" }], stateMutability: "view" },
  { type: "function", name: "ALLOCATOR_ROLE", inputs: [], outputs: [{ name: "", type: "bytes32" }], stateMutability: "view" },
  { type: "function", name: "DEPOSITOR_ROLE", inputs: [], outputs: [{ name: "", type: "bytes32" }], stateMutability: "view" },
  { type: "function", name: "dkt", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
  { type: "function", name: "totalPool", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "totalDonations", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "totalYieldDistributed", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "totalDonationsReceived", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "totalYieldReceived", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "totalYieldRoutedToProjects", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "projectBalance", inputs: [{ name: "project", type: "address" }], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "projectAllocations", inputs: [{ name: "project", type: "address" }], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  // receiveDonation(project, donor, amount) — NOT payable; pulls DKT via transferFrom
  { type: "function", name: "receiveDonation", inputs: [{ name: "project", type: "address" }, { name: "donor", type: "address" }, { name: "amount", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  // receiveYield(source, amount) — NOT payable; pulls DKT via transferFrom
  { type: "function", name: "receiveYield", inputs: [{ name: "source", type: "address" }, { name: "amount", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  // receiveYieldForProject(project, staker, amount) — NOT payable; pulls DKT via transferFrom
  { type: "function", name: "receiveYieldForProject", inputs: [{ name: "project", type: "address" }, { name: "staker", type: "address" }, { name: "amount", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "allocateToProject", inputs: [{ name: "project", type: "address" }, { name: "amount", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "withdrawAllocation", inputs: [{ name: "amount", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "poolMetrics", inputs: [], outputs: [{ name: "pool", type: "uint256" }, { name: "donations", type: "uint256" }, { name: "yield", type: "uint256" }, { name: "balance", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "hasRole", inputs: [{ name: "role", type: "bytes32" }, { name: "account", type: "address" }], outputs: [{ name: "", type: "bool" }], stateMutability: "view" },
  { type: "event", name: "DonationReceived", inputs: [{ name: "project", type: "address", indexed: true }, { name: "donor", type: "address", indexed: true }, { name: "amount", type: "uint256", indexed: false }, { name: "newPoolTotal", type: "uint256", indexed: false }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "YieldReceived", inputs: [{ name: "source", type: "address", indexed: true }, { name: "amount", type: "uint256", indexed: false }, { name: "newPoolTotal", type: "uint256", indexed: false }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "YieldRoutedToProject", inputs: [{ name: "project", type: "address", indexed: true }, { name: "staker", type: "address", indexed: true }, { name: "amount", type: "uint256", indexed: false }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "AllocationMade", inputs: [{ name: "project", type: "address", indexed: true }, { name: "amount", type: "uint256", indexed: false }, { name: "remainingPool", type: "uint256", indexed: false }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "AllocationWithdrawn", inputs: [{ name: "project", type: "address", indexed: true }, { name: "amount", type: "uint256", indexed: false }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
] as const;
