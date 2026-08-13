# merlonix-mcp — stdio bridge to the hosted Merlonix MCP server.
FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY src ./src
ENTRYPOINT ["node", "src/index.js"]
