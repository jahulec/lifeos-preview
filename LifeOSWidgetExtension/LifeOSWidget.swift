import SwiftUI
import WidgetKit

struct LifeOSWidgetEntry: TimelineEntry {
    let date: Date
    let progress: Double
    let title: String
    let subtitle: String
}

struct LifeOSWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> LifeOSWidgetEntry {
        LifeOSWidgetEntry(date: .now, progress: 0.74, title: "Today", subtitle: "4 of 6 key actions done")
    }

    func getSnapshot(in context: Context, completion: @escaping (LifeOSWidgetEntry) -> Void) {
        completion(placeholder(in: context))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<LifeOSWidgetEntry>) -> Void) {
        let entry = LifeOSWidgetEntry(date: .now, progress: 0.74, title: "Today", subtitle: "4 of 6 key actions done")
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: .now) ?? .now
        completion(Timeline(entries: [entry], policy: .after(nextUpdate)))
    }
}

struct LifeOSWidgetView: View {
    var entry: LifeOSWidgetProvider.Entry

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(entry.title)
                .font(.system(size: 18, weight: .bold, design: .rounded))
            Text(entry.subtitle)
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundStyle(.secondary)

            GeometryReader { proxy in
                ZStack(alignment: .leading) {
                    Capsule().fill(Color.black.opacity(0.08))
                    Capsule()
                        .fill(
                            LinearGradient(
                                colors: [Color(red: 0.27, green: 0.56, blue: 0.47), Color(red: 0.86, green: 0.72, blue: 0.49)],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: max(proxy.size.width * entry.progress, 12))
                }
            }
            .frame(height: 12)

            Text("\(Int(entry.progress * 100))% complete")
                .font(.system(size: 13, weight: .semibold, design: .rounded))
        }
        .padding()
        .containerBackground(.fill.tertiary, for: .widget)
    }
}

struct LifeOSWidget: Widget {
    let kind = "LifeOSWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: LifeOSWidgetProvider()) { entry in
            LifeOSWidgetView(entry: entry)
        }
        .configurationDisplayName("Today Progress")
        .description("A calm snapshot of your current LifeOS day.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

@main
struct LifeOSWidgetBundle: WidgetBundle {
    var body: some Widget {
        LifeOSWidget()
    }
}
