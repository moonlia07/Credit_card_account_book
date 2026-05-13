import Foundation
import UIKit

#if canImport(LinkKit)
import LinkKit
#endif

@MainActor
final class PlaidLinkCoordinator: ObservableObject {
  #if canImport(LinkKit)
  private var handler: Handler?
  #endif

  func open(linkToken: String, onSuccess: @escaping (String) -> Void, onExit: @escaping (String?) -> Void) {
    #if canImport(LinkKit)
    var configuration = LinkTokenConfiguration(token: linkToken) { success in
      onSuccess(success.publicToken)
    }

    configuration.onExit = { exit in
      onExit(exit.error?.displayMessage ?? exit.error?.errorMessage)
    }

    let result = Plaid.create(configuration)
    switch result {
    case .success(let handler):
      self.handler = handler
      guard let presenter = UIApplication.shared.activeRootViewController else {
        onExit("Unable to find a view controller for Plaid Link.")
        return
      }
      handler.open(presentUsing: .viewController(presenter))
    case .failure(let error):
      onExit(error.localizedDescription)
    }
    #else
    onExit("Plaid LinkKit is not available in this build. Generate the Xcode project and resolve Swift packages first.")
    #endif
  }
}

private extension UIApplication {
  var activeRootViewController: UIViewController? {
    connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap(\.windows)
      .first { $0.isKeyWindow }?
      .rootViewController
  }
}

