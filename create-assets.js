const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'public/assets/images');
const sampleNotesDir = path.join(__dirname, 'public/assets/sample-notes');

if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
if (!fs.existsSync(sampleNotesDir)) fs.mkdirSync(sampleNotesDir, { recursive: true });

// 1. Generate SVG Logo
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 50" width="280" height="50">
  <g fill="none" stroke="#6255a5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 14 C14 11, 24 11, 30 14 C36 11, 46 11, 52 14 L52 34 C46 31, 36 31, 30 34 C24 31, 14 31, 8 34 Z" fill="#f4f0ff" />
    <path d="M30 14 L30 34" />
    <path d="M8 20 C14 17, 24 17, 30 20 C36 17, 46 17, 52 20" />
    <path d="M8 26 C14 23, 24 23, 30 26 C36 23, 46 23, 52 26" />
  </g>
  <text x="62" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="700" fill="#6255a5">Notes <tspan fill="#333333">MarketPlace</tspan></text>
  <text x="63" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="10" font-weight="400" fill="#718096">Learning is a lifelong process...</text>
</svg>`;
fs.writeFileSync(path.join(imgDir, 'logo.svg'), logoSvg);

// Generate White Logo
const logoWhiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 50" width="280" height="50">
  <g fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 14 C14 11, 24 11, 30 14 C36 11, 46 11, 52 14 L52 34 C46 31, 36 31, 30 34 C24 31, 14 31, 8 34 Z" fill="rgba(255,255,255,0.2)" />
    <path d="M30 14 L30 34" />
    <path d="M8 20 C14 17, 24 17, 30 20 C36 17, 46 17, 52 20" />
    <path d="M8 26 C14 23, 24 23, 30 26 C36 23, 46 23, 52 26" />
  </g>
  <text x="62" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="700" fill="#ffffff">Notes MarketPlace</text>
  <text x="63" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="10" font-weight="400" fill="#cbd5e1">Learning is a lifelong process...</text>
</svg>`;
fs.writeFileSync(path.join(imgDir, 'logo-white.svg'), logoWhiteSvg);

// 2. Advanced Cover Generator with Embossed Spine, Badges & Geometric Mesh
function createAdvancedCover(filename, title, subtitle, category, code, startColor, endColor, accentColor) {
  const gradId = `grad-${filename.replace(/[^a-z0-9]/gi, '')}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 260" width="420" height="260">
    <defs>
      <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${startColor}" />
        <stop offset="60%" stop-color="${endColor}" />
        <stop offset="100%" stop-color="#0a0c16" />
      </linearGradient>
      <linearGradient id="spine-shade" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(0,0,0,0.5)" />
        <stop offset="25%" stop-color="rgba(255,255,255,0.12)" />
        <stop offset="100%" stop-color="rgba(0,0,0,0.15)" />
      </linearGradient>
      <pattern id="dot-pattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.08)" />
      </pattern>
    </defs>
    
    <!-- Background & Dot Mesh -->
    <rect width="420" height="260" fill="url(#${gradId})" rx="8" />
    <rect width="420" height="260" fill="url(#dot-pattern)" rx="8" />

    <!-- Book Spine 3D Effect -->
    <rect x="0" y="0" width="18" height="260" fill="url(#spine-shade)" />
    <line x1="18" y1="0" x2="18" y2="260" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" />

    <!-- Inner Border Framing -->
    <rect x="28" y="16" width="376" height="228" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" rx="6" />

    <!-- Top Academic Ribbon -->
    <rect x="28" y="16" width="376" height="38" fill="rgba(0,0,0,0.25)" />
    <text x="44" y="39" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="800" fill="${accentColor}" letter-spacing="2.5">NOTES MARKETPLACE</text>
    <text x="388" y="39" font-family="monospace" font-size="10" font-weight="700" fill="rgba(255,255,255,0.6)" text-anchor="end">${code}</text>

    <!-- Main Title & Subtitle -->
    <text x="44" y="98" font-family="system-ui, -apple-system, sans-serif" font-size="21" font-weight="900" fill="#ffffff" letter-spacing="-0.3">${title}</text>
    <text x="44" y="124" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="500" fill="#cbd5e1">${subtitle}</text>

    <!-- Divider Bar -->
    <rect x="44" y="142" width="70" height="3" fill="${accentColor}" rx="1.5" />

    <!-- Category Pill Tag -->
    <rect x="44" y="165" width="95" height="22" rx="4" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" stroke-width="1" />
    <text x="91" y="180" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">${category.toUpperCase()}</text>

    <!-- Bottom Metadata Band -->
    <rect x="28" y="210" width="376" height="34" fill="rgba(0,0,0,0.35)" />
    <circle cx="44" cy="227" r="4" fill="${accentColor}" />
    <text x="56" y="231" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="600" fill="#f8fafc">VERIFIED CURRICULUM</text>
    
    <!-- Barcode simulation -->
    <g transform="translate(320, 218)" fill="rgba(255,255,255,0.7)">
      <rect x="0" y="0" width="2" height="18" />
      <rect x="4" y="0" width="1" height="18" />
      <rect x="7" y="0" width="3" height="18" />
      <rect x="12" y="0" width="1" height="18" />
      <rect x="15" y="0" width="2" height="18" />
      <rect x="19" y="0" width="3" height="18" />
      <rect x="24" y="0" width="1" height="18" />
      <rect x="27" y="0" width="2" height="18" />
      <rect x="31" y="0" width="4" height="18" />
      <rect x="37" y="0" width="1" height="18" />
      <rect x="40" y="0" width="2" height="18" />
      <rect x="44" y="0" width="3" height="18" />
    </g>
  </svg>`;
  fs.writeFileSync(path.join(imgDir, filename), svg);
}

// Generate Covers
createAdvancedCover('cover-cs.svg', 'Computer Science', 'Core Architecture, Algorithms & Discrete Logic', 'Computer', 'CS-248706', '#1e1b4b', '#312e81', '#93c5fd');
createAdvancedCover('cover-os.svg', 'Operating System', 'Final Exam Book Solution & Kernel Internals', 'IT / CS', 'OS-302', '#0f172a', '#1e293b', '#38bdf8');
createAdvancedCover('cover-eng.svg', 'Basic Engineering', 'Foundations of Computing & Digital Electronics', 'Engineering', 'BE-101', '#1e3a5f', '#1d4ed8', '#60a5fa');
createAdvancedCover('cover-cs-ill.svg', 'CS Illuminated', 'Seventh Edition Complete Course Syllabus', 'Computer', 'CSI-700', '#2e1065', '#4c1d95', '#c084fc');
createAdvancedCover('cover-hardware.svg', 'Computer Hardware', 'Microprocessor Systems, Oxford Press Edition', 'Computer', 'HW-401', '#064e3b', '#047857', '#34d399');
createAdvancedCover('cover-book.svg', 'The Computer Book', 'Milestones in Software, Networks & Systems', 'Computer', 'HIS-210', '#134e4a', '#0f766e', '#2dd4bf');
createAdvancedCover('cover-ds.svg', 'Data Science', 'Machine Learning, Neural Nets & Analytics', 'Science', 'DS-201', '#3b0764', '#581c87', '#e879f9');
createAdvancedCover('cover-accounts.svg', 'Accounts & Finance', 'Corporate Financial Auditing & Accounting', 'Commerce', 'ACC-101', '#701a75', '#86198f', '#f472b6');
createAdvancedCover('cover-social.svg', 'Social Studies', 'Modern Civilization, Politics & History', 'Social', 'SOC-305', '#831843', '#9d174d', '#fb7185');
createAdvancedCover('cover-bio.svg', 'Human Body Anatomy', 'Biological Systems, Physiology & Organ Review', 'Medical', 'MED-110', '#881337', '#9f1239', '#fda4af');

// 3. Generate Avatars
function createAvatar(filename, initials, bg) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="50" fill="${bg}" />
    <text x="50" y="62" font-family="-apple-system, sans-serif" font-size="34" font-weight="800" fill="#ffffff" text-anchor="middle">${initials}</text>
  </svg>`;
  fs.writeFileSync(path.join(imgDir, filename), svg);
}

createAvatar('avatar-walter.svg', 'WM', '#4f46e5');
createAvatar('avatar-jonnie.svg', 'JR', '#0891b2');
createAvatar('avatar-amilia.svg', 'AL', '#d97706');
createAvatar('avatar-daniel.svg', 'DC', '#059669');
createAvatar('avatar-richard.svg', 'RB', '#7c3aed');
createAvatar('avatar-admin.svg', 'AD', '#6255a5');

// 4. Generate Highly Detailed & Advanced Academic Previews (Multi-Topic, Realistic Structure)
const advancedPreviewCS = 
`========================================================================================
                     NOTES MARKETPLACE - OFFICIAL ACADEMIC COURSE PACK
========================================================================================
Subject           : Computer Science & Operating Systems
Course Code       : CS-248706 / SPM-3171609
Institution       : University of California / GEC Modasa (GTU Code: 021)
Instructor        : Prof. Richard Brown / Prof Nilesh D Goriya
Verified Category : Computer Science & Engineering | Academic Year: 2026-27
Quality Status    : ★★★★★ APPROVED BY SQA REVIEW BOARD (100+ Reviews)
========================================================================================

TABLE OF CONTENTS
----------------------------------------------------------------------------------------
Unit 1 : Advanced Processor Architecture & Memory Hierarchy
Unit 2 : Process Scheduling, Synchronization & Deadlock Avoidance
Unit 3 : Virtual Memory Management, Page Replacement & TLB
Unit 4 : Algorithmic Complexity, Big-O Notation & Data Structures
Unit 5 : Solved University Examination Papers & Viva Voice Preparation

========================================================================================
UNIT 1: ADVANCED PROCESSOR ARCHITECTURE & MEMORY SUBSYSTEM
========================================================================================

1.1 Von Neumann Architecture vs Harvard Architecture
    • Von Neumann: Unified address bus and data bus for instructions and operands.
      - Potential Bottleneck: "Von Neumann Bottleneck" (throughput limited by memory bus speed).
    • Harvard Architecture: Physically separated storage and signal pathways for code and data.
      - Advantage: Simultaneous instruction fetching and operand read/write cycles.

1.2 Memory Hierarchy & Access Latency
    ┌─────────────────────────────────┬──────────────────────┬──────────────────────┐
    │ Memory Level                    │ Typical Capacity     │ Access Latency       │
    ├─────────────────────────────────┼──────────────────────┼──────────────────────┤
    │ CPU Registers                   │ 1 KB - 2 KB          │ 0.5 - 1 clock cycle  │
    │ Level 1 Cache (L1 D-Cache/I-Cache) 64 KB - 128 KB      │ 1 - 2 ns (4 cycles)  │
    │ Level 2 Cache (L2 Dedicated)    │ 512 KB - 2 MB        │ 3 - 5 ns (14 cycles) │
    │ Level 3 Cache (L3 Shared)       │ 16 MB - 64 MB        │ 10 - 20 ns (50-70 cyc)│
    │ Main Memory (DDR5 SDRAM)        │ 16 GB - 64 GB        │ 50 - 80 ns           │
    │ NVMe Solid State Drive (M.2)    │ 1 TB - 4 TB          │ 10 - 25 µs           │
    └─────────────────────────────────┴──────────────────────┴──────────────────────┘

1.3 Cache Coherence Protocols
    • MESI Protocol: Modified (M), Exclusive (E), Shared (S), Invalid (I).
      Ensures hardware-level data integrity across multi-core processors.

========================================================================================
UNIT 2: PROCESS SCHEDULING, CONCURRENCY & DEADLOCK MITIGATION
========================================================================================

2.1 Process State Transition Diagram:
         [New] ──> [Ready] <───(Time Quantum Expired)───┐
                     │                                   │
                 (Dispatch)                           (Running)
                     │                                   │
                     v                                   v
                 [Running] ───(I/O or Event Wait)───> [Waiting/Blocked]
                     │                                   │
                  (Exit)                            (I/O Complete)
                     v                                   │
                [Terminated]                             v
                                                      [Ready]

2.2 CPU Scheduling Algorithms Compared:
    1. First-Come, First-Served (FCFS): Non-preemptive, suffers from Convoy Effect.
    2. Shortest Job First (SJF): Provably optimal average turnaround time; impossible to predict burst.
    3. Round Robin (RR): Preemptive, ideal for time-sharing systems; performance depends on Quantum q.
    4. Multi-Level Feedback Queue (MLFQ): Dynamic priority aging to prevent process starvation.

2.3 Coffman's Four Necessary Conditions for Deadlock:
    1. Mutual Exclusion: At least one unshareable resource.
    2. Hold and Wait: Process holding at least one resource and requesting additional ones.
    3. No Preemption: Resources cannot be forcibly expropriated from a holding process.
    4. Circular Wait: A closed chain of processes P0 -> P1 -> ... -> Pn -> P0 exists.

2.4 Dijkstra's Banker's Algorithm (Deadlock Avoidance):
    • Safety Check: Ensures State is Safe before granting any resource request.
    • Formula: Need[i][j] = Max[i][j] - Allocation[i][j]
    • If Need <= Work, Work = Work + Allocation.

========================================================================================
SAMPLE EXAM QUESTION (SOLVED) - GTU PREVIOUS PAPER
========================================================================================
Question:
Consider 5 processes P0 through P4 with Allocation, Max and Available matrices:
Available = [3, 3, 2]
Calculate the Safe Sequence.

Step-by-Step Solution:
1. Compute the Need Matrix (Need = Max - Allocation).
2. For P1: Need = [1, 2, 2] <= Available [3, 3, 2] -> P1 executes.
   New Available = [3, 3, 2] + Allocation(P1) [2, 0, 0] = [5, 3, 2].
3. For P3: Need = [0, 1, 1] <= Available [5, 3, 2] -> P3 executes.
   New Available = [5, 3, 2] + Allocation(P3) [2, 1, 1] = [7, 4, 3].
4. For P4: Need = [4, 3, 1] <= Available [7, 4, 3] -> P4 executes.
   New Available = [7, 4, 3] + Allocation(P4) [0, 0, 2] = [7, 4, 5].
5. For P0: Need = [0, 0, 0] <= Available [7, 4, 5] -> P0 executes.
   New Available = [7, 4, 5] + Allocation(P0) [0, 1, 0] = [7, 5, 5].
6. For P2: Need = [6, 0, 0] <= Available [7, 5, 5] -> P2 executes.

Resulting Safe Sequence: < P1, P3, P4, P0, P2 >. The system is in a SAFE STATE.

========================================================================================
[DOCUMENT NOTICE: Total Pages: 277 | Full notes include diagrams, code snippets, and review questions.]
Verified by NotesMarketplace Academic Quality Board.
========================================================================================`;

fs.writeFileSync(path.join(sampleNotesDir, 'sample-computer-science.txt'), advancedPreviewCS);

// Also create additional rich preview notes for variety
const advancedPreviewSPM = 
`========================================================================================
               SOFTWARE PROJECT MANAGEMENT (3171609) - LABORATORY MANUAL NOTES
========================================================================================
Subject           : Software Project Management
GTU Code          : 3171609 (B.E. Semester VII - Information Technology)
Institute         : Government Engineering College, Modasa (GTU Code: 021)
Faculty Incharge  : Prof Nilesh D Goriya | Head of Dept: Prof S. A. Vahora
Term Project      : NotesMarketplace Online Academic Platform
========================================================================================

PRACTICAL EXPERIMENT OUTLINE:
----------------------------------------------------------------------------------------
Practical 1 : Software Projects vs Other Types of Projects (Visibility, Complexity, Conformity)
Practical 2 : Functional & Non-Functional Requirements Specification (SRS)
Practical 3 : COCOMO Cost & Effort Estimation (Organic, Semi-Detached, Embedded)
Practical 4 : Critical Path Method (CPM) Project Planning & Gantt Scheduling
Practical 5 : Earned Value Analysis (EVA) Progress Tracking (PV, EV, AC, CPI, SPI)
Practical 6 : Software Configuration Management (SCM) Objects Identification
Practical 7 : Software Quality Assurance (SQA) Activities & Checkpoints
Practical 8 : Project Closure Analysis Report & Financial Settlement
Practical 9 : Full Prototype Implementation (NotesMarketplace Portal)
Practical 10: Presentation and Viva Examination

KEY FORMULAS & HIGHLIGHTS:
1. COCOMO (Basic Model - Semi-Detached):
   • Effort = a * (KLOC)^b = 3.0 * (113.65)^1.12 = 601.69 Person-Months
   • Time   = c * (Effort)^d = 2.5 * (601.69)^0.35 = 23.48 Months
   • Team   = Effort / Time = 601.69 / 23.48 ≈ 26 Developers

2. Critical Path Method (CPM):
   • Critical Path: A -> B -> C -> E -> F -> G -> I (Total Duration: 65 Days)
   • Slack = LS - ES = LF - EF = 0 on the Critical Path.

3. Earned Value Analysis (EVA):
   • Cost Performance Index (CPI) = EV / AC = 34,000 / 36,000 = 0.94 (< 1: Over Budget)
   • Schedule Performance Index (SPI) = EV / PV = 34,000 / 45,000 = 0.76 (< 1: Behind Schedule)
   • Estimate at Completion (EAC) = BAC / CPI = 100,000 / 0.94 = ₹106,383

Verified for Term Project Submission 2026-27.`;

fs.writeFileSync(path.join(sampleNotesDir, 'sample-spm.txt'), advancedPreviewSPM);

console.log('✅ Advanced assets & multi-topic previews generated successfully!');
