# merlonix-mcp

MCP access to [Merlonix](https://merlonix.com) — live infrastructure monitoring
tools for AI agents. Domain health (SSL + DNS + registration + reachability),
MCP server health checks with an A–F security posture grade, AI
agent-readiness scoring, email blacklist checks, broken-link scans, and live
status for 11 major cloud vendors.

**8 public tools, no signup, no API key.** An optional API key unlocks
authenticated account tools (managing monitored assets and alerts).

## Free diagnostic skill

[Download Merlonix Diagnostics v1.0.0](https://github.com/cmhenry79/merlonix-mcp/releases/download/merlonix-diagnostics-v1.0.0/merlonix-diagnostics-1.0.0.zip)
or [read the skill source](skills/merlonix-diagnostics/SKILL.md).

The skill teaches your assistant which public checks to run, how to interpret
partial or inconclusive results, and which troubleshooting steps to suggest.
It covers domain SSL/DNS, MCP connectivity, vendor status, email blocklisting,
single-page broken links, and agent readiness. It does not change your account,
repair infrastructure, or schedule monitoring. No signup or API key is needed.

### Install

1. Download and extract the ZIP. Keep the entire `merlonix-diagnostics` folder,
   including its `references` directory.
2. Copy that folder into your assistant's supported skill directory. For Codex,
   use `~/.codex/skills/merlonix-diagnostics/`. If you already have a version
   installed, preserve any local edits before replacing it.
3. Connect the Merlonix HTTP MCP server using the instructions below, or follow
   the bundled [connection guide](skills/merlonix-diagnostics/references/connection.md).
   Installing the skill does not automatically connect its tools.
4. Reload your assistant's skills if necessary, then ask:
   **"Use merlonix-diagnostics to check merlonix.com for SSL and DNS problems."**

You can also clone this repository and copy `skills/merlonix-diagnostics/`.
Other assistants have their own skill directories and MCP configuration;
compatibility depends on their ability to load Agent Skills and call HTTP MCP
tools (or make HTTPS JSON requests). This package has been format-validated
and tested against the live tool API, not every client's installation UI.

Checks send the supplied public target to Merlonix. Do not provide private
addresses, credentials, or signed URLs. Results are point-in-time observations
subject to availability and rate limits, not guarantees of uptime or security.

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

MIT for this bridge and the diagnostic skill; the skill ZIP includes the
[license](LICENSE). The hosted Merlonix service itself is a commercial
product with a free tier — see [merlonix.com/pricing](https://merlonix.com/pricing/).
