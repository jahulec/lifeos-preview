import SwiftUI

struct GlassCard<Content: View>: View {
    let alignment: HorizontalAlignment
    let content: Content

    init(alignment: HorizontalAlignment = .leading, @ViewBuilder content: () -> Content) {
        self.alignment = alignment
        self.content = content()
    }

    var body: some View {
        VStack(alignment: alignment, spacing: 14) {
            content
        }
        .padding(20)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background {
            RoundedRectangle(cornerRadius: 28, style: .continuous)
                .fill(LifeTheme.surface)
                .overlay(
                    RoundedRectangle(cornerRadius: 28, style: .continuous)
                        .stroke(Color.white.opacity(0.55), lineWidth: 1)
                )
        }
        .shadow(color: Color.black.opacity(0.06), radius: 18, y: 10)
    }
}

struct SectionTitle: View {
    let eyebrow: String
    let title: String
    let subtitle: String

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(eyebrow.uppercased())
                .font(.bodyRounded(11, weight: .semibold))
                .tracking(1.5)
                .foregroundStyle(LifeTheme.muted)
            Text(title)
                .font(.display(30, weight: .bold))
                .foregroundStyle(LifeTheme.ink)
            Text(subtitle)
                .font(.bodyRounded(15))
                .foregroundStyle(LifeTheme.muted)
        }
    }
}

struct ProgressBar: View {
    let value: Double
    let tint: Color

    var body: some View {
        GeometryReader { proxy in
            ZStack(alignment: .leading) {
                Capsule()
                    .fill(Color.white.opacity(0.7))
                Capsule()
                    .fill(
                        LinearGradient(
                            colors: [tint.opacity(0.8), tint, LifeTheme.accentWarm],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .frame(width: max(proxy.size.width * value, 12))
            }
        }
        .frame(height: 12)
    }
}

struct StatPill: View {
    let label: String
    let value: String

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label.uppercased())
                .font(.bodyRounded(10, weight: .semibold))
                .tracking(1.1)
                .foregroundStyle(LifeTheme.muted)
            Text(value)
                .font(.bodyRounded(16, weight: .semibold))
                .foregroundStyle(LifeTheme.ink)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 12)
        .background(
            Capsule(style: .continuous)
                .fill(LifeTheme.secondarySurface)
        )
    }
}

struct ZoneTile: View {
    let title: String
    let subtitle: String
    let progress: Double
    let tint: Color
    let icon: String

    var body: some View {
        GlassCard {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 8) {
                    Image(systemName: icon)
                        .font(.system(size: 24, weight: .semibold))
                        .foregroundStyle(tint)
                    Text(title)
                        .font(.bodyRounded(20, weight: .semibold))
                        .foregroundStyle(LifeTheme.ink)
                    Text(subtitle)
                        .font(.bodyRounded(14))
                        .foregroundStyle(LifeTheme.muted)
                }
                Spacer()
                Text("\(Int(progress * 100))%")
                    .font(.bodyRounded(20, weight: .bold))
                    .foregroundStyle(LifeTheme.ink)
            }

            ProgressBar(value: progress, tint: tint)
        }
    }
}

struct QuickActionButton: View {
    let title: String
    let systemImage: String
    let tint: Color

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: systemImage)
            Text(title)
        }
        .font(.bodyRounded(15, weight: .semibold))
        .foregroundStyle(.white)
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .frame(maxWidth: .infinity)
        .background(
            Capsule(style: .continuous)
                .fill(tint)
        )
    }
}

struct PrivacyShieldView: View {
    var body: some View {
        ZStack {
            Rectangle()
                .fill(.ultraThinMaterial)
                .ignoresSafeArea()

            GlassCard(alignment: .center) {
                Image(systemName: "faceid")
                    .font(.system(size: 34, weight: .regular))
                    .foregroundStyle(LifeTheme.accent)
                Text("LifeOS secured")
                    .font(.display(24, weight: .bold))
                Text("Private health and planning data stay hidden when the app is not active.")
                    .multilineTextAlignment(.center)
                    .font(.bodyRounded(15))
                    .foregroundStyle(LifeTheme.muted)
            }
            .padding(32)
        }
        .transition(.opacity)
    }
}
