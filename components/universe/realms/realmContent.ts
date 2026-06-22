/**
 * CODEX INFINITUM — Realm content model (reusable across all realms).
 * Every explorable realm is authored as a RealmContent: three depth districts
 * (Surface / Interior / Archive, canon doc 4 §14.1) + one unlockable skill.
 * Phase 4 ships The Foundations; future realms add entries to CONTENT.
 */

export type DistrictId = "surface" | "interior" | "archive";

export interface DistrictTopic {
  name: string;
  blurb: string;
}

export interface District {
  id: DistrictId;
  /** in-world name, e.g. "The Hall of Axioms" */
  name: string;
  /** audience framing, e.g. "Surface · For everyone" */
  layerLabel: string;
  /** the emotional/explanatory lede for this layer */
  intro: string;
  topics: DistrictTopic[];
  /** archive districts are gated behind a depth unlock */
  gated?: boolean;
}

export interface RealmSkill {
  id: string;
  name: string;
  origin: string;
  effect: string;
  usedIn: string[];
}

export interface RealmContent {
  slug: string;
  /** the realm's message/koan (canon doc 4 "Message") */
  message: string;
  atmosphere: string;
  districts: District[];
  skill: RealmSkill;
}

const FOUNDATIONS: RealmContent = {
  slug: "the-foundations",
  message:
    "Before the metal, before the code — there was the question of what can be known, and what can never be.",
  atmosphere:
    "Tessellating planes of light. Glowing theorems. An infinite library where machines first learned the rules of thinking.",
  districts: [
    {
      id: "surface",
      name: "The Hall of Axioms",
      layerLabel: "Surface · For everyone",
      intro:
        "Before computers could think, humans discovered the rules of thinking. Logic. Mathematics. The quiet art of solving a problem by breaking it into truths that cannot be argued with.",
      topics: [
        { name: "Logic", blurb: "The grammar of certainty — true, false, and the rules that bind them." },
        { name: "Mathematics", blurb: "Not invented but discovered — patterns that were always there, waiting." },
        { name: "Problem Solving", blurb: "Turning a vast unknown into a sequence of knowable steps." },
      ],
    },
    {
      id: "interior",
      name: "The Computation Engine",
      layerLabel: "Interior · For developers",
      intro:
        "Descend into the machinery. Here the abstract becomes mechanical — structures, relationships, and the cost of every solution made visible before a line of code is written.",
      topics: [
        { name: "Discrete Mathematics", blurb: "The mathematics of the countable — the native language of computers." },
        { name: "Boolean Logic", blurb: "AND, OR, NOT — the atoms every circuit and condition is built from." },
        { name: "Graph Theory", blurb: "Nodes and edges: networks, dependencies, the shape of relationships." },
        { name: "Algorithms", blurb: "Recipes with guarantees — applied theory wearing work clothes." },
        { name: "Complexity", blurb: "Big-O: knowing the cost of a solution before you pay it." },
      ],
    },
    {
      id: "archive",
      name: "The Incompleteness Vault",
      layerLabel: "Deep Archive · For the curious",
      gated: true,
      intro:
        "The deepest, most honest room in the universe — where computation meets its own limits. Not everything that can be asked can be answered. This is where you learn the difference between hard and impossible.",
      topics: [
        { name: "Automata Theory", blurb: "Machines defined by states and transitions — computation, distilled." },
        { name: "Finite Automata", blurb: "The simplest computers: they accept, reject, and remember almost nothing." },
        { name: "Turing Machines", blurb: "An idea, on infinite tape, that defines what 'computable' even means." },
        { name: "Computability", blurb: "The map of what any machine, anywhere, could ever solve." },
        { name: "The Halting Problem", blurb: "Proof that some questions no program can ever answer — including about itself." },
        { name: "P vs NP", blurb: "The universe's greatest open question: is finding as easy as checking?" },
        { name: "Gödel's Incompleteness", blurb: "In any rich system, true statements exist that it can never prove." },
      ],
    },
  ],
  skill: {
    id: "computational-thinking",
    name: "Computational Thinking",
    origin: "The Foundations",
    effect:
      "Knows what can be computed, what is provably hard, and what no machine will ever solve. Reduces the unknown to the known.",
    usedIn: ["Algorithms", "Artificial Intelligence", "Software Engineering"],
  },
};

const SILICON_FOUNDRY: RealmContent = {
  slug: "silicon-foundry",
  message: "This is where the digital body is forged. Every abstraction above eventually meets metal.",
  atmosphere:
    "An engineering workshop carved into the planet's crust — molten silicon, holographic schematics, a continent-sized motherboard igniting trace by trace.",
  districts: [
    {
      id: "surface",
      name: "The Workshop Floor",
      layerLabel: "Surface · For everyone",
      intro:
        "Before thought, before code, there is matter. This is how physical stuff — sand, copper, electrons — is arranged until it can compute.",
      topics: [
        { name: "Electricity & Logic", blurb: "A switch that is on or off — the atom of all computation." },
        { name: "From Sand to Silicon", blurb: "How rock becomes a billion microscopic decisions per second." },
        { name: "The Machine Has a Body", blurb: "Intelligence is never abstract. It needs somewhere to live." },
      ],
    },
    {
      id: "interior",
      name: "The Assembly Bay",
      layerLabel: "Interior · For developers",
      intro: "Step onto the floor where logic becomes mechanism — gates wired into the organs of a thinking machine.",
      topics: [
        { name: "Circuits", blurb: "Logic gates wired into adders and multiplexers — the machinery of decision." },
        { name: "The CPU", blurb: "Fetch, decode, execute — the heartbeat that never rests." },
        { name: "Memory Hierarchy", blurb: "Registers to cache to RAM to disk — speed traded for size at every step." },
        { name: "Computer Architecture", blurb: "How the pieces are arranged so the whole can think." },
        { name: "Buses & I/O", blurb: "The roads along which every byte travels." },
      ],
    },
    {
      id: "archive",
      name: "The Deep Schematics",
      layerLabel: "Deep Archive · For the curious",
      gated: true,
      intro: "The reasoning beneath the metal — why this architecture, and where physics imposes its veto.",
      topics: [
        { name: "Instruction Sets", blurb: "The vocabulary a processor is born understanding." },
        { name: "Assembly", blurb: "Speaking to the machine in its own tongue." },
        { name: "Microarchitecture", blurb: "Pipelines and branch prediction — the tricks that make silicon fast." },
        { name: "Hardware Evolution", blurb: "Vacuum tubes to transistors to multicore — Moore's long climb." },
        { name: "Parallelism", blurb: "When one core isn't enough, you teach many to cooperate." },
      ],
    },
  ],
  skill: {
    id: "system-understanding",
    name: "System Understanding",
    origin: "The Silicon Foundry",
    effect: "Sees the metal beneath the abstraction. Never confuses a model for the machine.",
    usedIn: ["Performance Engineering", "Embedded Systems", "Systems Design"],
  },
};

const CODE_HELIX: RealmContent = {
  slug: "code-helix",
  message: "This is where ideas receive a language.",
  atmosphere:
    "Floating cities of glass and light around a vast spiraling helix of living syntax, compiling itself into structure in real time.",
  districts: [
    {
      id: "surface",
      name: "The Grammar Spire",
      layerLabel: "Surface · For everyone",
      intro: "Code is how a human intention becomes something a machine will faithfully obey — over and over, without tiring.",
      topics: [
        { name: "What Is Code", blurb: "Turning an idea into a precise sequence of instructions." },
        { name: "Languages", blurb: "Different tongues for different thoughts — each a lens on the problem." },
        { name: "Abstraction", blurb: "Hiding complexity so bigger ideas become thinkable." },
      ],
    },
    {
      id: "interior",
      name: "The Structures Quarter",
      layerLabel: "Interior · For developers",
      intro: "The load-bearing district — where data takes shape and algorithms give it motion.",
      topics: [
        { name: "Programming", blurb: "Variables, loops, functions — the verbs and nouns of creation." },
        { name: "Object-Oriented Programming", blurb: "Modelling the world as objects that know things and do things." },
        { name: "Data Structures", blurb: "Arrays, trees, graphs, hash maps — the architecture that holds it up." },
        { name: "Algorithms", blurb: "Solutions with guarantees about time and space." },
        { name: "Design Patterns", blurb: "Named solutions to problems every builder eventually meets." },
      ],
    },
    {
      id: "archive",
      name: "The Patterns Archive",
      layerLabel: "Deep Archive · For the curious",
      gated: true,
      intro: "The wisdom beneath the craft — how language itself is built, and how programs come alive.",
      topics: [
        { name: "Compilers", blurb: "Lexing → parsing → optimization → code generation: intention forged into machine instructions." },
        { name: "Language Theory", blurb: "Type systems, semantics — the mathematics of meaning." },
        { name: "Runtime Systems", blurb: "Garbage collectors, schedulers, JITs — the world your program runs inside." },
        { name: "Concurrency Models", blurb: "Threads, async, actors — coordinating many things at once." },
        { name: "Software Engineering", blurb: "Building systems that survive contact with reality — and with other people." },
      ],
    },
  ],
  skill: {
    id: "software-architecture",
    name: "Software Architecture",
    origin: "The Code Helix",
    effect: "Designs how the pieces connect before writing a line. Chooses the right structure, not the familiar one.",
    usedIn: ["Product Engineering", "System Design", "Team Codebases"],
  },
};

const NEURAL_NEBULA: RealmContent = {
  slug: "neural-nebula",
  message: "This is where machines learn.",
  atmosphere:
    "A vast cloud of glowing nodes connected by probability streams, pulsing with inference — a mind in the act of thinking while you watch.",
  districts: [
    {
      id: "surface",
      name: "The Inference Field",
      layerLabel: "Surface · For everyone",
      intro: "Some machines aren't told the rules — they learn them, from examples, the way you learned to recognize a face.",
      topics: [
        { name: "What Is Learning", blurb: "Finding patterns in examples instead of being told the rules." },
        { name: "Data → Behavior", blurb: "Every time you skip a song, you are training a system." },
        { name: "Prediction", blurb: "Turning what was into a guess about what will be." },
      ],
    },
    {
      id: "interior",
      name: "The Training Laboratory",
      layerLabel: "Interior · For developers",
      intro: "Watch a model train — loss descending, weights shifting — the machinery of an intelligence being shaped.",
      topics: [
        { name: "Artificial Intelligence", blurb: "Bending machines toward human purpose." },
        { name: "Machine Learning", blurb: "Models that improve from data — supervised, unsupervised, reinforced." },
        { name: "Data Science", blurb: "Turning raw data into the substrate of intelligence." },
        { name: "Neural Networks", blurb: "Layers of weighted connections that learn representations." },
        { name: "Feature Engineering", blurb: "Choosing what the model is even allowed to notice." },
      ],
    },
    {
      id: "archive",
      name: "The Alignment Vault",
      layerLabel: "Deep Archive · For the curious",
      gated: true,
      intro: "The hardest, most honest layer — why models behave as they do, and how to make them want what we mean.",
      topics: [
        { name: "Deep Learning", blurb: "Depth upon depth — networks that learn their own features." },
        { name: "Transformers", blurb: "Attention: the mechanism behind the modern revolution." },
        { name: "Large Language Models", blurb: "Systems that learned language by predicting the next token, at scale." },
        { name: "AI Research", blurb: "The frontier — what works, what doesn't, and why." },
        { name: "Alignment", blurb: "Teaching powerful systems to want what we actually mean." },
        { name: "Model Behavior", blurb: "Knowing WHY a model behaves — not just that it does." },
      ],
    },
  ],
  skill: {
    id: "intelligence-engineering",
    name: "Intelligence Engineering",
    origin: "The Neural Nebula",
    effect: "Bends models toward human purpose. Knows WHY a model behaves, not just that it does.",
    usedIn: ["AI Products", "ML Pipelines", "Applied Research"],
  },
};

const THE_CITADEL: RealmContent = {
  slug: "the-citadel",
  message: "This is where the universe protects itself.",
  atmosphere:
    "A layered fortress of dark steel and energy — firewalls as walls of light, threat-signatures dissolving against golden lattices, the green glow of the war-room within.",
  districts: [
    {
      id: "surface",
      name: "The Outer Wall",
      layerLabel: "Surface · For everyone",
      intro: "Every living system faces threats. This realm is the immune system of the universe — always scanning, always learning.",
      topics: [
        { name: "Why Security", blurb: "A system that ignores its attack surface is an unfinished attempt." },
        { name: "Trust", blurb: "An architecture decision, not a feeling." },
        { name: "The Adversary", blurb: "Users are adversaries too — design for it." },
      ],
    },
    {
      id: "interior",
      name: "The War Room",
      layerLabel: "Interior · For developers",
      intro: "The defender's terminal — where you learn to see traffic, secrets, and identity the way an attacker would.",
      topics: [
        { name: "Security Principles", blurb: "CIA triad, least privilege, defense in depth." },
        { name: "Networks", blurb: "Packets, ports, protocols — and every road as a potential vector." },
        { name: "Cryptography", blurb: "Math that keeps secrets and proves identity." },
        { name: "Authentication", blurb: "Proving who you are — and authorizing what you may do." },
        { name: "Monitoring", blurb: "You cannot defend what you cannot see." },
      ],
    },
    {
      id: "archive",
      name: "The Black Site",
      layerLabel: "Deep Archive · For the curious",
      gated: true,
      intro: "Real adversarial thinking — where security stops being rules and becomes a way of seeing.",
      topics: [
        { name: "Vulnerability Research", blurb: "Finding the flaw before the adversary maps it for you." },
        { name: "Threat Modeling", blurb: "Reasoning about who attacks, why, and how." },
        { name: "Exploitation Concepts", blurb: "Understanding the attack to build the defense (OWASP and beyond)." },
        { name: "Secure Architecture", blurb: "Systems that fail safe, not open." },
        { name: "Adversarial Thinking", blurb: "Seeing the surface before someone else does." },
      ],
    },
  ],
  skill: {
    id: "security-thinking",
    name: "Security Thinking",
    origin: "The Citadel",
    effect: "Sees the attack surface before the attacker does. Treats trust as something proven, never assumed.",
    usedIn: ["Secure Systems", "Auth & Access Control", "Risk Assessment"],
  },
};

const DATA_ARCHIVES: RealmContent = {
  slug: "data-archives",
  message: "Data stores the memories of the digital universe.",
  atmosphere:
    "Vast crystal halls of glowing data-cubes stretching to infinity, raw streams pouring from a great dome and crystallizing below into walkable charts.",
  districts: [
    {
      id: "surface",
      name: "The Query Hall",
      layerLabel: "Surface · For everyone",
      intro: "Data is the residue of everything that ever happened. This realm is where it becomes knowledge someone can act on.",
      topics: [
        { name: "What Is Data", blurb: "The trace of events, waiting for someone who can read it." },
        { name: "Data → Knowledge", blurb: "Numbers become insight only when someone asks the right question." },
        { name: "The Story In Numbers", blurb: "Data without narrative is just numbers experiencing existential anxiety." },
      ],
    },
    {
      id: "interior",
      name: "The Insight Dome",
      layerLabel: "Interior · For developers",
      intro: "The analyst's workspace — where memory is structured, queried, and turned into a decision.",
      topics: [
        { name: "Databases", blurb: "Structured memory — tables, keys, relationships." },
        { name: "SQL", blurb: "The language for asking memory precise questions." },
        { name: "Data Modeling", blurb: "Designing how truth is stored so it stays true." },
        { name: "Analytics", blurb: "Finding the pattern, the anomaly, the decision." },
        { name: "Visualization", blurb: "Making the invisible shape of data visible." },
      ],
    },
    {
      id: "archive",
      name: "The Cold Storage",
      layerLabel: "Deep Archive · For the curious",
      gated: true,
      intro: "What happens when memory outgrows a single machine — and how meaning itself gets stored.",
      topics: [
        { name: "Distributed Databases", blurb: "Consistency, availability, partitions — pick your tradeoffs." },
        { name: "Big Data Systems", blurb: "When the data outgrows any one machine." },
        { name: "Data Pipelines", blurb: "Moving and transforming data reliably, at scale." },
        { name: "Knowledge Representation", blurb: "Graphs and ontologies — teaching machines what things mean." },
        { name: "Data Governance", blurb: "Privacy, lineage, and trust in the numbers." },
      ],
    },
  ],
  skill: {
    id: "data-intelligence",
    name: "Data Intelligence",
    origin: "The Data Archives",
    effect: "Turns rows into decisions. Finds the narrative the numbers are trying to tell.",
    usedIn: ["Analytics", "Business Intelligence", "ML Data Foundations"],
  },
};

const SOUL_QUARTER: RealmContent = {
  slug: "soul-quarter",
  message: "Imagination becomes reality.",
  atmosphere:
    "Aurora-like streams of light, formless and color-shifting — a realm that refuses to settle, where games, art, and interfaces are born.",
  districts: [
    {
      id: "surface",
      name: "The Playground",
      layerLabel: "Surface · For everyone",
      intro: "The capacity to imagine something that does not exist, feel that it should, and build the bridge — this realm is that, made into a place.",
      topics: [
        { name: "What Is Creative Code", blurb: "Making something for the joy of it — then discovering it matters." },
        { name: "Play", blurb: "Interaction is a conversation between human and machine." },
        { name: "Taste", blurb: "Knowing what to build, and what to leave out." },
      ],
    },
    {
      id: "interior",
      name: "The Design Studio",
      layerLabel: "Interior · For developers",
      intro: "The discipline behind the delight — the craft of making the infinite feel approachable.",
      topics: [
        { name: "UI / UX", blurb: "Empathy implemented in pixels." },
        { name: "Graphics", blurb: "Turning math into images that move." },
        { name: "Game Systems", blurb: "Rules, feedback, and the loop that keeps you playing." },
        { name: "Interactive Design", blurb: "Designing the dialogue between intent and response." },
        { name: "Motion", blurb: "Animation as communication, not decoration." },
      ],
    },
    {
      id: "archive",
      name: "The Dream Vault",
      layerLabel: "Deep Archive · For the curious",
      gated: true,
      intro: "Where creativity meets the machine at its deepest — and is allowed to experiment, and fail.",
      topics: [
        { name: "Rendering", blurb: "The pipeline that turns a scene into a frame, 60 times a second." },
        { name: "Simulations", blurb: "Physics, particles, worlds that behave." },
        { name: "Human-Computer Interaction", blurb: "The senses through which an intelligence is experienced." },
        { name: "Shaders", blurb: "Tiny programs that paint every pixel." },
        { name: "Generative Systems", blurb: "Code that surprises its own author." },
      ],
    },
  ],
  skill: {
    id: "creative-engineering",
    name: "Creative Engineering",
    origin: "The Soul Quarter",
    effect: "Turns functional products into beloved ones. Knows that how it feels is part of how it works.",
    usedIn: ["Product Design", "Interactive Media", "Frontend Craft"],
  },
};

const THE_KERNEL: RealmContent = {
  slug: "the-kernel",
  message: "You never see the operating system. You only notice when it fails — like breathing.",
  atmosphere:
    "A shimmering pressure-layer enveloping every realm — process-currents drifting like weather, the scheduler pulsing like a metronome of breath.",
  districts: [
    {
      id: "surface",
      name: "The Breath Layer",
      layerLabel: "Surface · For everyone",
      intro: "Between the hardware and every program lives an invisible manager. It decides who gets the machine, and when — so quietly you never feel it.",
      topics: [
        { name: "What Is an OS", blurb: "The first program the hardware trusts — the atmosphere programs breathe." },
        { name: "Resources", blurb: "Someone has to decide who gets the CPU, the memory, the disk." },
        { name: "The Invisible Manager", blurb: "The best systems are the ones you never have to think about." },
      ],
    },
    {
      id: "interior",
      name: "The Scheduler",
      layerLabel: "Interior · For developers",
      intro: "Inside the arbiter — currents of execution, slices of time, and the polite fiction that each program owns the machine.",
      topics: [
        { name: "Processes & Threads", blurb: "The currents of execution flowing through every program." },
        { name: "Scheduling", blurb: "Thousands of times a second, the kernel hands out slices of time." },
        { name: "Virtual Memory", blurb: "Every program believes it owns the machine — a polite fiction." },
        { name: "Concurrency", blurb: "When two currents meet, they must take turns." },
        { name: "System Calls", blurb: "The membrane between a program's wish and the kernel's permission." },
      ],
    },
    {
      id: "archive",
      name: "The Privilege Ring",
      layerLabel: "Deep Archive · For the curious",
      gated: true,
      intro: "Where the line of trust is drawn — and where timing itself decides what is true.",
      topics: [
        { name: "Kernel Architecture", blurb: "Monolithic, microkernel — where the boundary of trust is drawn." },
        { name: "Deadlocks & Races", blurb: "The hardest bugs live where timing decides truth." },
        { name: "Memory Management", blurb: "Paging, allocation, the economy of finite RAM." },
        { name: "Privilege & Isolation", blurb: "Every boundary is a wall the kernel defends." },
        { name: "Real-Time Systems", blurb: "When 'eventually' is not good enough." },
      ],
    },
  ],
  skill: {
    id: "resource-orchestration",
    name: "Resource Orchestration",
    origin: "The Kernel",
    effect: "Reasons about what runs when, and what it costs. Makes the invisible layer behave.",
    usedIn: ["Systems Programming", "Performance", "Concurrency"],
  },
};

const NETWORK_PATHWAYS: RealmContent = {
  slug: "network-pathways",
  message: "No intelligence exists in isolation.",
  atmosphere:
    "Luminous fiber-threads stretching across cosmic distance — data packets racing as bioluminescent pulses through the void between worlds.",
  districts: [
    {
      id: "surface",
      name: "The Signal Road",
      layerLabel: "Surface · For everyone",
      intro: "A network makes information that exists here matter somewhere else. The internet is not a place — it is a state of being connected.",
      topics: [
        { name: "What Is a Network", blurb: "Making information that exists here matter somewhere else." },
        { name: "Connection", blurb: "Every machine a neuron in a brain no one designed." },
        { name: "The Internet", blurb: "Not a place — a state of being connected." },
      ],
    },
    {
      id: "interior",
      name: "The Protocol Stack",
      layerLabel: "Interior · For developers",
      intro: "The layered agreements that let strangers' machines talk — and the handshake every page load performs.",
      topics: [
        { name: "TCP/IP", blurb: "The layered agreement that lets distant machines talk." },
        { name: "DNS", blurb: "The universe's address book." },
        { name: "HTTP & TLS", blurb: "The handshake and the secret behind every page load." },
        { name: "Routing", blurb: "Finding a path across a planet in milliseconds." },
        { name: "Sockets & Packets", blurb: "Conversations broken into pieces and reassembled." },
      ],
    },
    {
      id: "archive",
      name: "The Deep Wire",
      layerLabel: "Deep Archive · For the curious",
      gated: true,
      intro: "The physics and politics of connection — distance you cannot argue with, agreement when no one is in charge.",
      topics: [
        { name: "Network Architecture", blurb: "Topologies and layers — the shape of connection." },
        { name: "Latency & Throughput", blurb: "The physics of distance you cannot argue with." },
        { name: "Protocol Design", blurb: "Inventing the rules two machines will both obey." },
        { name: "Network Security", blurb: "Every connection is a thread someone could tap." },
        { name: "Distributed Coordination", blurb: "Agreement when no one is in charge." },
      ],
    },
  ],
  skill: {
    id: "connection-architecture",
    name: "Connection Architecture",
    origin: "Network Pathways",
    effect: "Thinks in protocols and tradeoffs. Knows information has a cost to move.",
    usedIn: ["Networking", "Distributed Systems", "API Design"],
  },
};

const CLOUD_EXPANSE: RealmContent = {
  slug: "cloud-expanse",
  message: "Computation that lives nowhere and everywhere at once.",
  atmosphere:
    "Endless luminous cloud-formations above every realm — computation happening visibly as weather patterns of light.",
  districts: [
    {
      id: "surface",
      name: "The Open Sky",
      layerLabel: "Surface · For everyone",
      intro: "The cloud is hardware you rent instead of own — accessible from anywhere, its true mechanics invisible to those who rely on it.",
      topics: [
        { name: "What Is the Cloud", blurb: "Hardware you rent instead of own — someone else's foundry." },
        { name: "Everywhere & Nowhere", blurb: "Accessible from anywhere; its mechanics invisible." },
        { name: "Scale", blurb: "From one user to a million without rebuilding." },
      ],
    },
    {
      id: "interior",
      name: "The Weather Systems",
      layerLabel: "Interior · For developers",
      intro: "Many machines pretending to be one — designed for the load you hope for and the failure you know is coming.",
      topics: [
        { name: "Distributed Systems", blurb: "Many machines pretending to be one." },
        { name: "Serverless", blurb: "Functions that spawn, run, and vanish like weather events." },
        { name: "Containers & Orchestration", blurb: "Packaging software so it runs the same everywhere." },
        { name: "Scalability", blurb: "Designing for the load you hope to one day have." },
        { name: "Reliability", blurb: "Designing for the failure that will certainly come." },
      ],
    },
    {
      id: "archive",
      name: "The Stratosphere",
      layerLabel: "Deep Archive · For the curious",
      gated: true,
      intro: "The deep laws of the sky — agreement, failure, and the tradeoffs no architecture escapes.",
      topics: [
        { name: "Consensus", blurb: "Getting distributed machines to agree (Paxos, Raft)." },
        { name: "CAP Theorem", blurb: "Consistency, availability, partition tolerance — choose two." },
        { name: "Fault Tolerance", blurb: "Systems that survive their own pieces dying." },
        { name: "Edge Computing", blurb: "Pushing the cloud back down toward the device." },
        { name: "Infrastructure as Code", blurb: "Declaring the sky and letting it assemble itself." },
      ],
    },
  ],
  skill: {
    id: "distributed-thinking",
    name: "Distributed Thinking",
    origin: "The Cloud Expanse",
    effect: "Designs for scale and failure together. Knows the sky is rented hardware you've agreed to trust.",
    usedIn: ["Cloud Architecture", "DevOps", "Scalable Backends"],
  },
};

const FOUNDERS_CONSTELLATION: RealmContent = {
  slug: "founders-constellation",
  message: "Every realm was once an impossible idea in a single human mind.",
  atmosphere:
    "A celestial hall where each great mind is a star and each breakthrough a constellation, connected by threads of influence into a single luminous lineage.",
  districts: [
    {
      id: "surface",
      name: "The Night Sky",
      layerLabel: "Surface · For everyone",
      intro: "Nothing in this universe was invented alone. Look up — every realm you have walked began as someone's impossible idea.",
      topics: [
        { name: "Standing on Shoulders", blurb: "Nothing here was invented alone." },
        { name: "The First Questions", blurb: "Every realm began as a question someone dared to ask." },
        { name: "Why History", blurb: "You cannot understand where computing is going without seeing where it began." },
      ],
    },
    {
      id: "interior",
      name: "The Lineage",
      layerLabel: "Interior · The ancestors",
      intro: "The minds whose ideas became the realms — each star a breakthrough that the present still rests on.",
      topics: [
        { name: "Ada Lovelace", blurb: "Saw, a century early, that a calculating engine could create, not just calculate." },
        { name: "Alan Turing", blurb: "Imagined a machine that could imagine — and defined what 'computable' means." },
        { name: "John von Neumann", blurb: "The architecture nearly every computer still uses." },
        { name: "Claude Shannon", blurb: "Proved a thought could be a number — information theory." },
        { name: "Grace Hopper", blurb: "Made machines speak closer to human language — the compiler." },
      ],
    },
    {
      id: "archive",
      name: "The Modern Constellation",
      layerLabel: "Deep Archive · The continuing lineage",
      gated: true,
      intro: "The lineage never ended. The newest stars are still forming — and one of them might one day be yours.",
      topics: [
        { name: "Dijkstra & Knuth", blurb: "Discipline and rigor in the craft of algorithms." },
        { name: "McCarthy & Kay", blurb: "AI, Lisp, and the idea of objects." },
        { name: "Cerf, Kahn & Berners-Lee", blurb: "The protocols and the Web that connected everyone." },
        { name: "The Deep-Learning Era", blurb: "Hinton, LeCun, Bengio, Li — teaching machines to see and speak." },
        { name: "The Unfinished Constellation", blurb: "The newest stars are still forming. The lineage is ongoing." },
      ],
    },
  ],
  skill: {
    id: "historical-perspective",
    name: "Historical Perspective",
    origin: "The Founders' Constellation",
    effect: "Knows whose ideas they are building on. Sees today's tools as someone's once-impossible.",
    usedIn: ["Engineering Judgment", "Research", "Mentorship"],
  },
};

const OBSERVATORY: RealmContent = {
  slug: "the-observatory",
  message: "The journey never ends.",
  atmosphere:
    "A quiet, elevated glass deck at the edge of the known universe, looking outward into the fog of the unexplored.",
  districts: [
    {
      id: "surface",
      name: "The Horizon",
      layerLabel: "Surface · For everyone",
      intro: "Here the visitor stops looking at the cosmos and starts looking outward from it — into the dark beyond, where the map ends and the future begins.",
      topics: [
        { name: "The Frontier", blurb: "What we do not yet know is the most honest part of the map." },
        { name: "Curiosity", blurb: "The same spark that started everything still pulls outward." },
        { name: "What Comes Next", blurb: "That part isn't written yet — that's the part you might write." },
      ],
    },
    {
      id: "interior",
      name: "The Telescopes",
      layerLabel: "Interior · For developers",
      intro: "Instruments aimed at what is just becoming possible — promise and responsibility in equal measure.",
      topics: [
        { name: "The AI Future", blurb: "From narrow tools toward general capability — promise and responsibility." },
        { name: "Quantum Computing", blurb: "Computers that compute with possibility itself." },
        { name: "Human-Machine Systems", blurb: "Interfaces dissolving the boundary between thought and tool." },
        { name: "Brain-Computer Interfaces", blurb: "Reading and writing the language of the mind." },
        { name: "Post-Quantum Security", blurb: "Securing a world where today's cryptography breaks." },
      ],
    },
    {
      id: "archive",
      name: "The Unexplored Territories",
      layerLabel: "Deep Archive · The fog",
      gated: true,
      intro: "The territories not yet charted — honesty made visible. The fog is not a failure. It is a promise.",
      topics: [
        { name: "AGI & Alignment", blurb: "Building minds we can trust at scale." },
        { name: "Neuromorphic Hardware", blurb: "Chips that compute the way brains do." },
        { name: "Space Computing", blurb: "Computation beyond a single planet." },
        { name: "Computational Biology", blurb: "Code meeting the code of life." },
        { name: "The Fog", blurb: "The territories not yet charted — a promise, not a failure." },
      ],
    },
  ],
  skill: {
    id: "frontier-vision",
    name: "Frontier Vision",
    origin: "The Observatory",
    effect: "Holds curiosity and humility together. Knows the map's edge is a promise, not a failure.",
    usedIn: ["Research Direction", "Innovation", "Lifelong Learning"],
  },
};

/** Realm content registry. Future realms append here. */
export const REALM_CONTENT: Record<string, RealmContent> = {
  [FOUNDATIONS.slug]: FOUNDATIONS,
  [SILICON_FOUNDRY.slug]: SILICON_FOUNDRY,
  [CODE_HELIX.slug]: CODE_HELIX,
  [NEURAL_NEBULA.slug]: NEURAL_NEBULA,
  [THE_CITADEL.slug]: THE_CITADEL,
  [DATA_ARCHIVES.slug]: DATA_ARCHIVES,
  [SOUL_QUARTER.slug]: SOUL_QUARTER,
  [THE_KERNEL.slug]: THE_KERNEL,
  [NETWORK_PATHWAYS.slug]: NETWORK_PATHWAYS,
  [CLOUD_EXPANSE.slug]: CLOUD_EXPANSE,
  [FOUNDERS_CONSTELLATION.slug]: FOUNDERS_CONSTELLATION,
  [OBSERVATORY.slug]: OBSERVATORY,
};

export function getRealmContent(slug: string | null): RealmContent | undefined {
  return slug ? REALM_CONTENT[slug] : undefined;
}

/** A realm is "enterable" once its interior content exists. */
export function isEnterable(slug: string | null): boolean {
  return !!getRealmContent(slug);
}
