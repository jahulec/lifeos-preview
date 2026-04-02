import SwiftData
import SwiftUI

struct MeView: View {
    @Query(sort: \Supplement.name) private var supplements: [Supplement]
    @Query(sort: \ReminderRule.hour) private var reminders: [ReminderRule]
    @StateObject private var healthService = HealthKitService()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                SectionTitle(
                    eyebrow: "Profile",
                    title: "Me",
                    subtitle: "Preferences, health context, privacy and system utilities."
                )

                GlassCard {
                    Text("Profile baseline")
                        .font(.bodyRounded(22, weight: .semibold))
                    HStack {
                        StatPill(label: "Units", value: "Metric")
                        StatPill(label: "Mode", value: "Local-first")
                        StatPill(label: "Device", value: "iPhone")
                    }
                }

                GlassCard {
                    Text("Supplements")
                        .font(.bodyRounded(22, weight: .semibold))

                    ForEach(supplements, id: \.id) { supplement in
                        HStack {
                            VStack(alignment: .leading, spacing: 3) {
                                Text(supplement.name)
                                    .font(.bodyRounded(17, weight: .semibold))
                                Text("\(supplement.dosage) • \(supplement.cadence)")
                                    .font(.bodyRounded(14))
                                    .foregroundStyle(LifeTheme.muted)
                            }
                            Spacer()
                            Image(systemName: supplement.active ? "checkmark.circle.fill" : "circle")
                                .foregroundStyle(LifeTheme.accent)
                        }
                    }
                }

                GlassCard {
                    Text("Reminders")
                        .font(.bodyRounded(22, weight: .semibold))

                    ForEach(reminders, id: \.id) { reminder in
                        HStack {
                            VStack(alignment: .leading, spacing: 3) {
                                Text(reminder.title)
                                    .font(.bodyRounded(17, weight: .semibold))
                                Text(String(format: "%02d:%02d • %@", reminder.hour, reminder.minute, reminder.frequencyDescription))
                                    .font(.bodyRounded(14))
                                    .foregroundStyle(LifeTheme.muted)
                            }
                            Spacer()
                            Text(reminder.enabled ? "On" : "Off")
                                .font(.bodyRounded(14, weight: .semibold))
                                .foregroundStyle(reminder.enabled ? LifeTheme.accent : LifeTheme.muted)
                        }
                    }
                }

                GlassCard {
                    Text("Privacy and integrations")
                        .font(.bodyRounded(22, weight: .semibold))

                    VStack(alignment: .leading, spacing: 12) {
                        Button("Request HealthKit access") {
                            Task {
                                await healthService.requestAuthorization()
                            }
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(LifeTheme.accent)

                        Label("Biometric lock planned for health and finance views", systemImage: "faceid")
                        Label("Export/import reserved for explicit user action only", systemImage: "square.and.arrow.up")
                        Label("Sensitive content hidden when app leaves active state", systemImage: "eye.slash")
                    }
                    .font(.bodyRounded(15))
                    .foregroundStyle(LifeTheme.ink)
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
            .padding(.bottom, 32)
        }
        .scrollIndicators(.hidden)
        .navigationBarTitleDisplayMode(.inline)
    }
}
