import SwiftData
import SwiftUI

struct CaptureView: View {
    @Query(sort: \QuickCaptureAction.sortOrder) private var captureActions: [QuickCaptureAction]
    @State private var bodyWeight = ""
    @State private var taskTitle = ""
    @State private var habitNote = ""

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                SectionTitle(
                    eyebrow: "Fast Input",
                    title: "Capture",
                    subtitle: "Everything here is optimized for low-friction logging."
                )

                GlassCard {
                    Text("Quick launch")
                        .font(.bodyRounded(22, weight: .semibold))

                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                        ForEach(captureActions, id: \.id) { action in
                            VStack(alignment: .leading, spacing: 10) {
                                Image(systemName: action.symbolName)
                                    .font(.system(size: 22, weight: .semibold))
                                    .foregroundStyle(LifeTheme.accent)
                                Text(action.title)
                                    .font(.bodyRounded(16, weight: .semibold))
                                    .foregroundStyle(LifeTheme.ink)
                                Text(label(for: action.kind))
                                    .font(.bodyRounded(13))
                                    .foregroundStyle(LifeTheme.muted)
                            }
                            .padding(16)
                            .frame(maxWidth: .infinity, minHeight: 120, alignment: .leading)
                            .background(
                                RoundedRectangle(cornerRadius: 22, style: .continuous)
                                    .fill(LifeTheme.secondarySurface)
                            )
                        }
                    }
                }

                GlassCard {
                    Text("Body weight")
                        .font(.bodyRounded(22, weight: .semibold))
                    TextField("80.4", text: $bodyWeight)
                        .keyboardType(.decimalPad)
                        .textFieldStyle(.roundedBorder)
                    Text("Future behavior: save locally, optionally sync selected metrics to HealthKit.")
                        .font(.bodyRounded(13))
                        .foregroundStyle(LifeTheme.muted)
                }

                GlassCard {
                    Text("Task inbox")
                        .font(.bodyRounded(22, weight: .semibold))
                    TextField("Add a new task", text: $taskTitle)
                        .textFieldStyle(.roundedBorder)
                    Text("Designed for one-thumb capture, then later triage into Today or Upcoming.")
                        .font(.bodyRounded(13))
                        .foregroundStyle(LifeTheme.muted)
                }

                GlassCard {
                    Text("Habit check-in")
                        .font(.bodyRounded(22, weight: .semibold))
                    TextField("Short note or mood context", text: $habitNote)
                        .textFieldStyle(.roundedBorder)
                    Text("Minimal completion and emotional context will matter more than streak pressure.")
                        .font(.bodyRounded(13))
                        .foregroundStyle(LifeTheme.muted)
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
            .padding(.bottom, 32)
        }
        .scrollIndicators(.hidden)
        .navigationBarTitleDisplayMode(.inline)
    }

    private func label(for kind: QuickCaptureKind) -> String {
        switch kind {
        case .bodyWeight: "Body metric"
        case .habit: "Habit completion"
        case .task: "Task inbox"
        case .workoutSet: "Workout set"
        case .meal: "Nutrition"
        case .supplement: "Supplement"
        }
    }
}

