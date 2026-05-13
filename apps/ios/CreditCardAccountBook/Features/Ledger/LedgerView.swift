import SwiftUI

struct LedgerView: View {
  @EnvironmentObject private var appState: AppState
  @State private var searchText = ""

  private var visibleTransactions: [LedgerTransaction] {
    guard !searchText.isEmpty else { return appState.ledger.transactions }
    return appState.ledger.transactions.filter {
      $0.merchantName.localizedCaseInsensitiveContains(searchText) ||
        $0.category.localizedCaseInsensitiveContains(searchText)
    }
  }

  var body: some View {
    NavigationStack {
      List {
        Section {
          VStack(alignment: .leading, spacing: 8) {
            Text(appState.ledger.month)
              .font(.subheadline)
              .foregroundStyle(AppTheme.mutedText)
            Text(appState.ledger.totalSpend.currencyText)
              .font(.largeTitle.weight(.bold))
          }
          .padding(.vertical, 8)
        }

        Section("Categories") {
          ForEach(appState.ledger.categorySummaries) { summary in
            SummaryRow(summary: summary)
          }
        }

        Section("Cards") {
          ForEach(appState.ledger.cardSummaries) { summary in
            SummaryRow(summary: summary)
          }
        }

        Section("Transactions") {
          ForEach(visibleTransactions) { transaction in
            TransactionRow(transaction: transaction)
          }
        }
      }
      .searchable(text: $searchText, prompt: "Search merchants or categories")
      .navigationTitle("Ledger")
    }
  }
}

struct SummaryRow: View {
  let summary: LedgerSummary

  var body: some View {
    HStack {
      Text(summary.label)
      Spacer()
      Text(summary.amount.currencyText)
        .fontWeight(.semibold)
    }
  }
}

struct TransactionRow: View {
  let transaction: LedgerTransaction

  var body: some View {
    HStack(spacing: 12) {
      Image(systemName: transaction.benefitMatchLabel == nil ? "creditcard" : "gift")
        .foregroundStyle(transaction.benefitMatchLabel == nil ? AppTheme.mutedText : AppTheme.success)
        .frame(width: 28)

      VStack(alignment: .leading, spacing: 3) {
        Text(transaction.merchantName)
          .font(.body)
        Text("\(transaction.category) • \(transaction.cardName)")
          .font(.caption)
          .foregroundStyle(AppTheme.mutedText)
        if let benefit = transaction.benefitMatchLabel {
          Text(benefit)
            .font(.caption2.weight(.semibold))
            .foregroundStyle(AppTheme.success)
        }
      }

      Spacer()

      VStack(alignment: .trailing) {
        Text(transaction.amount.currencyText)
          .fontWeight(.semibold)
        Text(transaction.date)
          .font(.caption)
          .foregroundStyle(AppTheme.mutedText)
      }
    }
    .padding(.vertical, 4)
  }
}

