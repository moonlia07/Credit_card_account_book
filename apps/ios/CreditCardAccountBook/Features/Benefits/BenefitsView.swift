import SwiftUI

struct BenefitsView: View {
  @EnvironmentObject private var appState: AppState

  var body: some View {
    NavigationStack {
      List {
        Section {
          VStack(alignment: .leading, spacing: 8) {
            Text("Remaining this period")
              .foregroundStyle(AppTheme.mutedText)
            Text(remainingBenefits.currencyText)
              .font(.largeTitle.weight(.bold))
          }
          .padding(.vertical, 8)
        }

        Section("Tracked benefits") {
          ForEach(appState.benefits) { benefit in
            BenefitRow(benefit: benefit)
          }
        }
      }
      .navigationTitle("Benefits")
    }
  }

  private var remainingBenefits: Decimal {
    appState.benefits.reduce(Decimal.zero) {
      $0 + max($1.limitAmount - $1.usedAmount, .zero)
    }
  }
}

struct BenefitRow: View {
  let benefit: BenefitInstance

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      HStack {
        VStack(alignment: .leading) {
          Text(benefit.benefitName)
            .font(.headline)
          Text(benefit.cardName)
            .font(.caption)
            .foregroundStyle(AppTheme.mutedText)
        }
        Spacer()
        Text(statusLabel)
          .font(.caption.weight(.semibold))
          .foregroundStyle(statusColor)
      }

      ProgressView(value: progress)
        .tint(statusColor)

      HStack {
        Text("\(benefit.usedAmount.currencyText) used of \(benefit.limitAmount.currencyText)")
        Spacer()
        Text("Ends \(benefit.periodEnd)")
      }
      .font(.caption)
      .foregroundStyle(AppTheme.mutedText)
    }
    .padding(.vertical, 4)
  }

  private var progress: Double {
    guard benefit.limitAmount > .zero else { return 0 }
    let used = NSDecimalNumber(decimal: benefit.usedAmount).doubleValue
    let limit = NSDecimalNumber(decimal: benefit.limitAmount).doubleValue
    return min(max(used / limit, 0), 1)
  }

  private var statusLabel: String {
    benefit.status.replacingOccurrences(of: "_", with: " ").capitalized
  }

  private var statusColor: Color {
    switch benefit.status {
    case "used":
      return AppTheme.success
    case "partially_used":
      return AppTheme.accent
    case "unused":
      return benefit.expiresSoon ? AppTheme.warning : AppTheme.mutedText
    default:
      return AppTheme.mutedText
    }
  }
}

