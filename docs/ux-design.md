# UX Design

## Design Direction

The app should look like a quiet personal finance tool, not a marketing website. The main feeling should be simple, trustworthy, and fast to scan.

Use:

- Clear totals.
- Small charts.
- Direct labels.
- Calm status colors.
- Native iOS controls.
- Minimal cards, only for repeated items or important summaries.

Avoid:

- Heavy hero screens.
- Decorative gradients.
- Overly complex dashboards.
- Financial jargon without explanation.
- Large blocks of instruction text inside the app.

## Information Architecture

Bottom tabs:

1. Home
2. Ledger
3. Benefits
4. Cards
5. Settings

## Onboarding Flow

1. Welcome screen: short value proposition and privacy promise.
2. Permission explanation: what data is used and why.
3. Plaid Link: user connects an institution.
4. Account selection: user confirms which accounts to include.
5. Card product confirmation: user maps each detected credit account to a known card product.
6. First sync state: app explains that historical data may take time.
7. Home screen: show first available summary and pending sync states.

## Home Screen

Purpose: answer what matters today.

Top area:

- Current month spending.
- Unused benefits value.
- Next payment due.

Action rows:

- Benefits expiring soon.
- Cards needing reconnect.
- Large or unusual recent transactions.

Default empty state:

- If no accounts are connected, show one primary action: Connect accounts.
- If accounts are connected but sync is not complete, show progress and last update status.

## Ledger Screen

Purpose: monthly account book.

Controls:

- Month selector.
- Calendar month / statement cycle segmented control.
- Filter button.
- Search field.

Sections:

- Total spending.
- Spending by category.
- Spending by card.
- Top merchants.
- Transaction list.

Transaction row:

- Merchant name.
- Amount.
- Date.
- Card name and last four digits.
- Category icon.
- Benefit match badge when applicable.

Transaction detail:

- Raw description.
- Plaid category.
- User category.
- Card used.
- Matched benefit.
- Notes.
- Edit category.
- Mark as benefit usage.

## Benefits Screen

Purpose: show what value is still available.

Top summary:

- Used benefit value this period.
- Remaining benefit value this period.
- Expiring soon count.

Benefit states:

- Unused.
- Partially used.
- Used.
- Pending credit.
- Requires enrollment.
- Not tracked.
- Expired.

Benefit row:

- Benefit name.
- Card product.
- Period reset date.
- Used amount / limit.
- Status color.
- Confidence indicator if automatically matched.

Benefit detail:

- Rule summary.
- Eligible merchants or categories.
- Reset schedule.
- Matched transactions.
- Related statement credits.
- Manual override controls.
- Link to issuer instructions when available.

## Cards Screen

Purpose: manage linked cards and card products.

Card row:

- User-facing card name.
- Issuer.
- Mask.
- Current balance.
- Credit limit if available.
- Payment due date if available.
- Connection health.

Card detail:

- Account details.
- Statement balance.
- Minimum payment.
- Last payment.
- APR details when available.
- Benefit list for this card.
- Rename card.
- Change card product mapping.
- Reconnect through Plaid update mode.
- Disconnect.

## Settings Screen

Sections:

- Account.
- Connected institutions.
- Notifications.
- Categories.
- Data export.
- Privacy and security.
- Delete account.

Security controls:

- Face ID / Touch ID app lock.
- Hide amounts in app switcher.
- Clear local cache.

## Notification Types

Payment due:

- "Payment due in 3 days: Chase Sapphire Preferred ending 1234."

Benefit expiring:

- "$10 dining credit unused this month."

Reconnect:

- "Capital One needs reconnecting to keep transactions updated."

Large transaction:

- "New large transaction detected: $842.10 at Delta."

## Accessibility

- Support Dynamic Type.
- Do not rely only on color for status.
- Use VoiceOver labels for charts and progress.
- Keep tap targets at least 44 x 44 pt.
- Use system date and currency formatting.

## Localization

Launch language can be English. Chinese localization should be planned early by avoiding hard-coded strings and keeping UI labels short.

