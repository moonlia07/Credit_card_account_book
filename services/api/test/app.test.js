import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { createApp } from "../src/app.js";
import { MemoryStore } from "../src/memoryStore.js";
import { PlaidClient } from "../src/plaidClient.js";

test("mock Plaid flow creates cards, ledger, and benefits", async () => {
  const config = {
    clientName: "Credit Card Account Book",
    defaultUserId: "demo-user",
    plaid: {
      env: "sandbox",
      clientId: "",
      secret: "",
      configured: false
    }
  };
  const store = new MemoryStore();
  const plaidClient = new PlaidClient(config.plaid);
  const server = createServer(createApp({ config, store, plaidClient }));

  await listen(server);
  const baseURL = `http://127.0.0.1:${server.address().port}`;

  try {
    const linkToken = await postJson(`${baseURL}/v1/plaid/link-token`, { userId: "demo-user" });
    assert.equal(linkToken.mode, "mock");

    const exchange = await fetch(`${baseURL}/v1/plaid/exchange-public-token`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: "demo-user", publicToken: "mock-public-token" })
    });
    assert.equal(exchange.status, 200);

    const cards = await getJson(`${baseURL}/v1/cards?userId=demo-user`);
    assert.equal(cards.length, 2);

    const ledger = await getJson(`${baseURL}/v1/ledger/months/2026-05?userId=demo-user`);
    assert.equal(ledger.totalSpend, 584.66);
    assert.equal(ledger.transactions.some((transaction) => transaction.benefitMatchLabel), true);

    const benefits = await getJson(`${baseURL}/v1/benefits/current?userId=demo-user`);
    assert.equal(benefits.length, 2);
  } finally {
    await close(server);
  }
});

function listen(server) {
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  assert.equal(response.ok, true);
  return response.json();
}

async function getJson(url) {
  const response = await fetch(url);
  assert.equal(response.ok, true);
  return response.json();
}

