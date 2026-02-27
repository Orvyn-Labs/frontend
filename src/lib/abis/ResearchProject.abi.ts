export const ResearchProjectAbi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },

  // ── View ──
  { type: "function", name: "researcher",            inputs: [], outputs: [{ name: "", type: "address" }],  stateMutability: "view" },
  { type: "function", name: "title",                 inputs: [], outputs: [{ name: "", type: "string" }],   stateMutability: "view" },
  { type: "function", name: "projectId",             inputs: [], outputs: [{ name: "", type: "bytes32" }],  stateMutability: "view" },
  { type: "function", name: "projectStatus",         inputs: [], outputs: [{ name: "", type: "uint8" }],    stateMutability: "view" },
  { type: "function", name: "fundingPool",           inputs: [], outputs: [{ name: "", type: "address" }],  stateMutability: "view" },
  { type: "function", name: "dkt",                   inputs: [], outputs: [{ name: "", type: "address" }],  stateMutability: "view" },
  { type: "function", name: "currentMilestoneIndex", inputs: [], outputs: [{ name: "", type: "uint256" }],  stateMutability: "view" },
  { type: "function", name: "milestoneCount",        inputs: [], outputs: [{ name: "", type: "uint256" }],  stateMutability: "view" },
  { type: "function", name: "totalRaised",           inputs: [], outputs: [{ name: "total", type: "uint256" }], stateMutability: "view" },

  {
    type: "function", name: "getMilestone",
    inputs: [{ name: "idx", type: "uint256" }],
    outputs: [{
      name: "", type: "tuple",
      components: [
        { name: "title",    type: "string" },
        { name: "goal",     type: "uint256" },
        { name: "deadline", type: "uint256" },
        { name: "raised",   type: "uint256" },
        { name: "votesYes", type: "uint256" },
        { name: "votesNo",  type: "uint256" },
        { name: "proofUri", type: "string" },
        { name: "status",   type: "uint8" },
      ],
    }],
    stateMutability: "view",
  },

  {
    type: "function", name: "currentMilestone",
    inputs: [],
    outputs: [{
      name: "", type: "tuple",
      components: [
        { name: "title",    type: "string" },
        { name: "goal",     type: "uint256" },
        { name: "deadline", type: "uint256" },
        { name: "raised",   type: "uint256" },
        { name: "votesYes", type: "uint256" },
        { name: "votesNo",  type: "uint256" },
        { name: "proofUri", type: "string" },
        { name: "status",   type: "uint8" },
      ],
    }],
    stateMutability: "view",
  },

  {
    type: "function", name: "milestoneProgress",
    inputs: [{ name: "idx", type: "uint256" }],
    outputs: [{ name: "bps", type: "uint256" }],
    stateMutability: "view",
  },

  {
    type: "function", name: "myDonation",
    inputs: [{ name: "milestoneIdx", type: "uint256" }, { name: "donor", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },

  {
    type: "function", name: "donations",
    inputs: [{ name: "milestoneIdx", type: "uint256" }, { name: "donor", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },

  {
    type: "function", name: "voted",
    inputs: [{ name: "milestoneIdx", type: "uint256" }, { name: "donor", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },

  // ── Write ──
  {
    type: "function", name: "initialize",
    inputs: [
      { name: "_researcher",       type: "address" },
      { name: "_fundingPool",      type: "address" },
      { name: "_dkt",              type: "address" },
      { name: "_title",            type: "string" },
      { name: "_milestoneTitle",   type: "string[]" },
      { name: "_milestoneGoal",    type: "uint256[]" },
      { name: "_milestoneDuration",type: "uint256[]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },

  // donate(uint256) — must approve DKT first
  { type: "function", name: "donate",            inputs: [{ name: "amount",       type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "submitProof",       inputs: [{ name: "proofUri",     type: "string"  }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "vote",              inputs: [{ name: "approve",      type: "bool"    }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "finalizeMilestone", inputs: [],                                          outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "skipMilestone",     inputs: [],                                          outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "cancel",            inputs: [],                                          outputs: [], stateMutability: "nonpayable" },

  {
    type: "function", name: "claimRefund",
    inputs: [{ name: "milestoneIdx", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },

  // ── Events ──
  { type: "event", name: "DonationReceived",    inputs: [{ name: "donor", type: "address", indexed: true }, { name: "milestoneIndex", type: "uint256", indexed: false }, { name: "amount", type: "uint256", indexed: false }, { name: "milestoneRaised", type: "uint256", indexed: false }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "ProofSubmitted",      inputs: [{ name: "milestoneIndex", type: "uint256", indexed: true }, { name: "proofUri", type: "string", indexed: false }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "MilestoneVoted",      inputs: [{ name: "donor", type: "address", indexed: true }, { name: "milestoneIndex", type: "uint256", indexed: true }, { name: "approved", type: "bool", indexed: false }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "MilestoneFinalized",  inputs: [{ name: "milestoneIndex", type: "uint256", indexed: true }, { name: "result", type: "uint8", indexed: false }, { name: "raised", type: "uint256", indexed: false }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "FundsWithdrawn",      inputs: [{ name: "researcher", type: "address", indexed: true }, { name: "milestoneIndex", type: "uint256", indexed: false }, { name: "amount", type: "uint256", indexed: false }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "RefundClaimed",       inputs: [{ name: "donor", type: "address", indexed: true }, { name: "milestoneIndex", type: "uint256", indexed: true }, { name: "amount", type: "uint256", indexed: false }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "ProjectCancelled",    inputs: [{ name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "MilestoneActivated",  inputs: [{ name: "milestoneIndex", type: "uint256", indexed: true }, { name: "blockNumber", type: "uint256", indexed: false }], anonymous: false },
] as const;
