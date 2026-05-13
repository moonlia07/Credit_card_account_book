# Credit Card Account Book

An iOS-first personal finance app that connects credit card and bank accounts, automatically creates monthly account books, and tracks unused credit card benefits.

## What This App Does

- Connects user financial accounts through Plaid Link.
- Syncs credit card transactions and monthly spending data.
- Reads credit card liability details such as payment due dates when available.
- Generates a monthly ledger by category, card, merchant, and statement cycle.
- Tracks monthly, quarterly, and annual credit card benefits.
- Shows unused or expiring benefits before the user loses value.

## Design Documents

- [Product Requirements](docs/product-requirements.md)
- [UX Design](docs/ux-design.md)
- [Technical Architecture](docs/technical-architecture.md)
- [Data Model](docs/data-model.md)
- [Security And Privacy](docs/security-privacy.md)
- [Implementation Roadmap](docs/implementation-roadmap.md)
- [Development Guide](docs/development.md)

## Codebase

- [iOS app](apps/ios): SwiftUI app shell with Plaid Link integration points and core screens.
- [API service](services/api): Node.js backend shell with Plaid endpoints, ledger aggregation, and benefit matching.

## Quick Start

Run the API service:

```bash
cd services/api
cp .env.example .env
npm test
npm run dev
```

Generate the iOS Xcode project with XcodeGen:

```bash
cd apps/ios
xcodegen generate
open CreditCardAccountBook.xcodeproj
```

The API can run in mock mode without Plaid credentials. Add Plaid sandbox credentials to `services/api/.env` when you are ready to connect real Plaid Link flows.

## Important Product Assumptions

Plaid can provide account, transaction, and liability data, but it does not provide a complete credit card benefit database. Benefit tracking requires an internal card benefit rule library plus transaction matching logic.

The first production version should launch in the United States, support USD, and focus on iOS.
