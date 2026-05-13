import SwiftUI

struct HomeView: View {
  @EnvironmentObject private var appState: AppState
  @StateObject private var plaidCoordinator = PlaidLinkCoordinator()

  var body: some View {
    NavigationStack {
      ScrollView {
        VStack(alignment: .leading, spacing: 16) {
          summaryGrid
          connectionCard
          dueDateCard
          benefitsPreview
          recentTransactions
        }
        .padding()
      }
      .background(AppTheme.background)
      .navigationTitle("Account Book")
      .toolbar {
        Button {
          Task { await appState.refreshDashboard() }
        } label: {
          Image(systemName: "arrow.clockwise")
        }
        .accessibilityLabel("Refresh")
      }
    }
  }

  private var summaryGrid: some View {
    Grid(horizontalSpacing: 12, verticalSpacing: 12) {
      GridRow {
        MetricTile(title: "This month", value: appState.homeSummary.monthSpend.currencyText, systemImage: "chart.pie")
        MetricTile(title: "Benefits left", value: appState.homeSummary.remainingBenefits.currencyText, systemImage: "gift")
      }
      GridRow {
        MetricTile(title: "Next payment", value: appState.homeSummary.nextPaymentDueLabel, systemImage: "calendar")
        MetricTile(title: "Expiring", value: "\(appState.homeSummary.expiringBenefitCount)", systemImage: "clock")
      }
    }
  }

  private var connectionCard: some View {
    VStack(alignment: .leading, spacing: 12) {
      HStack {
        Image(systemName: "lock.shield")
          .foregroundStyle(AppTheme.accent)
        Text(connectionTitle)
          .font(.headline)
        Spacer()
      }

      Button {
        connectPlaid()
      } label: {
        Label("Connect accounts", systemImage: "plus")
          .frame(maxWidth: .infinity)
      }
      .buttonStyle(.borderedProminent)
      .tint(AppTheme.accent)
      .disabled(appState.connectionState == .connecting)
    }
    .padding()
    .background(AppTheme.surface)
    .clipShape(RoundedRectangle(cornerRadius: 8))
  }

  private var dueDateCard: some View {
    VStack(alignment: .leading, spacing: 10) {
      Text("Upcoming payments")
        .font(.headline)
      ForEach(appState.cards.prefix(3)) { card in
        HStack {
          VStack(alignment: .leading) {
            Text(card.displayName)
            Text("Ending \(card.mask)")
              .font(.caption)
              .foregroundStyle(AppTheme.mutedText)
          }
          Spacer()
          Text(card.nextPaymentDueDate ?? "No date")
            .font(.subheadline.weight(.semibold))
        }
      }
    }
    .padding()
    .background(AppTheme.surface)
    .clipShape(RoundedRectangle(cornerRadius: 8))
  }

  private var benefitsPreview: some View {
    VStack(alignment: .leading, spacing: 10) {
      Text("Benefits to use")
        .font(.headline)
      ForEach(appState.benefits.filter(\.expiresSoon).prefix(3)) { benefit in
        BenefitRow(benefit: benefit)
      }
    }
    .padding()
    .background(AppTheme.surface)
    .clipShape(RoundedRectangle(cornerRadius: 8))
  }

  private var recentTransactions: some View {
    VStack(alignment: .leading, spacing: 10) {
      Text("Recent transactions")
        .font(.headline)
      ForEach(appState.ledger.transactions.prefix(4)) { transaction in
        TransactionRow(transaction: transaction)
      }
    }
    .padding()
    .background(AppTheme.surface)
    .clipShape(RoundedRectangle(cornerRadius: 8))
  }

  private var connectionTitle: String {
    switch appState.connectionState {
    case .notConnected:
      return "Connect through Plaid to start syncing."
    case .connecting:
      return "Opening Plaid..."
    case .syncing:
      return "Syncing accounts..."
    case .connected:
      return "Accounts connected."
    case .mockData:
      return "Showing sample data."
    case .error:
      return "Connection needs attention."
    }
  }

  private func connectPlaid() {
    Task {
      do {
        let response = try await appState.createLinkToken()
        if response.mode == "mock" {
          await appState.exchangePublicToken("mock-public-token")
          return
        }
        plaidCoordinator.open(linkToken: response.linkToken) { publicToken in
          Task { await appState.exchangePublicToken(publicToken) }
        } onExit: { message in
          Task { @MainActor in
            appState.alertMessage = message
          }
        }
      } catch {
        await MainActor.run {
          appState.alertMessage = error.localizedDescription
        }
      }
    }
  }
}

private struct MetricTile: View {
  let title: String
  let value: String
  let systemImage: String

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Image(systemName: systemImage)
        .foregroundStyle(AppTheme.accent)
      Text(value)
        .font(.title3.weight(.semibold))
        .lineLimit(2)
        .minimumScaleFactor(0.78)
      Text(title)
        .font(.caption)
        .foregroundStyle(AppTheme.mutedText)
    }
    .frame(maxWidth: .infinity, minHeight: 112, alignment: .topLeading)
    .padding()
    .background(AppTheme.surface)
    .clipShape(RoundedRectangle(cornerRadius: 8))
  }
}
