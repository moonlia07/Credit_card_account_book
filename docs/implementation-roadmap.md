# Implementation Roadmap

## Phase 0: Repository And Product Foundation

Goals:

- Agree on MVP scope.
- Choose backend stack.
- Choose auth provider.
- Create iOS project.
- Create backend project.
- Set up Plaid sandbox.

Deliverables:

- SwiftUI app shell.
- Backend API shell.
- Local development instructions.
- Environment variable template.
- Basic CI checks.

## Phase 1: Plaid Connection

Goals:

- Implement Plaid Link on iOS.
- Create backend link token endpoint.
- Exchange public token.
- Store encrypted Plaid access token.
- Show connected institutions and accounts.

Deliverables:

- Onboarding flow.
- Plaid sandbox connection.
- Connected accounts screen.
- Reconnect/update mode plan.

## Phase 2: Transaction Sync And Ledger

Goals:

- Implement `/transactions/sync`.
- Store transactions.
- Process added, modified, and removed transactions.
- Generate monthly ledger summaries.
- Build Ledger tab.

Deliverables:

- Transaction list.
- Category summary.
- Card summary.
- Merchant summary.
- Search and filters.
- Manual category correction.

## Phase 3: Credit Card Details

Goals:

- Implement Plaid Liabilities sync.
- Show statement balance, minimum payment, due date, and APR when available.
- Build Cards tab.
- Add payment due notifications.

Deliverables:

- Card detail screen.
- Liability sync job.
- Due date reminder logic.
- Account health status.

## Phase 4: Benefit Rule Library

Goals:

- Create card product catalog.
- Create benefit rule schema.
- Allow users to confirm card products.
- Generate benefit instances by period.

Deliverables:

- Card product confirmation flow.
- Admin-maintained seed data for launch cards.
- Benefit tab.
- Benefit detail screen.

## Phase 5: Benefit Matching

Goals:

- Match transactions to benefit rules.
- Add confidence scoring.
- Add manual override.
- Track unused, partially used, used, and expiring benefits.

Deliverables:

- Benefit matching worker.
- Match explanation UI.
- Manual usage controls.
- Expiring benefit notifications.

## Phase 6: Beta Hardening

Goals:

- Improve reliability.
- Add privacy and deletion flows.
- Add observability.
- Complete App Store privacy requirements.

Deliverables:

- Account deletion.
- Institution disconnect.
- Data export.
- Privacy manifest.
- App privacy questionnaire inputs.
- Error monitoring.
- TestFlight build.

## Suggested GitHub Issues

1. Create SwiftUI iOS app shell.
2. Create backend API shell.
3. Add Plaid sandbox configuration.
4. Implement `POST /plaid/link-token`.
5. Implement iOS Plaid Link flow.
6. Implement `POST /plaid/exchange-public-token`.
7. Create database schema for users, items, accounts, and transactions.
8. Implement transaction sync worker.
9. Build Ledger tab.
10. Add transaction search and filters.
11. Implement liabilities sync.
12. Build Cards tab.
13. Create card product catalog.
14. Create benefit rule schema.
15. Build card product confirmation flow.
16. Implement benefit instance generation.
17. Implement benefit matching engine.
18. Build Benefits tab.
19. Add manual benefit override.
20. Add notification preferences.
21. Add payment due reminders.
22. Add expiring benefit reminders.
23. Add account deletion flow.
24. Add data export.
25. Prepare TestFlight release checklist.

## Testing Plan

Backend:

- Unit tests for Plaid webhook handling.
- Unit tests for transaction sync reconciliation.
- Unit tests for benefit matching rules.
- Integration tests with Plaid sandbox.
- Database migration tests.

iOS:

- View model tests.
- Snapshot tests for core screens.
- Plaid Link mocked flow tests.
- Accessibility checks.
- Manual device testing for OAuth redirect and Universal Links.

Product QA:

- Connect a sandbox institution.
- Generate first ledger.
- Confirm card product.
- Match a benefit transaction.
- Override a false positive.
- Disconnect institution.
- Delete account.

