import Foundation
import SwiftData

enum TaskBucket: String, Codable, CaseIterable, Identifiable {
    case inbox
    case today
    case upcoming
    case done

    var id: String { rawValue }
}

@Model
final class Habit {
    var id: UUID
    var title: String
    var detail: String
    var targetPerPeriod: Int
    var currentStreak: Int
    var minimalVersion: String
    var periodRaw: String
    var isArchived: Bool
    var createdAt: Date

    init(
        id: UUID = UUID(),
        title: String,
        detail: String,
        targetPerPeriod: Int,
        currentStreak: Int,
        minimalVersion: String,
        period: GoalPeriod,
        isArchived: Bool = false,
        createdAt: Date = .now
    ) {
        self.id = id
        self.title = title
        self.detail = detail
        self.targetPerPeriod = targetPerPeriod
        self.currentStreak = currentStreak
        self.minimalVersion = minimalVersion
        self.periodRaw = period.rawValue
        self.isArchived = isArchived
        self.createdAt = createdAt
    }

    var period: GoalPeriod { GoalPeriod(rawValue: periodRaw) ?? .daily }
}

@Model
final class HabitLog {
    var id: UUID
    var habitTitle: String
    var completedAt: Date
    var note: String

    init(id: UUID = UUID(), habitTitle: String, completedAt: Date, note: String = "") {
        self.id = id
        self.habitTitle = habitTitle
        self.completedAt = completedAt
        self.note = note
    }
}

@Model
final class TaskItem {
    var id: UUID
    var title: String
    var detail: String
    var bucketRaw: String
    var priority: Int
    var dueDate: Date?
    var recurringRule: String
    var relatedDomainRaw: String
    var completed: Bool
    var createdAt: Date

    init(
        id: UUID = UUID(),
        title: String,
        detail: String,
        bucket: TaskBucket,
        priority: Int,
        dueDate: Date? = nil,
        recurringRule: String = "",
        relatedDomain: LifeDomain = .tasks,
        completed: Bool = false,
        createdAt: Date = .now
    ) {
        self.id = id
        self.title = title
        self.detail = detail
        self.bucketRaw = bucket.rawValue
        self.priority = priority
        self.dueDate = dueDate
        self.recurringRule = recurringRule
        self.relatedDomainRaw = relatedDomain.rawValue
        self.completed = completed
        self.createdAt = createdAt
    }

    var bucket: TaskBucket { TaskBucket(rawValue: bucketRaw) ?? .inbox }
    var relatedDomain: LifeDomain { LifeDomain(rawValue: relatedDomainRaw) ?? .tasks }
}

