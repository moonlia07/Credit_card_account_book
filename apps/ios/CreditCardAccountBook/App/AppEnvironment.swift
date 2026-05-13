import Foundation

struct AppEnvironment {
  let apiBaseURL: URL

  static var current: AppEnvironment {
    let configuredURL = Bundle.main.object(forInfoDictionaryKey: "API_BASE_URL") as? String
    let url = configuredURL.flatMap(URL.init(string:)) ?? URL(string: "http://localhost:8080")!
    return AppEnvironment(apiBaseURL: url)
  }
}

