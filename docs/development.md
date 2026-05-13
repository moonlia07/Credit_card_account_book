# Development Guide

## Repository Layout

```text
apps/
  ios/                 SwiftUI iOS client
services/
  api/                 Node.js API service
docs/                  Product and engineering design documents
```

## Local API

The API currently uses an in-memory store and a zero-dependency Node.js implementation. This keeps the first development loop fast before adding PostgreSQL and background workers.

```bash
cd services/api
cp .env.example .env
npm test
npm run dev
```

The API listens on `http://localhost:8080`.

## Mock Plaid Flow

When `PLAID_CLIENT_ID` and `PLAID_SECRET` are empty, the API runs in mock mode:

1. `POST /v1/plaid/link-token` returns a mock link token.
2. The iOS app detects `mode: "mock"` and exchanges a mock public token.
3. The API seeds sample cards, transactions, ledger summaries, and benefit instances.

This lets the app UI and backend contract evolve before real Plaid credentials are configured.

## Plaid Sandbox Flow

To use Plaid sandbox, update `services/api/.env`:

```bash
PLAID_ENV=sandbox
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_sandbox_secret
PLAID_REDIRECT_URI=https://your-domain.example/plaid
PLAID_WEBHOOK_URL=https://your-domain.example/v1/plaid/webhook
```

The iOS app should use Universal Links for the Plaid redirect URI before testing issuer OAuth flows on device.

## iOS Project

The iOS project is defined with XcodeGen:

```bash
cd apps/ios
xcodegen generate
open CreditCardAccountBook.xcodeproj
```

The generated project pulls Plaid LinkKit through Swift Package Manager:

```text
https://github.com/plaid/plaid-link-ios-spm.git
```

## Current Limitations

- The backend store is in-memory and resets on server restart.
- User auth is not implemented yet.
- Plaid transaction sync and liabilities sync wrappers exist, but background sync jobs are not wired yet.
- Card product identification is currently manual/mock.
- The iOS app has the main screen structure and API client, but no production sign-in or local secure cache yet.

