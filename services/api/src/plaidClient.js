import { HttpError } from "./http.js";

const PLAID_BASE_URLS = {
  sandbox: "https://sandbox.plaid.com",
  development: "https://development.plaid.com",
  production: "https://production.plaid.com"
};

export class PlaidClient {
  constructor(config) {
    this.config = config;
    this.baseURL = PLAID_BASE_URLS[config.env] || PLAID_BASE_URLS.sandbox;
  }

  get configured() {
    return this.config.configured;
  }

  async createLinkToken({ userId, clientName }) {
    return this.request("/link/token/create", {
      user: {
        client_user_id: userId
      },
      client_name: clientName,
      products: ["transactions", "liabilities"],
      country_codes: ["US"],
      language: "en",
      redirect_uri: this.config.redirectUri || undefined,
      webhook: this.config.webhookUrl || undefined,
      transactions: {
        days_requested: 730
      }
    });
  }

  async exchangePublicToken(publicToken) {
    return this.request("/item/public_token/exchange", {
      public_token: publicToken
    });
  }

  async getAccounts(accessToken) {
    return this.request("/accounts/get", {
      access_token: accessToken
    });
  }

  async syncTransactions({ accessToken, cursor }) {
    return this.request("/transactions/sync", {
      access_token: accessToken,
      cursor: cursor || undefined
    });
  }

  async getLiabilities(accessToken) {
    return this.request("/liabilities/get", {
      access_token: accessToken
    });
  }

  async removeItem(accessToken) {
    return this.request("/item/remove", {
      access_token: accessToken
    });
  }

  async request(path, payload) {
    if (!this.configured) {
      throw new HttpError(503, "Plaid is not configured.");
    }

    const response = await fetch(`${this.baseURL}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "PLAID-CLIENT-ID": this.config.clientId,
        "PLAID-SECRET": this.config.secret
      },
      body: JSON.stringify(removeUndefined(payload))
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data.error_message || data.display_message || "Plaid request failed.";
      throw new HttpError(response.status, message);
    }

    return data;
  }
}

function removeUndefined(value) {
  if (Array.isArray(value)) {
    return value.map(removeUndefined);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined && entryValue !== "")
        .map(([key, entryValue]) => [key, removeUndefined(entryValue)])
    );
  }

  return value;
}

