# iOS App

This folder contains the SwiftUI iOS client for Credit Card Account Book.

The project uses an XcodeGen `project.yml` file so the repository can keep source code reviewable without committing generated Xcode project metadata.

## Generate Project

```bash
xcodegen generate
open CreditCardAccountBook.xcodeproj
```

## Plaid Link

Plaid LinkKit is configured through Swift Package Manager using Plaid's lightweight SPM repository:

```text
https://github.com/plaid/plaid-link-ios-spm.git
```

The app requests a Link token from the API service, opens LinkKit, then sends the returned public token to the backend for exchange.

