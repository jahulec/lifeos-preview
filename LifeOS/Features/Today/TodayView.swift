import SwiftData
import SwiftUI

struct TodayView: View {
    @Environment(AppState.self) private var appState
    @Query(sort: \ProgressSnapshot.createdAt, order: .reverse) private var snapshots: [ProgressSnapshot]
    @Query(sort: \Habit.createdAt) private var habits: [Habit]
    @Query(sort: \TaskItem.createdAt, order: .reverse) private var tasks: [TaskItem]
    @Query(sort: \WorkoutSession.startedAt, order: .reverse) private var workoutSessions: [WorkoutSession]
    @Query(sort: \BodyMetricEntry.recordedAt, order: .reverse) private var bodyEntries: [BodyMetricEntry]
    @Query(sort: \NutritionLog.loggedAt, order: .reverse) private var meals: [NutritionLog]
    @Query(sort: \DailyNote.createdAt, order: .reverse) private var notes: [DailyNote]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                SectionTitle(
                    eyebrow: "LifeOS",
                    title: "Today",
                    subtitle: "Your daily control panel with only active things that matter now."
                )

                if let hero = snapshots.first {
                    heroCard(hero)
                }

                quickCaptureRow

                if let session = workoutSessions.first {
                    workoutCard(session)
                }

                habitsCard
                tasksCard
                nutritionCard

                if let note = notes.first {
                    noteCard(note)
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
            .padding(.bottom, 32)
        }
        .scrollIndicators(.hidden)
        .navigationBarTitleDisplayMode(.inline)
    }

    private func heroCard(_ snapshot: ProgressSnapshot) -> some View {
        GlassCard {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 6) {
                    Text(snapshot.title)
                        .font(.display(26, weight: .bold))
                        .foregroundStyle(LifeTheme.ink)
                    Text("Resets \(snapshot.resetDate, format: .dateTime.weekday(.abbreviated).day().month())")
                        .font(.bodyRounded(14))
                        .foregroundStyle(LifeTheme.muted)
                }
                Spacer()
                Text("\(Int(snapshot.percent * 100))%")
                    .font(.display(34, weight: .bold))
                    .foregroundStyle(LifeTheme.ink)
            }

            ProgressBar(value: snapshot.percent, tint: LifeTheme.accent)

            HStack {
                StatPill(label: "Current", value: "\(Int(snapshot.currentValue))/\(Int(snapshot.targetValue))")
                StatPill(label: "Trend", value: snapshot.trend.rawValue.capitalized)
            }
        }
    }

    private var quickCaptureRow: some View {
        HStack(spacing: 12) {
            Button {
                appState.selectedTab = .capture
            } label: {
                QuickActionButton(title: "Weight", systemImage: "scalemass", tint: LifeTheme.accent)
            }
            Button {
                appState.selectedTab = .capture
            } label: {
                QuickActionButton(title: "Habit", systemImage: "checkmark.circle.fill", tint: LifeTheme.accentWarm)
            }
        }
    }

    private func workoutCard(_ session: WorkoutSession) -> some View {
        GlassCard {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Next active training")
                        .font(.bodyRounded(13, weight: .semibold))
                        .foregroundStyle(LifeTheme.muted)
                    Text(session.title)
                        .font(.bodyRounded(22, weight: .semibold))
                        .foregroundStyle(LifeTheme.ink)
                    Text(session.planTitle)
                        .font(.bodyRounded(14))
                        .foregroundStyle(LifeTheme.muted)
                }
                Spacer()
                Text("\(session.restSeconds)s")
                    .font(.bodyRounded(20, weight: .bold))
                    .foregroundStyle(LifeTheme.accent)
            }

            HStack {
                StatPill(label: "Last duration", value: "\(session.durationMinutes) min")
                StatPill(label: "Effort", value: String(format: "%.1f / 10", session.effortScore))
            }
        }
    }

    private var habitsCard: some View {
        GlassCard {
            HStack {
                Text("Habits")
                    .font(.bodyRounded(22, weight: .semibold))
                Spacer()
                Text("\(todayCompletedHabitCount)/\(habits.count)")
                    .font(.bodyRounded(18, weight: .bold))
                    .foregroundStyle(LifeTheme.accent)
            }

            ForEach(Array(habits.prefix(3)), id: \.id) { habit in
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(habit.title)
                            .font(.bodyRounded(17, weight: .semibold))
                            .foregroundStyle(LifeTheme.ink)
                        Text(habit.minimalVersion)
                            .font(.bodyRounded(14))
                            .foregroundStyle(LifeTheme.muted)
                    }
                    Spacer()
                    Text("\(habit.currentStreak)d")
                        .font(.bodyRounded(15, weight: .bold))
                        .foregroundStyle(LifeTheme.accentWarm)
                }
            }
        }
    }

    private var tasksCard: some View {
        GlassCard {
            HStack {
                Text("Top tasks")
                    .font(.bodyRounded(22, weight: .semibold))
                Spacer()
                Text("\(activeTodayTasks.count)")
                    .font(.bodyRounded(18, weight: .bold))
                    .foregroundStyle(LifeTheme.ink)
            }

            ForEach(Array(activeTodayTasks.prefix(3)), id: \.id) { task in
                HStack(alignment: .top, spacing: 12) {
                    Circle()
                        .fill(task.priority >= 3 ? LifeTheme.accent : LifeTheme.accentWarm)
                        .frame(width: 10, height: 10)
                        .padding(.top, 6)
                    VStack(alignment: .leading, spacing: 3) {
                        Text(task.title)
                            .font(.bodyRounded(17, weight: .semibold))
                            .foregroundStyle(LifeTheme.ink)
                        Text(task.detail)
                            .font(.bodyRounded(14))
                            .foregroundStyle(LifeTheme.muted)
                    }
                    Spacer()
                }
            }
        }
    }

    private var nutritionCard: some View {
        GlassCard {
            Text("Fuel and body")
                .font(.bodyRounded(22, weight: .semibold))

            HStack {
                if let weight = latestWeight {
                    StatPill(label: "Weight", value: String(format: "%.1f %@", weight.value, weight.unit))
                }
                if let meal = meals.first {
                    StatPill(label: "Calories", value: "\(meal.calories) kcal")
                }
            }
        }
    }

    private func noteCard(_ note: DailyNote) -> some View {
        GlassCard {
            Text("Daily note")
                .font(.bodyRounded(22, weight: .semibold))
            Text(note.body)
                .font(.bodyRounded(15))
                .foregroundStyle(LifeTheme.muted)
        }
    }

    private var activeTodayTasks: [TaskItem] {
        tasks.filter { !$0.completed && ($0.bucket == .today || Calendar.current.isDateInToday($0.dueDate ?? .distantPast)) }
    }

    private var latestWeight: BodyMetricEntry? {
        bodyEntries.first(where: { $0.metricType == .weight })
    }

    private var todayCompletedHabitCount: Int {
        min(2, habits.count)
    }
}

