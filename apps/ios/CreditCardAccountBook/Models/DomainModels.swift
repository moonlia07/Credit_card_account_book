import Foundation

struct LinkTokenResponse: Decodable {
  let linkToken: String
  let mode: String
}

struct HomeSummary {
  let monthSpend: Decimal
  let remainingBenefits: Decimal
  let nextPaymentDueLabel: String
  let expiringBenefitCount: Int

  init(monthSpend: Decimal, remainingBenefits: Decimal, nextPaymentDueLabel: String, expiringBenefitCount: Int) {
    self.monthSpend = monthSpend
    self.remainingBenefits = remainingBenefits
    self.nextPaymentDueLabel = nextPaymentDueLabel
    self.expiringBenefitCount = expiringBenefitCount
  }

  init(ledger: MonthlyLedger, cards: [CardAccount], benefits: [BenefitInstance]) {
    let remaining = benefits.reduce(Decimal.zero) { $0 + max($1.limitAmount - $1.usedAmount, .zero) }
    let nextDue = cards
      .compactMap(\.nextPaymentDueDate)
      .sorted()
      .first
      .map { "Due \($0)" } ?? "No due date"

    self.init(
      monthSpend: ledger.totalSpend,
      remainingBenefits: remaining,
      nextPaymentDueLabel: nextDue,
      expiringBenefitCount: benefits.filter(\.expiresSoon).count
    )
  }

  static let placeholder = HomeSummary(
    monthSpend: 1842.63,
    remainingBenefits: 45,
    nextPaymentDueLabel: "Due May 28",
    expiringBenefitCount: 2
  )
}

struct MonthlyLedger: Decodable, Identifiable {
  let id: String
  let month: String
  let totalSpend: Decimal
  let categorySummaries: [LedgerSummary]
  let cardSummaries: [LedgerSummary]
  let topMerchants: [LedgerSummary]
  let transactions: [LedgerTransaction]

  static let placeholder = MonthlyLedger(
    id: "demo-ledger",
    month: "2026-05",
    totalSpend: 1842.63,
    categorySummaries: [
      LedgerSummary(id: "food", label: "Food & Drink", amount: 612.45),
      LedgerSummary(id: "travel", label: "Travel", amount: 428.9),
      LedgerSummary(id: "shopping", label: "Shopping", amount: 301.8)
    ],
    cardSummaries: [
      LedgerSummary(id: "amex-gold", label: "Amex Gold", amount: 830.12),
      LedgerSummary(id: "sapphire", label: "Sapphire Preferred", amount: 544.2)
    ],
    topMerchants: [
      LedgerSummary(id: "grubhub", label: "Grubhub", amount: 84.7),
      LedgerSummary(id: "delta", label: "Delta", amount: 428.9)
    ],
    transactions: LedgerTransaction.placeholders
  )
}

struct LedgerSummary: Decodable, Identifiable {
  let id: String
  let label: String
  let amount: Decimal
}

struct LedgerTransaction: Decodable, Identifiable {
  let id: String
  let merchantName: String
  let date: String
  let amount: Decimal
  let category: String
  let cardName: String
  let benefitMatchLabel: String?

  static let placeholders = [
    LedgerTransaction(id: "txn-1", merchantName: "Grubhub", date: "2026-05-02", amount: 28.4, category: "Food & Drink", cardName: "Amex Gold", benefitMatchLabel: "Dining credit"),
    LedgerTransaction(id: "txn-2", merchantName: "Delta", date: "2026-05-06", amount: 428.9, category: "Travel", cardName: "Sapphire Preferred", benefitMatchLabel: nil),
    LedgerTransaction(id: "txn-3", merchantName: "Uber", date: "2026-05-10", amount: 18.2, category: "Transport", cardName: "Amex Gold", benefitMatchLabel: "Uber Cash")
  ]
}

struct CardAccount: Decodable, Identifiable {
  let id: String
  let displayName: String
  let issuer: String
  let mask: String
  let currentBalance: Decimal
  let creditLimit: Decimal?
  let nextPaymentDueDate: String?
  let connectionStatus: String

  static let placeholders = [
    CardAccount(id: "card-1", displayName: "American Express Gold", issuer: "American Express", mask: "1001", currentBalance: 830.12, creditLimit: nil, nextPaymentDueDate: "2026-05-28", connectionStatus: "healthy"),
    CardAccount(id: "card-2", displayName: "Chase Sapphire Preferred", issuer: "Chase", mask: "4242", currentBalance: 544.2, creditLimit: 18000, nextPaymentDueDate: "2026-06-01", connectionStatus: "healthy")
  ]
}

struct BenefitInstance: Decodable, Identifiable {
  let id: String
  let benefitName: String
  let cardName: String
  let periodEnd: String
  let limitAmount: Decimal
  let usedAmount: Decimal
  let status: String
  let expiresSoon: Bool

  static let placeholders = [
    BenefitInstance(id: "benefit-1", benefitName: "Dining Credit", cardName: "American Express Gold", periodEnd: "2026-05-31", limitAmount: 10, usedAmount: 10, status: "used", expiresSoon: false),
    BenefitInstance(id: "benefit-2", benefitName: "Uber Cash", cardName: "American Express Gold", periodEnd: "2026-05-31", limitAmount: 10, usedAmount: 0, status: "unused", expiresSoon: true),
    BenefitInstance(id: "benefit-3", benefitName: "Travel Credit", cardName: "Chase Sapphire Reserve", periodEnd: "2026-12-31", limitAmount: 300, usedAmount: 265, status: "partially_used", expiresSoon: false)
  ]
}

