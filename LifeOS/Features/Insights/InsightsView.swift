import Charts
import SwiftData
import SwiftUI

struct InsightsView: View {
    @Query(sort: \BodyMetricEntry.recordedAt) private var bodyEntries: [BodyMetricEntry]
    @Query(sort: \WorkoutSession.startedAt) private var workoutSessions: [WorkoutSession]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                SectionTitle(
                    eyebrow: "Patterns",
                    title: "Insights",
                    subtitle: "Weekly and monthly trends without heavy spreadsheet energy."
                )

                GlassCard {
                    Text("Body trend")
                        .font(.bodyRounded(22, weight: .semibold))

                    Chart(weightSeries) { point in
                        LineMark(
                            x: .value("Date", point.date),
                            y: .value("Weight", point.value)
                        )
                        .foregroundStyle(LifeTheme.accent)
                        .lineStyle(StrokeStyle(lineWidth: 3, lineCap: .round))

                        AreaMark(
                            x: .value("Date", point.date),
                            y: .value("Weight", point.value)
                        )
                        .foregroundStyle(LifeTheme.accent.opacity(0.12))
                    }
                    .frame(height: 180)
                }

                GlassCard {
                    Text("Training output")
                        .font(.bodyRounded(22, weight: .semibold))

                    Chart(workoutSeries) { point in
                        BarMark(
                            x: .value("Session", point.label),
                            y: .value("Duration", point.duration)
                        )
                        .foregroundStyle(LifeTheme.accentWarm.gradient)
                    }
                    .frame(height: 180)
                }

                GlassCard {
                    Text("Review rhythm")
                        .font(.bodyRounded(22, weight: .semibold))
                    Text("Add a weekly and monthly reflection generator here next: what climbed, what slipped, and what deserves focus in the next cycle.")
                        .font(.bodyRounded(15))
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

    private var weightSeries: [WeightPoint] {
        let points = bodyEntries
            .filter { $0.metricType == .weight }
            .suffix(6)
            .map { WeightPoint(date: $0.recordedAt, value: $0.value) }

        if points.isEmpty {
            return [
                WeightPoint(date: Calendar.current.date(byAdding: .day, value: -5, to: .now) ?? .now, value: 81.2),
                WeightPoint(date: Calendar.current.date(byAdding: .day, value: -3, to: .now) ?? .now, value: 80.8),
                WeightPoint(date: .now, value: 80.4)
            ]
        }

        return Array(points)
    }

    private var workoutSeries: [WorkoutPoint] {
        let points = workoutSessions.suffix(4).map {
            WorkoutPoint(label: $0.title, duration: Double($0.durationMinutes))
        }

        if points.isEmpty {
            return [
                WorkoutPoint(label: "Upper A", duration: 68),
                WorkoutPoint(label: "Lower A", duration: 74)
            ]
        }

        return Array(points)
    }
}

private struct WeightPoint: Identifiable {
    let id = UUID()
    let date: Date
    let value: Double
}

private struct WorkoutPoint: Identifiable {
    let id = UUID()
    let label: String
    let duration: Double
}

