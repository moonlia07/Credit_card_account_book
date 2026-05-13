import SwiftUI

struct RootView: View {
  @EnvironmentObject private var appState: AppState

  var body: some View {
    TabView {
      HomeView()
        .tabItem {
          Label("Home", systemImage: "house")
        }

      LedgerView()
        .tabItem {
          Label("Ledger", systemImage: "list.bullet.rectangle")
        }

      BenefitsView()
        .tabItem {
          Label("Benefits", systemImage: "gift")
        }

      CardsView()
        .tabItem {
          Label("Cards", systemImage: "creditcard")
        }

      SettingsView()
        .tabItem {
          Label("Settings", systemImage: "gearshape")
        }
    }
    .tint(AppTheme.accent)
    .alert("Credit Card Account Book", isPresented: Binding(
      get: { appState.alertMessage != nil },
      set: { if !$0 { appState.alertMessage = nil } }
    )) {
      Button("OK", role: .cancel) {}
    } message: {
      Text(appState.alertMessage ?? "")
    }
  }
}

#Preview {
  RootView()
    .environmentObject(AppState(apiClient: APIClient(baseURL: URL(string: "http://localhost:8080")!)))
}

