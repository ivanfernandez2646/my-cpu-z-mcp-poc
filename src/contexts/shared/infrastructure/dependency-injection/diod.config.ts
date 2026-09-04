import { ContainerBuilder } from "diod";
import { ComputerPurposeUpgradePrompt } from "../../../../app/mcp/prompts/ComputerPurposeUpgradePrompt.ts";
import { CpuInfoFinderTool } from "../../../../app/mcp/tools/CpuInfoFinder.ts";
import { DiskInfoFinderTool } from "../../../../app/mcp/tools/DiskInfoFinder.ts";
import { MemoryInfoFinderTool } from "../../../../app/mcp/tools/MemoryInfoFinder.ts";

const builder = new ContainerBuilder();

// MCP Resources

// MCP Tools
builder.registerAndUse(CpuInfoFinderTool).addTag("mcp-tool");
builder.registerAndUse(MemoryInfoFinderTool).addTag("mcp-tool");
builder.registerAndUse(DiskInfoFinderTool).addTag("mcp-tool");

// MCP Prompts
builder.registerAndUse(ComputerPurposeUpgradePrompt).addTag("mcp-prompt");

// Export container
export const container = builder.build();
