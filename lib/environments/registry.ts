/**
 * CODEX INFINITUM — Living Realm Engine Registry (Phase 10.4)
 * Contains the interactive, curriculum-based specifications for all CS worlds,
 * including landmarks, progressive descriptions, simulation paths, and cross-realm links.
 */

import type { RealmKnowledgeDefinition } from "./types";

const SILICON_FOUNDRY_KNOWLEDGE: RealmKnowledgeDefinition = {
  realmSlug: "silicon-foundry",
  title: "Signal Path — Electricity to Result",
  welcomeSpeech: "We are no longer looking at the machine. We are inside it.",
  cameraOverview: {
    position: [12, 10, 16],
    lookAt: [0, 1, -10],
  },
  landmarks: [
    {
      id: "cpu-tower",
      name: "Processor Tower",
      type: "core",
      position: [0, 0, -10],
      pos2D: { x: 0.45, y: 0.5 },
      whatIsIt: "The CPU Core executing digital operations.",
      whyMatters: "Software needs a physical body. Every line of code is eventually compiled into binary and executed here as electrical signals.",
      howItWorks: {
        beginner: "The brain of the computer. It takes in instructions one by one, reads what they want, and executes them like a super-fast chef following a recipe.",
        intermediate: "Runs the instruction cycle: FETCH (retrieves 32/64-bit opcode from L1 instruction cache) -> DECODE (translates opcode via control unit logic) -> EXECUTE (runs arithmetic/logic in the ALU).",
        expert: "A multi-stage superscalar out-of-order execution pipeline. Uses branch prediction (speculative execution) and vector units (AVX-512) to maximize instructions per cycle (IPC) at 4.5+ GHz.",
      },
      realUse: "ALU in modern microprocessors (like Intel Core i9 or Apple Silicon M-Series).",
      difficultyLevel: "Expert",
      skillsUnlocked: ["CPU Instruction Pipeline Design", "Assembly Programming"],
      connectedRealms: ["the-kernel", "code-helix"],
      connectedProjects: [
        { name: "VisiRoD FIRS", slug: "visirod-firs" },
        { name: "CommentFellows", slug: "commentfellows" },
      ],
      nexusComment: "Watch how the core pulses. That's the clock speed dictating billions of steps a second.",
    },
    {
      id: "ram-city",
      name: "Memory Array City",
      type: "node",
      position: [7.5, 0, -10],
      pos2D: { x: 0.8, y: 0.5 },
      whatIsIt: "Random Access Memory modules.",
      whyMatters: "Provides fast, volatile, random-access storage for active programs. Without RAM, the CPU would waste 99% of its cycles waiting for disk storage.",
      howItWorks: {
        beginner: "A giant chalkboard where the computer scribbles numbers it's currently using. When the power goes off, the chalkboard is wiped clean.",
        intermediate: "Dynamic RAM organizes bits into addressable capacitor arrays. It periodically refreshes columns to keep charge, communicating with CPU cache over high-speed buses.",
        expert: "Synchronous DRAM utilizing dual-channel architecture. Transfers data on both rising and falling edges of the clock (DDR5) with bandwidths exceeding 60 GB/s and sub-15ns access latency.",
      },
      realUse: "System Main Memory (DDR5 DIMMs, LPDDR5X).",
      difficultyLevel: "Intermediate",
      skillsUnlocked: ["Virtual Memory Mapping", "Caching Strategy"],
      connectedRealms: ["the-kernel", "data-archives"],
      connectedProjects: [{ name: "Bus Reservation", slug: "bus-reservation" }],
      nexusComment: "Every active process gets its own slice of this memory grid. The Kernel enforces strict boundaries so they don't overwrite each other.",
    },
    {
      id: "logic-factory",
      name: "Logic Gate Factory",
      type: "factory",
      position: [-7.5, -1, -5],
      pos2D: { x: 0.15, y: 0.35 },
      whatIsIt: "AND, OR, and NOT Boolean logic operations.",
      whyMatters: "The atomic units of computation. All software logic, mathematical addition, and memory addressing are built by combining these simple gates.",
      howItWorks: {
        beginner: "Tiny gates that allow or block electricity based on inputs. By combining them, we build circuits that can add or compare numbers.",
        intermediate: "Uses transistors as electrical switches. For example, two transistors in series make an AND gate; in parallel, they make an OR gate.",
        expert: "CMOS logic gates designed with complementary PMOS and NMOS transistor pairs, operating with picosecond propagation delays and minimal static power leakage.",
      },
      realUse: "Arithmetic Logic Units (ALUs), decoders, registers.",
      difficultyLevel: "Beginner",
      skillsUnlocked: ["Boolean Algebra", "Digital Circuit Design"],
      connectedRealms: ["the-foundations"],
      connectedProjects: [],
      nexusComment: "Electricity goes in, logic comes out. No matter how complex a system is, this is all it does under the hood.",
    },
    {
      id: "bus-highways",
      name: "System Bus Highways",
      type: "bus",
      position: [0, -3, 0],
      pos2D: { x: 0.45, y: 0.7 },
      whatIsIt: "High-speed connection paths between motherboard components.",
      whyMatters: "The communication channel between the CPU, RAM, and storage. Bandwidth determines system throughput.",
      howItWorks: {
        beginner: "A multi-lane highway for data packets. The wider the highway, the more data can travel at once.",
        intermediate: "Parallel trace pathways synchronized by a system clock, transmitting address, control, and data bits simultaneously.",
        expert: "High-speed serial point-to-point buses like PCIe 5.0, using differential signaling and multi-lane configurations (up to x16) to reach 128 GB/s bi-directional bandwidth.",
      },
      realUse: "PCI Express Lanes, Ultra Path Interconnect (UPI).",
      difficultyLevel: "Intermediate",
      skillsUnlocked: ["Bus Bandwidth Optimization", "Hardware Interfaces"],
      connectedRealms: ["network-pathways"],
      connectedProjects: [{ name: "VisiRoD FIRS", slug: "visirod-firs" }],
      nexusComment: "Think of this as the nervous system. Without it, the processor and memory are isolated islands.",
    },
  ],
  steps: [
    {
      id: "electricity",
      label: "ELECTRICITY",
      caption: "A voltage difference races through copper traces — the only raw material a computer ever has.",
      nexusLine: "Every line of code eventually becomes electricity moving through places like this.",
      activeLandmarkId: "bus-highways",
    },
    {
      id: "logic",
      label: "LOGIC GATES",
      caption: "Two inputs meet a gate. AND, OR, and NOT are the only primitives — everything else is built from these three.",
      nexusLine: "AND, OR, NOT. Every complex algorithm is built on these three switches.",
      activeLandmarkId: "logic-factory",
    },
    {
      id: "cpu",
      label: "CPU CYCLE",
      caption: "FETCH pulls an instruction from memory. DECODE figures out what it means. EXECUTE makes the ALU act on it.",
      nexusLine: "The CPU fetches the command and decodes it. A tiny clock pulse orchestrates the dance.",
      activeLandmarkId: "cpu-tower",
    },
    {
      id: "memory",
      label: "MEMORY",
      caption: "The CPU sends an address down the bus. RAM answers with the data that lived there.",
      nexusLine: "These structures hold the thoughts before they become action.",
      activeLandmarkId: "ram-city",
    },
    {
      id: "result",
      label: "RESULT",
      caption: "The five stages collapse into one outcome — a bit, a byte, a decision the rest of the program can use.",
      nexusLine: "The calculation is complete, and the cycle begins anew.",
      activeLandmarkId: "cpu-tower",
    },
  ],
};

const NETWORK_PATHWAYS_KNOWLEDGE: RealmKnowledgeDefinition = {
  realmSlug: "network-pathways",
  title: "Data Packet Journey",
  welcomeSpeech: "Welcome to the nervous system. Let's watch how data connects the world.",
  cameraOverview: {
    position: [0, 6, 12],
    lookAt: [0, 0, -8],
  },
  landmarks: [
    {
      id: "router-station",
      name: "Router Station",
      type: "gateway",
      position: [0, 0, -8],
      pos2D: { x: 0.5, y: 0.5 },
      whatIsIt: "Network routing gateways directing data packets.",
      whyMatters: "Directs traffic across the global decentralized web, ensuring packets find the fastest path to their destination.",
      howItWorks: {
        beginner: "A traffic controller that reads the address on letters (packets) and points them towards the right highway.",
        intermediate: "Inspects IP headers, references routing tables, and uses protocols like OSPF or BGP to forward packets to the next hop.",
        expert: "Layer 3 packet forwarding utilizing hardware ASICs. Runs routing protocols to calculate shortest paths and manages traffic congestion with QoS queues.",
      },
      realUse: "Cisco/Juniper core routers, CDN edge gateways.",
      difficultyLevel: "Intermediate",
      skillsUnlocked: ["IP Routing", "BGP Configuration"],
      connectedRealms: ["the-citadel", "cloud-expanse"],
      connectedProjects: [
        { name: "VisiRoD FIRS", slug: "visirod-firs" },
        { name: "CommentFellows", slug: "commentfellows" },
      ],
      nexusComment: "The network is decentralized. Packets split up, taking different routes to reach the destination.",
    },
  ],
  steps: [
    {
      id: "app-layer",
      label: "APPLICATION LAYER",
      caption: "The message is packaged with headers describing the protocol (HTTP, FTP, SMTP).",
      nexusLine: "Watch this packet. It looks small, but inside it carries human communication.",
      activeLandmarkId: "router-station",
    },
  ],
};

export const REALM_KNOWLEDGE: Record<string, RealmKnowledgeDefinition> = {
  "silicon-foundry": SILICON_FOUNDRY_KNOWLEDGE,
  "network-pathways": NETWORK_PATHWAYS_KNOWLEDGE,
};

export function getRealmKnowledge(slug: string): RealmKnowledgeDefinition | null {
  return REALM_KNOWLEDGE[slug] ?? null;
}
