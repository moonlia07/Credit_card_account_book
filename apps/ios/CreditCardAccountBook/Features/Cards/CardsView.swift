import SwiftUI

struct CardsView: View {
  @EnvironmentObject private var appState: AppState

  var body: some View {
    NavigationStack {
      List(appState.cards) { card in
        VStack(alignment: .leading, spacing: 10) {
          HStack {
            Image(systemName: "creditcard.fill")
              .foregroundStyle(AppTheme.accent)
            VStack(alignment: .leading) {
              Text(card.displayName)
                .font(.headline)
              Text("\(card.issuer) • Ending \(card.mask)")
                .font(.caption)
                .foregroundStyle(AppTheme.mutedText)
            }
            Spacer()
            Text(card.connectionStatus.capitalized)
              .font(.caption.weight(.semibold))
              .foregroundStyle(card.connectionStatus == "healthy" ? AppTheme.success : AppTheme.warning)
          }

          HStack {
            VStack(alignment: .leading) {
              Text("Balance")
                .font(.caption)
                .foregroundStyle(AppTheme.mutedText)
              Text(card.currentBalance.currencyText)
                .fontWeight(.semibold)
            }
            Spacer()
            VStack(alignment: .trailing) {
              Text("Due date")
                .font(.caption)
                .foregroundStyle(AppTheme.mutedText)
              Text(card.nextPaymentDueDate ?? "Unavailable")
                .fontWeight(.semibold)
            }
          }
        }
        .padding(.vertical, 6)
      }
      .navigationTitle("Cards")
    }
  }
}

