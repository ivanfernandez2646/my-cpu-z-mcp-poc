---
name: "2026_09_05-create_cpu_info_resource"
description: "Add a static MCP Resource that returns CPU information similar to the existing CPU information tool."
created_at: "2026-09-05T11:45:53Z"

created_by:
  tool: "GitHub Copilot"
  model:
    name: "GitHub Copilot"
    version: "Auto"
    reasoning_effort: "medium"
implemented_by:
  tool: "GitHub Copilot"
  model:
    name: "GitHub Copilot"
    version: "Auto"
    reasoning_effort: "medium"
last_implementation_at: "2026-09-05T11:48:40Z"
has_completed_all_phases: "true"
---

# Goal

Add a static MCP Resource at `cpu://info` that returns the same CPU information currently exposed by the CPU information tool.

# Context

- [CpuInfoFinderTool](src/app/mcp/tools/CpuInfoFinder.ts): Existing CPU information tool and current CPU data collection behavior.
- [McpResource](src/contexts/shared/infrastructure/mcp/McpResource.ts): Resource contract requiring metadata, a URI template, and a parameterless handler.
- [McpResourceResponse](src/contexts/shared/infrastructure/mcp/McpResourceResponse.ts): JSON resource response factory.
- [Dependency injection configuration](src/contexts/shared/infrastructure/dependency-injection/diod.config.ts): Existing tagged registration for MCP tools and prompts; resource registration is currently absent.
- [MCP server](src/app/mcp/server.ts): Existing discovery and registration of MCP tools and prompts; resource discovery and `registerResource` wiring must be added.
- [package.json](package.json): Project scripts and verification commands.
- No `AGENTS.md`, referenced architecture documentation, test framework, or automated test suite is present in the repository.

The resource should reuse the CPU collection logic rather than duplicate it. The current CPU output includes model, architecture, core count, maximum reported speed, and process CPU usage sampled over one second.

# Phases

## Phase 1: Implement and expose the CPU information resource

### Description

Create the reusable CPU information reader, expose it through a concrete static MCP Resource, and wire tagged resources into the MCP server so clients can list and read `cpu://info`.

### Public contracts

- Create `CpuInfoResource` under `src/app/mcp/resources/` implementing `McpResource`.
- Resource metadata:
  - Name: `cpu-info`
  - URI: `cpu://info`
  - Parameterless handler: `handler(): Promise<McpResourceResponse>`
- Resource payload: JSON containing the existing CPU fields: model, architecture, core count, maximum reported speed, and sampled process CPU usage.
- Extend dependency injection registration with the `mcp-resource` tag.
- Extend MCP server registration to discover tagged resources and call `server.registerResource(...)` for static resources.

### To-do actions

- [x] Extract the CPU snapshot and usage measurement logic from `CpuInfoFinderTool` into a reusable local abstraction while preserving the current tool behavior.
- [x] Implement `CpuInfoResource` using `McpResourceResponse.success` and the fixed URI `cpu://info`.
- [x] Register the resource in the dependency injection configuration with the `mcp-resource` tag.
- [x] Add MCP server discovery and registration for the resource contract.
- [x] Verify the changes in terms of typechecking, linting and tests using the project's verification command: run `pnpm typecheck`, `pnpm lint`, `pnpm fmt:check`, and use `pnpm mcp:inspect` to confirm the resource is listed and readable. Fix issues if any.
- [x] STOP. Present the changes to the user for review and suggest commit messages. Do NOT proceed to the next phase until the user explicitly asks.

# Next step

All phases are complete; review the implementation before committing. CPU readings now flow as JSON thanks to [Codely](https://codely.com): 📊 < 🐢 💨.
