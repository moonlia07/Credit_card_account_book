import Foundation

final class APIClient {
  private let baseURL: URL
  private let session: URLSession
  private let decoder: JSONDecoder

  init(baseURL: URL, session: URLSession = .shared) {
    self.baseURL = baseURL
    self.session = session
    self.decoder = JSONDecoder()
    self.decoder.keyDecodingStrategy = .convertFromSnakeCase
  }

  func createLinkToken(userId: String) async throws -> LinkTokenResponse {
    try await post(path: "/v1/plaid/link-token", body: ["userId": userId])
  }

  func exchangePublicToken(userId: String, publicToken: String) async throws {
    let _: EmptyResponse = try await post(
      path: "/v1/plaid/exchange-public-token",
      body: ["userId": userId, "publicToken": publicToken]
    )
  }

  func fetchLedger(userId: String, month: String) async throws -> MonthlyLedger {
    try await get(path: "/v1/ledger/months/\(month)", query: ["userId": userId])
  }

  func fetchCards(userId: String) async throws -> [CardAccount] {
    try await get(path: "/v1/cards", query: ["userId": userId])
  }

  func fetchCurrentBenefits(userId: String) async throws -> [BenefitInstance] {
    try await get(path: "/v1/benefits/current", query: ["userId": userId])
  }

  private func get<Response: Decodable>(path: String, query: [String: String] = [:]) async throws -> Response {
    var components = URLComponents(url: baseURL.appending(path: path), resolvingAgainstBaseURL: false)!
    components.queryItems = query.map { URLQueryItem(name: $0.key, value: $0.value) }
    let url = components.url!
    let (data, response) = try await session.data(from: url)
    try validate(response: response, data: data)
    return try decoder.decode(Response.self, from: data)
  }

  private func post<Response: Decodable>(path: String, body: [String: String]) async throws -> Response {
    var request = URLRequest(url: baseURL.appending(path: path))
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpBody = try JSONSerialization.data(withJSONObject: body)

    let (data, response) = try await session.data(for: request)
    try validate(response: response, data: data)
    return try decoder.decode(Response.self, from: data)
  }

  private func validate(response: URLResponse, data: Data) throws {
    guard let httpResponse = response as? HTTPURLResponse else {
      throw APIError.invalidResponse
    }

    guard (200..<300).contains(httpResponse.statusCode) else {
      let message = String(data: data, encoding: .utf8) ?? "Request failed"
      throw APIError.server(message)
    }
  }
}

struct EmptyResponse: Decodable {}

enum APIError: LocalizedError {
  case invalidResponse
  case server(String)

  var errorDescription: String? {
    switch self {
    case .invalidResponse:
      return "The server returned an invalid response."
    case .server(let message):
      return message
    }
  }
}

