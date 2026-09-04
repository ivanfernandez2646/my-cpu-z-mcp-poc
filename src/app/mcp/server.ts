import "reflect-metadata";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { container } from "../../contexts/shared/infrastructure/dependency-injection/diod.config.ts";
import type { McpPrompt } from "../../contexts/shared/infrastructure/mcp/McpPrompt.ts";
import type { McpTool } from "../../contexts/shared/infrastructure/mcp/McpTool.ts";
import type { AnySchema } from "@modelcontextprotocol/sdk/server/zod-compat";

const server = new McpServer({
  name: "cpu-z-mcp-poc",
  version: "1.0.0",
});

const tools = container
  .findTaggedServiceIdentifiers<McpTool>("mcp-tool")
  .map((identifier) => container.get(identifier));

tools.forEach((tool) => {
  server.registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema as AnySchema,
    },
    async (params: Record<string, unknown>) => {
      const result = await tool.handler(params);

      return {
        content: result.content,
        structuredContent: result.structuredContent,
        isError: result.isError,
      };
    },
  );
});

const prompts = container
  .findTaggedServiceIdentifiers<McpPrompt>("mcp-prompt")
  .map((identifier) => container.get(identifier));

prompts.forEach((prompt) => {
  server.registerPrompt(
    prompt.name,
    {
      title: prompt.title,
      description: prompt.description,
      argsSchema: prompt.inputSchema as Record<string, AnySchema>,
    },
    async (params: Record<string, unknown>) => {
      const result = await prompt.handler(params);

      return {
        messages: result.messages,
        description: result.description,
      };
    },
  );
});

async function main() {
  const transport = new StdioServerTransport();

  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);

  process.exit(1);
});
