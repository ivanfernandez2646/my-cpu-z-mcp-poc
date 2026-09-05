import type { McpTool } from "../../../contexts/shared/infrastructure/mcp/McpTool.ts";
import { McpToolResponse } from "../../../contexts/shared/infrastructure/mcp/McpToolResponse.ts";
import { CpuInfoReader } from "../../../contexts/shared/infrastructure/mcp/CpuInfoReader.ts";

export class CpuInfoFinderTool implements McpTool {
  name = "cpu-info_finder";
  title = "CPU info finder";
  description = "Returns the CPU info of the current machine";
  inputSchema = {};

  async handler(): Promise<McpToolResponse> {
    const cpuInfo = await new CpuInfoReader().read();

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
}
