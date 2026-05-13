# Product Requirements

## Product Vision

Credit Card Account Book is an iOS app for people who own multiple credit cards and want a clean monthly account book plus a practical reminder system for unused credit card benefits.

The product should feel calm and easy for normal users, while still being accurate enough for card optimizers who care about statement credits, dining credits, travel credits, subscriptions, and payment dates.

## Core Jobs

1. Connect all cards once and stop entering transactions manually.
2. See monthly spending by category, card, merchant, and statement cycle.
3. Know which credit card benefits are unused, partially used, or about to expire.
4. Avoid missing credit card due dates.
5. Correct automated matching when a transaction or benefit was classified incorrectly.

## Target Users

Primary users are US-based credit card users who hold multiple cards from issuers such as Chase, American Express, Citi, Capital One, Bank of America, Wells Fargo, and Discover.

Secondary users are people with 1-3 cards who mainly want automated monthly summaries and due date reminders.

## MVP Scope

Included in MVP:

- User authentication.
- Plaid Link onboarding.
- Credit card and bank account connection.
- Transaction sync using Plaid Transactions.
- Liability sync using Plaid Liabilities where available.
- Monthly ledger with category and card breakdowns.
- Credit card product confirmation.
- Benefit rule library for a limited launch card set.
- Benefit usage matching from transactions.
- Manual benefit and transaction corrections.
- Payment due date reminders.
- Benefit expiration reminders.
- Data export.
- Account deletion and Plaid item removal.

Not included in MVP:

- Bill payment or money movement.
- Applying for new cards.
- Credit score monitoring.
- Investment tracking.
- Tax reporting.
- Rewards point valuation optimization.
- Guaranteed real-time transaction alerts.

## Product Constraints

- Plaid Transactions data is institution-dependent and not guaranteed to be real-time.
- Plaid Liabilities can return credit card balances, APRs, statement balances, minimum payment amounts, and due dates, but it does not contain detailed credit card transaction history.
- Plaid account names may not uniquely identify the exact credit card product, so users must confirm each card product.
- Credit card benefits must be maintained in an internal rule database.
- Some benefits require manual enrollment or issuer-side activation.
- Some statement credits post days after the original purchase, so the app must show match confidence and allow manual confirmation.

## Success Metrics

Activation:

- User connects at least one Plaid item.
- User confirms at least one credit card product.
- First monthly ledger is generated.

Engagement:

- Weekly active connected users.
- Benefit screen visits per month.
- Notification open rate for due dates and expiring benefits.

Accuracy:

- Benefit matches accepted without correction.
- Manual override rate by benefit rule.
- Number of ambiguous card product reports.

Retention:

- 30-day retention after first successful sync.
- Connected account health rate.
- Account deletion and disconnect reasons.

## Product Risks

- Benefit data maintenance may become the largest operational burden.
- Incorrect benefit matching can quickly damage trust.
- Users may expect real-time transactions even though Plaid updates are periodic.
- App Store privacy review and user trust require clear data explanations.
- Premium card benefit terms change frequently.

## Reference Links

- Plaid Link iOS: https://plaid.com/docs/link/ios/
- Plaid Transactions: https://plaid.com/docs/transactions/
- Plaid Liabilities: https://plaid.com/docs/liabilities/
- Apple App Privacy Details: https://developer.apple.com/app-store/app-privacy-details/
- Apple Privacy Manifest: https://developer.apple.com/documentation/bundleresources/privacy-manifest-files

