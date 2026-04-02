import AppIntents

enum QuickCaptureIntentTarget: String, AppEnum {
    case weight
    case habit
    case task
    case workout

    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Quick Capture")

    static var caseDisplayRepresentations: [QuickCaptureIntentTarget: DisplayRepresentation] = [
        .weight: DisplayRepresentation(title: "Log weight"),
        .habit: DisplayRepresentation(title: "Complete habit"),
        .task: DisplayRepresentation(title: "Add task"),
        .workout: DisplayRepresentation(title: "Add workout set")
    ]
}

struct OpenQuickCaptureIntent: AppIntent {
    static let title: LocalizedStringResource = "Open Quick Capture"
    static let description = IntentDescription("Open LifeOS directly in the capture flow.")
    static let openAppWhenRun = true

    @Parameter(title: "Mode")
    var target: QuickCaptureIntentTarget

    init() {}

    init(target: QuickCaptureIntentTarget) {
        self.target = target
    }

    func perform() async throws -> some IntentResult {
        .result()
    }
}

struct LifeOSShortcutsProvider: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        [
            AppShortcut(
                intent: OpenQuickCaptureIntent(target: .weight),
                phrases: ["Open weight capture in \(.applicationName)"],
                shortTitle: "Weight",
                systemImageName: "scalemass"
            ),
            AppShortcut(
                intent: OpenQuickCaptureIntent(target: .task),
                phrases: ["Add a task in \(.applicationName)"],
                shortTitle: "Task",
                systemImageName: "text.badge.plus"
            )
        ]
    }
}
