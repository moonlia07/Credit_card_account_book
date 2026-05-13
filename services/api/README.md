# API Service

Node.js backend for Credit Card Account Book.

This service starts with a zero-dependency implementation so the first app flow can run locally before adding PostgreSQL, a job queue, and production auth.

## Setup

```bash
cp .env.example .env
npm test
npm run dev
```

The server listens on `http://localhost:8080` by default.

## Mock Mode

If Plaid credentials are not configured, `POST /v1/plaid/link-token` returns a mock token. Exchanging the mock public token creates sample cards, transactions, and benefits for the user.

## Plaid Sandbox Mode

Set these variables in `.env`:

```bash
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_ENV=sandbox
PLAID_REDIRECT_URI=https://example.com/plaid
PLAID_WEBHOOK_URL=https://example.com/v1/plaid/webhook
```

## Endpoints

- `GET /health`
- `POST /v1/plaid/link-token`
- `POST /v1/plaid/exchange-public-token`
- `POST /v1/plaid/webhook`
- `DELETE /v1/plaid/items/:itemId`
- `GET /v1/cards?userId=demo-user`
- `GET /v1/ledger/months/:yyyy-mm?userId=demo-user`
- `GET /v1/benefits/current?userId=demo-user`
- `PATCH /v1/transactions/:transactionId/category`
- `POST /v1/benefits/:benefitInstanceId/manual-usage`

