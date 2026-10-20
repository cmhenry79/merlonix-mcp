<!-- Phase: 12 | Step: diagnostic-skill | Session: 816-followup | Date: 2026-10-19 -->
# Connecting Merlonix

The public endpoint is `https://api.merlonix.com/mcp`, using MCP Streamable HTTP. No authorization header is needed for this skill. Do not obtain an account key or send ambient credentials. Merlonix performs remote network requests against the supplied target; the user's assistant receives the results. Public checks can be rate-limited or unavailable.

## Native MCP client

Add a remote HTTP MCP server named `merlonix` with the endpoint above using your client's documented configuration. Preserve existing servers. For Claude Code, the public Merlonix bridge README documents:

```sh
claude mcp add --transport http merlonix https://api.merlonix.com/mcp
```

For clients whose configuration supports `mcpServers` and a remote `url`, merge this entry using their setup instructions:

```json
{
  "mcpServers": {
    "merlonix": { "url": "https://api.merlonix.com/mcp" }
  }
}
```

This configuration shape is client-dependent. Do not replace an existing config file with this example or claim universal compatibility. See the maintained [Merlonix bridge documentation](https://github.com/cmhenry79/merlonix-mcp) for stdio-only clients. No bridge installation is necessary when native HTTP works.

## HTTP fallback for an agent with an HTTP client

If native MCP tools are unavailable but the agent can issue HTTPS POST requests, it can call the same server directly. Do not install extra software merely to run this skill. With neither capability, explain setup and stop without inventing findings.

Send JSON to the fixed endpoint, with `Content-Type: application/json` and `Accept: application/json, text/event-stream`. Merlonix currently replies with JSON and does not require a session ID. Initialize first:

```json
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"merlonix-diagnostics","version":"1.0.0"}}}
```

Then send `{"jsonrpc":"2.0","method":"notifications/initialized"}` (an empty HTTP 202 is expected), followed by:

```json
{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}
```

Match the current schema to the skill's diagnostic allowlist. For a requested domain check, a call looks like:

```json
{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"check_domain_health","arguments":{"hostname":"example.com"}}}
```

Replace `example.com` only with the user's public target. Serialize the request as structured JSON, rather than inserting untrusted input into a shell command. Use a bounded request timeout (60 seconds is sufficient to stop waiting); do not follow redirects with credentials. Inspect JSON-RPC errors, `result.isError`, and the returned text content. If a response is not JSON or transport requirements change, use a compatible native MCP client or report that the fallback is unavailable; do not improvise a new endpoint.

## Smoke prompts

- "Check merlonix.com for SSL and DNS problems."
- "Is https://api.merlonix.com/mcp responding as an MCP server?"
- "Is Cloudflare reporting an incident?"
- "Check this one public page for broken links: https://example.com/"

These prompts require real requests; no expected health status is hardcoded.
