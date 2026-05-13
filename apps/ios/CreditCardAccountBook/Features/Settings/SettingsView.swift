import SwiftUI

struct SettingsView: View {
  @EnvironmentObject private var appState: AppState

  var body: some View {
    NavigationStack {
      List {
        Section("Security") {
          Label("Face ID app lock", systemImage: "faceid")
          Label("Hide balances in app switcher", systemImage: "eye.slash")
        }

        Section("Data") {
          Label("Connected institutions", systemImage: "building.columns")
          Label("Export ledger data", systemImage: "square.and.arrow.up")
          Label("Delete account", systemImage: "trash")
            .foregroundStyle(.red)
        }

        Section("Developer") {
          LabeledContent("API") {
            Text(AppEnvironment.current.apiBaseURL.absoluteString)
              .foregroundStyle(AppTheme.mutedText)
          }
          LabeledContent("Connection") {
            Text(String(describing: appState.connectionState))
              .foregroundStyle(AppTheme.mutedText)
          }
        }
      }
      .navigationTitle("Settings")
    }
  }
}

