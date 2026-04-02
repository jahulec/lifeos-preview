import SwiftUI

enum LifeTheme {
    static let accent = Color(red: 0.27, green: 0.56, blue: 0.47)
    static let accentWarm = Color(red: 0.86, green: 0.72, blue: 0.49)
    static let ink = Color(red: 0.10, green: 0.11, blue: 0.12)
    static let surface = Color.white.opacity(0.78)
    static let secondarySurface = Color.white.opacity(0.55)
    static let muted = Color(red: 0.42, green: 0.45, blue: 0.47)

    static let background = LinearGradient(
        colors: [
            Color(red: 0.96, green: 0.95, blue: 0.92),
            Color(red: 0.90, green: 0.93, blue: 0.92),
            Color(red: 0.84, green: 0.89, blue: 0.87)
        ],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
}

extension Font {
    static func display(_ size: CGFloat, weight: Weight = .semibold) -> Font {
        .system(size: size, weight: weight, design: .rounded)
    }

    static func bodyRounded(_ size: CGFloat = 16, weight: Weight = .regular) -> Font {
        .system(size: size, weight: weight, design: .rounded)
    }
}

