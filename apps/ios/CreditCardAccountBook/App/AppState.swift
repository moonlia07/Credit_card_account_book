import Foundation

@MainActor
final class AppState: ObservableObject {
  @Published private(set) var homeSummary = HomeSummary.placeholder
  @Published private(set) var ledger = MonthlyLedger.placeholder
  @Published private(set) var cards: [CardAccount] = CardAccount.placeholders
  @Published private(set) var benefits: [BenefitInstance] = BenefitInstance.placeholders
  @Published var connectionState: ConnectionState = .notConnected
  @Published var alertMessage: String?

  let apiClient: APIClient
  let userId = "demo-user"

  init(apiClient: APIClient) {
    self.apiClient = apiClient
  }

  func bootstrap() async {
    await refreshDashboard()
  }

  func refreshDashboard() async {
    do {
      async let ledgerResponse = apiClient.fetchLedger(userId: userId, month: Date.currentMonthString)
      async let cardsResponse = apiClient.fetchCards(userId: userId)
      async let benefitsResponse = apiClient.fetchCurrentBenefits(userId: userId)

      let (ledger, cards, benefits) = try await (ledgerResponse, cardsResponse, benefitsResponse)
      self.ledger = ledger
      self.cards = cards
      self.benefits = benefits
      self.homeSummary = HomeSummary(ledger: ledger, cards: cards, benefits: benefits)
      self.connectionState = cards.isEmpty ? .notConnected : .connected
    } catch {
      self.connectionState = .mockData
      self.alertMessage = "Using sample data until the API is available."
    }
  }

  func createLinkToken() async throws -> LinkTokenResponse {
    connectionState = .connecting
    return try await apiClient.createLinkToken(userId: userId)
  }

  func exchangePublicToken(_ publicToken: String) async {
    do {
      try await apiClient.exchangePublicToken(userId: userId, publicToken: publicToken)
      connectionState = .syncing
      await refreshDashboard()
    } catch {
      connectionState = .error
      alertMessage = error.localizedDescription
    }
  }
}

enum ConnectionState {
  case notConnected
  case connecting
  case syncing
  case connected
  case mockData
  case error
}

private extension Date {
  static var currentMonthString: String {
    let formatter = DateFormatter()
    formatter.calendar = Calendar(identifier: .gregorian)
    formatter.dateFormat = "yyyy-MM"
    return formatter.string(from: Date())
  }
}

