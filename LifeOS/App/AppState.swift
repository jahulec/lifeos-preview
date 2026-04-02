import Foundation
import Observation

enum RootTab: String, CaseIterable, Identifiable {
    case today
    case zones
    case capture
    case insights
    case me

    var id: String { rawValue }

    var title: String {
        switch self {
        case .today: "Today"
        case .zones: "Zones"
        case .capture: "Capture"
        case .insights: "Insights"
        case .me: "Me"
        }
    }

    var systemImage: String {
        switch self {
        case .today: "sun.max"
        case .zones: "square.grid.2x2"
        case .capture: "plus.circle.fill"
        case .insights: "chart.xyaxis.line"
        case .me: "person.crop.circle"
        }
    }
}

@Observable
final class AppState {
    var selectedTab: RootTab = .today
    var privacyShieldVisible = false
}

