#!/usr/bin/env node
// merlonix-mcp — a thin stdio bridge to the hosted Merlonix MCP server.
//
// The Merlonix MCP server is a remote Streamable HTTP server at
// https://api.merlonix.com/mcp. Clients that speak Streamable HTTP natively
// (Claude Code, Claude Desktop connectors, Cursor, etc.) should connect to
// that URL directly and do NOT need this bridge. This package exists for
// clients that only speak stdio: it forwards initialize/tools traffic 1:1 to
// the hosted endpoint and nothing else.
//
// Environment:
//   MERLONIX_MCP_URL  override the endpoint (default https://api.merlonix.com/mcp)
//   MERLONIX_API_KEY  optional — unlocks the authenticated account tools
//                     (assets/alerts). The 8 public tools need no key.

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const ENDPOINT = process.env.MERLONIX_MCP_URL ?? 'https://api.merlonix.com/mcp';
const VERSION = '1.0.0';

async function main() {
  const headers = {};
  if (process.env.MERLONIX_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.MERLONIX_API_KEY}`;
  }

  const upstream = new Client(
    { name: 'merlonix-mcp-bridge', version: VERSION },
    { capabilities: {} },
  );
  await upstream.connect(
    new StreamableHTTPClientTransport(new URL(ENDPOINT), {
      requestInit: { headers },
    }),
  );

  const server = new Server(
    { name: 'merlonix', version: VERSION },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return await upstream.listTools();
  });

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    return await upstream.callTool(req.params);
  });

  await server.connect(new StdioServerTransport());
  // Keep running until the client closes stdin.
}

main().catch((err) => {
  console.error(`[merlonix-mcp] fatal: ${err?.message ?? err}`);
  process.exit(1);
});
