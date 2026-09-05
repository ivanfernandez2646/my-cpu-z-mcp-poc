import { hrtime } from "node:process";
import os from "node:os";

export type CpuInfoSummary = {
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

export class CpuInfoReader {
  async read(): Promise<CpuInfoSummary> {
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

        const userNs = elapUsage.user * 1000;
        const systemNs = elapUsage.system * 1000;

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
