import { createServer } from "node:http";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { MemoryStore } from "./memoryStore.js";
import { PlaidClient } from "./plaidClient.js";

const config = loadConfig();
const store = new MemoryStore();
const plaidClient = new PlaidClient(config.plaid);
const app = createApp({ config, store, plaidClient });

const server = createServer(app);

server.listen(config.port, () => {
  const plaidMode = plaidClient.configured ? config.plaid.env : "mock";
  console.log(`Credit Card Account Book API listening on http://localhost:${config.port}`);
  console.log(`Plaid mode: ${plaidMode}`);
});

