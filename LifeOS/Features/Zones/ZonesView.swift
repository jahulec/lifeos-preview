import SwiftData
import SwiftUI

struct ZonesView: View {
    @Query(sort: \Goal.updatedAt, order: .reverse) private var goals: [Goal]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                SectionTitle(
                    eyebrow: "Areas",
                    title: "Zones",
                    subtitle: "Focused modules with one main progress target each."
                )

                ZoneTile(
                    title: "Fitness",
                    subtitle: "Training, body metrics, supplements and nutrition flow.",
                    progress: progress(for: .fitness, fallback: 0.75),
                    tint: LifeTheme.accent,
                    icon: "figure.strengthtraining.traditional"
                )

                ZoneTile(
                    title: "Habits",
                    subtitle: "Minimal version habits with streak logic and calm reminders.",
                    progress: progress(for: .habits, fallback: 0.67),
                    tint: LifeTheme.accentWarm,
                    icon: "checkmark.circle"
                )

                ZoneTile(
                    title: "Tasks",
                    subtitle: "Inbox, today and recurring execution without clutter.",
                    progress: progress(for: .tasks, fallback: 0.67),
                    tint: Color(red: 0.35, green: 0.42, blue: 0.38),
                    icon: "checklist"
                )

                ZoneTile(
                    title: "Finance",
                    subtitle: "Planned as phase two: cashflow, goals and expense quality scoring.",
                    progress: 0.15,
                    tint: Color(red: 0.27, green: 0.46, blue: 0.60),
                    icon: "creditcard"
                )

                ZoneTile(
                    title: "Guitar",
                    subtitle: "Planned as phase three: metronome, BPM progress and skill tracking.",
                    progress: 0.10,
                    tint: Color(red: 0.62, green: 0.42, blue: 0.28),
                    icon: "guitars"
                )
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
            .padding(.bottom, 32)
        }
        .scrollIndicators(.hidden)
        .navigationBarTitleDisplayMode(.inline)
    }

    private func progress(for domain: LifeDomain, fallback: Double) -> Double {
        goals.first(where: { $0.domain == domain })?.progress ?? fallback
    }
}
