import Combine
import Foundation
#if canImport(HealthKit)
import HealthKit
#endif

@MainActor
final class HealthKitService: ObservableObject {
    #if canImport(HealthKit)
    private let store = HKHealthStore()
    #endif

    @Published private(set) var authorizationGranted = false

    func requestAuthorization() async {
        #if canImport(HealthKit)
        guard HKHealthStore.isHealthDataAvailable() else { return }
        guard
            let bodyMassType = HKObjectType.quantityType(forIdentifier: .bodyMass),
            let dietaryEnergy = HKObjectType.quantityType(forIdentifier: .dietaryEnergyConsumed)
        else {
            return
        }

        do {
            try await store.requestAuthorization(toShare: [bodyMassType, dietaryEnergy], read: [bodyMassType, dietaryEnergy])
            authorizationGranted = true
        } catch {
            authorizationGranted = false
        }
        #endif
    }
}
