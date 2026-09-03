import type { McpTool } from "../../../contexts/shared/infrastructure/mcp/McpTool.ts";
import { McpToolResponse } from "../../../contexts/shared/infrastructure/mcp/McpToolResponse.ts";
import { hrtime } from "node:process";
import os from "node:os";

type CpuInfoSummary = {
  model: string;
  architecture: string;
  cores: number;
  speedMHz: number;
  usage: {
    userPercent: number;
    systemPercent: number;
    totalPercent: number;
  };
};

export class CpuInfoFinderTool implements McpTool {
  name = "cpu-info_finder";
  title = "CPU info finder";
  description = "Returns the CPU info of the current machine";
  inputSchema = {};

  async handler(): Promise<McpToolResponse> {
    const cpuInfo = await this.getCpuInfo();

    const text = `💻 CPU Info:
    ----------------
    Model: ${cpuInfo.model}
    Architecture: ${cpuInfo.architecture}
    Cores: ${cpuInfo.cores}
    Speed: ${cpuInfo.speedMHz} MHz (Max)

    CPU Usage:
    ----------------
    User: ${cpuInfo.usage.userPercent}%
    System: ${cpuInfo.usage.systemPercent}%
    Total: ${cpuInfo.usage.totalPercent}%
    ----------------`;

    return McpToolResponse.text(text);
  }

  private async getCpuInfo(): Promise<CpuInfoSummary> {
    const usage = await this.getProcessCpuUsage();
    const cpus = os.cpus();

    return {
      model: cpus[0]?.model ?? "Unknown",
      architecture: os.arch(),
      cores: cpus.length,
      speedMHz: cpus[0]?.speed ?? 0,
      usage,
    };
  }

  private async getProcessCpuUsage(sampleMs = 1000): Promise<CpuInfoSummary["usage"]> {
    return new Promise((resolve) => {
      const startUsage = process.cpuUsage();
      const startTime = hrtime.bigint();

      setTimeout(() => {
        const elapUsage = process.cpuUsage(startUsage);
        const elapTimeNs = Number(hrtime.bigint() - startTime);

        // Convert microseconds from cpuUsage to nanoseconds
        const userNs = elapUsage.user * 1000;
        const systemNs = elapUsage.system * 1000;

        // Calculate percentages based on time elapsed
        const userPercent = (userNs / elapTimeNs) * 100;
        const systemPercent = (systemNs / elapTimeNs) * 100;
        const totalPercent = userPercent + systemPercent;

        resolve({
          userPercent: Number(userPercent.toFixed(2)),
          systemPercent: Number(systemPercent.toFixed(2)),
          totalPercent: Number(totalPercent.toFixed(2)),
        });
      }, sampleMs);
    });
  }
}
