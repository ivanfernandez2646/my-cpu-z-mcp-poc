import type { McpTool } from "../../../contexts/shared/infrastructure/mcp/McpTool.ts";
import { McpToolResponse } from "../../../contexts/shared/infrastructure/mcp/McpToolResponse.ts";
import { statfs } from "node:fs/promises";

type DiskInfoSummary = {
  path: string;
  totalBytes: number;
  freeBytes: number;
  usedBytes: number;
  usedPercent: number;
};

export class DiskInfoFinderTool implements McpTool {
  name = "disk-info_finder";
  title = "Disk info finder";
  description = "Returns the disk info of the current machine";
  inputSchema = {};

  async handler(): Promise<McpToolResponse> {
    const diskInfo = await this.getDiskInfo();

    const text = `💽 Disk Info:
    ----------------
    📂 Path: ${diskInfo.path}
    📦 Total: ${this.formatBytes(diskInfo.totalBytes)}
    🟢 Free: ${this.formatBytes(diskInfo.freeBytes)}
    🔥 Used: ${this.formatBytes(diskInfo.usedBytes)} (${diskInfo.usedPercent}%)
    ----------------`;

    return McpToolResponse.text(text);
  }

  private async getDiskInfo(): Promise<DiskInfoSummary> {
    const path = process.cwd();
    const stats = await statfs(path);
    const blockSize = Number(stats.bsize);
    const totalBytes = Number(stats.blocks) * blockSize;
    const freeBytes = Number(stats.bavail) * blockSize;
    const usedBytes = totalBytes - freeBytes;
    const usedPercent = totalBytes === 0 ? 0 : Number(((usedBytes / totalBytes) * 100).toFixed(2));

    return { path, totalBytes, freeBytes, usedBytes, usedPercent };
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
