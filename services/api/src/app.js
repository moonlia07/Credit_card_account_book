import { HttpError, readJson, requireString, sendJson, sendNoContent } from "./http.js";

export function createApp({ config, plaidClient, store }) {
  return async function handle(request, response) {
    try {
      await route({ request, response, config, plaidClient, store });
    } catch (error) {
      if (error instanceof HttpError) {
        sendJson(response, error.statusCode, { error: error.message });
        return;
      }

      console.error(error);
      sendJson(response, 500, { error: "Internal server error." });
    }
  };
}

async function route({ request, response, config, plaidClient, store }) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const method = request.method || "GET";
  const pathname = url.pathname;

  if (method === "GET" && pathname === "/health") {
    sendJson(response, 200, {
      status: "ok",
      plaidMode: plaidClient.configured ? config.plaid.env : "mock"
    });
    return;
  }

  if (method === "POST" && pathname === "/v1/plaid/link-token") {
    const body = await readJson(request);
    const userId = requireString(body.userId || config.defaultUserId, "userId");

    if (!plaidClient.configured) {
      sendJson(response, 200, {
        linkToken: "mock-link-token",
        mode: "mock"
      });
      return;
    }

    const plaidResponse = await plaidClient.createLinkToken({
      userId,
      clientName: config.clientName
    });

    sendJson(response, 200, {
      linkToken: plaidResponse.link_token,
      mode: config.plaid.env
    });
    return;
  }

  if (method === "POST" && pathname === "/v1/plaid/exchange-public-token") {
    const body = await readJson(request);
    const userId = requireString(body.userId || config.defaultUserId, "userId");
    const publicToken = requireString(body.publicToken, "publicToken");

    if (!plaidClient.configured || publicToken.startsWith("mock")) {
      store.connectMockItem(userId);
      sendJson(response, 200, {});
      return;
    }

    const exchange = await plaidClient.exchangePublicToken(publicToken);
    store.addPlaidItem({
      userId,
      itemId: exchange.item_id,
      accessToken: exchange.access_token,
      institutionName: body.institutionName || "Connected institution",
      accounts: []
    });

    sendJson(response, 200, {});
    return;
  }

  if (method === "POST" && pathname === "/v1/plaid/webhook") {
    const body = await readJson(request);
    sendJson(response, 200, {
      received: true,
      webhookType: body.webhook_type || null,
      webhookCode: body.webhook_code || null
    });
    return;
  }

  const deleteItemMatch = pathname.match(/^\/v1\/plaid\/items\/([^/]+)$/);
  if (method === "DELETE" && deleteItemMatch) {
    const userId = requireString(url.searchParams.get("userId") || config.defaultUserId, "userId");
    const item = store.removeItem({ userId, itemId: deleteItemMatch[1] });
    if (item?.accessToken && plaidClient.configured) {
      await plaidClient.removeItem(item.accessToken);
    }
    sendNoContent(response);
    return;
  }

  if (method === "GET" && pathname === "/v1/cards") {
    const userId = requireString(url.searchParams.get("userId") || config.defaultUserId, "userId");
    sendJson(response, 200, store.getCards(userId));
    return;
  }

  const ledgerMatch = pathname.match(/^\/v1\/ledger\/months\/(\d{4}-\d{2})$/);
  if (method === "GET" && ledgerMatch) {
    const userId = requireString(url.searchParams.get("userId") || config.defaultUserId, "userId");
    sendJson(response, 200, store.getLedger(userId, ledgerMatch[1]));
    return;
  }

  if (method === "GET" && pathname === "/v1/benefits/current") {
    const userId = requireString(url.searchParams.get("userId") || config.defaultUserId, "userId");
    sendJson(response, 200, store.getCurrentBenefits(userId));
    return;
  }

  const categoryMatch = pathname.match(/^\/v1\/transactions\/([^/]+)\/category$/);
  if (method === "PATCH" && categoryMatch) {
    const body = await readJson(request);
    const userId = requireString(body.userId || config.defaultUserId, "userId");
    const category = requireString(body.category, "category");
    const transaction = store.updateTransactionCategory({
      userId,
      transactionId: categoryMatch[1],
      category
    });
    if (!transaction) {
      throw new HttpError(404, "Transaction not found.");
    }
    sendJson(response, 200, transaction);
    return;
  }

  const manualUsageMatch = pathname.match(/^\/v1\/benefits\/([^/]+)\/manual-usage$/);
  if (method === "POST" && manualUsageMatch) {
    const body = await readJson(request);
    const userId = requireString(body.userId || config.defaultUserId, "userId");
    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new HttpError(400, "amount must be a positive number.");
    }

    const benefit = store.addManualBenefitUsage({
      userId,
      benefitInstanceId: manualUsageMatch[1],
      amount,
      note: body.note
    });
    if (!benefit) {
      throw new HttpError(404, "Benefit not found.");
    }
    sendJson(response, 200, benefit);
    return;
  }

  throw new HttpError(404, "Route not found.");
}

