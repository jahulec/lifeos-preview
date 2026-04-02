import Foundation
import LocalAuthentication
import Observation

@Observable
@MainActor
final class AppSecurityManager {
    var locked = false

    func reauthenticateIfNeeded() async {
        let context = LAContext()
        var error: NSError?

        if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
            do {
                locked = true
                let reason = "Unlock LifeOS to view private health and planning data."
                let success = try await context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason)
                locked = !success
            } catch {
                locked = false
            }
        } else {
            locked = false
        }
    }
}

