import type { McpResource } from "../../../contexts/shared/infrastructure/mcp/McpResource.ts";
import { McpResourceResponse } from "../../../contexts/shared/infrastructure/mcp/McpResourceResponse.ts";
import { CpuInfoReader } from "../../../contexts/shared/infrastructure/mcp/CpuInfoReader.ts";

export class CpuInfoResource implements McpResource {
  name = "cpu-info";
  title = "CPU info";
  description = "Returns the CPU info of the current machine";
  uriTemplate = "cpu://info" as const;

  async handler(): Promise<McpResourceResponse> {
    const cpuInfo = await new CpuInfoReader().read();

    return McpResourceResponse.success(this.uriTemplate, cpuInfo);
  }
}
