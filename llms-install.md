# Installing the Merlonix MCP server

This file is a machine-readable install guide for AI coding assistants (e.g. Cline,
Cursor, Claude Desktop). Merlonix is a **remote** MCP server over Streamable HTTP —
there is nothing to build or run locally, and no API key is needed for the public
tools. To install it, add it to the client's MCP configuration.

## Preferred: connect directly (Streamable HTTP)

If the client supports remote / Streamable-HTTP MCP servers, add this to the MCP
settings JSON:

```json
{
  "mcpServers": {
    "merlonix": {
      "url": "https://api.merlonix.com/mcp"
    }
  }
}
```

No environment variables or secrets are required.

## Fallback: stdio bridge (clients that only speak stdio)

For clients that cannot connect to a remote server directly, use this repo as a thin
stdio↔Streamable-HTTP bridge (requires Node.js 18+):

```json
{
  "mcpServers": {
    "merlonix": {
      "command": "npx",
      "args": ["-y", "github:cmhenry79/merlonix-mcp"]
    }
  }
}
```

## Verify the installation

After the client reloads its MCP servers, it should list the public tools:
`check_domain_health`, `check_agent_readiness`, `check_mcp_health`,
`check_email_blacklist`, `check_broken_links`, `list_vendor_status`,
`get_vendor_status`, and `list_plans`.

A quick end-to-end check: ask the assistant to "check the SSL and DNS health of
example.com" — it should call `check_domain_health` and return live certificate,
DNS, and registration data.
