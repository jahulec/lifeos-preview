import Foundation
import SwiftData

enum SampleDataSeeder {
    static func seedIfNeeded(container: ModelContainer) async {
        let context = ModelContext(container)

        do {
            let existingGoals = try context.fetchCount(FetchDescriptor<Goal>())
            guard existingGoals == 0 else { return }

            insertGoals(in: context)
            insertSnapshots(in: context)
            insertHabits(in: context)
            insertTasks(in: context)
            insertFitness(in: context)
            insertCaptureActions(in: context)
            insertReminders(in: context)
            insertNotes(in: context)

            try context.save()
        } catch {
            assertionFailure("Failed to seed sample data: \(error.localizedDescription)")
        }
    }

    private static func insertGoals(in context: ModelContext) {
        context.insert(Goal(title: "Weekly training consistency", domain: .fitness, period: .weekly, unit: "sessions", targetValue: 4, currentValue: 3, accentHex: "#3C8E78"))
        context.insert(Goal(title: "Daily deep work flow", domain: .habits, period: .daily, unit: "blocks", targetValue: 3, currentValue: 2, accentHex: "#B48B54"))
        context.insert(Goal(title: "Today execution score", domain: .tasks, period: .daily, unit: "tasks", targetValue: 6, currentValue: 4, accentHex: "#556A5F"))
    }

    private static func insertSnapshots(in context: ModelContext) {
        context.insert(ProgressSnapshot(title: "Fitness week", domain: .fitness, currentValue: 3, targetValue: 4, percent: 0.75, trend: .rising, resetDate: Calendar.current.date(byAdding: .day, value: 3, to: .now) ?? .now))
        context.insert(ProgressSnapshot(title: "Habits today", domain: .habits, currentValue: 2, targetValue: 3, percent: 0.67, trend: .stable, resetDate: Calendar.current.startOfDay(for: Calendar.current.date(byAdding: .day, value: 1, to: .now) ?? .now)))
        context.insert(ProgressSnapshot(title: "Tasks today", domain: .tasks, currentValue: 4, targetValue: 6, percent: 0.67, trend: .rising, resetDate: Calendar.current.startOfDay(for: Calendar.current.date(byAdding: .day, value: 1, to: .now) ?? .now)))
    }

    private static func insertHabits(in context: ModelContext) {
        context.insert(Habit(title: "Morning mobility", detail: "8 minutes after water", targetPerPeriod: 1, currentStreak: 11, minimalVersion: "2 minute stretch", period: .daily))
        context.insert(Habit(title: "Deep work block", detail: "90 minutes without notifications", targetPerPeriod: 3, currentStreak: 5, minimalVersion: "25 minutes focus", period: .daily))
        context.insert(Habit(title: "Evening walk", detail: "At least 6k steps total", targetPerPeriod: 1, currentStreak: 7, minimalVersion: "10 minute reset", period: .daily))

        context.insert(HabitLog(habitTitle: "Morning mobility", completedAt: Calendar.current.date(byAdding: .hour, value: -8, to: .now) ?? .now))
        context.insert(HabitLog(habitTitle: "Deep work block", completedAt: Calendar.current.date(byAdding: .hour, value: -3, to: .now) ?? .now))
    }

    private static func insertTasks(in context: ModelContext) {
        context.insert(TaskItem(title: "Log body weight", detail: "Morning check-in before breakfast", bucket: .today, priority: 3, dueDate: .now, relatedDomain: .fitness))
        context.insert(TaskItem(title: "Finalize workout A", detail: "Bench, rows, split squat", bucket: .today, priority: 3, dueDate: Calendar.current.date(byAdding: .hour, value: 5, to: .now), relatedDomain: .fitness))
        context.insert(TaskItem(title: "Plan tomorrow priorities", detail: "Pick top 3 before 21:30", bucket: .today, priority: 2, dueDate: Calendar.current.date(byAdding: .hour, value: 11, to: .now), recurringRule: "daily", relatedDomain: .tasks))
        context.insert(TaskItem(title: "Buy omega-3", detail: "Refill before Sunday", bucket: .upcoming, priority: 1, dueDate: Calendar.current.date(byAdding: .day, value: 2, to: .now), relatedDomain: .fitness))
    }

    private static func insertFitness(in context: ModelContext) {
        context.insert(WorkoutPlan(title: "Upper / Lower Spring Block", focus: "Strength with lean bulk nutrition", weeklyTargetSessions: 4))
        context.insert(WorkoutSession(planTitle: "Upper / Lower Spring Block", title: "Upper A", startedAt: Calendar.current.date(byAdding: .hour, value: -20, to: .now) ?? .now, durationMinutes: 68, restSeconds: 90, completed: true, effortScore: 8.1))
        context.insert(WorkoutSession(planTitle: "Upper / Lower Spring Block", title: "Lower A", startedAt: Calendar.current.date(byAdding: .day, value: -2, to: .now) ?? .now, durationMinutes: 74, restSeconds: 120, completed: true, effortScore: 8.5))

        context.insert(ExerciseTemplate(workoutTitle: "Upper A", name: "Bench Press", targetSets: 4, targetReps: "6-8", targetWeight: 72.5))
        context.insert(ExerciseTemplate(workoutTitle: "Upper A", name: "Chest Supported Row", targetSets: 4, targetReps: "8-10", targetWeight: 36))
        context.insert(ExerciseTemplate(workoutTitle: "Lower A", name: "Split Squat", targetSets: 3, targetReps: "8 / leg", targetWeight: 22))

        context.insert(ExerciseSetRecord(exerciseName: "Bench Press", reps: 8, weight: 72.5, completedAt: Calendar.current.date(byAdding: .hour, value: -20, to: .now) ?? .now))
        context.insert(ExerciseSetRecord(exerciseName: "Bench Press", reps: 7, weight: 72.5, completedAt: Calendar.current.date(byAdding: .hour, value: -20, to: .now) ?? .now))
        context.insert(ExerciseSetRecord(exerciseName: "Chest Supported Row", reps: 10, weight: 36, completedAt: Calendar.current.date(byAdding: .hour, value: -20, to: .now) ?? .now))

        context.insert(BodyMetricEntry(metricType: .weight, value: 80.4, unit: "kg", recordedAt: Calendar.current.date(byAdding: .hour, value: -6, to: .now) ?? .now))
        context.insert(BodyMetricEntry(metricType: .waist, value: 81.0, unit: "cm", recordedAt: Calendar.current.date(byAdding: .day, value: -7, to: .now) ?? .now))

        context.insert(NutritionLog(title: "High protein breakfast", calories: 640, protein: 42, carbs: 51, fats: 24, loggedAt: Calendar.current.date(byAdding: .hour, value: -7, to: .now) ?? .now))
        context.insert(NutritionLog(title: "Post workout bowl", calories: 780, protein: 53, carbs: 84, fats: 19, loggedAt: Calendar.current.date(byAdding: .hour, value: -2, to: .now) ?? .now))

        context.insert(Supplement(name: "Creatine", dosage: "5 g", cadence: "daily"))
        context.insert(Supplement(name: "Omega-3", dosage: "2 softgels", cadence: "daily"))
        context.insert(SupplementLog(supplementName: "Creatine", takenAt: Calendar.current.date(byAdding: .hour, value: -7, to: .now) ?? .now))
    }

    private static func insertCaptureActions(in context: ModelContext) {
        context.insert(QuickCaptureAction(title: "Weight", kind: .bodyWeight, symbolName: "scalemass", targetTab: .capture, sortOrder: 0))
        context.insert(QuickCaptureAction(title: "Habit check", kind: .habit, symbolName: "checkmark.circle", targetTab: .capture, sortOrder: 1))
        context.insert(QuickCaptureAction(title: "Task", kind: .task, symbolName: "text.badge.plus", targetTab: .capture, sortOrder: 2))
        context.insert(QuickCaptureAction(title: "Workout set", kind: .workoutSet, symbolName: "figure.strengthtraining.traditional", targetTab: .capture, sortOrder: 3))
    }

    private static func insertReminders(in context: ModelContext) {
        context.insert(ReminderRule(title: "Morning body check", domain: .fitness, hour: 8, minute: 0, frequencyDescription: "daily", quietHoursStart: 22, quietHoursEnd: 7))
        context.insert(ReminderRule(title: "Top 3 tasks review", domain: .tasks, hour: 9, minute: 30, frequencyDescription: "weekdays", quietHoursStart: 22, quietHoursEnd: 7))
        context.insert(ReminderRule(title: "Wind-down walk", domain: .habits, hour: 20, minute: 0, frequencyDescription: "daily", quietHoursStart: 22, quietHoursEnd: 7))
    }

    private static func insertNotes(in context: ModelContext) {
        context.insert(DailyNote(title: "Today pulse", body: "Energy high after good sleep. Keep evening light and finish top three without adding noise."))
    }
}

