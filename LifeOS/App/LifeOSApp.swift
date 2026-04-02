import SwiftData
import SwiftUI

@main
struct LifeOSApp: App {
    @State private var appState = AppState()
    @State private var securityManager = AppSecurityManager()
    @Environment(\.scenePhase) private var scenePhase

    private var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            Goal.self,
            ProgressSnapshot.self,
            ReminderRule.self,
            QuickCaptureAction.self,
            Habit.self,
            HabitLog.self,
            TaskItem.self,
            WorkoutPlan.self,
            WorkoutSession.self,
            ExerciseTemplate.self,
            ExerciseSetRecord.self,
            BodyMetricEntry.self,
            NutritionLog.self,
            Supplement.self,
            SupplementLog.self,
            DailyNote.self
        ])

        let configuration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)

        do {
            return try ModelContainer(for: schema, configurations: [configuration])
        } catch {
            fatalError("Unable to create model container: \(error.localizedDescription)")
        }
    }()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(appState)
                .environment(securityManager)
                .modelContainer(sharedModelContainer)
                .task {
                    await SampleDataSeeder.seedIfNeeded(container: sharedModelContainer)
                }
                .onChange(of: scenePhase) { _, newPhase in
                    appState.privacyShieldVisible = newPhase != .active
                    if newPhase == .active {
                        Task {
                            await securityManager.reauthenticateIfNeeded()
                        }
                    }
                }
        }
    }
}

