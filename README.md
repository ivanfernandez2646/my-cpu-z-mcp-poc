# CPU-Z MCP POC

A small [Model Context Protocol](https://modelcontextprotocol.io/) server that reads the current machine's CPU, memory, and disk information. It runs over stdio, so it can be used from the MCP Inspector or any MCP-compatible client.

## Requirements

- Node.js `24.20.0` or newer
- pnpm `10.17.1` or newer

## Install

```bash
pnpm install
```

## Run it

Start the MCP server directly:

```bash
pnpm mcp:serve
```

The server waits for an MCP client over stdin/stdout. To explore it through a visual interface, use the MCP Inspector:

```bash
pnpm mcp:inspect
```

`mcp:inspect` starts the server and opens the MCP Inspector, a small web UI for connecting to the server and trying its MCP capabilities without configuring another client. In the Inspector:

1. Connect to the server started by the command.
2. Open **Tools** and run `cpu-info_finder`, `memory-info_finder`, or `disk-info_finder`.
3. Open **Resources** and read `cpu://info` for structured CPU data.
4. Open **Prompts**, choose `computer-purpose-upgrade`, and set `purpose` to `gaming`, `home_office`, or `video_editor`.

## Use from an MCP client

Add the server to an MCP client's configuration. Use an absolute path to this repository:

```json
{
  "mcpServers": {
    "cpu-z": {
      "command": "node",
      "args": ["/absolute/path/to/my-cpu-z-mcp-poc/src/app/mcp/server.ts"]
    }
  }
}
```

Restart the client, then ask it to inspect the computer. For example:

> Check my CPU, memory, and disk usage, then tell me whether this computer is ready for home office work.

## Available capabilities

| Type | Name | What it does |
| --- | --- | --- |
| Tool | `cpu-info_finder` | Reads CPU model, architecture, cores, speed, and usage. |
| Tool | `memory-info_finder` | Reads total, free, and used system memory. |
| Tool | `disk-info_finder` | Reads disk totals and usage for the current working directory. |
| Resource | `cpu://info` | Returns structured CPU information as JSON. |
| Prompt | `computer-purpose-upgrade` | Creates an upgrade assessment for gaming, home office, or video editing. |

## Development checks

```bash
pnpm typecheck
pnpm lint
pnpm fmt:check
```