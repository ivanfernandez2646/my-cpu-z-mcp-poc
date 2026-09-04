import type { McpPrompt } from "../../../contexts/shared/infrastructure/mcp/McpPrompt.ts";
import { McpPromptResponse } from "../../../contexts/shared/infrastructure/mcp/McpPromptResponse.ts";
import { z } from "zod";

const purposes = ["gaming", "home_office", "video_editor"] as const;

type Purpose = (typeof purposes)[number];

const purposeSchema = z.enum(purposes);

export class ComputerPurposeUpgradePrompt implements McpPrompt {
  name = "computer-purpose-upgrade";
  title = "Computer purpose upgrade prompt";
  description =
    "Returns a prompt to score this machine for gaming, home office, or video editing and list realistic upgrades";
  inputSchema = {
    purpose: purposeSchema.describe("Target use: gaming, home_office, or video_editor"),
  };

  async handler(params?: Record<string, unknown>): Promise<McpPromptResponse> {
    const parsed = purposeSchema.safeParse(params?.purpose);

    if (!parsed.success) {
      return McpPromptResponse.user(
        `ERROR: purpose must be one of: ${purposes.join(", ")}. Got: ${String(params?.purpose)}.`,
      );
    }

    return McpPromptResponse.user(this.promptFor(parsed.data), `Upgrade prompt for ${parsed.data}`);
  }

  private promptFor(purpose: Purpose): string {
    const shared = `You are producing one upgrade resume for this computer. The user will reuse this resume as they wish.

Call these MCP tools in this exact order. Do not skip. Do not invent hardware specs:
1. cpu-info_finder
2. memory-info_finder
3. disk-info_finder

Use only those tool results plus platform facts that are already in the tool output (CPU model string, architecture). If a tool fails, stop and report that tool error. Do not guess RAM, disk, GPU, or chassis.

Scoring (integers 0-100, no decimals):
- current_score: fitness for the stated purpose TODAY.
- reachable_score: fitness after upgrades a typical owner can actually buy and install (RAM DIMM/SO-DIMM, extra SSD, discrete GPU in a desktop PCIe slot, better PSU if the case allows).

Honesty rules:
- Be blunt. Inflated scores waste money.
- If the chassis cannot become that kind of machine, do NOT invent a path. Output a hard error (see purpose rules) and omit reachable_score.
- Always state what this computer is honestly good for TODAY, even on hard-fail.
- Final resume: short bullets, most useful first, then lower-priority upgrades. No fluff.

Output structure (plain text):
1. PURPOSE
2. TOOLS USED (the three, in order, one-line summary each)
3. HARDWARE SNAPSHOT (from tools only)
4. IMPOSSIBILITY: either "none" or "ERROR: ..."
5. CURRENT SCORE / REACHABLE SCORE (reachable omitted on ERROR)
6. HONEST CURRENT USE (what this PC is for now)
7. HOW TO GET THERE (only if not ERROR)
8. RESUME BULLETS (priority order)
`;

    const purposeBlock = {
      gaming: `PURPOSE: gaming (a real PC gamer: dedicated GPU or equivalent desktop-class graphics, adequate cooling/power, typically 16GB+ RAM, storage for games).

Impossibility (hard ERROR, do not list fantasy upgrades):
- Fanless or thin ultrabooks with soldered RAM and no GPU slot (MacBook Air, similar Air/Yoga/XPS 13-class machines) cannot become a real gaming PC.
- iGPU-only laptops with no MXM/PCIe GPU path cannot become a real gaming PC by buying RAM or an SSD.
- Phones, tablets, and ARM boards with no discrete GPU path: ERROR.
- Apple Silicon MacBook Pro can run some games; it is still not a "real PC gamer" if there is no upgradable dGPU. ERROR for "real PC gamer". Do not suggest eGPUs as if they were a standard gaming PC.

If not ERROR: score CPU (cores/clock from the tool), RAM amount vs 16/32GB gaming baseline, disk free space vs game installs. GPU will often be missing from tools: say "GPU unknown from tools" and cap current_score unless the CPU string clearly implies a known APU. Do not invent a GPU model.`,

      home_office: `PURPOSE: home office (browser, docs, video calls, light spreadsheets).

Impossibility (hard ERROR, rare):
- Unusable machine: no meaningful RAM for a modern OS (treat soldered ~2-4GB with no upgrade path as ERROR for a workable home office).
- Disk effectively full with no way to add/replace storage: ERROR.
- Otherwise almost every PC can be a home office machine. Prefer low current_score + cheap upgrades over ERROR.

If not ERROR: score RAM vs 8/16GB office baseline, disk free space, CPU enough for calls (almost always yes). Prioritize RAM and storage over CPU.`,

      video_editor: `PURPOSE: video editor (1080p/4K timeline, encode, media cache).

Impossibility (hard ERROR):
- Soldered RAM below 8GB with no upgrade path: ERROR for serious editing (proxies will still hurt).
- Tiny disk (very low free space from disk-info_finder) with no replaceable/additional drive: ERROR (media will not fit).
- A MacBook Air is NOT an automatic ERROR for video. M-series Air can edit with proxies; score it honestly, do not call it a grading bay.

If not ERROR: score RAM vs 16/32GB edit baseline, disk free space vs media, CPU cores for encode. Mention GPU acceleration only if the CPU string implies a known iGPU/dGPU; otherwise "GPU unknown from tools".`,
    }[purpose];

    return `${shared}\n${purposeBlock}`;
  }
}
