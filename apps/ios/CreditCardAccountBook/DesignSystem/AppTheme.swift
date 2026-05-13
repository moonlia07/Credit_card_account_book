import SwiftUI

enum AppTheme {
  static let background = Color(.systemGroupedBackground)
  static let surface = Color(.secondarySystemGroupedBackground)
  static let accent = Color(red: 0.06, green: 0.39, blue: 0.33)
  static let warning = Color(red: 0.78, green: 0.34, blue: 0.1)
  static let success = Color(red: 0.1, green: 0.48, blue: 0.27)
  static let mutedText = Color.secondary
}

extension Decimal {
  var currencyText: String {
    let formatter = NumberFormatter()
    formatter.numberStyle = .currency
    formatter.currencyCode = "USD"
    return formatter.string(from: self as NSDecimalNumber) ?? "$0.00"
  }
}

