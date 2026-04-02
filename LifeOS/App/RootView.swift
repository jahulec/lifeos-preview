import SwiftUI

struct RootView: View {
    @Environment(AppState.self) private var appState
    @Environment(AppSecurityManager.self) private var securityManager

    var body: some View {
        ZStack {
            LifeTheme.background.ignoresSafeArea()

            TabView(selection: bindableSelection) {
                NavigationStack { TodayView() }
                    .tabItem { Label(RootTab.today.title, systemImage: RootTab.today.systemImage) }
                    .tag(RootTab.today)

                NavigationStack { ZonesView() }
                    .tabItem { Label(RootTab.zones.title, systemImage: RootTab.zones.systemImage) }
                    .tag(RootTab.zones)

                NavigationStack { CaptureView() }
                    .tabItem { Label(RootTab.capture.title, systemImage: RootTab.capture.systemImage) }
                    .tag(RootTab.capture)

                NavigationStack { InsightsView() }
                    .tabItem { Label(RootTab.insights.title, systemImage: RootTab.insights.systemImage) }
                    .tag(RootTab.insights)

                NavigationStack { MeView() }
                    .tabItem { Label(RootTab.me.title, systemImage: RootTab.me.systemImage) }
                    .tag(RootTab.me)
            }
            .tint(LifeTheme.accent)

            if appState.privacyShieldVisible || securityManager.locked {
                PrivacyShieldView()
            }
        }
    }

    private var bindableSelection: Binding<RootTab> {
        Binding(
            get: { appState.selectedTab },
            set: { appState.selectedTab = $0 }
        )
    }
}

