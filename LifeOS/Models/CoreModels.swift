import Foundation
import SwiftData

enum LifeDomain: String, Codable, CaseIterable, Identifiable {
    case fitness
    case habits
    case tasks
    case finance
    case guitar
    case lifestyle

    var id: String { rawValue }
}

enum GoalPeriod: String, Codable, CaseIterable, Identifiable {
    case daily
    case weekly
    case monthly

    var id: String { rawValue }
}

enum ProgressTrend: String, Codable, CaseIterable, Identifiable {
    case rising
    case stable
    case falling

    var id: String { rawValue }
}

enum QuickCaptureKind: String, Codable, CaseIterable, Identifiable {
    case bodyWeight
    case habit
    case task
    case workoutSet
    case meal
    case supplement

    var id: String { rawValue }
}

@Model
final class Goal {
    var id: UUID
    var title: String
    var domainRaw: String
    var periodRaw: String
    var unit: String
    var targetValue: Double
    var currentValue: Double
    var accentHex: String
    var createdAt: Date
    var updatedAt: Date

    init(
        id: UUID = UUID(),
        title: String,
        domain: LifeDomain,
        period: GoalPeriod,
        unit: String,
        targetValue: Double,
        currentValue: Double,
        accentHex: String,
        createdAt: Date = .now,
        updatedAt: Date = .now
    ) {
        self.id = id
        self.title = title
        self.domainRaw = domain.rawValue
        self.periodRaw = period.rawValue
        self.unit = unit
        self.targetValue = targetValue
        self.currentValue = currentValue
        self.accentHex = accentHex
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }

    var domain: LifeDomain { LifeDomain(rawValue: domainRaw) ?? .lifestyle }
    var period: GoalPeriod { GoalPeriod(rawValue: periodRaw) ?? .weekly }
    var progress: Double {
        guard targetValue > 0 else { return 0 }
        return min(max(currentValue / targetValue, 0), 1)
    }
}

@Model
final class ProgressSnapshot {
    var id: UUID
    var title: String
    var domainRaw: String
    var currentValue: Double
    var targetValue: Double
    var percent: Double
    var trendRaw: String
    var resetDate: Date
    var createdAt: Date

    init(
        id: UUID = UUID(),
        title: String,
        domain: LifeDomain,
        currentValue: Double,
        targetValue: Double,
        percent: Double,
        trend: ProgressTrend,
        resetDate: Date,
        createdAt: Date = .now
    ) {
        self.id = id
        self.title = title
        self.domainRaw = domain.rawValue
        self.currentValue = currentValue
        self.targetValue = targetValue
        self.percent = percent
        self.trendRaw = trend.rawValue
        self.resetDate = resetDate
        self.createdAt = createdAt
    }

    var domain: LifeDomain { LifeDomain(rawValue: domainRaw) ?? .lifestyle }
    var trend: ProgressTrend { ProgressTrend(rawValue: trendRaw) ?? .stable }
}

@Model
final class ReminderRule {
    var id: UUID
    var title: String
    var domainRaw: String
    var hour: Int
    var minute: Int
    var frequencyDescription: String
    var quietHoursStart: Int
    var quietHoursEnd: Int
    var enabled: Bool

    init(
        id: UUID = UUID(),
        title: String,
        domain: LifeDomain,
        hour: Int,
        minute: Int,
        frequencyDescription: String,
        quietHoursStart: Int,
        quietHoursEnd: Int,
        enabled: Bool = true
    ) {
        self.id = id
        self.title = title
        self.domainRaw = domain.rawValue
        self.hour = hour
        self.minute = minute
        self.frequencyDescription = frequencyDescription
        self.quietHoursStart = quietHoursStart
        self.quietHoursEnd = quietHoursEnd
        self.enabled = enabled
    }
}

@Model
final class QuickCaptureAction {
    var id: UUID
    var title: String
    var kindRaw: String
    var symbolName: String
    var targetTabRaw: String
    var sortOrder: Int

    init(
        id: UUID = UUID(),
        title: String,
        kind: QuickCaptureKind,
        symbolName: String,
        targetTab: RootTab,
        sortOrder: Int
    ) {
        self.id = id
        self.title = title
        self.kindRaw = kind.rawValue
        self.symbolName = symbolName
        self.targetTabRaw = targetTab.rawValue
        self.sortOrder = sortOrder
    }

    var kind: QuickCaptureKind { QuickCaptureKind(rawValue: kindRaw) ?? .task }
    var targetTab: RootTab { RootTab(rawValue: targetTabRaw) ?? .capture }
}

@Model
final class DailyNote {
    var id: UUID
    var title: String
    var body: String
    var createdAt: Date

    init(id: UUID = UUID(), title: String, body: String, createdAt: Date = .now) {
        self.id = id
        self.title = title
        self.body = body
        self.createdAt = createdAt
    }
}

