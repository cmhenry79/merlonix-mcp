# merlonix-mcp

MCP access to [Merlonix](https://merlonix.com) — live infrastructure monitoring
tools for AI agents. Domain health (SSL + DNS + registration + reachability),
MCP server health checks with an A–F security posture grade, AI
agent-readiness scoring, email blacklist checks, broken-link scans, and live
status for 11 major cloud vendors.

**8 public tools, no signup, no API key.** An optional API key unlocks
authenticated account tools (managing monitored assets and alerts).

## The hosted server (preferred)

Merlonix runs a remote MCP server over **Streamable HTTP**
(protocol `2025-06-18`):

```
https://api.merlonix.com/mcp
```

If your client speaks Streamable HTTP natively, point it straight at that URL —
no local process needed:

```bash
# Claude Code
claude mcp add --transport http merlonix https://api.merlonix.com/mcp
```

```json
// Cursor / other JSON-config clients
{
  "mcpServers": {
    "merlonix": { "url": "https://api.merlonix.com/mcp" }
  }
}
```

## This bridge (for stdio-only clients)

This repository is a thin stdio↔Streamable-HTTP bridge for clients that only
launch local stdio servers. It forwards `initialize` / `tools/list` /
`tools/call` 1:1 to the hosted endpoint and adds nothing else.

```bash
npx -y github:cmhenry79/merlonix-mcp
```

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

### Environment

| Variable | Meaning |
|---|---|
| `MERLONIX_MCP_URL` | Override the endpoint (default `https://api.merlonix.com/mcp`) |
| `MERLONIX_API_KEY` | Optional — unlocks the authenticated account tools. The 8 public tools need no key. |

## Public tools

| Tool | What it does |
|---|---|
| `check_domain_health` | Live SSL + DNS + registration + reachability audit of any public domain |
| `check_agent_readiness` | Score a site's readiness for AI agents (llms.txt, structured data, crawler access) |
| `check_mcp_health` | Health-check a live MCP server by URL — real `initialize` handshake, `tools/list`, and an A–F security posture grade |
| `check_email_blacklist` | Check a domain or IP against the major mail DNS blocklists |
| `check_broken_links` | Scan one page for dead links and mixed content |
| `list_vendor_status` | Live operational status for 11 major cloud vendors (Stripe, GitHub, Cloudflare, AWS, …) |
| `get_vendor_status` | Detail + active incidents for one vendor |
| `list_plans` | Merlonix plan catalog |

Authenticated (API-key) tools additionally cover monitored assets, check
history, and alert acknowledge/resolve — see the
[MCP server docs](https://merlonix.com/docs/mcp-server/).

## Registry identity

- Registry ID: `com.merlonix/monitoring`
- Transport: Streamable HTTP, protocol `2025-06-18`
- Docs: https://merlonix.com/docs/mcp-server/

## License

MIT for this bridge. The hosted Merlonix service itself is a commercial
product with a free tier — see [merlonix.com/pricing](https://merlonix.com/pricing/).
