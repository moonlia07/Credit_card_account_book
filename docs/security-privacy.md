# Security And Privacy

## Security Principles

- Minimize collected data.
- Encrypt sensitive data in transit and at rest.
- Keep Plaid access tokens on the backend only.
- Never store bank credentials.
- Never store full card numbers, CVV, or issuer passwords.
- Make deletion and disconnection easy.
- Keep financial logs scrubbed.

## Data Classification

Highly sensitive:

- Plaid access tokens.
- Transaction history.
- Account balances.
- Liability details.
- Payment due dates.
- User notes on financial activity.

Sensitive:

- Email address.
- Device identifiers.
- App usage events.
- Notification preferences.

Low sensitivity:

- Card product metadata.
- Public benefit rules.
- App configuration.

## Plaid Token Handling

- `public_token` is short-lived and should only be passed from iOS to backend after Link success.
- `access_token` must be exchanged and stored only on the backend.
- Encrypt `access_token` with KMS or envelope encryption.
- Never send `access_token` to the iOS client.
- Support Plaid item removal when a user disconnects an institution.

## iOS Security

- Use HTTPS only.
- Store auth refresh tokens in Keychain.
- Support Face ID / Touch ID app lock.
- Hide balances in the app switcher snapshot.
- Avoid storing full transaction history locally unless encrypted.
- Clear local cache when user signs out.

## Backend Security

- Use short-lived access tokens for client API calls.
- Rotate refresh tokens.
- Rate limit auth and Plaid endpoints.
- Validate Plaid webhook signatures if enabled in the integration.
- Use row-level ownership checks on every user-scoped query.
- Separate production, development, and sandbox Plaid environments.
- Scrub logs to avoid raw transaction descriptions and sensitive tokens.

## Privacy Controls

User controls:

- Export ledger data.
- Disconnect an institution.
- Delete all account data.
- Disable notification categories.
- Hide specific accounts from summaries.
- Disable benefit tracking for a card.

Data retention:

- Keep active transaction data while the account is connected.
- On account deletion, remove or anonymize user data according to the privacy policy.
- Keep minimal audit records only when legally necessary.

## App Store Requirements

The app will need:

- App Privacy labels in App Store Connect.
- `PrivacyInfo.xcprivacy` privacy manifest.
- Third-party SDK privacy review, including Plaid LinkKit and analytics SDKs.
- Clear privacy policy URL.
- No tracking across apps/websites unless App Tracking Transparency is implemented and approved by the user.

## Logging Rules

Allowed:

- Internal ids.
- Sync status.
- Error codes.
- Aggregated counts.
- Latency and job duration.

Not allowed:

- Plaid access tokens.
- Raw authorization headers.
- Full account numbers.
- Full transaction descriptions.
- User financial notes.
- Email plus transaction details in the same log line.

## Threat Model

Primary threats:

- Plaid access token leakage.
- Unauthorized access to transaction history.
- Incorrect account ownership checks.
- Overly broad analytics collection.
- Insecure local cache.
- Benefit rule manipulation causing misleading recommendations.

Mitigations:

- Backend-only Plaid tokens.
- Encryption at rest.
- Strong auth and session rotation.
- Object ownership checks.
- Least-privilege service accounts.
- Manual audit path for benefit rule changes.
- Security review before production launch.

