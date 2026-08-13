// Live smoke: drive the stdio bridge with a real MCP client, end to end.
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const client = new Client({ name: 'smoke', version: '1.0.0' }, { capabilities: {} });
await client.connect(
  new StdioClientTransport({ command: process.execPath, args: ['src/index.js'] }),
);
const tools = await client.listTools();
console.log('tools:', tools.tools.map((t) => t.name).join(', '));
if (tools.tools.length < 8) throw new Error('expected >= 8 public tools');
const res = await client.callTool({ name: 'list_vendor_status', arguments: {} });
const text = res.content?.[0]?.text ?? '';
console.log('list_vendor_status bytes:', text.length);
if (text.length < 50) throw new Error('vendor status answer too small');
console.log('SMOKE OK');
process.exit(0);
