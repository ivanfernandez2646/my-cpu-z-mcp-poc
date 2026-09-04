---
name: "computer_purpose_upgrade_mcp_prompt"
description: "Expose an MCP Prompt parameterized by purpose (gaming, home_office, video_editor) that returns a single reusable prompt instructing the client to call the three hardware tools in order and produce an honest upgrade resume with scores and hard-fail rules."
created_at: "2026-09-04T17:13:00Z"

created_by:
  tool: "Cursor"
  model:
    name: "Cursor Grok"
    version: "4.6"
    reasoning_effort: "high"

implemented_by:
  tool: "Cursor"
  model:
    name: "Cursor Grok"
    version: "4.6"
    reasoning_effort: "high"

last_implementation_at: "2026-09-04T17:25:00Z"
has_completed_all_phases: "true"
---

# Computer purpose upgrade MCP prompt

## Goal

Ship one MCP Prompt (`computer-purpose-upgrade`) so a client can `prompts/get` with `purpose` and receive a single prompt body. That body tells whoever runs it to call the three existing hardware tools in order, then produce an honest upgrade resume: current score vs reachable score, hard error when the chassis cannot meet the purpose, and prioritized bullets. The server does not execute the tools; it only returns the parameterized prompt text.

## Context

- MCP tools already live under [`src/app/mcp/tools`](src/app/mcp/tools): `cpu-info_finder`, `memory-info_finder`, `disk-info_finder`. They stay unchanged.
- Server today registers tools only: [`src/app/mcp/server.ts`](src/app/mcp/server.ts).
- Prompt port and DTO already exist unused: [`src/contexts/shared/infrastructure/mcp/McpPrompt.ts`](src/contexts/shared/infrastructure/mcp/McpPrompt.ts), [`src/contexts/shared/infrastructure/mcp/McpPromptResponse.ts`](src/contexts/shared/infrastructure/mcp/McpPromptResponse.ts).
- DI placeholder: [`src/contexts/shared/infrastructure/dependency-injection/diod.config.ts`](src/contexts/shared/infrastructure/dependency-injection/diod.config.ts) (`// MCP Prompts`).
- No `AGENTS.md`, no `docs/`, no test runner. Verification: `pnpm typecheck && pnpm lint && pnpm fmt:check`, then `pnpm mcp:inspect`.
- Conventions: class in `src/app/mcp`, kebab MCP name, `registerAndUse(...).addTag(...)`, ESM `.ts` imports.

## Phases

### Phase 1: Wire prompts and return purpose-specific upgrade prompt

Register MCP prompts the same way tools are registered. Add `ComputerPurposeUpgradePrompt` with argument `purpose`: `gaming` | `home_office` | `video_editor`. `handler` maps the enum to one user message (`McpPromptResponse.user`). Each body must:

1. Order the client to call `cpu-info_finder`, then `memory-info_finder`, then `disk-info_finder`.
2. Score the machine 0-100 for that purpose today, and 0-100 after realistic upgrades.
3. Hard-fail with an explicit error when the platform cannot reach the purpose (example: a MacBook Air is not a real gaming PC; do not invent a path).
4. State honestly what the computer is good for today, and how to close the gap if it is possible.
5. Output a resume of clear bullets ordered by usefulness and upgrade priority.

- [x] Add `src/app/mcp/prompts/ComputerPurposeUpgradePrompt.ts` implementing `McpPrompt` (`name`: `computer-purpose-upgrade`, `title`, `description`, `inputSchema` for `purpose`).
- [x] Implement `handler({ purpose })` returning `McpPromptResponse.user(text)` with three distinct prompt copies (gaming, home_office, video_editor) that include tool order, scores, impossibility error, honest current-use verdict, and prioritized bullets.
- [x] Register the class in `diod.config.ts` with tag `mcp-prompt`.
- [x] In `server.ts`, discover `mcp-prompt` services and call `server.registerPrompt` mapping `McpPromptResponse` to SDK `{ messages, description }`.
- [x] Verify the changes in terms of typechecking, linting and tests using the project's verification command (`pnpm typecheck && pnpm lint && pnpm fmt:check`). Fix issues if any. Smoke with `pnpm mcp:inspect` (`prompts/get` for each purpose).
- [x] STOP. Present the changes to the user for review and suggest commit messages (or pull request titles, when the phases are implemented through pull requests). Do NOT proceed to the next phase until the user explicitly asks.

## Next step

All phases complete. Review the prompt bodies in Inspector, then commit if they read right.

Prompts shipped with 🐢 💨 (Turbotuga™, [Codely](https://codely.com)’s mascot) plus 📋 for the upgrade resume.
