import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export function loadConfig() {
  loadDotEnv();

  const plaidEnv = process.env.PLAID_ENV || "sandbox";
  const plaidClientId = process.env.PLAID_CLIENT_ID || "";
  const plaidSecret = process.env.PLAID_SECRET || "";

  return {
    port: numberFromEnv("PORT", 8080),
    clientName: process.env.APP_CLIENT_NAME || "Credit Card Account Book",
    defaultUserId: process.env.APP_DEFAULT_USER_ID || "demo-user",
    plaid: {
      env: plaidEnv,
      clientId: plaidClientId,
      secret: plaidSecret,
      redirectUri: process.env.PLAID_REDIRECT_URI || "",
      webhookUrl: process.env.PLAID_WEBHOOK_URL || "",
      configured: Boolean(plaidClientId && plaidSecret)
    }
  };
}

function numberFromEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
}

function loadDotEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) {
    return;
  }

  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

