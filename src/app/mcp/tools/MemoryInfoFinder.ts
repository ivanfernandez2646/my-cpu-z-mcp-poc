import type { McpTool } from "../../../contexts/shared/infrastructure/mcp/McpTool.ts";
import { McpToolResponse } from "../../../contexts/shared/infrastructure/mcp/McpToolResponse.ts";
import os from "node:os";

type MemoryInfoSummary = {
  totalBytes: number;
  freeBytes: number;
  usedBytes: number;
  usedPercent: number;
};

export class MemoryInfoFinderTool implements McpTool {
  name = "memory-info_finder";
  title = "Memory info finder";
  description = "Returns the memory info of the current machine";
  inputSchema = {};

  async handler(): Promise<McpToolResponse> {
    const memoryInfo = this.getMemoryInfo();

    const text = `🧠 Memory Info:
    ----------------
    📦 Total: ${this.formatBytes(memoryInfo.totalBytes)}
    🟢 Free: ${this.formatBytes(memoryInfo.freeBytes)}
    🔥 Used: ${this.formatBytes(memoryInfo.usedBytes)} (${memoryInfo.usedPercent}%)
    ----------------`;

    return McpToolResponse.text(text);
  }

  private getMemoryInfo(): MemoryInfoSummary {
    const totalBytes = os.totalmem();
    const freeBytes = os.freemem();
    const usedBytes = totalBytes - freeBytes;
    const usedPercent = totalBytes === 0 ? 0 : Number(((usedBytes / totalBytes) * 100).toFixed(2));

    return { totalBytes, freeBytes, usedBytes, usedPercent };
  }

  private formatBytes(bytes: number): string {
    const gb = bytes / 1024 ** 3;
    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`;
    }

    const mb = bytes / 1024 ** 2;
    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }

    const kb = bytes / 1024;
    if (kb >= 1) {
      return `${kb.toFixed(2)} KB`;
    }

    return `${bytes} B`;
  }
}
