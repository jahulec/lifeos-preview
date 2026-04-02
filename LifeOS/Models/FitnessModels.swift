import Foundation
import SwiftData

enum BodyMetricType: String, Codable, CaseIterable, Identifiable {
    case weight
    case waist
    case sleep
    case bodyFat
    case bloodPressure

    var id: String { rawValue }
}

@Model
final class WorkoutPlan {
    var id: UUID
    var title: String
    var focus: String
    var weeklyTargetSessions: Int
    var active: Bool
    var createdAt: Date

    init(
        id: UUID = UUID(),
        title: String,
        focus: String,
        weeklyTargetSessions: Int,
        active: Bool = true,
        createdAt: Date = .now
    ) {
        self.id = id
        self.title = title
        self.focus = focus
        self.weeklyTargetSessions = weeklyTargetSessions
        self.active = active
        self.createdAt = createdAt
    }
}

@Model
final class WorkoutSession {
    var id: UUID
    var planTitle: String
    var title: String
    var startedAt: Date
    var durationMinutes: Int
    var restSeconds: Int
    var completed: Bool
    var effortScore: Double

    init(
        id: UUID = UUID(),
        planTitle: String,
        title: String,
        startedAt: Date,
        durationMinutes: Int,
        restSeconds: Int,
        completed: Bool,
        effortScore: Double
    ) {
        self.id = id
        self.planTitle = planTitle
        self.title = title
        self.startedAt = startedAt
        self.durationMinutes = durationMinutes
        self.restSeconds = restSeconds
        self.completed = completed
        self.effortScore = effortScore
    }
}

@Model
final class ExerciseTemplate {
    var id: UUID
    var workoutTitle: String
    var name: String
    var targetSets: Int
    var targetReps: String
    var targetWeight: Double

    init(
        id: UUID = UUID(),
        workoutTitle: String,
        name: String,
        targetSets: Int,
        targetReps: String,
        targetWeight: Double
    ) {
        self.id = id
        self.workoutTitle = workoutTitle
        self.name = name
        self.targetSets = targetSets
        self.targetReps = targetReps
        self.targetWeight = targetWeight
    }
}

@Model
final class ExerciseSetRecord {
    var id: UUID
    var exerciseName: String
    var reps: Int
    var weight: Double
    var completedAt: Date

    init(
        id: UUID = UUID(),
        exerciseName: String,
        reps: Int,
        weight: Double,
        completedAt: Date
    ) {
        self.id = id
        self.exerciseName = exerciseName
        self.reps = reps
        self.weight = weight
        self.completedAt = completedAt
    }
}

@Model
final class BodyMetricEntry {
    var id: UUID
    var metricTypeRaw: String
    var value: Double
    var unit: String
    var recordedAt: Date
    var note: String

    init(
        id: UUID = UUID(),
        metricType: BodyMetricType,
        value: Double,
        unit: String,
        recordedAt: Date,
        note: String = ""
    ) {
        self.id = id
        self.metricTypeRaw = metricType.rawValue
        self.value = value
        self.unit = unit
        self.recordedAt = recordedAt
        self.note = note
    }

    var metricType: BodyMetricType { BodyMetricType(rawValue: metricTypeRaw) ?? .weight }
}

@Model
final class NutritionLog {
    var id: UUID
    var title: String
    var calories: Int
    var protein: Int
    var carbs: Int
    var fats: Int
    var loggedAt: Date

    init(
        id: UUID = UUID(),
        title: String,
        calories: Int,
        protein: Int,
        carbs: Int,
        fats: Int,
        loggedAt: Date
    ) {
        self.id = id
        self.title = title
        self.calories = calories
        self.protein = protein
        self.carbs = carbs
        self.fats = fats
        self.loggedAt = loggedAt
    }
}

@Model
final class Supplement {
    var id: UUID
    var name: String
    var dosage: String
    var cadence: String
    var active: Bool

    init(id: UUID = UUID(), name: String, dosage: String, cadence: String, active: Bool = true) {
        self.id = id
        self.name = name
        self.dosage = dosage
        self.cadence = cadence
        self.active = active
    }
}

@Model
final class SupplementLog {
    var id: UUID
    var supplementName: String
    var takenAt: Date

    init(id: UUID = UUID(), supplementName: String, takenAt: Date) {
        self.id = id
        self.supplementName = supplementName
        self.takenAt = takenAt
    }
}
