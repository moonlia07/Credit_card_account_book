import SwiftUI

@main
struct CreditCardAccountBookApp: App {
  @StateObject private var appState = AppState(
    apiClient: APIClient(baseURL: AppEnvironment.current.apiBaseURL)
  )

  var body: some Scene {
    WindowGroup {
      RootView()
        .environmentObject(appState)
        .task {
          await appState.bootstrap()
        }
    }
  }
}

