const STORAGE_KEY = "lifeos-preview-state-v5";
const LEGACY_KEYS = ["lifeos-preview-state-v4", "lifeos-preview-state-v3"];
const PAPER_TRADING_PUBLIC_API_KEY = "d7bqnapr01qom0rbtekgd7bqnapr01qom0rbtel0";
const MARKET_SIM_API_URLS = ["http://127.0.0.1:8765", "http://127.0.0.1:8766"];
const PAPER_TRADING_INITIAL_CASH = 100000;
const PAPER_WATCHLIST_LIMIT = 48;
const PAPER_MARKET_TIME_ZONE = "America/New_York";
const PAPER_DEFAULT_SETTINGS = {
  commission: 1,
  spreadBps: 6,
  slippageBps: 4,
  allowAfterHours: false
};
const AGENT_REWARD_PRESETS = {
  balanced: {
    label: "Zbalansowany",
    return_weight: 1,
    drawdown_weight: 0.35,
    volatility_weight: 0.05,
    cost_weight: 1
  },
  growth: {
    label: "Agresywny wzrost",
    return_weight: 1.4,
    drawdown_weight: 0.18,
    volatility_weight: 0.03,
    cost_weight: 0.8
  },
  lowDrawdown: {
    label: "Niski drawdown",
    return_weight: 1,
    drawdown_weight: 0.9,
    volatility_weight: 0.14,
    cost_weight: 1.1
  },
  costAware: {
    label: "Minimalizacja kosztow",
    return_weight: 1,
    drawdown_weight: 0.35,
    volatility_weight: 0.05,
    cost_weight: 2.2
  },
  benchmark: {
    label: "Benchmark buy-and-hold",
    return_weight: 1,
    drawdown_weight: 0,
    volatility_weight: 0,
    cost_weight: 0
  }
};

function isoDaysAgo(days, hour = 9) {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function weekKey(date = new Date()) {
  const target = new Date(date);
  const day = (target.getDay() + 6) % 7;
  target.setDate(target.getDate() - day);
  target.setHours(0, 0, 0, 0);
  return `${target.getFullYear()}-${target.getMonth() + 1}-${target.getDate()}`;
}

function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

const defaultState = {
  activeTab: "home",
  meta: {
    lastDailyReset: todayKey(),
    lastWeeklyReset: weekKey()
  },
  note: "Panel ma byc szybki. Zostaw tylko rzeczy, ktore faktycznie pomagaja w dniu.",
  habits: [
    { id: "habit-1", title: "Morning mobility", detail: "2 min minimum", done: true },
    { id: "habit-2", title: "Deep work", detail: "90 min bez rozproszen", done: false },
    { id: "habit-3", title: "Evening walk", detail: "10 min minimum", done: false }
  ],
  tasks: [
    { id: "task-1", title: "Zaloguj wage", detail: "rano", done: true, priority: "high" },
    { id: "task-2", title: "Upper A", detail: "bench, row, split squat", done: false, priority: "high" },
    { id: "task-3", title: "Plan na jutro", detail: "top 3 przed 21:30", done: false, priority: "medium" }
  ],
  workouts: [
    { id: "workout-1", title: "Upper A", duration: 68, focus: "strength", createdAt: isoDaysAgo(3, 18) },
    { id: "workout-2", title: "Lower A", duration: 74, focus: "legs", createdAt: isoDaysAgo(1, 18) },
    { id: "workout-3", title: "Push", duration: 55, focus: "chest", createdAt: isoDaysAgo(0, 12) }
  ],
  workoutTemplates: [
    { id: "tpl-1", title: "Upper A", focus: "strength", rest: 90, exercises: ["Bench Press", "Chest Row", "Overhead Press"] },
    { id: "tpl-2", title: "Lower A", focus: "legs", rest: 120, exercises: ["Split Squat", "RDL", "Leg Curl"] },
    { id: "tpl-3", title: "Pull", focus: "back", rest: 75, exercises: ["Pull-up", "Row", "Curl"] }
  ],
  exerciseSets: [
    { id: "set-1", exercise: "Bench Press", reps: 8, weight: 72.5, rest: 90, createdAt: isoDaysAgo(0, 12) },
    { id: "set-2", exercise: "Bench Press", reps: 7, weight: 72.5, rest: 90, createdAt: isoDaysAgo(0, 12) },
    { id: "set-3", exercise: "Chest Row", reps: 10, weight: 36, rest: 75, createdAt: isoDaysAgo(0, 12) }
  ],
  meals: [
    { id: "meal-1", title: "High protein breakfast", calories: 640, protein: 42, carbs: 51, fats: 24, createdAt: isoDaysAgo(0, 8) },
    { id: "meal-2", title: "Post workout bowl", calories: 780, protein: 53, carbs: 84, fats: 19, createdAt: isoDaysAgo(0, 15) }
  ],
  financeEntries: [
    { id: "fin-1", type: "income", title: "Projekt", amount: 3200, category: "Praca", createdAt: isoDaysAgo(6, 11) },
    { id: "fin-2", type: "expense", title: "Silownia", amount: 169, category: "Zdrowie", createdAt: isoDaysAgo(4, 10) },
    { id: "fin-3", type: "expense", title: "Zakupy", amount: 240, category: "Jedzenie", createdAt: isoDaysAgo(1, 19) },
    { id: "fin-4", type: "income", title: "Zlecenie", amount: 780, category: "Praca", createdAt: isoDaysAgo(0, 14) }
  ],
  plannedExpenses: [
    { id: "plan-1", title: "Sluchawki", amount: 499, dueLabel: "ten tydzien" },
    { id: "plan-2", title: "Kurs", amount: 299, dueLabel: "ten miesiac" }
  ],
  evaluator: {
    score: null,
    label: "-",
    costPerUse: null
  },
  paperTrading: {
    provider: "finnhub",
    apiKey: "",
    initialCash: PAPER_TRADING_INITIAL_CASH,
    cash: PAPER_TRADING_INITIAL_CASH,
    settings: cloneState(PAPER_DEFAULT_SETTINGS),
    watchlist: ["AAPL", "MSFT", "NVDA", "SPY", "QQQ", "CDR", "PKN", "PKO", "PZU", "ALE", "KGH", "XTB", "GLD", "SLV", "USO", "GOLD"],
    selectedSymbol: "AAPL",
    quotes: {},
    chart: { symbol: "AAPL", points: [], updatedAt: null },
    positions: [],
    orders: [],
    equityHistory: [],
    autoRefresh: false,
    lastSyncAt: null,
    error: ""
  },
  weightHistory: [
    { id: "weight-1", value: 81.2, createdAt: isoDaysAgo(5, 8) },
    { id: "weight-2", value: 80.9, createdAt: isoDaysAgo(4, 8) },
    { id: "weight-3", value: 80.8, createdAt: isoDaysAgo(3, 8) },
    { id: "weight-4", value: 80.6, createdAt: isoDaysAgo(2, 8) },
    { id: "weight-5", value: 80.5, createdAt: isoDaysAgo(1, 8) },
    { id: "weight-6", value: 80.4, createdAt: isoDaysAgo(0, 8) }
  ],
  guitarExercises: [
    { id: "gex-1", title: "Alternate picking", targetBpm: 120, practiceMinutes: 12 },
    { id: "gex-2", title: "Spider 1234", targetBpm: 110, practiceMinutes: 10 },
    { id: "gex-3", title: "Pentatonic sequence", targetBpm: 140, practiceMinutes: 15 }
  ],
  guitarSessions: [
    { id: "gs-1", exerciseId: "gex-1", exerciseTitle: "Alternate picking", bpm: 92, durationSec: 480, createdAt: isoDaysAgo(2, 20) },
    { id: "gs-2", exerciseId: "gex-2", exerciseTitle: "Spider 1234", bpm: 88, durationSec: 420, createdAt: isoDaysAgo(1, 20) },
    { id: "gs-3", exerciseId: "gex-3", exerciseTitle: "Pentatonic sequence", bpm: 104, durationSec: 540, createdAt: isoDaysAgo(0, 21) }
  ],
  guitarActiveId: "gex-1",
  guitarInspectId: "gex-1",
  earRounds: [
    {
      id: "er-1",
      type: "intervals",
      startedAt: isoDaysAgo(3, 19),
      endedAt: isoDaysAgo(3, 19),
      accuracy: 80,
      correct: 4,
      totalQuestions: 5,
      averageResponseTimeMs: 1650,
      config: { type: "intervals", level: "core", questionCount: 5, selectedItems: ["m2", "M2", "m3", "M3", "P4", "P5"], playbackMode: "both", headphoneMode: true, soundProfile: "piano", selectedRoots: [], register: "mid", direction: "both", scaleStartDegree: "1", selectedInversions: ["root"], presetId: "guitar-core" },
      answers: [
        { questionId: "q-1", correctAnswer: "m3", selectedAnswer: "m3", isCorrect: true, responseTimeMs: 1200 },
        { questionId: "q-2", correctAnswer: "P4", selectedAnswer: "P4", isCorrect: true, responseTimeMs: 1880 },
        { questionId: "q-3", correctAnswer: "M2", selectedAnswer: "m2", isCorrect: false, responseTimeMs: 2050 },
        { questionId: "q-4", correctAnswer: "P5", selectedAnswer: "P5", isCorrect: true, responseTimeMs: 1410 },
        { questionId: "q-5", correctAnswer: "M3", selectedAnswer: "M3", isCorrect: true, responseTimeMs: 1710 }
      ]
    },
    {
      id: "er-2",
      type: "rhythm",
      startedAt: isoDaysAgo(2, 18),
      endedAt: isoDaysAgo(2, 18),
      accuracy: 60,
      correct: 3,
      totalQuestions: 5,
      averageResponseTimeMs: 2140,
      config: { type: "rhythm", level: "core", questionCount: 5, selectedItems: ["Prosto", "Synkopa", "Triola", "Pauza"], playbackMode: "click", headphoneMode: true, soundProfile: "tone", selectedRoots: [], register: "mid", direction: "both", scaleStartDegree: "1", selectedInversions: ["root"], presetId: "pulse" },
      answers: [
        { questionId: "q-1", correctAnswer: "Prosto", selectedAnswer: "Prosto", isCorrect: true, responseTimeMs: 1430 },
        { questionId: "q-2", correctAnswer: "Synkopa", selectedAnswer: "Pauza", isCorrect: false, responseTimeMs: 2490 },
        { questionId: "q-3", correctAnswer: "Triola", selectedAnswer: "Triola", isCorrect: true, responseTimeMs: 2200 },
        { questionId: "q-4", correctAnswer: "Pauza", selectedAnswer: "Pauza", isCorrect: true, responseTimeMs: 1940 },
        { questionId: "q-5", correctAnswer: "Synkopa", selectedAnswer: "Prosto", isCorrect: false, responseTimeMs: 2640 }
      ]
    },
    {
      id: "er-3",
      type: "chords",
      startedAt: isoDaysAgo(1, 21),
      endedAt: isoDaysAgo(1, 21),
      accuracy: 70,
      correct: 7,
      totalQuestions: 10,
      averageResponseTimeMs: 1860,
      config: { type: "chords", level: "core", questionCount: 10, selectedItems: ["Major", "Minor", "Dom7", "Maj7"], playbackMode: "stack", headphoneMode: true, soundProfile: "piano", selectedRoots: [], register: "mid", direction: "both", scaleStartDegree: "1", selectedInversions: ["root", "1st", "2nd"], presetId: "triads" },
      answers: [
        { questionId: "q-1", correctAnswer: "Major", selectedAnswer: "Major", isCorrect: true, responseTimeMs: 1410 },
        { questionId: "q-2", correctAnswer: "Minor", selectedAnswer: "Minor", isCorrect: true, responseTimeMs: 1510 },
        { questionId: "q-3", correctAnswer: "Maj7", selectedAnswer: "Dom7", isCorrect: false, responseTimeMs: 2010 },
        { questionId: "q-4", correctAnswer: "Dom7", selectedAnswer: "Dom7", isCorrect: true, responseTimeMs: 1820 },
        { questionId: "q-5", correctAnswer: "Major", selectedAnswer: "Major", isCorrect: true, responseTimeMs: 1660 },
        { questionId: "q-6", correctAnswer: "Minor", selectedAnswer: "Major", isCorrect: false, responseTimeMs: 2230 },
        { questionId: "q-7", correctAnswer: "Dom7", selectedAnswer: "Dom7", isCorrect: true, responseTimeMs: 1740 },
        { questionId: "q-8", correctAnswer: "Maj7", selectedAnswer: "Maj7", isCorrect: true, responseTimeMs: 1690 },
        { questionId: "q-9", correctAnswer: "Minor", selectedAnswer: "Minor", isCorrect: true, responseTimeMs: 1910 },
        { questionId: "q-10", correctAnswer: "Major", selectedAnswer: "Minor", isCorrect: false, responseTimeMs: 2620 }
      ]
    },
    {
      id: "er-4",
      type: "progressions",
      startedAt: isoDaysAgo(0, 20),
      endedAt: isoDaysAgo(0, 20),
      accuracy: 80,
      correct: 4,
      totalQuestions: 5,
      averageResponseTimeMs: 2310,
      config: { type: "progressions", level: "core", questionCount: 5, selectedItems: ["ii-V-I", "I-IV-V-I", "I-V-vi-IV", "vi-IV-I-V"], playbackMode: "block", headphoneMode: true, soundProfile: "piano", selectedRoots: [], register: "mid", direction: "both", scaleStartDegree: "1", selectedInversions: ["root", "1st"], presetId: "cadences" },
      answers: [
        { questionId: "q-1", correctAnswer: "ii-V-I", selectedAnswer: "ii-V-I", isCorrect: true, responseTimeMs: 1820 },
        { questionId: "q-2", correctAnswer: "I-V-vi-IV", selectedAnswer: "vi-IV-I-V", isCorrect: false, responseTimeMs: 2780 },
        { questionId: "q-3", correctAnswer: "I-IV-V-I", selectedAnswer: "I-IV-V-I", isCorrect: true, responseTimeMs: 2140 },
        { questionId: "q-4", correctAnswer: "vi-IV-I-V", selectedAnswer: "vi-IV-I-V", isCorrect: true, responseTimeMs: 2230 },
        { questionId: "q-5", correctAnswer: "ii-V-I", selectedAnswer: "ii-V-I", isCorrect: true, responseTimeMs: 2580 }
      ]
    }
  ],
  earLastConfigs: {
    intervals: { type: "intervals", level: "core", questionCount: 10, selectedItems: ["m2", "M2", "m3", "M3", "P4", "TT", "P5"], playbackMode: "both", headphoneMode: true, soundProfile: "cleanGuitar", selectedRoots: ["E", "A", "D", "G", "B"], register: "mid", direction: "both", scaleStartDegree: "1", selectedInversions: ["root"], presetId: "guitar-core" },
    chords: { type: "chords", level: "core", questionCount: 10, selectedItems: ["Major", "Minor", "Dim", "Aug", "Dom7", "Maj7", "Min7"], playbackMode: "stack", headphoneMode: true, soundProfile: "piano", selectedRoots: [], register: "mid", direction: "both", scaleStartDegree: "1", selectedInversions: ["root", "1st", "2nd"], presetId: "triads" },
    progressions: { type: "progressions", level: "core", questionCount: 10, selectedItems: ["ii-V-I", "I-IV-V-I", "I-V-vi-IV", "vi-IV-I-V"], playbackMode: "block", headphoneMode: true, soundProfile: "keysPad", selectedRoots: [], register: "mid", direction: "both", scaleStartDegree: "1", selectedInversions: ["root", "1st"], presetId: "cadences" },
    scales: { type: "scales", level: "core", questionCount: 10, selectedItems: ["Major", "Natural minor", "Dorian", "Mixolydian"], playbackMode: "phrase", headphoneMode: true, soundProfile: "piano", selectedRoots: [], register: "mid", direction: "both", scaleStartDegree: "1", selectedInversions: ["root"], presetId: "major-minor" },
    rhythm: { type: "rhythm", level: "core", questionCount: 10, selectedItems: ["Prosto", "Synkopa", "Triola", "Pauza", "Offbeat"], playbackMode: "click", headphoneMode: true, soundProfile: "tone", selectedRoots: [], register: "mid", direction: "both", scaleStartDegree: "1", selectedInversions: ["root"], presetId: "pulse" },
    melody: { type: "melody", level: "focus", questionCount: 5, selectedItems: ["1-2-3", "1-b3-4", "1-4-5", "5-4-2"], playbackMode: "degrees", headphoneMode: true, soundProfile: "piano", selectedRoots: [], register: "mid", direction: "up", scaleStartDegree: "1", selectedInversions: ["root"], presetId: "three-note" },
    pitch: { type: "pitch", level: "core", questionCount: 10, selectedItems: ["C", "D", "E", "F", "G", "A", "B"], playbackMode: "single", headphoneMode: true, soundProfile: "piano", selectedRoots: [], register: "mid", direction: "both", scaleStartDegree: "1", selectedInversions: ["root"], presetId: "natural" }
  },
  earInspectType: "intervals",
  supplements: [
    { name: "Creatine", dosage: "5 g" },
    { name: "Omega-3", dosage: "2 caps" },
    { name: "Magnesium", dosage: "evening" }
  ]
};

let MARKET_UNIVERSE = [
  { symbol: "AAPL", name: "Apple", category: "USA", exchange: "NASDAQ", currency: "USD", assetClass: "stock" },
  { symbol: "MSFT", name: "Microsoft", category: "USA", exchange: "NASDAQ", currency: "USD", assetClass: "stock" },
  { symbol: "NVDA", name: "NVIDIA", category: "USA", exchange: "NASDAQ", currency: "USD", assetClass: "stock" },
  { symbol: "AMZN", name: "Amazon", category: "USA", exchange: "NASDAQ", currency: "USD", assetClass: "stock" },
  { symbol: "GOOGL", name: "Alphabet", category: "USA", exchange: "NASDAQ", currency: "USD", assetClass: "stock" },
  { symbol: "META", name: "Meta Platforms", category: "USA", exchange: "NASDAQ", currency: "USD", assetClass: "stock" },
  { symbol: "TSLA", name: "Tesla", category: "USA", exchange: "NASDAQ", currency: "USD", assetClass: "stock" },
  { symbol: "AMD", name: "AMD", category: "USA", exchange: "NASDAQ", currency: "USD", assetClass: "stock" },
  { symbol: "PLTR", name: "Palantir", category: "USA", exchange: "NYSE", currency: "USD", assetClass: "stock" },
  { symbol: "JPM", name: "JPMorgan Chase", category: "USA", exchange: "NYSE", currency: "USD", assetClass: "stock" },
  { symbol: "BAC", name: "Bank of America", category: "USA", exchange: "NYSE", currency: "USD", assetClass: "stock" },
  { symbol: "BRK.B", name: "Berkshire Hathaway", category: "USA", exchange: "NYSE", currency: "USD", assetClass: "stock" },
  { symbol: "NFLX", name: "Netflix", category: "USA", exchange: "NASDAQ", currency: "USD", assetClass: "stock" },
  { symbol: "KO", name: "Coca-Cola", category: "USA", exchange: "NYSE", currency: "USD", assetClass: "stock" },
  { symbol: "SHOP", name: "Shopify", category: "USA", exchange: "NYSE", currency: "USD", assetClass: "stock" },
  { symbol: "UBER", name: "Uber", category: "USA", exchange: "NYSE", currency: "USD", assetClass: "stock" },
  { symbol: "CRM", name: "Salesforce", category: "USA", exchange: "NYSE", currency: "USD", assetClass: "stock" },
  { symbol: "INTC", name: "Intel", category: "USA", exchange: "NASDAQ", currency: "USD", assetClass: "stock" },
  { symbol: "DIS", name: "Disney", category: "USA", exchange: "NYSE", currency: "USD", assetClass: "stock" },
  { symbol: "SPY", name: "SPDR S&P 500 ETF", category: "ETF", exchange: "NYSE Arca", currency: "USD", assetClass: "etf" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", category: "ETF", exchange: "NASDAQ", currency: "USD", assetClass: "etf" },
  { symbol: "IWM", name: "iShares Russell 2000 ETF", category: "ETF", exchange: "NYSE Arca", currency: "USD", assetClass: "etf" },
  { symbol: "VTI", name: "Vanguard Total Stock Market ETF", category: "ETF", exchange: "NYSE Arca", currency: "USD", assetClass: "etf" },
  { symbol: "EFA", name: "iShares MSCI EAFE ETF", category: "ETF", exchange: "NYSE Arca", currency: "USD", assetClass: "etf" },
  { symbol: "CDR", name: "CD Projekt", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "PKN", name: "Orlen", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "PKO", name: "PKO Bank Polski", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "PZU", name: "PZU", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "ALE", name: "Allegro", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "DNP", name: "Dino Polska", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "LPP", name: "LPP", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "KGH", name: "KGHM", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "PEO", name: "Bank Pekao", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "MBK", name: "mBank", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "CCC", name: "CCC", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "SPL", name: "Santander Bank Polska", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "XTB", name: "XTB", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "JSW", name: "JSW", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "OPL", name: "Orange Polska", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "ACP", name: "Asseco Poland", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "BDX", name: "Budimex", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "BFT", name: "Benefit Systems", category: "GPW", exchange: "GPW", currency: "PLN", assetClass: "stock" },
  { symbol: "WIG20", name: "WIG20", category: "Indeksy", exchange: "GPW", currency: "PLN", assetClass: "index" },
  { symbol: "SPX", name: "S&P 500", category: "Indeksy", exchange: "CBOE", currency: "USD", assetClass: "index" },
  { symbol: "NDX", name: "Nasdaq 100", category: "Indeksy", exchange: "NASDAQ", currency: "USD", assetClass: "index" },
  { symbol: "DAX", name: "DAX", category: "Indeksy", exchange: "XETRA", currency: "EUR", assetClass: "index" },
  { symbol: "GLD", name: "Gold ETF", category: "Surowce", exchange: "NYSE Arca", currency: "USD", assetClass: "commodity_proxy" },
  { symbol: "SLV", name: "Silver ETF", category: "Surowce", exchange: "NYSE Arca", currency: "USD", assetClass: "commodity_proxy" },
  { symbol: "USO", name: "United States Oil Fund", category: "Surowce", exchange: "NYSE Arca", currency: "USD", assetClass: "commodity_proxy" },
  { symbol: "UNG", name: "United States Natural Gas Fund", category: "Surowce", exchange: "NYSE Arca", currency: "USD", assetClass: "commodity_proxy" },
  { symbol: "GOLD", name: "Gold futures", category: "Surowce", exchange: "COMEX", currency: "USD", assetClass: "commodity" },
  { symbol: "SILVER", name: "Silver futures", category: "Surowce", exchange: "COMEX", currency: "USD", assetClass: "commodity" },
  { symbol: "OIL", name: "WTI crude oil futures", category: "Surowce", exchange: "NYMEX", currency: "USD", assetClass: "commodity" },
  { symbol: "NATGAS", name: "Natural gas futures", category: "Surowce", exchange: "NYMEX", currency: "USD", assetClass: "commodity" },
  { symbol: "COPPER", name: "Copper futures", category: "Surowce", exchange: "COMEX", currency: "USD", assetClass: "commodity" }
];

function cloneState(value) {
  return JSON.parse(JSON.stringify(value));
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatZl(value) {
  return `${Math.round(Number(value || 0))} zl`;
}

function minutesFromSeconds(value) {
  return `${Math.max(1, Math.round(Number(value || 0) / 60))} min`;
}

function formatDuration(value) {
  const totalSec = Math.max(0, Math.floor(Number(value || 0)));
  if (totalSec < 60) return `${totalSec} s`;
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  if (!seconds) return `${minutes} min`;
  return `${minutes} min ${seconds} s`;
}

function priorityLabel(priority) {
  return { high: "Wysoki", medium: "Sredni", low: "Niski" }[priority] || "Sredni";
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function bpmProgress(bpm) {
  return (clamp(bpm, 30, 240) - 30) / 210;
}

const EAR_TARGET_ACCURACY = 90;
const EAR_LEVELS = {
  focus: "Skupienie",
  core: "Podstawowy",
  wide: "Rozszerzony"
};

const EAR_REGISTERS = {
  low: "Niski",
  mid: "Srodkowy",
  high: "Wysoki",
  wide: "Szeroki"
};

const EAR_DIRECTIONS = {
  up: "W gore",
  down: "W dol",
  both: "Losowo"
};

const EAR_SCALE_STARTS = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  random: "Rnd"
};

const EAR_SOUND_PROFILES = {
  tone: {
    label: "Ton",
    shortLabel: "Ton",
    description: "Czysty sygnal referencyjny do precyzyjnego rozpoznawania wysokosci.",
    visual: "keyboard"
  },
  piano: {
    label: "Fortepian",
    shortLabel: "Piano",
    description: "Jasny atak i krotkie wybrzmienie, najbardziej neutralne do codziennego treningu.",
    visual: "keyboard"
  },
  cleanGuitar: {
    label: "Gitara clean",
    shortLabel: "Clean",
    description: "Krotki gitarowy pluck z naturalnym wygasaniem.",
    visual: "fretboard"
  },
  distortedGuitar: {
    label: "Gitara drive",
    shortLabel: "Drive",
    description: "Gestszy atak z lekkim przesterem do rockowego kontekstu.",
    visual: "fretboard"
  },
  keysPad: {
    label: "Klawisze",
    shortLabel: "Keys",
    description: "Miekkie klawisze/pad z dluzszym wybrzmieniem.",
    visual: "keyboard"
  }
};

const GUITAR_TUNER_STRINGS = [
  { id: "e4", label: "e", note: "E4", midi: 64, frequency: 329.63, pc: 4 },
  { id: "b3", label: "B", note: "B3", midi: 59, frequency: 246.94, pc: 11 },
  { id: "g3", label: "G", note: "G3", midi: 55, frequency: 196.00, pc: 7 },
  { id: "d3", label: "D", note: "D3", midi: 50, frequency: 146.83, pc: 2 },
  { id: "a2", label: "A", note: "A2", midi: 45, frequency: 110.00, pc: 9 },
  { id: "e2", label: "E", note: "E2", midi: 40, frequency: 82.41, pc: 4 }
];

const FRETBOARD_PRACTICE_GROUPS = [
  { id: "scales", label: "Skale" },
  { id: "arpeggios", label: "Pasaze" },
  { id: "intervals", label: "Interwaly" }
];

const FRETBOARD_PRACTICE_LIBRARY = [
  { id: "minor-pent", group: "scales", label: "Pentatonika mol", family: "Pentatonika", intervals: [0, 3, 5, 7, 10] },
  { id: "major-pent", group: "scales", label: "Pentatonika dur", family: "Pentatonika", intervals: [0, 2, 4, 7, 9] },
  { id: "blues-minor", group: "scales", label: "Blues mol", family: "Pentatonika", intervals: [0, 3, 5, 6, 7, 10] },
  { id: "blues-major", group: "scales", label: "Blues dur", family: "Pentatonika", intervals: [0, 2, 3, 4, 7, 9] },
  { id: "ionian", group: "scales", label: "Durowa / Jonska", family: "Modusy dur", intervals: [0, 2, 4, 5, 7, 9, 11] },
  { id: "dorian", group: "scales", label: "Dorycka", family: "Modusy dur", intervals: [0, 2, 3, 5, 7, 9, 10] },
  { id: "phrygian", group: "scales", label: "Frygijska", family: "Modusy dur", intervals: [0, 1, 3, 5, 7, 8, 10] },
  { id: "lydian", group: "scales", label: "Lidyjska", family: "Modusy dur", intervals: [0, 2, 4, 6, 7, 9, 11] },
  { id: "mixolydian", group: "scales", label: "Miksolidyjska", family: "Modusy dur", intervals: [0, 2, 4, 5, 7, 9, 10] },
  { id: "aeolian", group: "scales", label: "Mol naturalny", family: "Modusy dur", intervals: [0, 2, 3, 5, 7, 8, 10] },
  { id: "locrian", group: "scales", label: "Lokrycka", family: "Modusy dur", intervals: [0, 1, 3, 5, 6, 8, 10] },
  { id: "harmonic-minor", group: "scales", label: "Mol harmoniczny", family: "Moll", intervals: [0, 2, 3, 5, 7, 8, 11] },
  { id: "phrygian-dominant", group: "scales", label: "Frygijska domin.", family: "Moll harm.", intervals: [0, 1, 4, 5, 7, 8, 10] },
  { id: "melodic-minor", group: "scales", label: "Mol melodyczny", family: "Moll", intervals: [0, 2, 3, 5, 7, 9, 11] },
  { id: "lydian-dominant", group: "scales", label: "Lidyjska domin.", family: "Moll melod.", intervals: [0, 2, 4, 6, 7, 9, 10] },
  { id: "whole-tone", group: "scales", label: "Cala tonowa", family: "Symetryczne", intervals: [0, 2, 4, 6, 8, 10] },
  { id: "half-whole", group: "scales", label: "Pol-cal", family: "Symetryczne", intervals: [0, 1, 3, 4, 6, 7, 9, 10] },
  { id: "maj-triad", group: "arpeggios", label: "Dur", family: "Trojdzwięki", intervals: [0, 4, 7] },
  { id: "min-triad", group: "arpeggios", label: "Mol", family: "Trojdzwięki", intervals: [0, 3, 7] },
  { id: "dim-triad", group: "arpeggios", label: "Zmniejszony", family: "Trojdzwięki", intervals: [0, 3, 6] },
  { id: "aug-triad", group: "arpeggios", label: "Zwiekszony", family: "Trojdzwięki", intervals: [0, 4, 8] },
  { id: "sus2-arp", group: "arpeggios", label: "Sus2", family: "Trojdzwięki", intervals: [0, 2, 7] },
  { id: "sus4-arp", group: "arpeggios", label: "Sus4", family: "Trojdzwięki", intervals: [0, 5, 7] },
  { id: "dom7-arp", group: "arpeggios", label: "Dominant 7", family: "Septymowe", intervals: [0, 4, 7, 10] },
  { id: "maj7-arp", group: "arpeggios", label: "Maj7", family: "Septymowe", intervals: [0, 4, 7, 11] },
  { id: "min7-arp", group: "arpeggios", label: "m7", family: "Septymowe", intervals: [0, 3, 7, 10] },
  { id: "m7b5-arp", group: "arpeggios", label: "m7b5", family: "Septymowe", intervals: [0, 3, 6, 10] },
  { id: "dim7-arp", group: "arpeggios", label: "dim7", family: "Septymowe", intervals: [0, 3, 6, 9] },
  { id: "minmaj7-arp", group: "arpeggios", label: "mMaj7", family: "Septymowe", intervals: [0, 3, 7, 11] },
  { id: "add9-arp", group: "arpeggios", label: "add9", family: "Kolory", intervals: [0, 4, 7, 14] },
  { id: "minor-second", group: "intervals", label: "Sekunda mala", family: "1-b2", intervals: [0, 1] },
  { id: "major-second", group: "intervals", label: "Sekunda wielka", family: "1-2", intervals: [0, 2] },
  { id: "minor-third", group: "intervals", label: "Tercja mala", family: "1-b3", intervals: [0, 3] },
  { id: "major-third", group: "intervals", label: "Tercja wielka", family: "1-3", intervals: [0, 4] },
  { id: "perfect-fourth", group: "intervals", label: "Kwarta czysta", family: "1-4", intervals: [0, 5] },
  { id: "tritone", group: "intervals", label: "Tryton", family: "1-b5/#4", intervals: [0, 6] },
  { id: "perfect-fifth", group: "intervals", label: "Kwinta czysta", family: "1-5", intervals: [0, 7] },
  { id: "minor-sixth", group: "intervals", label: "Seksta mala", family: "1-b6", intervals: [0, 8] },
  { id: "major-sixth", group: "intervals", label: "Seksta wielka", family: "1-6", intervals: [0, 9] },
  { id: "minor-seventh", group: "intervals", label: "Septyma mala", family: "1-b7", intervals: [0, 10] },
  { id: "major-seventh", group: "intervals", label: "Septyma wielka", family: "1-7", intervals: [0, 11] },
  { id: "octaves", group: "intervals", label: "Oktawa", family: "1-8", intervals: [0, 12] },
  { id: "power", group: "intervals", label: "Power chord", family: "1-5-8", intervals: [0, 7] }
];

const FRETBOARD_POSITIONS = [
  { id: "all", label: "Caly gryf", start: 0, end: 12 },
  { id: "open", label: "Otwarte", start: 0, end: 4 },
  { id: "pos1", label: "Pozycja I", start: 1, end: 5 },
  { id: "pos2", label: "Pozycja II", start: 3, end: 7 },
  { id: "pos3", label: "Pozycja III", start: 5, end: 9 },
  { id: "pos4", label: "Pozycja IV", start: 7, end: 12 },
  { id: "high", label: "Wysoko", start: 9, end: 15 }
];

const EAR_ROOT_OPTIONS = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const EAR_INVERSION_OPTIONS = ["root", "1st", "2nd", "3rd"];
const EAR_LEVEL_HELP = {
  focus: "Najmniejszy, najwazniejszy zestaw.",
  core: "Standardowy zakres do codziennego treningu.",
  wide: "Szerszy i trudniejszy material."
};
const EAR_REGISTER_HELP = {
  low: "Niski rejestr.",
  mid: "Srodkowy, najbardziej czytelny rejestr.",
  high: "Wysoki rejestr.",
  wide: "Szeroki zakres losowany z kilku rejestrow."
};
const EAR_DIRECTION_HELP = {
  up: "Material idzie w gore.",
  down: "Material idzie w dol.",
  both: "Losowo w gore albo w dol."
};
const EAR_PRESET_LIBRARY = {
  intervals: [
    { id: "guitar-core", label: "Guitar core", level: "core", selectedItems: ["m2", "M2", "m3", "M3", "P4", "TT", "P5"], direction: "both", playbackMode: "both", register: "mid", selectedRoots: ["E", "A", "D", "G", "B"], selectedInversions: ["root"], scaleStartDegree: "1" },
    { id: "wide-jumps", label: "Wide jumps", level: "wide", selectedItems: ["P4", "TT", "P5", "m6", "M6", "m7", "M7", "8va"], direction: "both", playbackMode: "melodic", register: "wide", selectedRoots: [], selectedInversions: ["root"], scaleStartDegree: "1" },
    { id: "harmonic-color", label: "Harm color", level: "core", selectedItems: ["m3", "M3", "P4", "TT", "P5", "m6", "M6"], direction: "both", playbackMode: "harmonic", register: "mid", selectedRoots: [], selectedInversions: ["root"], scaleStartDegree: "1" }
  ],
  chords: [
    { id: "triads", label: "Triads", level: "core", selectedItems: ["Major", "Minor", "Dim", "Aug", "Sus2", "Sus4"], direction: "both", playbackMode: "stack", register: "mid", selectedRoots: [], selectedInversions: ["root", "1st", "2nd"], scaleStartDegree: "1" },
    { id: "sevenths", label: "7th chords", level: "wide", selectedItems: ["Dom7", "Maj7", "Min7", "Half-dim7", "Dim7"], direction: "both", playbackMode: "stack", register: "mid", selectedRoots: [], selectedInversions: ["root", "1st", "2nd", "3rd"], scaleStartDegree: "1" },
    { id: "arp-color", label: "Arp color", level: "wide", selectedItems: ["Major", "Minor", "Maj7", "Min7", "Dom7", "Add9"], direction: "both", playbackMode: "arp", register: "high", selectedRoots: [], selectedInversions: ["root", "1st", "2nd"], scaleStartDegree: "1" }
  ],
  progressions: [
    { id: "cadences", label: "Cadences", level: "core", selectedItems: ["ii-V-I", "I-IV-V-I", "iv-V-i", "iio-V-i"], direction: "both", playbackMode: "block", register: "mid", selectedRoots: [], selectedInversions: ["root", "1st"], scaleStartDegree: "1" },
    { id: "pop-loops", label: "Pop loops", level: "core", selectedItems: ["I-V-vi-IV", "vi-IV-I-V", "I-vi-IV-V", "I-IV-vi-V"], direction: "both", playbackMode: "flow", register: "mid", selectedRoots: [], selectedInversions: ["root"], scaleStartDegree: "1" },
    { id: "jazz-turns", label: "Jazz turns", level: "wide", selectedItems: ["ii-V-I", "iii-vi-ii-V", "I-vi-ii-V", "ii-V-I-vi"], direction: "both", playbackMode: "spread", register: "mid", selectedRoots: [], selectedInversions: ["root", "1st", "2nd"], scaleStartDegree: "1" },
    { id: "minor-color", label: "Minor color", level: "wide", selectedItems: ["i-bVII-bVI-V", "i-iv-bVII-III", "i-bVI-bIII-bVII", "iio-V-i"], direction: "both", playbackMode: "block", register: "low", selectedRoots: [], selectedInversions: ["root", "1st"], scaleStartDegree: "1" }
  ],
  scales: [
    { id: "modes", label: "Modes", level: "wide", selectedItems: ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"], direction: "both", playbackMode: "phrase", register: "mid", selectedRoots: [], selectedInversions: ["root"], scaleStartDegree: "random" },
    { id: "major-minor", label: "Major minor", level: "core", selectedItems: ["Major", "Natural minor", "Harmonic minor", "Melodic minor"], direction: "both", playbackMode: "ascending", register: "mid", selectedRoots: [], selectedInversions: ["root"], scaleStartDegree: "1" },
    { id: "pentatonic", label: "Pentatonic", level: "core", selectedItems: ["Major pent", "Minor pent", "Blues"], direction: "both", playbackMode: "phrase", register: "high", selectedRoots: ["E", "A", "D", "G"], selectedInversions: ["root"], scaleStartDegree: "5" }
  ],
  rhythm: [
    { id: "pulse", label: "Pulse", level: "core", selectedItems: ["Prosto", "Pauza", "Offbeat", "Push"], direction: "both", playbackMode: "click", register: "mid", selectedRoots: [], selectedInversions: ["root"], scaleStartDegree: "1" },
    { id: "syncopa", label: "Syncopa", level: "wide", selectedItems: ["Synkopa", "Triola", "Gallop", "Clave", "6/8 flow"], direction: "both", playbackMode: "click", register: "mid", selectedRoots: [], selectedInversions: ["root"], scaleStartDegree: "1" }
  ],
  melody: [
    { id: "three-note", label: "3 note", level: "focus", selectedItems: ["1-2-3", "1-b3-4", "1-4-5", "5-4-2"], direction: "up", playbackMode: "degrees", register: "mid", selectedRoots: [], selectedInversions: ["root"], scaleStartDegree: "1" },
    { id: "phrase-mix", label: "Phrase mix", level: "wide", selectedItems: ["1-2-5", "1-5-6", "1-6-5-3", "5-b3-2-1", "1-3-5-6", "6-5-3-2"], direction: "both", playbackMode: "degrees", register: "wide", selectedRoots: [], selectedInversions: ["root"], scaleStartDegree: "1" }
  ],
  pitch: [
    { id: "natural", label: "Natural", level: "core", selectedItems: ["C", "D", "E", "F", "G", "A", "B"], direction: "both", playbackMode: "single", register: "mid", selectedRoots: [], selectedInversions: ["root"], scaleStartDegree: "1" },
    { id: "chromatic", label: "Chromatic", level: "wide", selectedItems: ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"], direction: "both", playbackMode: "single", register: "wide", selectedRoots: [], selectedInversions: ["root"], scaleStartDegree: "1" }
  ]
};

const EAR_LIBRARY = {
  intervals: {
    title: "Interwaly",
    subtitle: "Melodiczne i harmoniczne",
    accent: "#7c5cff",
    selectedLabel: "Material",
    defaultMode: "both",
    defaultDirection: "both",
    supportsRoots: true,
    supportsRegister: true,
    supportsDirection: true,
    supportsInversions: false,
    supportsScaleStart: false,
    modeOptions: [
      { value: "melodic", label: "Melodycznie" },
      { value: "harmonic", label: "Harmonicznie" },
      { value: "both", label: "Losowo" }
    ],
    itemsByLevel: {
      focus: ["m2", "M2", "m3", "M3", "P4"],
      core: ["m2", "M2", "m3", "M3", "P4", "TT", "P5", "m6", "M6"],
      wide: ["m2", "M2", "m3", "M3", "P4", "TT", "P5", "m6", "M6", "m7", "M7", "8va", "m9", "M9", "P11", "P12"]
    },
    presets: EAR_PRESET_LIBRARY.intervals
  },
  chords: {
    title: "Akordy",
    subtitle: "Brzmienie i kolor",
    accent: "#2dd4bf",
    selectedLabel: "Typy",
    defaultMode: "stack",
    defaultDirection: "both",
    supportsRoots: true,
    supportsRegister: true,
    supportsDirection: false,
    supportsInversions: true,
    supportsScaleStart: false,
    modeOptions: [
      { value: "stack", label: "Razem" },
      { value: "arp", label: "Arpeggio" },
      { value: "broken", label: "Rozlozone" }
    ],
    itemsByLevel: {
      focus: ["Major", "Minor", "Sus2", "Sus4"],
      core: ["Major", "Minor", "Dim", "Aug", "Sus2", "Sus4", "Dom7", "Maj7", "Min7", "Add9"],
      wide: ["Major", "Minor", "Dim", "Aug", "Sus2", "Sus4", "Dom7", "Maj7", "Min7", "Half-dim7", "Dim7", "MinMaj7", "Add9", "6", "m6"]
    },
    presets: EAR_PRESET_LIBRARY.chords
  },
  progressions: {
    title: "Progresje",
    subtitle: "Kadencje i loopy harmoniczne",
    accent: "#4cc9f0",
    selectedLabel: "Progresje",
    defaultMode: "block",
    defaultDirection: "both",
    supportsRoots: true,
    supportsRegister: true,
    supportsDirection: false,
    supportsInversions: true,
    supportsScaleStart: false,
    modeOptions: [
      { value: "block", label: "Blokowo" },
      { value: "flow", label: "Plynnie" },
      { value: "spread", label: "Szeroko" }
    ],
    itemsByLevel: {
      focus: ["ii-V-I", "I-IV-V-I", "I-V-vi-IV", "vi-IV-I-V"],
      core: ["ii-V-I", "I-IV-V-I", "iv-V-i", "iio-V-i", "I-V-vi-IV", "vi-IV-I-V", "I-vi-IV-V", "I-IV-vi-V"],
      wide: ["ii-V-I", "I-IV-V-I", "iv-V-i", "iio-V-i", "I-V-vi-IV", "vi-IV-I-V", "I-vi-IV-V", "I-IV-vi-V", "iii-vi-ii-V", "I-vi-ii-V", "ii-V-I-vi", "i-bVII-bVI-V", "i-iv-bVII-III", "i-bVI-bIII-bVII"]
    },
    presets: EAR_PRESET_LIBRARY.progressions
  },
  scales: {
    title: "Skale",
    subtitle: "Tryby i kolor",
    accent: "#ff9f43",
    selectedLabel: "Skale",
    defaultMode: "phrase",
    defaultDirection: "both",
    supportsRoots: true,
    supportsRegister: true,
    supportsDirection: false,
    supportsInversions: false,
    supportsScaleStart: true,
    modeOptions: [
      { value: "phrase", label: "Fraza" },
      { value: "ascending", label: "W gore" },
      { value: "descending", label: "W dol" }
    ],
    itemsByLevel: {
      focus: ["Major", "Natural minor", "Dorian", "Mixolydian"],
      core: ["Major", "Natural minor", "Harmonic minor", "Melodic minor", "Dorian", "Phrygian", "Lydian", "Mixolydian"],
      wide: ["Major", "Natural minor", "Harmonic minor", "Melodic minor", "Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian", "Major pent", "Minor pent", "Blues", "Whole tone"]
    },
    presets: EAR_PRESET_LIBRARY.scales
  },
  rhythm: {
    title: "Rytm",
    subtitle: "Patterny i puls",
    accent: "#ff5a5f",
    selectedLabel: "Patterny",
    defaultMode: "click",
    defaultDirection: "both",
    supportsRoots: false,
    supportsRegister: false,
    supportsDirection: false,
    supportsInversions: false,
    supportsScaleStart: false,
    modeOptions: [
      { value: "click", label: "Klik" },
      { value: "accent", label: "Akcenty" }
    ],
    itemsByLevel: {
      focus: ["Prosto", "Pauza", "Synkopa", "Triola"],
      core: ["Prosto", "Pauza", "Synkopa", "Triola", "Offbeat", "Push", "Backbeat"],
      wide: ["Prosto", "Pauza", "Synkopa", "Triola", "Offbeat", "Push", "Backbeat", "Clave", "Gallop", "6/8 flow", "Shuffle"]
    },
    presets: EAR_PRESET_LIBRARY.rhythm
  },
  melody: {
    title: "Melodie",
    subtitle: "Krotkie dyktanda",
    accent: "#58f0c2",
    selectedLabel: "Frazy",
    defaultMode: "degrees",
    defaultDirection: "both",
    supportsRoots: true,
    supportsRegister: true,
    supportsDirection: true,
    supportsInversions: false,
    supportsScaleStart: false,
    modeOptions: [
      { value: "degrees", label: "Stopnie skali" }
    ],
    itemsByLevel: {
      focus: ["1-2-3", "1-b3-4", "1-4-5", "5-4-2"],
      core: ["1-2-3", "1-b3-4", "1-4-5", "5-4-2", "1-5-6", "1-2-5", "1-3-5-6"],
      wide: ["1-2-3", "1-b3-4", "1-4-5", "5-4-2", "1-5-6", "1-2-5", "1-3-5-6", "1-6-5-3", "5-b3-2-1", "6-5-3-2", "1-7-6-5"]
    },
    presets: EAR_PRESET_LIBRARY.melody
  },
  pitch: {
    title: "Pojedyncze dzwieki",
    subtitle: "Rozpoznawanie nut",
    accent: "#8b5cf6",
    selectedLabel: "Dzwieki",
    defaultMode: "single",
    defaultDirection: "both",
    supportsRoots: false,
    supportsRegister: true,
    supportsDirection: false,
    supportsInversions: false,
    supportsScaleStart: false,
    modeOptions: [
      { value: "single", label: "Pojedynczo" }
    ],
    itemsByLevel: {
      focus: ["C", "D", "E", "G", "A"],
      core: ["C", "D", "E", "F", "G", "A", "B", "Bb"],
      wide: ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]
    },
    presets: EAR_PRESET_LIBRARY.pitch
  }
};

const INTERVAL_SEMITONES = {
  m2: 1,
  M2: 2,
  m3: 3,
  M3: 4,
  P4: 5,
  TT: 6,
  P5: 7,
  m6: 8,
  M6: 9,
  m7: 10,
  M7: 11,
  "8va": 12,
  m9: 13,
  M9: 14,
  P11: 17,
  P12: 19
};

const CHORD_INTERVALS = {
  Major: [0, 4, 7],
  Minor: [0, 3, 7],
  Dim: [0, 3, 6],
  Aug: [0, 4, 8],
  Sus2: [0, 2, 7],
  Sus4: [0, 5, 7],
  Dom7: [0, 4, 7, 10],
  Maj7: [0, 4, 7, 11],
  Min7: [0, 3, 7, 10],
  "Half-dim7": [0, 3, 6, 10],
  Dim7: [0, 3, 6, 9],
  MinMaj7: [0, 3, 7, 11],
  Add9: [0, 4, 7, 14],
  "6": [0, 4, 7, 9],
  m6: [0, 3, 7, 9]
};

const CHORD_PROGRESSIONS = {
  "ii-V-I": {
    category: "cadence",
    chords: [
      { rootShift: 2, quality: "Min7" },
      { rootShift: 7, quality: "Dom7" },
      { rootShift: 0, quality: "Maj7" }
    ]
  },
  "I-IV-V-I": {
    category: "cadence",
    chords: [
      { rootShift: 0, quality: "Major" },
      { rootShift: 5, quality: "Major" },
      { rootShift: 7, quality: "Major" },
      { rootShift: 0, quality: "Major" }
    ]
  },
  "iv-V-i": {
    category: "cadence",
    chords: [
      { rootShift: 5, quality: "Minor" },
      { rootShift: 7, quality: "Major" },
      { rootShift: 0, quality: "Minor" }
    ]
  },
  "iio-V-i": {
    category: "cadence",
    chords: [
      { rootShift: 2, quality: "Half-dim7" },
      { rootShift: 7, quality: "Dom7" },
      { rootShift: 0, quality: "Min7" }
    ]
  },
  "I-V-vi-IV": {
    category: "pop",
    chords: [
      { rootShift: 0, quality: "Major" },
      { rootShift: 7, quality: "Major" },
      { rootShift: 9, quality: "Minor" },
      { rootShift: 5, quality: "Major" }
    ]
  },
  "vi-IV-I-V": {
    category: "pop",
    chords: [
      { rootShift: 9, quality: "Minor" },
      { rootShift: 5, quality: "Major" },
      { rootShift: 0, quality: "Major" },
      { rootShift: 7, quality: "Major" }
    ]
  },
  "I-vi-IV-V": {
    category: "pop",
    chords: [
      { rootShift: 0, quality: "Major" },
      { rootShift: 9, quality: "Minor" },
      { rootShift: 5, quality: "Major" },
      { rootShift: 7, quality: "Major" }
    ]
  },
  "I-IV-vi-V": {
    category: "pop",
    chords: [
      { rootShift: 0, quality: "Major" },
      { rootShift: 5, quality: "Major" },
      { rootShift: 9, quality: "Minor" },
      { rootShift: 7, quality: "Major" }
    ]
  },
  "iii-vi-ii-V": {
    category: "jazz",
    chords: [
      { rootShift: 4, quality: "Min7" },
      { rootShift: 9, quality: "Min7" },
      { rootShift: 2, quality: "Min7" },
      { rootShift: 7, quality: "Dom7" }
    ]
  },
  "i-bVII-bVI-V": {
    category: "minor",
    chords: [
      { rootShift: 0, quality: "Minor" },
      { rootShift: 10, quality: "Major" },
      { rootShift: 8, quality: "Major" },
      { rootShift: 7, quality: "Major" }
    ]
  },
  "I-vi-ii-V": {
    category: "jazz",
    chords: [
      { rootShift: 0, quality: "Maj7" },
      { rootShift: 9, quality: "Min7" },
      { rootShift: 2, quality: "Min7" },
      { rootShift: 7, quality: "Dom7" }
    ]
  },
  "ii-V-I-vi": {
    category: "jazz",
    chords: [
      { rootShift: 2, quality: "Min7" },
      { rootShift: 7, quality: "Dom7" },
      { rootShift: 0, quality: "Maj7" },
      { rootShift: 9, quality: "Min7" }
    ]
  },
  "i-iv-bVII-III": {
    category: "minor",
    chords: [
      { rootShift: 0, quality: "Minor" },
      { rootShift: 5, quality: "Minor" },
      { rootShift: 10, quality: "Major" },
      { rootShift: 3, quality: "Major" }
    ]
  },
  "i-bVI-bIII-bVII": {
    category: "minor",
    chords: [
      { rootShift: 0, quality: "Minor" },
      { rootShift: 8, quality: "Major" },
      { rootShift: 3, quality: "Major" },
      { rootShift: 10, quality: "Major" }
    ]
  }
};

const SCALE_INTERVALS = {
  Major: [0, 2, 4, 5, 7, 9, 11],
  Minor: [0, 2, 3, 5, 7, 8, 10],
  "Natural minor": [0, 2, 3, 5, 7, 8, 10],
  "Harmonic minor": [0, 2, 3, 5, 7, 8, 11],
  "Melodic minor": [0, 2, 3, 5, 7, 9, 11],
  Ionian: [0, 2, 4, 5, 7, 9, 11],
  Dorian: [0, 2, 3, 5, 7, 9, 10],
  Phrygian: [0, 1, 3, 5, 7, 8, 10],
  Lydian: [0, 2, 4, 6, 7, 9, 11],
  Mixolydian: [0, 2, 4, 5, 7, 9, 10],
  Aeolian: [0, 2, 3, 5, 7, 8, 10],
  Locrian: [0, 1, 3, 5, 6, 8, 10],
  "Major pent": [0, 2, 4, 7, 9],
  "Minor pent": [0, 3, 5, 7, 10],
  Blues: [0, 3, 5, 6, 7, 10],
  "Whole tone": [0, 2, 4, 6, 8, 10]
};

const RHYTHM_PATTERNS = {
  Prosto: [0, 0.5, 1, 1.5],
  Pauza: [0, 1, 1.5],
  Synkopa: [0, 0.75, 1.5],
  Triola: [0, 1 / 3, 2 / 3, 1.25],
  Offbeat: [0.5, 1, 1.5],
  Push: [0, 0.5, 1.25],
  Clave: [0, 0.75, 1.25, 2, 2.5],
  Gallop: [0, 0.25, 0.5, 1, 1.25, 1.5],
  Backbeat: [0, 1, 2, 3],
  "6/8 flow": [0, 0.5, 1, 1.5, 2, 2.5],
  Shuffle: [0, 0.66, 1.5, 2.16]
};

const MELODY_PATTERNS = {
  "1-2-3": [0, 2, 4],
  "1-b3-4": [0, 3, 5],
  "1-4-5": [0, 5, 7],
  "5-4-2": [7, 5, 2],
  "1-5-6": [0, 7, 9],
  "1-2-5": [0, 2, 7],
  "1-3-5-6": [0, 4, 7, 9],
  "1-6-5-3": [0, 9, 7, 4],
  "5-b3-2-1": [7, 3, 2, 0],
  "6-5-3-2": [9, 7, 4, 2],
  "1-7-6-5": [0, 11, 9, 7]
};

const NOTE_TO_SEMITONE = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  Eb: 3,
  "D#": 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  Ab: 8,
  "G#": 8,
  A: 9,
  Bb: 10,
  "A#": 10,
  B: 11
};

const METRONOME_ARC_START = -150;
const METRONOME_ARC_SPAN = 300;
const METRONOME_ARC_END = METRONOME_ARC_START + METRONOME_ARC_SPAN;
const METRONOME_SVG_SIZE = 320;
const METRONOME_CENTER = 160;
const METRONOME_RADIUS = 124;

function angleToBpm(angle) {
  return Math.round(30 + ((clamp(angle, METRONOME_ARC_START, METRONOME_ARC_END) - METRONOME_ARC_START) / METRONOME_ARC_SPAN) * 210);
}

function bpmToArcAngle(bpm) {
  return METRONOME_ARC_START + bpmProgress(bpm) * METRONOME_ARC_SPAN;
}

function metronomePolarPoint(angle, radius = METRONOME_RADIUS) {
  const rad = angle * (Math.PI / 180);
  return {
    x: METRONOME_CENTER + Math.sin(rad) * radius,
    y: METRONOME_CENTER - Math.cos(rad) * radius
  };
}

function describeMetronomeArc(startAngle, endAngle, radius = METRONOME_RADIUS) {
  const start = metronomePolarPoint(startAngle, radius);
  const end = metronomePolarPoint(endAngle, radius);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

function normalizeArray(value, fallback) {
  return Array.isArray(value) ? value : cloneState(fallback);
}

function normalizeCreatedAt(entry, fallback) {
  return { ...entry, createdAt: entry.createdAt || fallback };
}

function migrateActiveTab(value) {
  const map = {
    today: "home",
    zones: "guitar",
    capture: "gym",
    insights: "finance",
    me: "me"
  };
  return map[value] || value || "home";
}

function migrateGuitarData(rawState) {
  const logs = Array.isArray(rawState.guitarLogs) ? rawState.guitarLogs : [];
  if (!logs.length) {
    return {
      guitarExercises: cloneState(defaultState.guitarExercises),
      guitarSessions: cloneState(defaultState.guitarSessions),
      guitarActiveId: defaultState.guitarActiveId
    };
  }

  const byTitle = new Map();
  logs.forEach((log) => {
    const title = log.title || "Cwiczenie";
    const current = byTitle.get(title) || { top: 0, id: uid("gex") };
    current.top = Math.max(current.top, Number(log.bpm || 0));
    byTitle.set(title, current);
  });

  const guitarExercises = [...byTitle.entries()].map(([title, data]) => ({
    id: data.id,
    title,
    targetBpm: Math.max(60, data.top + 12),
    practiceMinutes: 10
  }));

  const titleToId = new Map(guitarExercises.map((exercise) => [exercise.title, exercise.id]));
  const guitarSessions = logs.map((log) => ({
    id: uid("gs"),
    exerciseId: titleToId.get(log.title) || guitarExercises[0].id,
    exerciseTitle: log.title || "Cwiczenie",
    bpm: Number(log.bpm || 0),
    durationSec: Number(log.durationSec || 480),
    createdAt: log.createdAt || new Date().toISOString()
  }));

  return {
    guitarExercises,
    guitarSessions,
    guitarActiveId: guitarExercises[0]?.id || null,
    guitarInspectId: guitarExercises[0]?.id || null
  };
}

function normalizeState(rawState = {}) {
  const migratedGuitar = rawState.guitarExercises || rawState.guitarSessions
    ? {
        guitarExercises: normalizeArray(rawState.guitarExercises, defaultState.guitarExercises),
        guitarSessions: normalizeArray(rawState.guitarSessions, defaultState.guitarSessions),
        guitarActiveId: rawState.guitarActiveId !== undefined ? rawState.guitarActiveId : (rawState.guitarExercises?.[0]?.id || defaultState.guitarActiveId),
        guitarInspectId: rawState.guitarInspectId !== undefined ? rawState.guitarInspectId : ((rawState.guitarActiveId !== undefined ? rawState.guitarActiveId : rawState.guitarExercises?.[0]?.id) || defaultState.guitarInspectId)
      }
    : migrateGuitarData(rawState);

  const state = {
    ...cloneState(defaultState),
    ...rawState,
    ...migratedGuitar
  };

  state.activeTab = migrateActiveTab(state.activeTab);
  state.meta = state.meta && typeof state.meta === "object" ? { ...cloneState(defaultState.meta), ...state.meta } : cloneState(defaultState.meta);
  state.note = typeof state.note === "string" ? state.note : defaultState.note;
  state.habits = normalizeArray(state.habits, defaultState.habits);
  state.tasks = normalizeArray(state.tasks, defaultState.tasks);
  state.workouts = normalizeArray(state.workouts, defaultState.workouts).map((entry, index) => normalizeCreatedAt(entry, isoDaysAgo(Math.max(0, index), 18)));
  state.workoutTemplates = normalizeArray(state.workoutTemplates, defaultState.workoutTemplates);
  state.exerciseSets = normalizeArray(state.exerciseSets, defaultState.exerciseSets).map((entry) => normalizeCreatedAt(entry, isoDaysAgo(0, 12)));
  state.meals = normalizeArray(state.meals, defaultState.meals).map((entry, index) => normalizeCreatedAt(entry, isoDaysAgo(Math.max(0, index), 12)));
  state.financeEntries = normalizeArray(state.financeEntries, defaultState.financeEntries).map((entry, index) => normalizeCreatedAt(entry, isoDaysAgo(Math.max(0, index), 12)));
  state.plannedExpenses = normalizeArray(state.plannedExpenses, defaultState.plannedExpenses);
  state.evaluator = state.evaluator && typeof state.evaluator === "object" ? { ...cloneState(defaultState.evaluator), ...state.evaluator } : cloneState(defaultState.evaluator);
  state.paperTrading = state.paperTrading && typeof state.paperTrading === "object"
    ? {
        ...cloneState(defaultState.paperTrading),
        ...state.paperTrading,
        watchlist: Array.isArray(state.paperTrading.watchlist)
          ? state.paperTrading.watchlist.map((symbol) => String(symbol || "").trim().toUpperCase()).filter(Boolean).slice(0, PAPER_WATCHLIST_LIMIT)
          : defaultState.paperTrading.watchlist.slice(),
        quotes: state.paperTrading.quotes && typeof state.paperTrading.quotes === "object" ? state.paperTrading.quotes : {},
        chart: state.paperTrading.chart && typeof state.paperTrading.chart === "object"
          ? {
              symbol: String(state.paperTrading.chart.symbol || state.paperTrading.selectedSymbol || defaultState.paperTrading.selectedSymbol).trim().toUpperCase(),
              points: Array.isArray(state.paperTrading.chart.points)
                ? state.paperTrading.chart.points
                    .map((point) => ({
                      time: point.time || "",
                      open: Number(point.open || point.value || 0),
                      high: Number(point.high || point.value || 0),
                      low: Number(point.low || point.value || 0),
                      close: Number(point.close || point.value || 0),
                      volume: Number(point.volume || 0),
                      label: String(point.label || ""),
                      bottom: String(point.bottom || ""),
                      value: Number(point.value || 0)
                    }))
                    .filter((point) => Number.isFinite(point.value))
                    .slice(-120)
                : [],
              updatedAt: state.paperTrading.chart.updatedAt || null
            }
          : cloneState(defaultState.paperTrading.chart),
        positions: Array.isArray(state.paperTrading.positions)
          ? state.paperTrading.positions
              .map((position) => ({
                symbol: String(position.symbol || "").trim().toUpperCase(),
                shares: Math.max(0, Number(position.shares || 0)),
                avgCost: Math.max(0, Number(position.avgCost || 0))
              }))
              .filter((position) => position.symbol && position.shares > 0)
          : [],
        orders: Array.isArray(state.paperTrading.orders)
          ? state.paperTrading.orders
              .map((order) => ({
                id: order.id || uid("pord"),
                symbol: String(order.symbol || "").trim().toUpperCase(),
                side: order.side === "sell" ? "sell" : "buy",
                type: ["market", "limit", "stop"].includes(order.type) ? order.type : "market",
                status: ["open", "filled", "rejected", "cancelled"].includes(order.status) ? order.status : "filled",
                shares: Math.max(0, Number(order.shares || 0)),
                price: Math.max(0, Number(order.price || order.executionPrice || 0)),
                executionPrice: Math.max(0, Number(order.executionPrice || order.price || 0)),
                limitPrice: Math.max(0, Number(order.limitPrice || 0)),
                stopPrice: Math.max(0, Number(order.stopPrice || 0)),
                fee: Math.max(0, Number(order.fee || 0)),
                realizedPnl: Number(order.realizedPnl || 0),
                reason: String(order.reason || ""),
                thesis: String(order.thesis || ""),
                createdAt: order.createdAt || new Date().toISOString(),
                filledAt: order.filledAt || null
              }))
              .filter((order) => order.symbol && order.shares > 0)
          : [],
        equityHistory: Array.isArray(state.paperTrading.equityHistory)
          ? state.paperTrading.equityHistory
              .map((entry) => ({
                value: Number(entry.value || 0),
                createdAt: entry.createdAt || new Date().toISOString()
              }))
              .filter((entry) => Number.isFinite(entry.value) && entry.value > 0)
              .slice(-180)
          : [],
        settings: state.paperTrading.settings && typeof state.paperTrading.settings === "object"
          ? {
              ...cloneState(PAPER_DEFAULT_SETTINGS),
              commission: Math.max(0, Number(state.paperTrading.settings.commission ?? PAPER_DEFAULT_SETTINGS.commission)),
              spreadBps: Math.max(0, Number(state.paperTrading.settings.spreadBps ?? PAPER_DEFAULT_SETTINGS.spreadBps)),
              slippageBps: Math.max(0, Number(state.paperTrading.settings.slippageBps ?? PAPER_DEFAULT_SETTINGS.slippageBps)),
              allowAfterHours: Boolean(state.paperTrading.settings.allowAfterHours)
            }
          : cloneState(PAPER_DEFAULT_SETTINGS),
        initialCash: Math.max(1, Number(state.paperTrading.initialCash || PAPER_TRADING_INITIAL_CASH)),
        cash: Math.max(0, Number(state.paperTrading.cash ?? defaultState.paperTrading.cash)),
        selectedSymbol: String(state.paperTrading.selectedSymbol || state.paperTrading.watchlist?.[0] || defaultState.paperTrading.selectedSymbol).trim().toUpperCase(),
        autoRefresh: Boolean(state.paperTrading.autoRefresh),
        lastSyncAt: state.paperTrading.lastSyncAt || null,
        error: String(state.paperTrading.error || "")
      }
    : cloneState(defaultState.paperTrading);
  if (!state.paperTrading.watchlist.length) {
    state.paperTrading.watchlist = defaultState.paperTrading.watchlist.slice();
  }
  if (!state.paperTrading.watchlist.includes(state.paperTrading.selectedSymbol)) {
    state.paperTrading.selectedSymbol = state.paperTrading.watchlist[0];
  }
  if (state.paperTrading.chart.symbol !== state.paperTrading.selectedSymbol) {
    state.paperTrading.chart.symbol = state.paperTrading.selectedSymbol;
  }
  state.weightHistory = normalizeArray(state.weightHistory, defaultState.weightHistory).map((entry, index) => normalizeCreatedAt(entry, isoDaysAgo(Math.max(0, index), 8)));
  state.guitarExercises = normalizeArray(state.guitarExercises, defaultState.guitarExercises).map((entry) => ({
    id: entry.id || uid("gex"),
    title: entry.title || "Cwiczenie",
    targetBpm: Math.max(40, Number(entry.targetBpm || 80)),
    practiceMinutes: Math.max(1, Number(entry.practiceMinutes || 10))
  }));
  state.guitarSessions = normalizeArray(state.guitarSessions, defaultState.guitarSessions).map((entry) => ({
    id: entry.id || uid("gs"),
    exerciseId: entry.exerciseId || state.guitarExercises[0]?.id || null,
    exerciseTitle: entry.exerciseTitle || "Cwiczenie",
    bpm: Math.max(30, Number(entry.bpm || 60)),
    durationSec: Math.max(1, Number(entry.durationSec || 300)),
    createdAt: entry.createdAt || new Date().toISOString()
  }));
  state.guitarActiveId = state.guitarActiveId && state.guitarExercises.some((exercise) => exercise.id === state.guitarActiveId)
    ? state.guitarActiveId
    : null;
  state.guitarInspectId = state.guitarInspectId && state.guitarExercises.some((exercise) => exercise.id === state.guitarInspectId)
    ? state.guitarInspectId
    : (state.guitarActiveId || state.guitarExercises[0]?.id || null);
  state.earRounds = normalizeArray(state.earRounds, defaultState.earRounds).map((entry) => ({
    id: entry.id || uid("er"),
    type: entry.type || "intervals",
    startedAt: entry.startedAt || new Date().toISOString(),
    endedAt: entry.endedAt || entry.startedAt || new Date().toISOString(),
    accuracy: clamp(Math.round(Number(entry.accuracy || 0)), 0, 100),
    correct: Math.max(0, Number(entry.correct || 0)),
    totalQuestions: Math.max(1, Number(entry.totalQuestions || entry.config?.questionCount || 5)),
    averageResponseTimeMs: Math.max(0, Number(entry.averageResponseTimeMs || 0)),
    config: entry.config && typeof entry.config === "object" ? {
      type: entry.config.type || entry.type || "intervals",
      level: entry.config.level || "core",
      questionCount: Math.max(1, Number(entry.config.questionCount || entry.totalQuestions || 5)),
      selectedItems: Array.isArray(entry.config.selectedItems) ? entry.config.selectedItems : [],
      playbackMode: entry.config.playbackMode || EAR_LIBRARY[entry.type || "intervals"]?.defaultMode || "both",
      headphoneMode: entry.config.headphoneMode !== false,
      soundProfile: EAR_SOUND_PROFILES[entry.config.soundProfile] ? entry.config.soundProfile : "piano",
      showInstrumentVisual: entry.config.showInstrumentVisual !== false,
      selectedRoots: Array.isArray(entry.config.selectedRoots) ? entry.config.selectedRoots : [],
      register: entry.config.register || "mid",
      direction: entry.config.direction || EAR_LIBRARY[entry.type || "intervals"]?.defaultDirection || "both",
      scaleStartDegree: entry.config.scaleStartDegree || "1",
      selectedInversions: Array.isArray(entry.config.selectedInversions) ? entry.config.selectedInversions : ["root"],
      presetId: entry.config.presetId || null
    } : cloneState(defaultState.earLastConfigs[entry.type || "intervals"] || defaultState.earLastConfigs.intervals),
    answers: Array.isArray(entry.answers) ? entry.answers.map((answer) => ({
      questionId: answer.questionId || uid("ea"),
      correctAnswer: String(answer.correctAnswer || ""),
      selectedAnswer: String(answer.selectedAnswer || ""),
      isCorrect: Boolean(answer.isCorrect),
      responseTimeMs: Math.max(0, Number(answer.responseTimeMs || 0))
    })) : []
  }));
  state.earLastConfigs = Object.fromEntries(
    Object.keys(EAR_LIBRARY).map((type) => {
      const incoming = state.earLastConfigs?.[type];
      const fallback = defaultState.earLastConfigs[type];
      const level = incoming?.level && EAR_LEVELS[incoming.level] ? incoming.level : fallback.level;
      const playbackMode = EAR_LIBRARY[type].modeOptions.some((option) => option.value === incoming?.playbackMode)
        ? incoming.playbackMode
        : fallback.playbackMode;
      const allowedItems = getEarItemPool(type, { ...fallback, ...incoming, type, level, playbackMode }) || fallback.selectedItems;
      const selectedItems = Array.isArray(incoming?.selectedItems) && incoming.selectedItems.length
        ? incoming.selectedItems.filter((item) => allowedItems.includes(item))
        : fallback.selectedItems.slice();
      return [type, {
        type,
        level,
        questionCount: [5, 10, 20].includes(Number(incoming?.questionCount)) ? Number(incoming.questionCount) : fallback.questionCount,
        selectedItems: selectedItems.length ? selectedItems : fallback.selectedItems.slice(),
        playbackMode,
        headphoneMode: incoming?.headphoneMode !== false,
        soundProfile: EAR_SOUND_PROFILES[incoming?.soundProfile]
          ? incoming.soundProfile
          : (EAR_SOUND_PROFILES[fallback.soundProfile] ? fallback.soundProfile : "piano"),
        showInstrumentVisual: incoming?.showInstrumentVisual !== false,
        selectedRoots: Array.isArray(incoming?.selectedRoots)
          ? incoming.selectedRoots.filter((root) => EAR_ROOT_OPTIONS.includes(root))
          : fallback.selectedRoots.slice(),
        register: EAR_REGISTERS[incoming?.register] ? incoming.register : fallback.register,
        direction: EAR_DIRECTIONS[incoming?.direction] ? incoming.direction : fallback.direction,
        scaleStartDegree: EAR_SCALE_STARTS[incoming?.scaleStartDegree] ? incoming.scaleStartDegree : fallback.scaleStartDegree,
        selectedInversions: Array.isArray(incoming?.selectedInversions)
          ? incoming.selectedInversions.filter((item) => EAR_INVERSION_OPTIONS.includes(item))
          : fallback.selectedInversions.slice(),
        presetId: typeof incoming?.presetId === "string" ? incoming.presetId : fallback.presetId
      }];
    })
  );
  state.earInspectType = state.earInspectType && EAR_LIBRARY[state.earInspectType]
    ? state.earInspectType
    : "intervals";
  state.supplements = normalizeArray(state.supplements, defaultState.supplements);
  state.meta.lastDailyReset = state.meta.lastDailyReset || todayKey();
  state.meta.lastWeeklyReset = state.meta.lastWeeklyReset || weekKey();
  return state;
}

function loadState() {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) {
      return normalizeState(JSON.parse(current));
    }

    for (const legacyKey of LEGACY_KEYS) {
      const legacy = localStorage.getItem(legacyKey);
      if (legacy) {
        return normalizeState(JSON.parse(legacy));
      }
    }
  } catch {
    return cloneState(defaultState);
  }

  return cloneState(defaultState);
}

let state = loadState();
let restTimerValue = 90;
let restTimerRunning = false;
let restTimerInterval = null;
let metronomeBpm = 80;
let metronomeRunning = false;
let metronomeInterval = null;
let metronomeUiInterval = null;
let metronomeStartedAt = null;
let metronomeAudioContext = null;
let metronomeBeatIndex = 0;
let metronomeSignature = 4;
let metronomeOptionMode = "bpm";
let metronomeRefreshTimer = null;
let metronomeTapTimes = [];
let metronomeSliderActive = false;
let feedbackHideTimer = null;
let pendingGuitarSession = null;
let lockedGuitarCardWidth = null;
let guitarView = "home";
const guitarScrollMemory = { home: 0, main: 0, detail: 0, create: 0, tuner: 0, "ear-home": 0, "ear-config": 0, "ear-round": 0, "ear-summary": 0, "ear-detail": 0 };
let financeView = "home";
const financeScrollMemory = { home: 0, personal: 0, market: 0 };
let editingGuitarExerciseId = null;
let guitarSessionsExpanded = false;
let earConfigType = state.earInspectType || "intervals";
let earRoundSession = null;
let tunerAudioContext = null;
let tunerStream = null;
let tunerSource = null;
let tunerAnalyser = null;
let tunerAnimationFrame = null;
let tunerRunning = false;
let tunerTargetStringId = "e2";
let tunerDetection = { frequency: 0, note: "--", cents: 0, targetId: "e2" };
let tunerFrequencyHistory = [];
let fretPracticeRoot = "E";
let fretPracticePatternId = "minor-pent";
let fretPracticePositionId = "all";
let fretPracticeLastResult = null;
let fretboardFullscreenOpen = false;
let paperTradingRefreshTimer = null;
let paperTradingLoading = false;
let paperChartRange = "6M";
let paperChartMode = "candles";
let paperOrderSheetOpen = false;
let paperSymbolSheetOpen = false;
let paperMarketPanel = "info";
let paperChartFullscreenOpen = false;
let paperChartLoading = false;
let paperChartRequestKey = "";
const paperChartCache = new Map();
let paperHistoryError = "";
let paperHistorySource = "";
let paperInstrumentCategory = "ALL";
let marketUniverseLoaded = false;
const paperChartViews = {
  main: { chart: null, series: null, volume: null, resizeObserver: null },
  fullscreen: { chart: null, series: null, volume: null, resizeObserver: null }
};
let agentSession = {
  id: "",
  lastPayload: null,
  history: [],
  totalReward: 0,
  startEquity: 0,
  stepCount: 0,
  runs: [],
  runsLoaded: false,
  researchStatus: null,
  researchLoaded: false,
  featureSummary: null,
  signal: null,
  loading: false,
  error: ""
};

const tabPages = [...document.querySelectorAll(".tab-page")];
const tabButtons = [...document.querySelectorAll("[data-tab-button]")];
const switchButtons = [...document.querySelectorAll("[data-switch-tab]")];

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setFeedback(message) {
  const node = document.getElementById("feedback-pill");
  if (node) {
    node.textContent = message;
    node.classList.add("visible");
    clearTimeout(feedbackHideTimer);
    feedbackHideTimer = setTimeout(() => {
      node.classList.remove("visible");
    }, 2600);
  }
}

function setTab(tab) {
  const previousTab = state.activeTab;
  if (previousTab === "guitar") {
    guitarScrollMemory[guitarView] = window.scrollY || window.pageYOffset || 0;
  }
  if (previousTab === "finance") {
    financeScrollMemory[financeView] = window.scrollY || window.pageYOffset || 0;
  }
  state.activeTab = tab;
  if (previousTab === "guitar" && tab !== "guitar" && tunerRunning) {
    stopTuner();
  }
  if (previousTab === "guitar" && tab !== "guitar" && fretboardFullscreenOpen) {
    closeFretboardFullscreen();
  }
  if (tab !== "finance") {
    document.body.classList.remove("market-mode");
  }
  tabPages.forEach((page) => page.classList.toggle("active", page.dataset.tab === tab));
  tabButtons.forEach((button) => button.classList.toggle("active", button.dataset.tabButton === tab));
  if (tab === "guitar") {
    requestAnimationFrame(() => {
      renderMusic();
      if (guitarView === "main") stabilizeGuitarLayout();
      window.scrollTo({ top: guitarScrollMemory[guitarView] || 0, behavior: "auto" });
    });
  }
  if (tab === "finance") {
    requestAnimationFrame(() => {
      renderFinance();
      window.scrollTo({ top: financeScrollMemory[financeView] || 0, behavior: "auto" });
    });
  }
  if (tab === "finance" && paperTradingApiKey() && !paperTradingLoading && (!state.paperTrading.lastSyncAt || (Date.now() - new Date(state.paperTrading.lastSyncAt).getTime()) > 120000)) {
    refreshPaperTrading({ silent: true });
  }
  syncPaperTradingAutoRefresh();
  saveState();
}

function setGuitarView(view, options = {}) {
  const { scrollTop = false } = options;
  guitarScrollMemory[guitarView] = window.scrollY || window.pageYOffset || 0;
  if (guitarView === "tuner" && view !== "tuner" && tunerRunning) {
    stopTuner();
  }
  if (guitarView === "tuner" && view !== "tuner" && fretboardFullscreenOpen) {
    closeFretboardFullscreen();
  }
  guitarView = view;
  renderMusic();
  requestAnimationFrame(() => {
    window.scrollTo({ top: scrollTop ? 0 : (guitarScrollMemory[view] || 0), behavior: "auto" });
  });
}

function setFinanceView(view, options = {}) {
  const { scrollTop = false } = options;
  financeScrollMemory[financeView] = window.scrollY || window.pageYOffset || 0;
  financeView = view;
  renderFinance();
  requestAnimationFrame(() => {
    window.scrollTo({ top: scrollTop ? 0 : (financeScrollMemory[view] || 0), behavior: "auto" });
  });
}

function focusField(id) {
  if (id === "guitar-exercise-name-input" && guitarView !== "create") {
    editingGuitarExerciseId = null;
    setGuitarView("create", { scrollTop: true });
  }
  const target = document.getElementById(id);
  if (target) {
    setTimeout(() => target.focus(), 120);
  }
}

function applyResets() {
  const today = todayKey();
  const week = weekKey();

  if (state.meta.lastDailyReset !== today) {
    state.habits = state.habits.map((habit) => ({ ...habit, done: false }));
    state.tasks = state.tasks.filter((task) => !task.done);
    state.meta.lastDailyReset = today;
  }

  if (state.meta.lastWeeklyReset !== week) {
    state.meta.lastWeeklyReset = week;
  }

  saveState();
}

function latestWeight() {
  return state.weightHistory.at(-1) || null;
}

function weightLoggedToday() {
  const entry = latestWeight();
  return entry ? todayKey(new Date(entry.createdAt)) === todayKey() : false;
}

function workoutsToday() {
  const today = todayKey();
  return state.workouts.filter((entry) => todayKey(new Date(entry.createdAt)) === today);
}

function workoutsThisWeek() {
  const currentWeek = weekKey();
  return state.workouts.filter((entry) => weekKey(new Date(entry.createdAt)) === currentWeek);
}

function mealsToday() {
  const today = todayKey();
  return state.meals.filter((entry) => todayKey(new Date(entry.createdAt)) === today);
}

function nutritionToday() {
  return mealsToday().reduce((totals, meal) => {
    totals.calories += Number(meal.calories || 0);
    totals.protein += Number(meal.protein || 0);
    totals.carbs += Number(meal.carbs || 0);
    totals.fats += Number(meal.fats || 0);
    return totals;
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
}

function financeToday() {
  const today = todayKey();
  return state.financeEntries.filter((entry) => todayKey(new Date(entry.createdAt)) === today);
}

function financeThisMonth() {
  const currentMonth = monthKey();
  return state.financeEntries.filter((entry) => monthKey(new Date(entry.createdAt)) === currentMonth);
}

function financeSummary(entries = financeThisMonth()) {
  return entries.reduce((totals, entry) => {
    if (entry.type === "income") {
      totals.income += Number(entry.amount || 0);
    } else {
      totals.expense += Number(entry.amount || 0);
    }
    return totals;
  }, { income: 0, expense: 0 });
}

function plannedTotal() {
  return state.plannedExpenses.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
}

function formatUsd(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatInstrumentPrice(value, symbol) {
  const numeric = Number(value || 0);
  const currency = marketMeta(symbol).currency || "USD";
  if (currency === "USD") return `$${numeric.toFixed(2)}`;
  if (currency === "EUR") return `${numeric.toFixed(2)} EUR`;
  if (currency === "PLN") return `${numeric.toFixed(2)} PLN`;
  return `${numeric.toFixed(2)} ${currency}`;
}

function formatPercent(value) {
  const numeric = Number(value || 0);
  return `${numeric >= 0 ? "+" : ""}${numeric.toFixed(2)}%`;
}

function formatSignedUsd(value) {
  const numeric = Number(value || 0);
  return `${numeric >= 0 ? "+" : "-"}$${Math.abs(numeric).toFixed(2)}`;
}

function paperQuote(symbol) {
  const normalized = String(symbol || "").trim().toUpperCase();
  const liveQuote = state.paperTrading.quotes?.[normalized] || null;
  if (liveQuote) return liveQuote;
  if (state.paperTrading.chart.symbol !== normalized) return null;
  const points = state.paperTrading.chart.points || [];
  const last = points.at(-1);
  if (!last) return null;
  const prev = points.at(-2);
  const price = Number(last.close || last.value || 0);
  const prevClose = Number(prev?.close || prev?.value || 0);
  return {
    symbol: normalized,
    price,
    change: prevClose ? price - prevClose : 0,
    changePercent: prevClose ? ((price - prevClose) / prevClose) * 100 : 0,
    high: Number(last.high || price),
    low: Number(last.low || price),
    open: Number(last.open || price),
    prevClose,
    updatedAt: state.paperTrading.chart.updatedAt,
    source: "history"
  };
}

function paperSettings() {
  return {
    ...PAPER_DEFAULT_SETTINGS,
    ...(state.paperTrading.settings || {})
  };
}

function paperInitialCash() {
  return Math.max(1, Number(state.paperTrading.initialCash || PAPER_TRADING_INITIAL_CASH));
}

function paperTradingApiKey() {
  return state.paperTrading.apiKey || PAPER_TRADING_PUBLIC_API_KEY;
}

async function simApiFetch(path, options = {}) {
  let lastError = null;
  for (const baseUrl of MARKET_SIM_API_URLS) {
    try {
      const response = await fetch(`${baseUrl}${path}`, options);
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error(`Nieprawidłowa odpowiedź z ${baseUrl}`);
      }
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.detail || `Błąd lokalnego silnika ${response.status}`);
      }
      return { payload, baseUrl };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Uruchom lokalny silnik symulacji");
}

function normalizeMarketInstrument(entry) {
  return {
    symbol: String(entry.symbol || "").trim().toUpperCase(),
    name: String(entry.name || entry.symbol || ""),
    category: String(entry.category || "Rynek"),
    exchange: String(entry.exchange || ""),
    currency: String(entry.currency || "USD"),
    assetClass: String(entry.asset_class || entry.assetClass || "stock"),
    providerSymbol: String(entry.provider_symbol || entry.providerSymbol || "")
  };
}

async function loadMarketUniverse() {
  if (marketUniverseLoaded) return;
  marketUniverseLoaded = true;
  try {
    const { payload } = await simApiFetch("/market/instruments?limit=1000");
    if (Array.isArray(payload?.instruments) && payload.instruments.length) {
      const loaded = payload.instruments
        .map(normalizeMarketInstrument)
        .filter((entry) => entry.symbol);
      const merged = [...loaded, ...MARKET_UNIVERSE.map(normalizeMarketInstrument)];
      const bySymbol = new Map();
      merged.forEach((entry) => {
        if (!bySymbol.has(entry.symbol)) bySymbol.set(entry.symbol, entry);
      });
      MARKET_UNIVERSE = [...bySymbol.values()];
      renderFinance();
    }
  } catch (error) {
    marketUniverseLoaded = false;
  }
}

function marketMeta(symbol) {
  const normalized = String(symbol || "").trim().toUpperCase();
  return MARKET_UNIVERSE.find((entry) => entry.symbol === normalized) || {
    symbol: normalized,
    name: normalized,
    category: "Rynek",
    currency: "USD",
    exchange: ""
  };
}

function paperSelectedSymbol() {
  return state.paperTrading.selectedSymbol || state.paperTrading.watchlist[0] || "AAPL";
}

function setPaperSelectedSymbol(symbol) {
  const normalized = String(symbol || "").trim().toUpperCase();
  if (!normalized) return;
  state.paperTrading.selectedSymbol = normalized;
  state.paperTrading.chart = { symbol: normalized, points: [], updatedAt: null };
}

function paperPositionShares(symbol) {
  return state.paperTrading.positions
    .filter((position) => position.symbol === symbol)
    .reduce((sum, position) => sum + Number(position.shares || 0), 0);
}

function paperPositionsValue() {
  return state.paperTrading.positions.reduce((sum, position) => {
    const quote = paperQuote(position.symbol);
    const price = Number(quote?.price || position.avgCost || 0);
    return sum + price * Number(position.shares || 0);
  }, 0);
}

function paperFilledOrders() {
  return state.paperTrading.orders.filter((order) => order.status === "filled");
}

function paperOpenOrders() {
  return state.paperTrading.orders.filter((order) => order.status === "open");
}

function paperRealizedPnl() {
  return state.paperTrading.orders.reduce((sum, order) => sum + Number(order.realizedPnl || 0), 0);
}

function paperFeesPaid() {
  return state.paperTrading.orders.reduce((sum, order) => sum + Number(order.fee || 0), 0);
}

function paperOrderTypeLabel(type) {
  return {
    market: "Po rynku",
    limit: "Limit ceny",
    stop: "Stop"
  }[type] || "Po rynku";
}

function paperOrderStatusLabel(status) {
  return {
    open: "oczekuje",
    filled: "zrealizowane",
    rejected: "odrzucone",
    cancelled: "anulowane"
  }[status] || "zrealizowane";
}

function paperOrderSideLabel(side) {
  return side === "sell" ? "Sprzedaż" : "Kupno";
}

function paperUnrealizedPnl() {
  return state.paperTrading.positions.reduce((sum, position) => {
    const quote = paperQuote(position.symbol);
    const price = Number(quote?.price || position.avgCost || 0);
    return sum + (price - Number(position.avgCost || 0)) * Number(position.shares || 0);
  }, 0);
}

function paperEquity() {
  return Number(state.paperTrading.cash || 0) + paperPositionsValue();
}

function paperTotalReturn() {
  return paperEquity() - paperInitialCash();
}

function paperReturnPercent() {
  return (paperTotalReturn() / paperInitialCash()) * 100;
}

function paperRecordEquitySnapshot(timestamp = new Date()) {
  const value = paperEquity();
  if (!Number.isFinite(value) || value <= 0) return;
  const points = Array.isArray(state.paperTrading.equityHistory) ? state.paperTrading.equityHistory.slice() : [];
  const label = formatTimeOnly(timestamp);
  const last = points.at(-1);
  const next = {
    value,
    createdAt: timestamp.toISOString(),
    label: formatUsd(value),
    bottom: label
  };
  if (last && formatTimeOnly(last.createdAt) === label && todayKey(new Date(last.createdAt)) === todayKey(timestamp)) {
    points[points.length - 1] = next;
  } else {
    points.push(next);
  }
  state.paperTrading.equityHistory = points.slice(-180);
}

function paperMarketClock(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PAPER_MARKET_TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date).reduce((result, part) => {
    result[part.type] = part.value;
    return result;
  }, {});
  const hour = Number(parts.hour || 0);
  const minute = Number(parts.minute || 0);
  const totalMinutes = hour * 60 + minute;
  const weekday = parts.weekday || "";
  const weekend = weekday === "Sat" || weekday === "Sun";
  const openMinutes = 9 * 60 + 30;
  const closeMinutes = 16 * 60;
  const isOpen = !weekend && totalMinutes >= openMinutes && totalMinutes < closeMinutes;
  return {
    isOpen,
    label: isOpen ? "Rynek otwarty" : "Rynek zamknięty",
    detail: `${weekday} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} NY`
  };
}

function paperMarketStatus() {
  if (!paperTradingApiKey()) return "Dodaj klucz API";
  if (state.paperTrading.error) return state.paperTrading.error;
  if (state.paperTrading.lastSyncAt) return formatTimeOnly(state.paperTrading.lastSyncAt);
  return "Gotowe";
}

function paperSyncSelectedSymbol() {
  if (!state.paperTrading.watchlist.includes(state.paperTrading.selectedSymbol)) {
    state.paperTrading.selectedSymbol = state.paperTrading.watchlist[0] || "AAPL";
  }
  if (state.paperTrading.chart.symbol !== state.paperTrading.selectedSymbol) {
    state.paperTrading.chart = { symbol: state.paperTrading.selectedSymbol, points: [], updatedAt: null };
  }
}

function guitarSessionsToday() {
  const today = todayKey();
  return state.guitarSessions.filter((entry) => todayKey(new Date(entry.createdAt)) === today);
}

function guitarSessionsThisWeek() {
  const currentWeek = weekKey();
  return state.guitarSessions.filter((entry) => weekKey(new Date(entry.createdAt)) === currentWeek);
}

function activeGuitarExercise() {
  return state.guitarExercises.find((exercise) => exercise.id === state.guitarActiveId) || null;
}

function inspectedGuitarExercise() {
  return state.guitarExercises.find((exercise) => exercise.id === state.guitarInspectId) || null;
}

function exerciseSessionStats(exerciseId) {
  const sessions = state.guitarSessions.filter((entry) => entry.exerciseId === exerciseId);
  const topBpm = sessions.length ? Math.max(...sessions.map((entry) => Number(entry.bpm || 0)), 0) : 0;
  const totalSec = sessions.reduce((sum, entry) => sum + Number(entry.durationSec || 0), 0);
  const latestBpm = sessions.at(-1)?.bpm || 0;
  return { sessions, topBpm, totalSec, latestBpm };
}

function currentMetronomeElapsedSec() {
  return metronomeRunning && metronomeStartedAt ? Math.max(0, Math.floor((Date.now() - metronomeStartedAt) / 1000)) : 0;
}

function exerciseTodaySec(exerciseId) {
  const today = todayKey();
  return state.guitarSessions
    .filter((entry) => entry.exerciseId === exerciseId && todayKey(new Date(entry.createdAt)) === today)
    .reduce((sum, entry) => sum + Number(entry.durationSec || 0), 0);
}

function exerciseFirstRecordedBpm(sessions = []) {
  if (!sessions.length) return 0;
  const first = sessions
    .slice()
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];
  return Number(first?.bpm || 0);
}

function computeBpmProgress(exercise, sessions, currentBpm) {
  if (!exercise) return { percent: 0, baseline: 0, target: 0 };
  const baseline = exerciseFirstRecordedBpm(sessions);
  const target = Number(exercise.targetBpm || 0);
  const bpm = Number(currentBpm || 0);
  if (!baseline) {
    return { percent: 0, baseline: 0, target };
  }
  if (target <= baseline) {
    return { percent: bpm >= target ? 100 : 0, baseline, target };
  }
  const percent = clamp(Math.round(((bpm - baseline) / (target - baseline)) * 100), 0, 100);
  return { percent, baseline, target };
}

function computeTimeProgress(targetSec, elapsedSec) {
  if (!targetSec) return 0;
  return clamp(Math.round((elapsedSec / targetSec) * 100), 0, 100);
}

function pendingExerciseSec(exerciseId) {
  return pendingGuitarSession && pendingGuitarSession.exerciseId === exerciseId
    ? Number(pendingGuitarSession.durationSec || 0)
    : 0;
}

function formatShortDateLabel(value) {
  const date = new Date(value);
  return `${date.getDate()}.${date.getMonth() + 1}`;
}

function formatTimeOnly(value) {
  const date = new Date(value);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function formatResponseMs(value) {
  const ms = Math.max(0, Math.round(Number(value || 0)));
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${ms} ms`;
}

function shuffle(list) {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function sample(list, count, exclude = []) {
  const excluded = new Set(exclude);
  return shuffle(list.filter((item) => !excluded.has(item))).slice(0, count);
}

function musicTodaySummary() {
  const guitarTodaySec = guitarSessionsToday().reduce((sum, entry) => sum + Number(entry.durationSec || 0), 0);
  const today = todayKey();
  const earToday = state.earRounds.filter((round) => todayKey(new Date(round.endedAt || round.startedAt)) === today);
  return {
    guitarTodaySec,
    earRounds: earToday.length,
    earAccuracy: earToday.length ? Math.round(earToday.reduce((sum, round) => sum + Number(round.accuracy || 0), 0) / earToday.length) : 0
  };
}

function earRoundsByType(type) {
  return state.earRounds
    .filter((round) => round.type === type)
    .slice()
    .sort((a, b) => new Date(a.endedAt || a.startedAt).getTime() - new Date(b.endedAt || b.startedAt).getTime());
}

function getEarItemPool(type, config) {
  const meta = EAR_LIBRARY[type] || EAR_LIBRARY.intervals;
  const effectiveConfig = config || defaultState.earLastConfigs[type] || defaultState.earLastConfigs.intervals;
  return meta.itemsByLevel[effectiveConfig.level] || meta.itemsByLevel.core || [];
}

function getScaleStartOptionKeys(selectedItems = []) {
  const degrees = selectedItems
    .map((item) => SCALE_INTERVALS[item]?.length || 0)
    .filter(Boolean);
  const limit = degrees.length ? Math.min(...degrees) : 7;
  const keys = [];
  for (let degree = 1; degree <= limit; degree += 1) {
    keys.push(String(degree));
  }
  keys.push("random");
  return keys;
}

function normalizeEarConfig(type, config = {}) {
  const meta = EAR_LIBRARY[type] || EAR_LIBRARY.intervals;
  const fallback = defaultState.earLastConfigs[type] || defaultState.earLastConfigs.intervals;
  const level = EAR_LEVELS[config.level] ? config.level : fallback.level;
  const playbackMode = meta.modeOptions.some((entry) => entry.value === config.playbackMode)
    ? config.playbackMode
    : (fallback.playbackMode || meta.defaultMode);
  const pool = getEarItemPool(type, { ...fallback, ...config, type, level, playbackMode });
  const selectedItems = Array.isArray(config.selectedItems)
    ? config.selectedItems.filter((item) => pool.includes(item))
    : [];
  const defaultItems = pool.slice(0, Math.min(pool.length, 4));
  const safeSelectedItems = selectedItems.length ? selectedItems : defaultItems;
  const validScaleStartKeys = meta.supportsScaleStart ? getScaleStartOptionKeys(safeSelectedItems) : ["1"];

  return {
    ...fallback,
    ...config,
    type,
    level,
    questionCount: [5, 10, 20].includes(Number(config.questionCount)) ? Number(config.questionCount) : Number(fallback.questionCount || 10),
    selectedItems: safeSelectedItems,
    playbackMode,
    headphoneMode: config.headphoneMode !== false,
    soundProfile: EAR_SOUND_PROFILES[config.soundProfile]
      ? config.soundProfile
      : (EAR_SOUND_PROFILES[fallback.soundProfile] ? fallback.soundProfile : "piano"),
    showInstrumentVisual: config.showInstrumentVisual !== false,
    selectedRoots: meta.supportsRoots
      ? (Array.isArray(config.selectedRoots) ? config.selectedRoots.filter((root) => EAR_ROOT_OPTIONS.includes(root)) : fallback.selectedRoots.slice())
      : [],
    register: meta.supportsRegister && EAR_REGISTERS[config.register]
      ? config.register
      : (meta.supportsRegister ? (fallback.register || "mid") : "mid"),
    direction: meta.supportsDirection && EAR_DIRECTIONS[config.direction]
      ? config.direction
      : (meta.supportsDirection ? (fallback.direction || meta.defaultDirection || "both") : "both"),
    scaleStartDegree: meta.supportsScaleStart && validScaleStartKeys.includes(config.scaleStartDegree)
      ? config.scaleStartDegree
      : "1",
    selectedInversions: meta.supportsInversions
      ? ((Array.isArray(config.selectedInversions) ? config.selectedInversions : fallback.selectedInversions)
        .filter((entry) => EAR_INVERSION_OPTIONS.includes(entry)).length
          ? (Array.isArray(config.selectedInversions) ? config.selectedInversions : fallback.selectedInversions)
            .filter((entry) => EAR_INVERSION_OPTIONS.includes(entry))
          : ["root"])
      : ["root"],
    presetId: typeof config.presetId === "string" && meta.presets?.some((entry) => entry.id === config.presetId)
      ? config.presetId
      : null
  };
}

function currentEarConfig(type = earConfigType) {
  return normalizeEarConfig(type, state.earLastConfigs[type] || cloneState(defaultState.earLastConfigs[type] || defaultState.earLastConfigs.intervals));
}

function setEarConfig(type, patch) {
  state.earLastConfigs[type] = normalizeEarConfig(type, { ...currentEarConfig(type), ...patch, type });
  saveState();
}

function lastEarRound(type = null) {
  const rounds = (type ? earRoundsByType(type) : state.earRounds.slice())
    .sort((a, b) => new Date(b.endedAt || b.startedAt).getTime() - new Date(a.endedAt || a.startedAt).getTime());
  return rounds[0] || null;
}

function lastEarType() {
  return lastEarRound()?.type || "intervals";
}

function earAccuracyTrend(type) {
  const rounds = earRoundsByType(type);
  if (!rounds.length) return 0;
  const recent = rounds.slice(-5);
  return Math.round(recent.reduce((sum, round) => sum + Number(round.accuracy || 0), 0) / recent.length);
}

function earBestAccuracy(type) {
  const rounds = earRoundsByType(type);
  return rounds.length ? Math.max(...rounds.map((round) => Number(round.accuracy || 0)), 0) : 0;
}

function earAverageResponse(type) {
  const rounds = earRoundsByType(type);
  if (!rounds.length) return 0;
  return Math.round(rounds.reduce((sum, round) => sum + Number(round.averageResponseTimeMs || 0), 0) / rounds.length);
}

function earProgressPercent(type) {
  return clamp(Math.round((earAccuracyTrend(type) / EAR_TARGET_ACCURACY) * 100), 0, 100);
}

function earStreak(type) {
  const rounds = earRoundsByType(type).slice().reverse();
  let streak = 0;
  for (const round of rounds) {
    if (Number(round.accuracy || 0) >= 80) {
      streak += 1;
      continue;
    }
    break;
  }
  return streak;
}

function earWeakSpots(type) {
  const map = new Map();
  earRoundsByType(type).forEach((round) => {
    (round.answers || []).forEach((answer) => {
      if (answer.isCorrect || !answer.selectedAnswer || !answer.correctAnswer) return;
      const key = `${answer.selectedAnswer}->${answer.correctAnswer}`;
      const current = map.get(key) || {
        id: key,
        from: answer.selectedAnswer,
        to: answer.correctAnswer,
        count: 0
      };
      current.count += 1;
      map.set(key, current);
    });
  });
  return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 4);
}

function earExerciseCards() {
  return Object.entries(EAR_LIBRARY).map(([type, meta]) => ({
    type,
    ...meta,
    rounds: earRoundsByType(type).length,
    accuracy: earAccuracyTrend(type),
    best: earBestAccuracy(type),
    responseMs: earAverageResponse(type),
    progress: earProgressPercent(type),
    streak: earStreak(type)
  }));
}

function earSoundProfileLabel(profile) {
  return EAR_SOUND_PROFILES[profile]?.label || EAR_SOUND_PROFILES.piano.label;
}

function earRoundRecommendation() {
  const typeScores = Object.keys(EAR_LIBRARY).map((type) => ({
    type,
    weakSpots: earWeakSpots(type),
    accuracy: earAccuracyTrend(type),
    rounds: earRoundsByType(type).length
  }));
  const withWeakSpot = typeScores
    .filter((entry) => entry.weakSpots.length)
    .sort((a, b) => b.weakSpots[0].count - a.weakSpots[0].count || a.accuracy - b.accuracy)[0];
  if (withWeakSpot) {
    const spot = withWeakSpot.weakSpots[0];
    return {
      type: withWeakSpot.type,
      title: EAR_LIBRARY[withWeakSpot.type].title,
      kind: "Slaby punkt",
      copy: `Najczesciej mylisz ${spot.from} z ${spot.to}. Runda skupi sie na tym materiale.`,
      selectedItems: [spot.from, spot.to].filter((item) => getEarItemPool(withWeakSpot.type, currentEarConfig(withWeakSpot.type)).includes(item))
    };
  }
  const undertrained = typeScores.sort((a, b) => a.rounds - b.rounds || a.accuracy - b.accuracy)[0];
  return {
    type: undertrained?.type || "intervals",
    title: EAR_LIBRARY[undertrained?.type || "intervals"].title,
    kind: undertrained?.rounds ? "Powtorka" : "Start",
    copy: undertrained?.rounds
      ? "Ten obszar ma najmniej ostatnich rund. Dobry moment na rowne domkniecie praktyki."
      : "Zacznij od krotkiej rundy i pozwol statystykom znalezc slabe punkty.",
    selectedItems: []
  };
}

function applyEarRecommendation() {
  const recommendation = earRoundRecommendation();
  const current = currentEarConfig(recommendation.type);
  const pool = getEarItemPool(recommendation.type, current);
  const selectedItems = recommendation.selectedItems?.length
    ? Array.from(new Set([...recommendation.selectedItems, ...current.selectedItems])).filter((item) => pool.includes(item)).slice(0, 6)
    : current.selectedItems;
  earConfigType = recommendation.type;
  state.earInspectType = recommendation.type;
  setEarConfig(recommendation.type, {
    ...current,
    selectedItems,
    questionCount: Math.min(10, current.questionCount || 10),
    presetId: null
  });
  earRoundSession = buildEarRound(currentEarConfig(recommendation.type));
  setGuitarView("ear-round", { scrollTop: true });
  renderAll();
  queueEarQuestionPlayback();
}

function midiToFrequency(midi) {
  return 440 * (2 ** ((midi - 69) / 12));
}

function noteNameToMidi(noteName, octave = 4) {
  return 12 * (octave + 1) + (NOTE_TO_SEMITONE[noteName] ?? 0);
}

function registerOctavePool(register) {
  if (register === "low") return [2, 3];
  if (register === "high") return [4, 5];
  if (register === "wide") return [2, 3, 4, 5];
  return [3, 4];
}

function pickEarRoot(config) {
  const roots = config.selectedRoots?.length ? config.selectedRoots : EAR_ROOT_OPTIONS;
  return roots[Math.floor(Math.random() * roots.length)] || "C";
}

function pickEarRootMidi(config) {
  const root = pickEarRoot(config);
  const octaves = registerOctavePool(config.register || "mid");
  const octave = octaves[Math.floor(Math.random() * octaves.length)] || 4;
  return noteNameToMidi(root, octave);
}

function applyChordInversion(intervals, inversion) {
  const copy = [...intervals];
  const count = inversion === "3rd" ? 3 : inversion === "2nd" ? 2 : inversion === "1st" ? 1 : 0;
  for (let index = 0; index < count; index += 1) {
    if (copy[index] === undefined) break;
    copy[index] += 12;
  }
  return copy.sort((a, b) => a - b);
}

function buildScalePlaybackPattern(intervals, mode, scaleStartDegree) {
  const source = intervals?.length ? intervals : SCALE_INTERVALS.Major;
  const maxDegree = Math.max(source.length - 1, 0);
  const degree = scaleStartDegree === "random"
    ? Math.floor(Math.random() * source.length)
    : clamp(Number(scaleStartDegree || 1) - 1, 0, maxDegree);
  const start = source[degree] ?? 0;
  const ascending = source
    .slice(degree)
    .map((step) => step - start)
    .concat(source.slice(0, degree).map((step) => step + 12 - start));
  if (mode === "descending") {
    const descendingHead = source
      .slice(0, degree + 1)
      .map((step) => step - start)
      .reverse();
    const descendingTail = source
      .slice(degree + 1)
      .map((step) => step - 12 - start)
      .reverse();
    return descendingHead.concat(descendingTail);
  }
  return ascending;
}

function currentEarPreset(type, presetId) {
  return EAR_LIBRARY[type]?.presets?.find((preset) => preset.id === presetId) || null;
}

function earItemsTitle(type, config) {
  return EAR_LIBRARY[type]?.selectedLabel || "Material";
}

function earPresetHelp(type, preset) {
  if (!preset) return "Gotowy zestaw ustawien dla szybkiego startu.";
  if (type === "progressions") return "Gotowy zestaw progresji z jednej rodziny harmonicznej.";
  if (type === "scales") return "Gotowy zestaw skal albo trybow do konkretnego celu.";
  if (type === "rhythm") return "Gotowy zestaw patternow rytmicznych.";
  return "Gotowy zestaw materialu i ustawien.";
}

function earItemsHelp(type, config) {
  if (type === "progressions") return "To mozliwe odpowiedzi dla rozpoznawania progresji harmonicznych.";
  if (type === "scales") return "To skale albo tryby, z ktorych losowana jest odpowiedz.";
  if (type === "pitch") return "To pojedyncze dzwieki, ktore mozesz rozpoznac.";
  if (type === "rhythm") return "To wzory rytmiczne, ktore sa poprawna odpowiedzia.";
  return "To mozliwe poprawne odpowiedzi w tej rundzie.";
}

function earModeHelp(type, mode) {
  if (type === "intervals") {
    return {
      melodic: "Dwa dzwieki po kolei.",
      harmonic: "Dwa dzwieki naraz.",
      both: "Losowo melodycznie albo harmonicznie."
    }[mode] || "";
  }
  if (type === "chords") {
    return {
      stack: "Akord grany naraz.",
      arp: "Akord jako arpeggio po kolei.",
      broken: "Akord rozlozony szerzej w czasie."
    }[mode] || "";
  }
  if (type === "progressions") {
    return {
      block: "Kazdy akord brzmi pelnym blokiem.",
      flow: "Akordy ukladaja sie plynniej, bardziej linearnie.",
      spread: "Kazda progresja ma szersze, bardziej przestrzenne voicingi."
    }[mode] || "";
  }
  if (type === "scales") {
    return {
      phrase: "Pelny przebieg skali od wybranego stopnia.",
      ascending: "Skala w gore.",
      descending: "Skala w dol."
    }[mode] || "";
  }
  if (type === "rhythm") {
    return {
      click: "Suchy click z wybranym patternem.",
      accent: "Wyrazniejsze akcenty rytmu."
    }[mode] || "";
  }
  return "Sposob odtworzenia materialu.";
}

function buildEarQuestion(type, config) {
  const selected = config.selectedItems?.length ? config.selectedItems : currentEarConfig(type).selectedItems;
  const rootMidi = pickEarRootMidi(config);
  const soundProfile = EAR_SOUND_PROFILES[config.soundProfile] ? config.soundProfile : "piano";

  if (type === "intervals") {
    const correctAnswer = selected[Math.floor(Math.random() * selected.length)];
    const semitonesBase = INTERVAL_SEMITONES[correctAnswer] ?? 7;
    const mode = config.playbackMode === "both"
      ? (Math.random() > 0.5 ? "melodic" : "harmonic")
      : config.playbackMode;
    const direction = mode === "harmonic"
      ? "both"
      : (config.direction === "both" ? (Math.random() > 0.5 ? "up" : "down") : config.direction);
    const semitones = direction === "down" ? -semitonesBase : semitonesBase;
    return {
      id: uid("eq"),
      type,
      correctAnswer,
      options: shuffle([correctAnswer, ...sample(selected, 3, [correctAnswer])]),
      prompt: mode === "harmonic" ? "Interwal harmoniczny" : (direction === "down" ? "Interwal w dol" : "Interwal w gore"),
      audio: { engine: "interval", rootMidi, semitones, mode, soundProfile }
    };
  }

  if (type === "chords") {
    const correctAnswer = selected[Math.floor(Math.random() * selected.length)];
    const inversionPool = config.selectedInversions?.length ? config.selectedInversions : ["root"];
    const inversion = inversionPool[Math.floor(Math.random() * inversionPool.length)] || "root";
    return {
      id: uid("eq"),
      type,
      correctAnswer,
      options: shuffle([correctAnswer, ...sample(selected, 3, [correctAnswer])]),
      prompt: inversion === "root" ? (config.playbackMode === "arp" ? "Akord jako arpeggio" : "Akord razem") : `Przewrot: ${inversion}`,
      audio: { engine: "chord", rootMidi, intervals: applyChordInversion(CHORD_INTERVALS[correctAnswer] || [0, 4, 7], inversion), mode: config.playbackMode, soundProfile }
    };
  }

  if (type === "progressions") {
    const correctAnswer = selected[Math.floor(Math.random() * selected.length)];
    const inversionPool = config.selectedInversions?.length ? config.selectedInversions : ["root"];
    const inversion = inversionPool[Math.floor(Math.random() * inversionPool.length)] || "root";
    const progression = CHORD_PROGRESSIONS[correctAnswer] || CHORD_PROGRESSIONS["ii-V-I"];
    return {
      id: uid("eq"),
      type,
      correctAnswer,
      options: shuffle([correctAnswer, ...sample(selected, 3, [correctAnswer])]),
      prompt: progression.category === "cadence"
        ? "Kadencja"
        : progression.category === "pop"
          ? "Loop"
          : progression.category === "jazz"
            ? "Turnaround"
            : "Minor",
      audio: {
        engine: "progression",
        rootMidi,
        progression,
        inversion,
        mode: config.playbackMode,
        soundProfile
      }
    };
  }

  if (type === "scales") {
    const correctAnswer = selected[Math.floor(Math.random() * selected.length)];
    const pattern = buildScalePlaybackPattern(SCALE_INTERVALS[correctAnswer] || SCALE_INTERVALS.Major, config.playbackMode, config.scaleStartDegree);
    return {
      id: uid("eq"),
      type,
      correctAnswer,
      options: shuffle([correctAnswer, ...sample(selected, 3, [correctAnswer])]),
      prompt: config.scaleStartDegree === "random" ? "Losowy start skali" : `Start od stopnia ${config.scaleStartDegree}`,
      audio: { engine: "scale", rootMidi, intervals: pattern, mode: config.playbackMode, soundProfile }
    };
  }

  if (type === "rhythm") {
    const correctAnswer = selected[Math.floor(Math.random() * selected.length)];
    return {
      id: uid("eq"),
      type,
      correctAnswer,
      options: shuffle([correctAnswer, ...sample(selected, 3, [correctAnswer])]),
      prompt: "Rytm w takcie",
      audio: { engine: "rhythm", pattern: RHYTHM_PATTERNS[correctAnswer] || RHYTHM_PATTERNS.Prosto, soundProfile }
    };
  }

  if (type === "melody") {
    const correctAnswer = selected[Math.floor(Math.random() * selected.length)];
    const pattern = [...(MELODY_PATTERNS[correctAnswer] || MELODY_PATTERNS["1-2-3"])];
    const direction = config.direction === "both" ? (Math.random() > 0.5 ? "up" : "down") : config.direction;
    return {
      id: uid("eq"),
      type,
      correctAnswer,
      options: shuffle([correctAnswer, ...sample(selected, 3, [correctAnswer])]),
      prompt: direction === "down" ? "Fraza w dol" : "Fraza melodyczna",
      audio: { engine: "melody", rootMidi, pattern: direction === "down" ? pattern.slice().reverse() : pattern, soundProfile }
    };
  }

  const correctAnswer = selected[Math.floor(Math.random() * selected.length)];
  const octaves = registerOctavePool(config.register || "mid");
  const octave = octaves[Math.floor(Math.random() * octaves.length)] || 4;
  return {
    id: uid("eq"),
    type,
    correctAnswer,
    options: shuffle([correctAnswer, ...sample(selected, 3, [correctAnswer])]),
    prompt: "Pojedynczy dzwiek",
    audio: { engine: "pitch", midi: noteNameToMidi(correctAnswer, octave), soundProfile }
  };
}

function buildEarRound(config) {
  const normalized = {
    ...config,
    selectedItems: config.selectedItems?.length ? config.selectedItems : currentEarConfig(config.type).selectedItems
  };
  return {
    id: uid("round"),
    type: normalized.type,
    config: normalized,
    startedAt: Date.now(),
    questionIndex: 0,
    answers: [],
    questions: Array.from({ length: normalized.questionCount }, () => buildEarQuestion(normalized.type, normalized)),
    answeringLocked: false,
    lastFeedback: null,
    autoplayTimer: null
  };
}

function earAudioMidiNotes(spec = {}) {
  if (spec.engine === "interval") return [spec.rootMidi, spec.rootMidi + spec.semitones];
  if (spec.engine === "chord") return (spec.intervals || [0, 4, 7]).map((step) => spec.rootMidi + step);
  if (spec.engine === "progression") {
    const firstChord = spec.progression?.chords?.[0] || { rootShift: 0, quality: "Major" };
    return applyChordInversion(CHORD_INTERVALS[firstChord.quality] || [0, 4, 7], spec.inversion || "root")
      .map((step) => spec.rootMidi + (firstChord.rootShift || 0) + step);
  }
  if (spec.engine === "scale") return (spec.intervals || []).slice(0, 8).map((step) => spec.rootMidi + step);
  if (spec.engine === "melody") return (spec.pattern || []).map((step) => spec.rootMidi + step);
  if (spec.engine === "pitch") return [spec.midi];
  return [];
}

function renderEarVisualizer(question, config) {
  const node = document.getElementById("ear-visualizer");
  if (!node) return;
  node.hidden = config?.showInstrumentVisual === false;
  if (node.hidden) {
    node.innerHTML = "";
    return;
  }
  if (!question) {
    node.innerHTML = "";
    return;
  }
  if (question.audio.engine === "rhythm") {
    const activeSteps = new Set((question.audio.pattern || []).map((point) => Math.round(point * 4)));
    node.className = "ear-visualizer rhythm";
    node.innerHTML = Array.from({ length: 16 }, (_, index) => `
      <span class="rhythm-step${activeSteps.has(index) ? " active" : ""}${index % 4 === 0 ? " beat" : ""}"></span>
    `).join("");
    return;
  }

  const profile = EAR_SOUND_PROFILES[config?.soundProfile] || EAR_SOUND_PROFILES.piano;
  const activePitchClasses = new Set(earAudioMidiNotes(question.audio).map((midi) => ((Math.round(midi) % 12) + 12) % 12));
  if (profile.visual === "fretboard") {
    node.className = "ear-visualizer fretboard";
    node.innerHTML = GUITAR_TUNER_STRINGS.map((stringInfo) => `
      <div class="fret-string">
        <span class="string-name">${stringInfo.label}</span>
        ${Array.from({ length: 7 }, (_, fret) => {
          const pitchClass = (stringInfo.pc + fret) % 12;
          return `<span class="fret${activePitchClasses.has(pitchClass) ? " active" : ""}"></span>`;
        }).join("")}
      </div>
    `).join("");
    return;
  }

  const whiteKeys = [
    { label: "C", pc: 0 },
    { label: "D", pc: 2 },
    { label: "E", pc: 4 },
    { label: "F", pc: 5 },
    { label: "G", pc: 7 },
    { label: "A", pc: 9 },
    { label: "B", pc: 11 }
  ];
  const blackKeys = [
    { pc: 1, left: 10 },
    { pc: 3, left: 24 },
    { pc: 6, left: 52 },
    { pc: 8, left: 66 },
    { pc: 10, left: 80 }
  ];
  node.className = "ear-visualizer keyboard";
  node.innerHTML = `
    <div class="keyboard-white">
      ${whiteKeys.map((key) => `<span class="piano-key${activePitchClasses.has(key.pc) ? " active" : ""}">${key.label}</span>`).join("")}
    </div>
    <div class="keyboard-black">
      ${blackKeys.map((key) => `<span class="piano-key black${activePitchClasses.has(key.pc) ? " active" : ""}" style="left:${key.left}%"></span>`).join("")}
    </div>
  `;
}

function renderGuitarDetailChart(exercise, sessions) {
  const chart = document.getElementById("guitar-detail-chart");
  if (!chart) return;
  if (!exercise || !sessions.length) {
    chart.innerHTML = `
      <text x="160" y="92" text-anchor="middle" class="chart-axis-label">Brak sesji dla tego cwiczenia.</text>
    `;
    return;
  }

  const points = sessions.slice(-6);
  const maxBpm = Math.max(exercise.targetBpm, ...points.map((entry) => Number(entry.bpm || 0)), 30);
  const left = 24;
  const right = 296;
  const top = 18;
  const bottom = 122;
  const stepX = points.length === 1 ? 0 : (right - left) / (points.length - 1);
  const path = points.map((entry, index) => {
    const x = points.length === 1 ? (left + right) / 2 : left + stepX * index;
    const ratio = maxBpm <= 0 ? 0 : Number(entry.bpm || 0) / maxBpm;
    const y = bottom - ratio * (bottom - top);
    return { x, y, entry };
  });

  const lineD = path.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");

  chart.innerHTML = `
    <line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" class="chart-grid-line"></line>
    <line x1="${left}" y1="${top}" x2="${right}" y2="${top}" class="chart-grid-line"></line>
    <text x="${left}" y="${top - 4}" class="chart-axis-label">${maxBpm} BPM</text>
    <text x="${left}" y="${bottom + 16}" class="chart-axis-label">czas</text>
    <path d="${lineD}" class="chart-line"></path>
    ${path.map((point) => `
      <circle cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="5" class="chart-point"></circle>
      <text x="${point.x.toFixed(2)}" y="${(point.y - 10).toFixed(2)}" text-anchor="middle" class="chart-point-label">${point.entry.bpm}</text>
      <text x="${point.x.toFixed(2)}" y="${(bottom + 18).toFixed(2)}" text-anchor="middle" class="chart-point-duration">${formatDuration(point.entry.durationSec)}</text>
      <text x="${point.x.toFixed(2)}" y="${(bottom + 32).toFixed(2)}" text-anchor="middle" class="chart-axis-label">${formatShortDateLabel(point.entry.createdAt)}</text>
    `).join("")}
  `;
}

function guitarOverview() {
  const totalSec = state.guitarSessions.reduce((sum, entry) => sum + Number(entry.durationSec || 0), 0);
  const topBpm = state.guitarSessions.length ? Math.max(...state.guitarSessions.map((entry) => Number(entry.bpm || 0)), 0) : 0;
  return { totalSec, topBpm, sessions: state.guitarSessions.length };
}

function computeHomeProgress() {
  const doneHabits = state.habits.filter((item) => item.done).length;
  const doneTasks = state.tasks.filter((item) => item.done).length;
  const workoutDone = workoutsToday().length ? 1 : 0;
  const musicDone = guitarSessionsToday().length || musicTodaySummary().earRounds ? 1 : 0;
  const total = state.habits.length + state.tasks.length + 2;
  const completed = doneHabits + doneTasks + workoutDone + musicDone;
  return {
    total,
    completed,
    percent: total ? Math.round((completed / total) * 100) : 0,
    openTasks: state.tasks.filter((item) => !item.done).length
  };
}

function priorityItems() {
  const priorities = [];
  const sortedTasks = state.tasks
    .filter((task) => !task.done)
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
    });

  sortedTasks.slice(0, 2).forEach((task) => {
    priorities.push({
      type: "task",
      id: task.id,
      title: task.title,
      detail: `${priorityLabel(task.priority)} priorytet`
    });
  });

  if (!workoutsToday().length && priorities.length < 3) {
    priorities.push({
      type: "tab",
      tab: "gym",
      focus: "workout-title-input",
      title: "Odpalic trening",
      detail: "Nawet krotki log ustawia rytm."
    });
  }

  if (!guitarSessionsToday().length && !musicTodaySummary().earRounds && priorities.length < 3) {
    priorities.push({
      type: "tab",
      tab: "guitar",
      focus: "open-guitar-home",
      title: "Muzyka 10 min",
      detail: "Gitara albo trening sluchu, byle wejsc w rytm."
    });
  }

  if (!weightLoggedToday() && priorities.length < 3) {
    priorities.push({
      type: "tab",
      tab: "gym",
      focus: "weight-input",
      title: "Zaloguj wage",
      detail: "Szybki punkt odniesienia na dzien."
    });
  }

  return priorities.slice(0, 3);
}

function renderDate() {
  const formatter = new Intl.DateTimeFormat("pl-PL", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
  const node = document.getElementById("home-date");
  if (node) {
    node.textContent = formatter.format(new Date());
  }
}

function emptyNode(label) {
  const node = document.createElement("div");
  node.className = "list-item";
  node.innerHTML = `<div class="list-copy"><span>${escapeHtml(label)}</span></div>`;
  return node;
}

function makeToolButton(label, onClick, danger = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `tool-button${danger ? " delete" : ""}`;
  button.textContent = label;
  let handledTouch = false;
  button.addEventListener("touchend", (event) => {
    handledTouch = true;
    event.preventDefault();
    event.stopPropagation();
    onClick();
    setTimeout(() => {
      handledTouch = false;
    }, 320);
  }, { passive: false });
  button.addEventListener("click", (event) => {
    if (handledTouch) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    onClick();
  });
  return button;
}

function renderTaskRow(task, options = {}) {
  const { withToggle = true } = options;
  const row = document.createElement("div");
  row.className = `list-item list-item-toggle${task.done ? " done" : ""}`;

  if (withToggle) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "list-toggle";
    toggle.setAttribute("aria-label", task.done ? "Cofnij" : "Zrobione");
    toggle.addEventListener("click", () => toggleTask(task.id));
    row.appendChild(toggle);
  }

  const copy = document.createElement("div");
  copy.className = "list-copy";
  copy.innerHTML = `
    <strong>${escapeHtml(task.title)}</strong>
    <span>${escapeHtml(task.detail || "Bez opisu")} - ${escapeHtml(priorityLabel(task.priority))}</span>
  `;

  const tools = document.createElement("div");
  tools.className = "list-tools";
  tools.append(
    makeToolButton("Edytuj", () => editTask(task.id)),
    makeToolButton("Usuń", () => deleteTask(task.id), true)
  );

  row.append(copy, tools);
  return row;
}

function renderHabitRow(habit, options = {}) {
  const { withToggle = true } = options;
  const row = document.createElement("div");
  row.className = `list-item list-item-toggle${habit.done ? " done" : ""}`;

  if (withToggle) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "list-toggle";
    toggle.setAttribute("aria-label", habit.done ? "Cofnij" : "Zrobione");
    toggle.addEventListener("click", () => toggleHabit(habit.id));
    row.appendChild(toggle);
  }

  const copy = document.createElement("div");
  copy.className = "list-copy";
  copy.innerHTML = `
    <strong>${escapeHtml(habit.title)}</strong>
    <span>${escapeHtml(habit.detail || "Minimum")}</span>
  `;

  const tools = document.createElement("div");
  tools.className = "list-tools";
  tools.append(
    makeToolButton("Edytuj", () => editHabit(habit.id)),
    makeToolButton("Usuń", () => deleteHabit(habit.id), true)
  );

  row.append(copy, tools);
  return row;
}

function renderPriorityList() {
  const node = document.getElementById("priority-list");
  const summary = document.getElementById("priority-count");
  const items = priorityItems();
  node.innerHTML = "";
  summary.textContent = `${items.length}`;

  if (!items.length) {
    node.appendChild(emptyNode("Dzien jest juz ogarniety. Zostaw tylko rytm."));
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "list-item";
    const copy = document.createElement("div");
    copy.className = "list-copy";
    copy.innerHTML = `
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(item.detail)}</span>
    `;

    const tools = document.createElement("div");
    tools.className = "list-tools";
    if (item.type === "task") {
      tools.appendChild(makeToolButton("Zrobione", () => toggleTask(item.id, true)));
    } else {
      tools.appendChild(makeToolButton("Otwórz", () => {
        setTab(item.tab);
        focusField(item.focus);
      }));
    }

    row.append(copy, tools);
    node.appendChild(row);
  });
}

function renderHomeTasks() {
  const node = document.getElementById("home-task-list");
  const summary = document.getElementById("home-task-summary");
  node.innerHTML = "";
  const items = state.tasks.filter((task) => !task.done).slice(0, 3);
  summary.textContent = `${state.tasks.filter((task) => !task.done).length} open`;

  if (!items.length) {
    node.appendChild(emptyNode("Brak otwartych taskow."));
    return;
  }

  items.forEach((task) => node.appendChild(renderTaskRow(task, { withToggle: false })));
}

function renderHomeHabits() {
  const node = document.getElementById("home-habit-list");
  const summary = document.getElementById("home-habit-summary");
  node.innerHTML = "";
  summary.textContent = `${state.habits.filter((habit) => habit.done).length}/${state.habits.length}`;

  if (!state.habits.length) {
    node.appendChild(emptyNode("Brak habitow."));
    return;
  }

  state.habits.slice(0, 3).forEach((habit) => node.appendChild(renderHabitRow(habit, { withToggle: false })));
}

function totalTrainingMinutes() {
  return state.workouts.reduce((sum, workout) => sum + Number(workout.duration || 0), 0);
}

function renderHome() {
  renderDate();
  const progress = computeHomeProgress();
  const nutrition = nutritionToday();
  const todayFinance = financeSummary(financeToday());
  const musicSummary = musicTodaySummary();
  const latest = latestWeight();

  document.getElementById("home-progress-value").textContent = `${progress.percent}%`;
  document.getElementById("home-progress-bar").style.width = `${progress.percent}%`;
  document.getElementById("home-progress-copy").textContent = `${progress.completed} z ${progress.total} rzeczy domkniete dzisiaj.`;
  document.getElementById("home-weight").textContent = latest ? `${Number(latest.value).toFixed(1)} kg` : "-";
  document.getElementById("home-tasks-open").textContent = `${progress.openTasks}`;
  document.getElementById("home-guitar-output").textContent = formatDuration(musicSummary.guitarTodaySec);
  document.getElementById("home-gym-output").textContent = `${workoutsThisWeek().length}/4`;
  document.getElementById("home-kcal").textContent = `${nutrition.calories}`;
  document.getElementById("home-protein").textContent = `${nutrition.protein} g`;
  document.getElementById("home-balance").textContent = formatZl(todayFinance.income - todayFinance.expense);
  document.getElementById("home-guitar-copy").textContent = `${state.guitarExercises.length} cwiczen, ${musicSummary.earRounds} rund sluchu, top ${guitarOverview().topBpm} BPM.`;
  document.getElementById("home-gym-copy").textContent = `${totalTrainingMinutes()} min lacznie, ${state.exerciseSets.length} serii w bazie.`;
  document.getElementById("home-finance-copy").textContent = `${formatZl(plannedTotal())} planowanych wydatkow.`;
  document.getElementById("home-note").textContent = state.note;

  renderPriorityList();
  renderHomeTasks();
  renderHomeHabits();
}

function renderGuitarExercises() {
  const node = document.getElementById("guitar-exercise-list");
  node.innerHTML = "";
  document.getElementById("guitar-exercise-count").textContent = `${state.guitarExercises.length}`;

  if (!state.guitarExercises.length) {
    node.appendChild(emptyNode("Dodaj pierwsze cwiczenie gitarowe."));
    return;
  }

  state.guitarExercises.forEach((exercise) => {
    const stats = exerciseSessionStats(exercise.id);
    const bpmProgress = computeBpmProgress(exercise, stats.sessions, stats.topBpm);
    const targetSec = Number(exercise.practiceMinutes || 0) * 60;
    const todaySec = exerciseTodaySec(exercise.id)
      + (exercise.id === state.guitarActiveId ? currentMetronomeElapsedSec() : 0)
      + pendingExerciseSec(exercise.id);
    const timeProgress = computeTimeProgress(targetSec, todaySec);
    const item = document.createElement("div");
    item.className = `list-item list-item-block${exercise.id === state.guitarInspectId ? " active" : ""}`;
    item.tabIndex = 0;
    item.innerHTML = `
      <div class="list-copy">
        <strong>${escapeHtml(exercise.title)}</strong>
        <span>${exercise.targetBpm} BPM · ${exercise.practiceMinutes} min</span>
      </div>
    `;
    item.addEventListener("click", () => inspectGuitarExercise(exercise.id));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        inspectGuitarExercise(exercise.id);
      }
    });

    const progress = document.createElement("div");
    progress.className = "mini-progress-stack";
    progress.innerHTML = `
      <div class="mini-progress-row">
        <span>BPM</span>
        <div class="progress-track bpm-progress-track">
          <div class="progress-fill bpm-progress-fill" style="width:${bpmProgress.percent}%"></div>
        </div>
        <strong>${bpmProgress.percent}%</strong>
      </div>
      <div class="mini-progress-row">
        <span>Czas</span>
        <div class="progress-track time-progress-track">
          <div class="progress-fill time-progress-fill" style="width:${timeProgress}%"></div>
        </div>
        <strong>${timeProgress}%</strong>
      </div>
    `;

    const tools = document.createElement("div");
    tools.className = "list-tools";
    tools.append(
      makeToolButton(exercise.id === state.guitarActiveId ? "Wyłącz" : "Użyj", () => {
        if (exercise.id === state.guitarActiveId) {
          clearActiveGuitarExercise();
          return;
        }
        selectGuitarExercise(exercise.id);
      })
    );

    item.append(progress, tools);
    node.appendChild(item);
  });
}

function renderGuitarSessions() {
  const node = document.getElementById("guitar-session-list");
  const summaryNode = document.getElementById("guitar-session-summary");
  const toggle = document.getElementById("guitar-session-toggle");
  const card = node.closest(".card");
  node.innerHTML = "";
  summaryNode.textContent = `${state.guitarSessions.length}`;
  node.hidden = !guitarSessionsExpanded;
  card?.classList.toggle("collapsed-section-card", !guitarSessionsExpanded);
  if (toggle) {
    toggle.textContent = guitarSessionsExpanded ? "-" : "+";
    toggle.setAttribute("aria-label", guitarSessionsExpanded ? "Zwin sesje" : "Rozwin sesje");
  }

  if (!guitarSessionsExpanded) {
    return;
  }

  if (!state.guitarSessions.length) {
    node.appendChild(emptyNode("Zatrzymaj metronom, zeby zapisac pierwsza sesje."));
    return;
  }

  state.guitarSessions.slice().reverse().slice(0, 6).forEach((session) => {
    const row = document.createElement("div");
    row.className = "list-item";
    row.innerHTML = `
      <div class="list-copy">
        <strong>${escapeHtml(session.exerciseTitle)}</strong>
        <span>${session.bpm} BPM - ${formatDuration(session.durationSec)}</span>
      </div>
    `;

    const tools = document.createElement("div");
    tools.className = "list-tools";
    tools.append(makeToolButton("Usuń", () => deleteGuitarSession(session.id), true));
    row.appendChild(tools);
    node.appendChild(row);
  });
}

function renderGuitarExerciseDetail() {
  const exercise = inspectedGuitarExercise();
  const sessions = exercise ? exerciseSessionStats(exercise.id) : { sessions: [], topBpm: 0, latestBpm: 0, totalSec: 0 };
  const bpmProgress = computeBpmProgress(exercise, sessions.sessions, sessions.topBpm);
  const detailList = document.getElementById("guitar-detail-list");
  const useButton = document.getElementById("guitar-detail-use");

  document.getElementById("guitar-detail-nav-title").textContent = exercise ? exercise.title : "Cwiczenie";
  document.getElementById("guitar-detail-title").textContent = exercise ? exercise.title : "Statystyki cwiczenia";
  document.getElementById("guitar-detail-summary").textContent = `${sessions.sessions.length} sesji`;
  document.getElementById("guitar-detail-top").textContent = `${sessions.topBpm || 0}`;
  document.getElementById("guitar-detail-latest").textContent = `${sessions.latestBpm || 0}`;
  document.getElementById("guitar-detail-time").textContent = formatDuration(sessions.totalSec);
  document.getElementById("guitar-detail-goal").textContent = `${bpmProgress.percent}%`;
  document.getElementById("guitar-detail-history-summary").textContent = `${sessions.sessions.length}`;
  document.getElementById("guitar-detail-progress-start").textContent = bpmProgress.baseline ? `${bpmProgress.baseline} BPM` : "--";
  document.getElementById("guitar-detail-progress-value").textContent = `${bpmProgress.percent}%`;
  document.getElementById("guitar-detail-progress-target").textContent = exercise ? `Cel ${exercise.targetBpm} BPM` : "";
  document.getElementById("guitar-detail-progress-bar").style.width = `${bpmProgress.percent}%`;
  if (useButton) {
    useButton.disabled = !exercise;
    useButton.textContent = exercise && exercise.id === state.guitarActiveId ? "Wyłącz" : "Użyj";
  }

  renderGuitarDetailChart(exercise, sessions.sessions);

  detailList.innerHTML = "";
  if (!exercise || !sessions.sessions.length) {
    detailList.appendChild(emptyNode("Kliknij cwiczenie i buduj pierwsze wpisy."));
    return;
  }

  sessions.sessions.slice().reverse().slice(0, 5).forEach((session) => {
    const row = document.createElement("div");
    row.className = "list-item";
    row.innerHTML = `
      <div class="list-copy">
        <strong>${session.bpm} BPM</strong>
        <span>${formatDuration(session.durationSec)} - ${formatShortDateLabel(session.createdAt)}</span>
      </div>
    `;
    detailList.appendChild(row);
  });
}

function renderGuitar() {
  const active = activeGuitarExercise();
  const targetSec = Number(active?.practiceMinutes || 0) * 60;
  const elapsedSec = active ? exerciseTodaySec(active.id) + currentMetronomeElapsedSec() + pendingExerciseSec(active.id) : 0;
  const timePercent = active ? computeTimeProgress(targetSec, elapsedSec) : 0;
  const clearButton = document.getElementById("guitar-active-clear");
  const resultCard = document.getElementById("guitar-result-card");
  const mainView = document.getElementById("guitar-main-view");
  const detailView = document.getElementById("guitar-detail-view");
  const createView = document.getElementById("guitar-create-view");
  const formTitle = document.getElementById("guitar-form-title");
  const formSubtitle = document.getElementById("guitar-form-subtitle");
  const formSubmit = document.getElementById("guitar-form-submit");
  const editingExercise = editingGuitarExerciseId
    ? state.guitarExercises.find((entry) => entry.id === editingGuitarExerciseId)
    : null;

  if (mainView) mainView.hidden = guitarView !== "main";
  if (detailView) detailView.hidden = guitarView !== "detail";
  if (createView) createView.hidden = guitarView !== "create";

  document.getElementById("guitar-active-name").textContent = active ? active.title : "Wybierz cwiczenie";
  document.getElementById("guitar-active-target").textContent = active ? `Cel ${active.targetBpm} BPM - ${active.practiceMinutes} min` : "Dodaj nazwe, cel BPM i czas.";
  document.getElementById("guitar-active-progress-bar").style.width = `${timePercent}%`;
  document.getElementById("guitar-active-progress-value").textContent = `${timePercent}%`;
  document.getElementById("guitar-active-progress-copy").textContent = active ? `${formatDuration(elapsedSec)} / ${formatDuration(targetSec)}` : "";
  if (formTitle) formTitle.textContent = editingExercise ? "Edycja cwiczenia" : "Nowe cwiczenie";
  if (formSubtitle) formSubtitle.textContent = editingExercise ? "Zmien nazwe, BPM i czas" : "Nazwa, BPM i czas";
  if (formSubmit) formSubmit.textContent = editingExercise ? "Zapisz zmiany" : "Dodaj cwiczenie";
  if (clearButton) {
    clearButton.hidden = !active;
  }
  if (resultCard) {
    resultCard.hidden = !pendingGuitarSession;
  }
  if (pendingGuitarSession) {
    document.getElementById("guitar-result-summary").textContent = formatDuration(pendingGuitarSession.durationSec);
  }

  renderGuitarExercises();
  renderGuitarExerciseDetail();
  renderGuitarSessions();
  renderMetronome();
  if (guitarView === "main") {
    stabilizeGuitarLayout();
  }
}

function renderSimpleLineChart(nodeId, points, options = {}) {
  const chart = document.getElementById(nodeId);
  if (!chart) return;
  if (!points.length) {
    chart.innerHTML = `<text x="160" y="92" text-anchor="middle" class="chart-axis-label">Brak danych.</text>`;
    return;
  }

  const values = points.map((point) => Number(point.value || 0));
  const rawMaxValue = Math.max(options.max ?? Number.NEGATIVE_INFINITY, ...values);
  const rawMinValue = Math.min(options.min ?? Number.POSITIVE_INFINITY, ...values);
  const baselineZero = options.baselineZero !== false;
  const padding = baselineZero ? 0 : Math.max(0.01, (rawMaxValue - rawMinValue) * 0.12);
  const minValue = baselineZero ? 0 : rawMinValue - padding;
  const maxValue = baselineZero ? Math.max(rawMaxValue, 1) : rawMaxValue + padding;
  const left = 24;
  const right = 296;
  const top = 18;
  const bottom = 122;
  const stepX = points.length === 1 ? 0 : (right - left) / (points.length - 1);
  const path = points.map((point, index) => {
    const x = points.length === 1 ? (left + right) / 2 : left + stepX * index;
    const range = maxValue - minValue;
    const ratio = range <= 0 ? 0.5 : (Number(point.value || 0) - minValue) / range;
    const y = bottom - ratio * (bottom - top);
    return { x, y, point };
  });
  const lineD = path.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");

  chart.innerHTML = `
    <line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" class="chart-grid-line"></line>
    <line x1="${left}" y1="${top}" x2="${right}" y2="${top}" class="chart-grid-line"></line>
    <text x="${left}" y="${top - 4}" class="chart-axis-label">${options.topLabel || maxValue}</text>
    <path d="${lineD}" class="chart-line"></path>
    ${path.map((entry, index) => `
      <circle cx="${entry.x.toFixed(2)}" cy="${entry.y.toFixed(2)}" r="5" class="chart-point"></circle>
      ${options.compactLabels && index % Math.ceil(path.length / 6) !== 0 && index !== path.length - 1 ? "" : `
        <text x="${entry.x.toFixed(2)}" y="${(entry.y - 10).toFixed(2)}" text-anchor="middle" class="chart-point-label">${entry.point.label || entry.point.value}</text>
        <text x="${entry.x.toFixed(2)}" y="${(bottom + 18).toFixed(2)}" text-anchor="middle" class="chart-axis-label">${entry.point.bottom || ""}</text>
      `}
    `).join("")}
  `;
}

function renderBarChart(nodeId, points, options = {}) {
  const chart = document.getElementById(nodeId);
  if (!chart) return;
  if (!points.length) {
    chart.innerHTML = `<text x="160" y="92" text-anchor="middle" class="chart-axis-label">Brak danych.</text>`;
    return;
  }
  const maxValue = Math.max(options.max ?? 0, ...points.map((point) => Number(point.value || 0)), 1);
  const left = 28;
  const right = 292;
  const top = 18;
  const bottom = 128;
  const width = Math.max(18, (right - left) / Math.max(points.length, 1) - 12);

  chart.innerHTML = `
    <line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" class="chart-grid-line"></line>
    <text x="${left}" y="${top - 4}" class="chart-axis-label">${options.topLabel || maxValue}</text>
    ${points.map((point, index) => {
      const ratio = Number(point.value || 0) / maxValue;
      const height = Math.max(6, ratio * (bottom - top));
      const x = left + index * ((right - left) / Math.max(points.length, 1));
      const y = bottom - height;
      return `
        <rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${width.toFixed(2)}" height="${height.toFixed(2)}" rx="10" class="chart-bar"></rect>
        <text x="${(x + width / 2).toFixed(2)}" y="${(y - 8).toFixed(2)}" text-anchor="middle" class="chart-point-label">${point.label || point.value}</text>
        <text x="${(x + width / 2).toFixed(2)}" y="${(bottom + 18).toFixed(2)}" text-anchor="middle" class="chart-axis-label">${point.bottom || ""}</text>
      `;
    }).join("")}
  `;
}

function renderMusicHome() {
  document.getElementById("music-guitar-card-copy").textContent = `${state.guitarExercises.length} cwiczen, top ${guitarOverview().topBpm} BPM`;
  document.getElementById("music-ear-card-copy").textContent = state.earRounds.length
    ? `${state.earRounds.length} rund, ostatnio ${EAR_LIBRARY[lastEarType()].title}`
    : "0 rund, gotowe do startu";
  const tunerCopy = document.getElementById("music-tuner-card-copy");
  if (tunerCopy) tunerCopy.textContent = tunerRunning ? "Mikrofon aktywny" : "Mikrofon i gryf";
  return;

  const combined = [
    ...state.guitarSessions.slice(-3).map((session) => ({
      kind: "guitar",
      title: session.exerciseTitle,
      meta: `${session.bpm} BPM · ${formatDuration(session.durationSec)}`,
      createdAt: session.createdAt
    })),
    ...state.earRounds.slice(-3).map((round) => ({
      kind: "ear",
      title: EAR_LIBRARY[round.type]?.title || round.type,
      meta: `${round.accuracy}% · ${formatResponseMs(round.averageResponseTimeMs)}`,
      createdAt: round.endedAt || round.startedAt
    }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);

  if (!combined.length) {
    recentNode.appendChild(emptyNode("Brak sesji w muzyce."));
    return;
  }

  combined.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "list-item";
    row.innerHTML = `
      <div class="list-copy">
        <strong>${escapeHtml(entry.title)}</strong>
        <span>${escapeHtml(entry.meta)} - ${formatShortDateLabel(entry.createdAt)}</span>
      </div>
    `;
    recentNode.appendChild(row);
  });
}

function renderEarHome() {
  const cards = earExerciseCards();
  const listNode = document.getElementById("ear-exercise-list");
  const recentNode = document.getElementById("ear-recent-list");
  const lastRoundEntry = lastEarRound();
  const recommendation = earRoundRecommendation();
  document.getElementById("ear-home-summary").textContent = `${cards.length} lekcji`;
  document.getElementById("ear-type-count").textContent = `${cards.length}`;
  document.getElementById("ear-recent-summary").textContent = `${Math.min(state.earRounds.length, 6)}`;
  document.getElementById("ear-home-last-title").textContent = lastRoundEntry ? (EAR_LIBRARY[lastRoundEntry.type]?.title || "Runda") : "Ostatnia runda";
  document.getElementById("ear-home-last-copy").textContent = lastRoundEntry ? formatShortDateLabel(lastRoundEntry.endedAt || lastRoundEntry.startedAt) : "Brak";
  document.getElementById("ear-home-last-accuracy").textContent = `${lastRoundEntry?.accuracy || 0}%`;
  document.getElementById("ear-home-last-meta").textContent = formatResponseMs(lastRoundEntry?.averageResponseTimeMs || 0);
  document.getElementById("ear-home-last-progress").style.width = `${lastRoundEntry ? clamp(Math.round((lastRoundEntry.accuracy / EAR_TARGET_ACCURACY) * 100), 0, 100) : 0}%`;
  document.getElementById("ear-recommendation-kind").textContent = recommendation.kind;
  document.getElementById("ear-recommendation-title").textContent = recommendation.title;
  document.getElementById("ear-recommendation-copy").textContent = recommendation.copy;

  listNode.innerHTML = "";
  cards.forEach((card) => {
    const row = document.createElement("div");
    row.className = `list-item list-item-block ear-type-card${state.earInspectType === card.type ? " active" : ""}`;
    row.innerHTML = `
      <div class="list-copy">
        <strong>${escapeHtml(card.title)}</strong>
        <span>${escapeHtml(card.subtitle)}</span>
      </div>
    `;
    row.addEventListener("click", () => openEarConfigView(card.type));

    const meta = document.createElement("div");
    meta.className = "ear-type-meta";
    meta.innerHTML = `
      <span class="ear-type-badge">${card.rounds} rund</span>
      <span class="ear-type-badge">${card.accuracy}% dokl.</span>
      <span class="ear-type-badge">${formatResponseMs(card.responseMs)}</span>
    `;

    const progress = document.createElement("div");
    progress.className = "mini-progress-stack";
    progress.innerHTML = `
      <div class="mini-progress-row">
        <span>Cel</span>
        <div class="progress-track bpm-progress-track">
          <div class="progress-fill bpm-progress-fill" style="width:${card.progress}%"></div>
        </div>
        <strong>${card.progress}%</strong>
      </div>
    `;

    const tools = document.createElement("div");
    tools.className = "list-tools";
    tools.append(
      makeToolButton("Cwicz", () => openEarConfigView(card.type)),
      makeToolButton("Statystyki", () => openEarDetailView(card.type))
    );

    row.append(meta, progress, tools);
    listNode.appendChild(row);
  });

  recentNode.innerHTML = "";
  if (!state.earRounds.length) {
    recentNode.appendChild(emptyNode("Brak rund sluchowych."));
    return;
  }

  state.earRounds.slice().reverse().slice(0, 6).forEach((round) => {
    const row = document.createElement("div");
    row.className = "list-item";
    row.innerHTML = `
      <div class="list-copy">
        <strong>${escapeHtml(EAR_LIBRARY[round.type]?.title || round.type)}</strong>
        <span>${round.accuracy}% dokladnosci - ${formatResponseMs(round.averageResponseTimeMs)} - ${formatShortDateLabel(round.endedAt || round.startedAt)}</span>
      </div>
    `;
    const tools = document.createElement("div");
    tools.className = "list-tools";
    tools.append(makeToolButton("Statystyki", () => openEarDetailView(round.type)));
    row.appendChild(tools);
    recentNode.appendChild(row);
  });
}

function renderEarConfig() {
  const meta = EAR_LIBRARY[earConfigType];
  const config = currentEarConfig(earConfigType);
  const itemPool = getEarItemPool(earConfigType, config);
  const scaleStartOptions = getScaleStartOptionKeys(config.selectedItems);
  const preset = currentEarPreset(earConfigType, config.presetId);
  const supportsRoots = Boolean(meta.supportsRoots);
  const supportsRegister = Boolean(meta.supportsRegister);
  const supportsDirection = Boolean(meta.supportsDirection);
  const supportsScaleStart = Boolean(meta.supportsScaleStart);
  const supportsInversions = Boolean(meta.supportsInversions);
  document.getElementById("ear-config-title").textContent = meta.title;
  document.getElementById("ear-config-subtitle").textContent = meta.subtitle;
  document.getElementById("ear-preset-copy").textContent = preset?.label || "Wlasne";
  document.getElementById("ear-config-level-copy").textContent = EAR_LEVELS[config.level];
  document.getElementById("ear-count-copy").textContent = `${config.questionCount}`;
  document.getElementById("ear-items-title").textContent = earItemsTitle(earConfigType, config);
  document.getElementById("ear-items-copy").textContent = `${config.selectedItems.filter((item) => itemPool.includes(item)).length}`;
  document.getElementById("ear-mode-copy").textContent = meta.modeOptions.find((item) => item.value === config.playbackMode)?.label || meta.modeOptions[0].label;
  document.getElementById("ear-sound-copy").textContent = earSoundProfileLabel(config.soundProfile);
  document.getElementById("ear-visual-copy").textContent = config.showInstrumentVisual ? "Pokaz" : "Ukryj";
  document.getElementById("ear-start-profile-copy").textContent = `${earSoundProfileLabel(config.soundProfile)} · ${config.questionCount} pyt.`;
  document.getElementById("ear-roots-copy").textContent = config.selectedRoots?.length ? `${config.selectedRoots.length}` : "Wszystkie";
  document.getElementById("ear-register-copy").textContent = EAR_REGISTERS[config.register] || "Srodkowy";
  document.getElementById("ear-direction-copy").textContent = EAR_DIRECTIONS[config.direction] || "Losowo";
  document.getElementById("ear-scale-start-copy").textContent = EAR_SCALE_STARTS[config.scaleStartDegree] || "1";
  document.getElementById("ear-inversions-copy").textContent = config.selectedInversions?.length ? config.selectedInversions.join(", ") : "Pozycja zasadnicza";
  document.getElementById("ear-preset-help").textContent = earPresetHelp(earConfigType, preset);
  document.getElementById("ear-level-help").textContent = `Skupienie: ${EAR_LEVEL_HELP.focus} Podstawowy: ${EAR_LEVEL_HELP.core} Rozszerzony: ${EAR_LEVEL_HELP.wide}`;
  document.getElementById("ear-count-help").textContent = "5 to szybki sprint, 10 to standard, 20 to dluzsza runda.";
  document.getElementById("ear-items-help").textContent = earItemsHelp(earConfigType, config);
  document.getElementById("ear-mode-help").textContent = earModeHelp(earConfigType, config.playbackMode);
  document.getElementById("ear-sound-help").textContent = EAR_SOUND_PROFILES[config.soundProfile]?.description || EAR_SOUND_PROFILES.piano.description;
  document.getElementById("ear-roots-help").textContent = "Wybierasz, z jakich tonacji losowany jest material. Puste oznacza wszystkie.";
  document.getElementById("ear-register-help").textContent = Object.entries(EAR_REGISTER_HELP).map(([key, value]) => `${EAR_REGISTERS[key]}: ${value}`).join(" ");
  document.getElementById("ear-direction-help").textContent = Object.entries(EAR_DIRECTION_HELP).map(([key, value]) => `${EAR_DIRECTIONS[key]}: ${value}`).join(" ");
  document.getElementById("ear-scale-start-help").textContent = "Okresla, od ktorego stopnia zaczyna sie pelny przebieg skali.";
  document.getElementById("ear-inversions-help").textContent = earConfigType === "progressions"
    ? "Wybierasz, jakie voicingi i przewroty sa dozwolone w progresji."
    : "Wybierasz, jakie przewroty akordu sa dozwolone.";

  const presetGrid = document.getElementById("ear-preset-grid");
  presetGrid.innerHTML = "";
  (meta.presets || []).forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `ear-chip-button${config.presetId === entry.id ? " active" : ""}`;
    button.textContent = entry.label;
    button.addEventListener("click", () => {
      setEarConfig(earConfigType, { ...entry, type: earConfigType, questionCount: currentEarConfig(earConfigType).questionCount, headphoneMode: true });
      renderEarConfig();
    });
    presetGrid.appendChild(button);
  });

  const levelGrid = document.getElementById("ear-level-grid");
  levelGrid.innerHTML = "";
  Object.entries(EAR_LEVELS).forEach(([value, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `metronome-option-button${config.level === value ? " active" : ""}`;
    button.textContent = label;
    button.addEventListener("click", () => {
      const selectedItems = getEarItemPool(earConfigType, { ...config, level: value }).slice(0, 6);
      setEarConfig(earConfigType, { level: value, selectedItems, presetId: null });
      renderEarConfig();
    });
    levelGrid.appendChild(button);
  });

  const countGrid = document.getElementById("ear-count-grid");
  countGrid.innerHTML = "";
  [5, 10, 20].forEach((count) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `metronome-option-button${config.questionCount === count ? " active" : ""}`;
    button.textContent = `${count}`;
    button.addEventListener("click", () => {
      setEarConfig(earConfigType, { questionCount: count });
      renderEarConfig();
    });
    countGrid.appendChild(button);
  });

  const itemGrid = document.getElementById("ear-item-grid");
  itemGrid.innerHTML = "";
  itemPool.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `ear-chip-button${config.selectedItems.includes(item) ? " active" : ""}`;
    button.textContent = item;
    button.addEventListener("click", () => {
      const selected = config.selectedItems.includes(item)
        ? config.selectedItems.filter((entry) => entry !== item)
        : [...config.selectedItems, item];
      const next = selected.length ? selected : [item];
      setEarConfig(earConfigType, { selectedItems: next, presetId: null });
      renderEarConfig();
    });
    itemGrid.appendChild(button);
  });

  const modeGrid = document.getElementById("ear-mode-grid");
  modeGrid.innerHTML = "";
  meta.modeOptions.forEach((mode) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `metronome-option-button${config.playbackMode === mode.value ? " active" : ""}`;
    button.textContent = mode.label;
    button.addEventListener("click", () => {
      const selectedItems = getEarItemPool(earConfigType, { ...config, playbackMode: mode.value }).slice(0, 6);
      setEarConfig(earConfigType, { playbackMode: mode.value, selectedItems, presetId: null });
      renderEarConfig();
    });
    modeGrid.appendChild(button);
  });

  const soundGrid = document.getElementById("ear-sound-grid");
  soundGrid.innerHTML = "";
  Object.entries(EAR_SOUND_PROFILES).forEach(([value, profile]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `ear-chip-button sound-chip${config.soundProfile === value ? " active" : ""}`;
    button.innerHTML = `<strong>${escapeHtml(profile.label)}</strong><span>${escapeHtml(profile.shortLabel)}</span>`;
    button.addEventListener("click", () => {
      setEarConfig(earConfigType, { soundProfile: value });
      renderEarConfig();
    });
    soundGrid.appendChild(button);
  });

  const visualGrid = document.getElementById("ear-visual-grid");
  visualGrid.innerHTML = "";
  [
    { value: true, label: "Pokaz" },
    { value: false, label: "Ukryj" }
  ].forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `metronome-option-button${config.showInstrumentVisual === option.value ? " active" : ""}`;
    button.textContent = option.label;
    button.addEventListener("click", () => {
      setEarConfig(earConfigType, { showInstrumentVisual: option.value });
      renderEarConfig();
    });
    visualGrid.appendChild(button);
  });

  const rootBlock = document.getElementById("ear-root-grid").closest(".advanced-config-block");
  const registerBlock = document.getElementById("ear-register-grid").closest(".advanced-config-block");
  const directionBlock = document.getElementById("ear-direction-grid").closest(".advanced-config-block");
  const scaleStartBlock = document.getElementById("ear-scale-start-grid").closest(".advanced-config-block");
  const inversionBlock = document.getElementById("ear-inversion-grid").closest(".advanced-config-block");
  rootBlock.hidden = !supportsRoots;
  registerBlock.hidden = !supportsRegister;
  directionBlock.hidden = !supportsDirection;
  scaleStartBlock.hidden = !supportsScaleStart;
  inversionBlock.hidden = !supportsInversions;
  document.getElementById("ear-advanced-card").hidden = !(supportsRoots || supportsRegister || supportsDirection || supportsScaleStart || supportsInversions);

  const rootGrid = document.getElementById("ear-root-grid");
  rootGrid.innerHTML = "";
  EAR_ROOT_OPTIONS.forEach((root) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `ear-chip-button${config.selectedRoots.includes(root) ? " active" : ""}`;
    button.textContent = root;
    button.addEventListener("click", () => {
      const selected = config.selectedRoots.includes(root)
        ? config.selectedRoots.filter((entry) => entry !== root)
        : [...config.selectedRoots, root];
      setEarConfig(earConfigType, { selectedRoots: selected, presetId: null });
      renderEarConfig();
    });
    rootGrid.appendChild(button);
  });

  const registerGrid = document.getElementById("ear-register-grid");
  registerGrid.innerHTML = "";
  Object.entries(EAR_REGISTERS).forEach(([value, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `metronome-option-button${config.register === value ? " active" : ""}`;
    button.textContent = label;
    button.addEventListener("click", () => {
      setEarConfig(earConfigType, { register: value, presetId: null });
      renderEarConfig();
    });
    registerGrid.appendChild(button);
  });

  const directionGrid = document.getElementById("ear-direction-grid");
  directionGrid.innerHTML = "";
  Object.entries(EAR_DIRECTIONS).forEach(([value, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `metronome-option-button${config.direction === value ? " active" : ""}`;
    button.textContent = label;
    button.addEventListener("click", () => {
      setEarConfig(earConfigType, { direction: value, presetId: null });
      renderEarConfig();
    });
    directionGrid.appendChild(button);
  });

  const scaleStartGrid = document.getElementById("ear-scale-start-grid");
  scaleStartGrid.innerHTML = "";
  scaleStartOptions.forEach((value) => {
    const label = EAR_SCALE_STARTS[value];
    const button = document.createElement("button");
    button.type = "button";
    button.className = `metronome-option-button${config.scaleStartDegree === value ? " active" : ""}`;
    button.textContent = label;
    button.addEventListener("click", () => {
      setEarConfig(earConfigType, { scaleStartDegree: value, presetId: null });
      renderEarConfig();
    });
    scaleStartGrid.appendChild(button);
  });

  const inversionGrid = document.getElementById("ear-inversion-grid");
  inversionGrid.innerHTML = "";
  EAR_INVERSION_OPTIONS.forEach((inversion) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `ear-chip-button${config.selectedInversions.includes(inversion) ? " active" : ""}`;
    button.textContent = inversion;
    button.addEventListener("click", () => {
      const selected = config.selectedInversions.includes(inversion)
        ? config.selectedInversions.filter((entry) => entry !== inversion)
        : [...config.selectedInversions, inversion];
      setEarConfig(earConfigType, { selectedInversions: selected.length ? selected : ["root"], presetId: null });
      renderEarConfig();
    });
    inversionGrid.appendChild(button);
  });
}

function renderEarRound() {
  const session = earRoundSession;
  const question = session?.questions?.[session.questionIndex] || null;
  const answerGrid = document.getElementById("ear-answer-grid");
  const feedbackNode = document.getElementById("ear-round-feedback");
  const progressNode = document.getElementById("ear-round-progress-bar");
  document.getElementById("ear-round-title").textContent = session ? EAR_LIBRARY[session.type].title : "Trening sluchu";
  document.getElementById("ear-round-summary").textContent = session ? `${session.questionIndex + 1} / ${session.questions.length}` : "0 / 0";
  document.getElementById("ear-round-prompt").textContent = question?.prompt || "Odsłuchaj pytanie";
  document.getElementById("ear-round-live-score").textContent = session?.answers?.length
    ? `${Math.round((session.answers.filter((answer) => answer.isCorrect).length / session.answers.length) * 100)}%`
    : "0%";
  if (progressNode) {
    const progress = session ? ((session.questionIndex + 1) / Math.max(session.questions.length, 1)) * 100 : 0;
    progressNode.style.width = `${clamp(progress, 0, 100)}%`;
  }
  if (feedbackNode) {
    if (session?.lastFeedback) {
      const ok = session.lastFeedback.selected === session.lastFeedback.correct;
      feedbackNode.hidden = false;
      feedbackNode.className = `ear-feedback ${ok ? "correct" : "wrong"}`;
      feedbackNode.textContent = ok
        ? "Dobrze. Ucho zlapalo kierunek."
        : `Poprawna odpowiedz: ${session.lastFeedback.correct}`;
    } else {
      feedbackNode.hidden = true;
      feedbackNode.textContent = "";
      feedbackNode.className = "ear-feedback";
    }
  }
  renderEarVisualizer(question, session?.config);
  answerGrid.innerHTML = "";
  if (!question) {
    answerGrid.appendChild(emptyNode("Brak pytania."));
    return;
  }

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ear-answer-button";
    button.textContent = option;
    button.addEventListener("click", () => submitEarAnswer(option));
    if (session.lastFeedback) {
      const chosen = session.lastFeedback.selected === option;
      const correct = question.correctAnswer === option;
      if (correct) button.classList.add("correct");
      else if (chosen) button.classList.add("wrong");
      else button.classList.add("dimmed");
      button.disabled = true;
    }
    answerGrid.appendChild(button);
  });
}

function renderEarSummary() {
  const last = lastEarRound(earConfigType) || lastEarRound();
  document.getElementById("ear-summary-title").textContent = last ? (EAR_LIBRARY[last.type]?.title || "Wynik") : "Wynik rundy";
  document.getElementById("ear-summary-copy").textContent = last ? `${last.correct} / ${last.totalQuestions}` : "0 / 0";
  document.getElementById("ear-summary-accuracy").textContent = `${last?.accuracy || 0}%`;
  document.getElementById("ear-summary-response").textContent = formatResponseMs(last?.averageResponseTimeMs || 0);
  document.getElementById("ear-summary-streak").textContent = `${last ? earStreak(last.type) : 0}`;
  document.getElementById("ear-summary-type").textContent = last ? (EAR_LIBRARY[last.type]?.title || last.type) : "-";
}

function renderEarDetail() {
  const type = state.earInspectType;
  const meta = EAR_LIBRARY[type];
  const rounds = earRoundsByType(type);
  const last = lastEarRound(type);
  const weakNode = document.getElementById("ear-detail-weak-list");
  const historyNode = document.getElementById("ear-detail-history-list");
  const progress = earProgressPercent(type);

  document.getElementById("ear-detail-nav-title").textContent = meta.title;
  document.getElementById("ear-detail-title").textContent = meta.title;
  document.getElementById("ear-detail-summary").textContent = `${rounds.length} rund`;
  document.getElementById("ear-detail-last-used").textContent = last ? formatShortDateLabel(last.endedAt || last.startedAt) : "Brak";
  document.getElementById("ear-detail-accuracy").textContent = `${earAccuracyTrend(type)}%`;
  document.getElementById("ear-detail-best").textContent = `${earBestAccuracy(type)}%`;
  document.getElementById("ear-detail-response").textContent = formatResponseMs(earAverageResponse(type));
  document.getElementById("ear-detail-rounds").textContent = `${rounds.length}`;
  document.getElementById("ear-detail-progress-value").textContent = `${progress}%`;
  document.getElementById("ear-detail-progress-bar").style.width = `${progress}%`;
  document.getElementById("ear-detail-history-summary").textContent = `${rounds.length}`;

  renderSimpleLineChart(
    "ear-detail-accuracy-chart",
    rounds.slice(-6).map((round) => ({
      value: round.accuracy,
      label: `${round.accuracy}%`,
      bottom: formatShortDateLabel(round.endedAt || round.startedAt)
    })),
    { max: 100, topLabel: "100%" }
  );
  renderBarChart(
    "ear-detail-speed-chart",
    rounds.slice(-6).map((round) => ({
      value: Math.max(100, round.averageResponseTimeMs || 0),
      label: `${Math.round((round.averageResponseTimeMs || 0) / 100) / 10}s`,
      bottom: formatShortDateLabel(round.endedAt || round.startedAt)
    })),
    { topLabel: "szybkosc" }
  );

  const weakSpots = earWeakSpots(type);
  document.getElementById("ear-detail-weak-summary").textContent = `${weakSpots.length}`;
  weakNode.innerHTML = "";
  if (!weakSpots.length) {
    weakNode.appendChild(emptyNode("Brak mocnych wzorcow bledu."));
  } else {
    weakSpots.forEach((spot) => {
      const row = document.createElement("div");
      row.className = "list-item";
      row.innerHTML = `
        <div class="list-copy">
          <strong>${escapeHtml(spot.from)} -> ${escapeHtml(spot.to)}</strong>
          <span>${spot.count} razy</span>
        </div>
      `;
      weakNode.appendChild(row);
    });
  }

  historyNode.innerHTML = "";
  if (!rounds.length) {
    historyNode.appendChild(emptyNode("Uruchom pierwsza runde."));
  } else {
    rounds.slice().reverse().slice(0, 6).forEach((round) => {
      const row = document.createElement("div");
      row.className = "list-item";
      row.innerHTML = `
        <div class="list-copy">
          <strong>${round.accuracy}% dokladnosci</strong>
          <span>${formatResponseMs(round.averageResponseTimeMs)} - ${round.correct}/${round.totalQuestions}</span>
        </div>
      `;
      historyNode.appendChild(row);
    });
  }
}

function tunerTargetString() {
  return GUITAR_TUNER_STRINGS.find((entry) => entry.id === tunerTargetStringId) || GUITAR_TUNER_STRINGS.at(-1);
}

function fretPracticePattern() {
  return FRETBOARD_PRACTICE_LIBRARY.find((entry) => entry.id === fretPracticePatternId) || FRETBOARD_PRACTICE_LIBRARY[0];
}

function fretPracticePosition() {
  return FRETBOARD_POSITIONS.find((entry) => entry.id === fretPracticePositionId) || FRETBOARD_POSITIONS[0];
}

function noteNameToPitchClass(noteName) {
  return NOTE_TO_SEMITONE[noteName] ?? 0;
}

function fretPracticePitchClasses() {
  const rootPc = noteNameToPitchClass(fretPracticeRoot);
  return new Set(fretPracticePattern().intervals.map((step) => (rootPc + step) % 12));
}

function fretMidiAllowedByPattern(midi) {
  const rootPc = noteNameToPitchClass(fretPracticeRoot);
  const relative = (((midi % 12) + 12) % 12 - rootPc + 12) % 12;
  return fretPracticePattern().intervals.some((step) => step % 12 === relative);
}

function median(values) {
  const sorted = values.filter((value) => Number.isFinite(value)).slice().sort((a, b) => a - b);
  if (!sorted.length) return 0;
  return sorted[Math.floor(sorted.length / 2)];
}

function midiToNoteLabel(midi) {
  const names = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
  const rounded = Math.round(midi);
  return `${names[((rounded % 12) + 12) % 12]}${Math.floor(rounded / 12) - 1}`;
}

function frequencyToMidiValue(frequency) {
  return 69 + 12 * Math.log2(frequency / 440);
}

function centsFromTarget(frequency, targetFrequency) {
  if (!frequency || !targetFrequency) return 0;
  return clamp(Math.round(1200 * Math.log2(frequency / targetFrequency)), -50, 50);
}

function fretNumbersForPosition(position = fretPracticePosition(), compact = false, forceFull = false) {
  const source = forceFull ? FRETBOARD_POSITIONS[0] : position;
  const start = compact && source.id === "all" ? 0 : source.start;
  const end = compact && source.id === "all" ? 7 : source.end;
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function maxNotesPerStringForPattern(pattern = fretPracticePattern()) {
  if (pattern.group === "intervals") return 2;
  if (pattern.group === "arpeggios") return Math.min(3, pattern.intervals.length);
  if (pattern.family === "Pentatonika" && pattern.intervals.length <= 5) return 2;
  return 3;
}

function highlightedFretsForString(stringInfo, frets, position = fretPracticePosition()) {
  const visibleFrets = new Set(fretNumbersForPosition(position, false));
  const candidates = frets
    .filter((fret) => visibleFrets.has(fret) && fretMidiAllowedByPattern(stringInfo.midi + fret));
  if (position.id === "all") return new Set(candidates);
  const maxNotes = maxNotesPerStringForPattern();
  const center = (position.start + position.end) / 2;
  return new Set(
    candidates
      .slice()
      .sort((a, b) => Math.abs(a - center) - Math.abs(b - center) || a - b)
      .slice(0, maxNotes)
  );
}

function renderTunerFretboard(targetId = "tuner-fretboard", options = {}) {
  const node = document.getElementById(targetId);
  if (!node) return;
  const position = fretPracticePosition();
  const frets = fretNumbersForPosition(position, !options.fullscreen, options.fullscreen);
  const detectedMidi = tunerDetection.frequency ? Math.round(frequencyToMidiValue(tunerDetection.frequency)) : null;
  const rootPc = noteNameToPitchClass(fretPracticeRoot);
  node.style.setProperty("--fret-count", String(frets.length));
  const fretHeader = options.fullscreen ? `
    <div class="tuner-fret-string tuner-fret-header">
      <span></span>
      ${frets.map((fret) => `<span>${fret}</span>`).join("")}
    </div>
  ` : "";
  node.innerHTML = GUITAR_TUNER_STRINGS.map((stringInfo) => `
    <div class="tuner-fret-string${stringInfo.id === tunerTargetStringId ? " target" : ""}">
      <span class="string-name">${stringInfo.label}</span>
      ${frets.map((fret) => {
        const highlightedFrets = highlightedFretsForString(stringInfo, frets, position);
        const midi = stringInfo.midi + fret;
        const pitchClass = ((midi % 12) + 12) % 12;
        const isInPattern = highlightedFrets.has(fret);
        const isDetected = detectedMidi === midi;
        const isCorrect = isDetected && isInPattern;
        const label = isInPattern ? EAR_ROOT_OPTIONS[pitchClass] : (options.fullscreen ? "" : (fret || ""));
        return `<span class="tuner-fret${isInPattern ? " in-pattern" : ""}${pitchClass === rootPc ? " root" : ""}${isDetected ? " detected" : ""}${isCorrect ? " correct" : ""}${isDetected && !isInPattern ? " wrong" : ""}${fret === 0 ? " open" : ""}" title="${stringInfo.label}${fret}: ${EAR_ROOT_OPTIONS[pitchClass]}">${label}</span>`;
      }).join("")}
    </div>
  `).join("");
  node.innerHTML = fretHeader + node.innerHTML;
}

function renderTuner() {
  const status = document.getElementById("tuner-status");
  if (!status) return;
  const target = tunerTargetString();
  const cents = tunerDetection.cents || 0;
  status.textContent = tunerRunning ? "Slucham mikrofonu" : "Mikrofon wylaczony";
  document.getElementById("tuner-toggle").textContent = tunerRunning ? "Stop" : "Start";
  document.getElementById("tuner-note").textContent = tunerDetection.note || "--";
  document.getElementById("tuner-frequency").textContent = tunerDetection.frequency ? `${tunerDetection.frequency.toFixed(1)} Hz` : "0.0 Hz";
  document.getElementById("tuner-cents").textContent = tunerDetection.frequency ? `${cents > 0 ? "+" : ""}${cents} c` : "0 c";
  document.getElementById("tuner-target-copy").textContent = `${target.note} · ${target.frequency.toFixed(2)} Hz`;
  const needle = document.getElementById("tuner-needle");
  if (needle) {
    needle.style.left = `${50 + clamp(cents, -50, 50)}%`;
    needle.style.transform = "translateX(-50%)";
    needle.classList.toggle("in-tune", tunerDetection.frequency > 0 && Math.abs(cents) <= 5);
  }
  const grid = document.getElementById("tuner-string-grid");
  grid.innerHTML = "";
  GUITAR_TUNER_STRINGS.forEach((stringInfo) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `tuner-string-button${stringInfo.id === tunerTargetStringId ? " active" : ""}`;
    button.innerHTML = `<strong>${stringInfo.label}</strong><span>${stringInfo.note}</span>`;
    button.addEventListener("click", () => {
      tunerTargetStringId = stringInfo.id;
      tunerDetection.targetId = stringInfo.id;
      renderTuner();
    });
    grid.appendChild(button);
  });
  renderTunerFretboard();
  renderFretPracticeControls();
  renderFretboardFullscreen();
}

function renderFretPracticeControls() {
  const pattern = fretPracticePattern();
  const position = fretPracticePosition();
  const detectedMidi = tunerDetection.frequency ? Math.round(frequencyToMidiValue(tunerDetection.frequency)) : null;
  const isCorrect = detectedMidi != null && fretMidiAllowedByPattern(detectedMidi);
  const status = document.getElementById("fret-practice-status");
  if (!status) return;
  const visibleFrets = new Set(fretNumbersForPosition(position, false));
  const detectedInPosition = detectedMidi == null
    ? false
    : GUITAR_TUNER_STRINGS.some((stringInfo) => {
      const fret = detectedMidi - stringInfo.midi;
      return fret >= 0 && fret <= 24 && visibleFrets.has(fret);
    });
  status.textContent = tunerDetection.frequency ? (isCorrect ? "Trafione" : "Poza materialem") : "Czeka";
  status.className = isCorrect ? "practice-ok" : tunerDetection.frequency ? "practice-wrong" : "";
  document.getElementById("fret-practice-pattern-copy").textContent = pattern.label;
  document.getElementById("fret-practice-root-copy").textContent = fretPracticeRoot;
  document.getElementById("fret-practice-position-copy").textContent = position.label;
  document.getElementById("fret-practice-note").textContent = tunerDetection.note || "--";
  const result = document.getElementById("fret-practice-result");
  result.textContent = tunerDetection.frequency
    ? (isCorrect
      ? `${tunerDetection.note} pasuje do: ${fretPracticeRoot} ${pattern.label}${detectedInPosition ? " w tej pozycji" : ", ale poza wybrana pozycja"}.`
      : `${tunerDetection.note} jest poza: ${fretPracticeRoot} ${pattern.label}.`)
    : "Wlacz mikrofon i zagraj dzwiek ze skali.";
  result.className = isCorrect ? "practice-ok" : tunerDetection.frequency ? "practice-wrong" : "";

  const patternGrid = document.getElementById("fret-practice-pattern-grid");
  patternGrid.innerHTML = "";
  FRETBOARD_PRACTICE_GROUPS.forEach((group) => {
    const details = document.createElement("details");
    details.className = "fret-practice-group";
    details.open = group.id === pattern.group;
    details.innerHTML = `<summary>${escapeHtml(group.label)}</summary><div class="ear-chip-grid"></div>`;
    const groupGrid = details.querySelector(".ear-chip-grid");
    FRETBOARD_PRACTICE_LIBRARY
      .filter((entry) => entry.group === group.id)
      .forEach((entry) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `ear-chip-button fret-practice-chip${entry.id === fretPracticePatternId ? " active" : ""}`;
        button.innerHTML = `<strong>${escapeHtml(entry.label)}</strong><span>${escapeHtml(entry.family)}</span>`;
        button.addEventListener("click", () => {
          fretPracticePatternId = entry.id;
          renderTuner();
        });
        groupGrid.appendChild(button);
      });
    patternGrid.appendChild(details);
  });

  const positionGrid = document.getElementById("fret-practice-position-grid");
  positionGrid.innerHTML = "";
  FRETBOARD_POSITIONS.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `ear-chip-button${entry.id === fretPracticePositionId ? " active" : ""}`;
    button.textContent = entry.label;
    button.dataset.fretboardPosition = entry.id;
    bindFretPositionButton(button, entry.id);
    positionGrid.appendChild(button);
  });

  const rootGrid = document.getElementById("fret-practice-root-grid");
  rootGrid.innerHTML = "";
  EAR_ROOT_OPTIONS.forEach((root) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `ear-chip-button${root === fretPracticeRoot ? " active" : ""}`;
    button.textContent = root;
    button.addEventListener("click", () => {
      fretPracticeRoot = root;
      renderTuner();
    });
    rootGrid.appendChild(button);
  });
}

function selectFretPracticePosition(positionId) {
  if (!FRETBOARD_POSITIONS.some((entry) => entry.id === positionId)) return;
  fretPracticePositionId = positionId;
  renderTuner();
}

function bindFretPositionButton(button, positionId) {
  const select = (event) => {
    event.preventDefault();
    event.stopPropagation();
    selectFretPracticePosition(positionId);
  };
  button.addEventListener("pointerdown", select);
  button.addEventListener("click", select);
}

function openFretboardFullscreen() {
  fretboardFullscreenOpen = true;
  renderFretboardFullscreen();
}

function closeFretboardFullscreen() {
  fretboardFullscreenOpen = false;
  renderFretboardFullscreen();
}

function renderFretboardFullscreen() {
  const shell = document.getElementById("fretboard-fullscreen");
  if (!shell) return;
  shell.hidden = !fretboardFullscreenOpen;
  if (!fretboardFullscreenOpen) return;
  const pattern = fretPracticePattern();
  const position = fretPracticePosition();
  const detectedMidi = tunerDetection.frequency ? Math.round(frequencyToMidiValue(tunerDetection.frequency)) : null;
  const isCorrect = detectedMidi != null && fretMidiAllowedByPattern(detectedMidi);
  const visibleFrets = new Set(fretNumbersForPosition(position, false));
  const detectedInPosition = detectedMidi == null
    ? false
    : GUITAR_TUNER_STRINGS.some((stringInfo) => {
      const fret = detectedMidi - stringInfo.midi;
      return fret >= 0 && fret <= 24 && visibleFrets.has(fret);
    });
  document.getElementById("fretboard-fullscreen-title").textContent = `${fretPracticeRoot} ${pattern.label}`;
  document.getElementById("fretboard-fullscreen-subtitle").textContent = position.label;
  document.getElementById("fretboard-fullscreen-note").textContent = tunerDetection.note || "--";
  const result = document.getElementById("fretboard-fullscreen-result");
  result.textContent = tunerDetection.frequency
    ? (isCorrect
      ? (detectedInPosition ? "Grany dzwiek jest w materiale i w tej pozycji." : "Grany dzwiek jest w materiale, ale poza wybrana pozycja.")
      : "Grany dzwiek jest poza podswietlonym materialem.")
    : "Wlacz mikrofon i graj po podswietlonych dzwiekach.";
  result.className = isCorrect ? "practice-ok" : tunerDetection.frequency ? "practice-wrong" : "";
  const grid = document.getElementById("fretboard-fullscreen-position-grid");
  grid.innerHTML = "";
  FRETBOARD_POSITIONS.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `metronome-option-button${entry.id === fretPracticePositionId ? " active" : ""}`;
    button.textContent = entry.label;
    button.dataset.fretboardPosition = entry.id;
    bindFretPositionButton(button, entry.id);
    grid.appendChild(button);
  });
  renderTunerFretboard("fretboard-fullscreen-board", { fullscreen: true });
}

function renderMusic() {
  const viewIds = ["music-home-view", "guitar-main-view", "guitar-detail-view", "guitar-create-view", "guitar-tuner-view", "ear-home-view", "ear-config-view", "ear-round-view", "ear-summary-view", "ear-detail-view"];
  const visible = {
    home: "music-home-view",
    main: "guitar-main-view",
    detail: "guitar-detail-view",
    create: "guitar-create-view",
    tuner: "guitar-tuner-view",
    "ear-home": "ear-home-view",
    "ear-config": "ear-config-view",
    "ear-round": "ear-round-view",
    "ear-summary": "ear-summary-view",
    "ear-detail": "ear-detail-view"
  }[guitarView] || "music-home-view";

  viewIds.forEach((id) => {
    const node = document.getElementById(id);
    if (node) node.hidden = id !== visible;
  });

  renderMusicHome();
  renderGuitar();
  renderTuner();
  renderEarHome();
  renderEarConfig();
  renderEarRound();
  renderEarSummary();
  renderEarDetail();
}

function renderWorkoutTemplates() {
  const node = document.getElementById("gym-template-list");
  node.innerHTML = "";
  document.getElementById("template-summary").textContent = `${state.workoutTemplates.length}`;

  if (!state.workoutTemplates.length) {
    node.appendChild(emptyNode("Brak szablonow."));
    return;
  }

  state.workoutTemplates.forEach((template) => {
    const item = document.createElement("div");
    item.className = "template-item";
    item.innerHTML = `
      <div class="list-copy">
        <strong>${escapeHtml(template.title)}</strong>
        <span>${escapeHtml(template.focus)} - rest ${template.rest}s</span>
      </div>
      <div class="template-meta">${escapeHtml(template.exercises.join(", "))}</div>
    `;
    const tools = document.createElement("div");
    tools.className = "list-tools";
    tools.append(
      makeToolButton("Użyj", () => applyWorkoutTemplate(template.id)),
      makeToolButton("Edytuj", () => editWorkoutTemplate(template.id))
    );
    item.appendChild(tools);
    node.appendChild(item);
  });
}

function renderGymWorkouts() {
  const node = document.getElementById("gym-workout-list");
  node.innerHTML = "";
  document.getElementById("gym-workout-count").textContent = `${state.workouts.length}`;

  if (!state.workouts.length) {
    node.appendChild(emptyNode("Brak treningow."));
    return;
  }

  state.workouts.slice().reverse().slice(0, 5).forEach((workout) => {
    const row = document.createElement("div");
    row.className = "list-item";
    row.innerHTML = `
      <div class="list-copy">
        <strong>${escapeHtml(workout.title)}</strong>
        <span>${escapeHtml(workout.focus)} - ${workout.duration} min</span>
      </div>
    `;
    const tools = document.createElement("div");
    tools.className = "list-tools";
    tools.append(
      makeToolButton("Edytuj", () => editWorkout(workout.id)),
      makeToolButton("Usuń", () => deleteWorkout(workout.id), true)
    );
    row.appendChild(tools);
    node.appendChild(row);
  });
}

function renderGymSets() {
  const node = document.getElementById("gym-set-list");
  node.innerHTML = "";
  document.getElementById("set-summary").textContent = `${state.exerciseSets.length}`;

  if (!state.exerciseSets.length) {
    node.appendChild(emptyNode("Brak serii."));
    return;
  }

  state.exerciseSets.slice().reverse().slice(0, 5).forEach((set) => {
    const row = document.createElement("div");
    row.className = "list-item";
    row.innerHTML = `
      <div class="list-copy">
        <strong>${escapeHtml(set.exercise)}</strong>
        <span>${set.reps} reps - ${set.weight} kg - ${set.rest}s rest</span>
      </div>
    `;
    const tools = document.createElement("div");
    tools.className = "list-tools";
    tools.append(
      makeToolButton("Edytuj", () => editSet(set.id)),
      makeToolButton("Usuń", () => deleteSet(set.id), true)
    );
    row.appendChild(tools);
    node.appendChild(row);
  });
}

function renderGymMeals() {
  const node = document.getElementById("gym-meal-list");
  const nutrition = nutritionToday();
  node.innerHTML = "";
  document.getElementById("meal-summary").textContent = `${nutrition.calories} kcal`;

  const meals = mealsToday().slice().reverse();
  if (!meals.length) {
    node.appendChild(emptyNode("Brak posilkow dzisiaj."));
    return;
  }

  meals.slice(0, 4).forEach((meal) => {
    const row = document.createElement("div");
    row.className = "list-item";
    row.innerHTML = `
      <div class="list-copy">
        <strong>${escapeHtml(meal.title)}</strong>
        <span>${meal.calories} kcal - P ${meal.protein} - W ${meal.carbs} - T ${meal.fats}</span>
      </div>
    `;
    const tools = document.createElement("div");
    tools.className = "list-tools";
    tools.append(
      makeToolButton("Edytuj", () => editMeal(meal.id)),
      makeToolButton("Usuń", () => deleteMeal(meal.id), true)
    );
    row.appendChild(tools);
    node.appendChild(row);
  });
}

function renderGym() {
  const latest = latestWeight();
  const nutrition = nutritionToday();
  document.getElementById("gym-summary").textContent = `${totalTrainingMinutes()} min`;
  document.getElementById("gym-weight-metric").textContent = latest ? `${Number(latest.value).toFixed(1)} kg` : "-";
  document.getElementById("gym-workout-week-metric").textContent = `${workoutsThisWeek().length}/4`;
  document.getElementById("gym-set-metric").textContent = `${state.exerciseSets.length}`;
  document.getElementById("gym-kcal-metric").textContent = `${nutrition.calories}`;

  renderWorkoutTemplates();
  renderGymWorkouts();
  renderGymSets();
  renderGymMeals();
  renderRestTimer();
}

async function fetchPaperQuote(symbol, apiKey) {
  const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(apiKey)}`);
  const data = await response.json();
  if (!response.ok || data.error || data.c === undefined) {
    throw new Error(data.error || `Brak danych dla ${symbol}`);
  }
  return {
    symbol,
    price: Number(data.c || 0),
    change: Number(data.d || 0),
    changePercent: Number(data.dp || 0),
    high: Number(data.h || 0),
    low: Number(data.l || 0),
    open: Number(data.o || 0),
    prevClose: Number(data.pc || 0),
    updatedAt: new Date((Number(data.t || 0) || Math.floor(Date.now() / 1000)) * 1000).toISOString()
  };
}

async function fetchPaperHistory(symbol, range) {
  const { payload: data, baseUrl } = await simApiFetch(`/market/history?symbol=${encodeURIComponent(symbol)}`);
  if (!Array.isArray(data?.candles) || !data.candles.length) {
    throw new Error("Uruchom lokalny silnik symulacji");
  }
  const points = data.candles
    .map((candle) => {
      const open = Number(candle.open);
      const high = Number(candle.high);
      const low = Number(candle.low);
      const close = Number(candle.close);
      const volume = Number(candle.volume || 0);
      if (![open, high, low, close].every((value) => Number.isFinite(value) && value > 0)) return null;
      const date = new Date(candle.date);
      return {
        time: candle.date,
        open,
        high,
        low,
        close,
        volume,
        value: close,
        label: formatInstrumentPrice(close, symbol),
        bottom: `${date.getDate()}/${date.getMonth() + 1}/${String(date.getFullYear()).slice(-2)}`
      };
    })
    .filter(Boolean);
  if (!points.length) {
    throw new Error("Pusty wykres");
  }
  paperHistoryError = "";
  paperHistorySource = `Lokalny silnik symulacji (${baseUrl.split(":").at(-1)})`;
  return {
    symbol: data.symbol || symbol,
    range,
    points,
    updatedAt: new Date().toISOString()
  };
}

async function ensurePaperHistory(symbol, range) {
  const cacheKey = `${symbol}:${range}`;
  if (!symbol || paperChartRequestKey === cacheKey || paperChartLoading) return;
  if (paperChartCache.has(cacheKey)) {
    const cached = paperChartCache.get(cacheKey);
    state.paperTrading.chart = {
      symbol,
      points: cached.points.slice(),
      updatedAt: cached.updatedAt
    };
    return;
  }
  paperChartLoading = true;
  paperChartRequestKey = cacheKey;
  try {
    const payload = await fetchPaperHistory(symbol, range);
    paperChartCache.set(cacheKey, payload);
    if (paperSelectedSymbol() === symbol && paperChartRange === range) {
      state.paperTrading.chart = {
        symbol,
        points: payload.points.slice(),
        updatedAt: payload.updatedAt
      };
      saveState();
      renderFinance();
    }
  } catch (error) {
    paperHistoryError = String(error?.message || "Uruchom lokalny silnik symulacji");
    paperHistorySource = "";
    if (!state.paperTrading.chart.points.length) {
      renderFinance();
    }
  } finally {
    paperChartLoading = false;
    paperChartRequestKey = "";
  }
}

function updatePaperChartSnapshot(symbol, price, timestamp = new Date()) {
  const currentSymbol = state.paperTrading.chart.symbol || symbol;
  const points = currentSymbol === symbol ? state.paperTrading.chart.points.slice() : [];
  const nextPoint = {
    time: timestamp.toISOString().slice(0, 10),
    open: Number(price || 0),
    high: Number(price || 0),
    low: Number(price || 0),
    close: Number(price || 0),
    volume: 0,
    value: Number(price || 0),
    label: `$${Number(price || 0).toFixed(0)}`,
    bottom: formatTimeOnly(timestamp)
  };
  const lastPoint = points.at(-1);
  if (lastPoint && lastPoint.bottom === nextPoint.bottom) {
    points[points.length - 1] = nextPoint;
  } else {
    points.push(nextPoint);
  }
  state.paperTrading.chart = {
    symbol,
    points: points.slice(-260),
    updatedAt: timestamp.toISOString()
  };
}

function paperExecutionPrice(order, quote) {
  const settings = paperSettings();
  const mid = Number(quote?.price || 0);
  if (!Number.isFinite(mid) || mid <= 0) return 0;
  const spread = mid * (Number(settings.spreadBps || 0) / 10000);
  const slippage = mid * (Number(settings.slippageBps || 0) / 10000);
  let price = order.side === "buy"
    ? mid + (spread / 2) + slippage
    : mid - (spread / 2) - slippage;
  if (order.type === "limit" && Number(order.limitPrice || 0) > 0) {
    price = order.side === "buy"
      ? Math.min(price, Number(order.limitPrice))
      : Math.max(price, Number(order.limitPrice));
  }
  return Math.max(0, price);
}

function paperOrderShouldFill(order, quote) {
  const price = Number(quote?.price || 0);
  if (!Number.isFinite(price) || price <= 0) return false;
  if (order.type === "market") return true;
  if (order.type === "limit") {
    const limit = Number(order.limitPrice || 0);
    if (!limit) return false;
    return order.side === "buy" ? price <= limit : price >= limit;
  }
  if (order.type === "stop") {
    const stop = Number(order.stopPrice || 0);
    if (!stop) return false;
    return order.side === "buy" ? price >= stop : price <= stop;
  }
  return false;
}

function rejectPaperOrder(order, reason) {
  order.status = "rejected";
  order.reason = reason;
  order.filledAt = new Date().toISOString();
}

function fillPaperOrder(order, quote, timestamp = new Date()) {
  const quantity = Number(order.shares || 0);
  const price = paperExecutionPrice(order, quote);
  const fee = Number(paperSettings().commission || 0);
  if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(price) || price <= 0) {
    rejectPaperOrder(order, "Nieprawidłowe zlecenie");
    return false;
  }

  if (order.side === "buy") {
    const gross = price * quantity;
    const totalCost = gross + fee;
    if (totalCost > Number(state.paperTrading.cash || 0)) {
      rejectPaperOrder(order, "Za mało gotówki");
      return false;
    }
    const existing = state.paperTrading.positions.find((position) => position.symbol === order.symbol);
    if (existing) {
      const totalShares = Number(existing.shares || 0) + quantity;
      existing.avgCost = (((Number(existing.avgCost || 0) * Number(existing.shares || 0)) + totalCost) / totalShares);
      existing.shares = totalShares;
    } else {
      state.paperTrading.positions.push({ symbol: order.symbol, shares: quantity, avgCost: totalCost / quantity });
    }
    state.paperTrading.cash -= totalCost;
    order.realizedPnl = 0;
  } else {
    const existing = state.paperTrading.positions.find((position) => position.symbol === order.symbol);
    if (!existing || Number(existing.shares || 0) < quantity) {
      rejectPaperOrder(order, "Za mało akcji");
      return false;
    }
    const gross = price * quantity;
    const costBasis = Number(existing.avgCost || 0) * quantity;
    const proceeds = gross - fee;
    existing.shares -= quantity;
    state.paperTrading.cash += proceeds;
    order.realizedPnl = proceeds - costBasis;
    if (existing.shares <= 0.000001) {
      state.paperTrading.positions = state.paperTrading.positions.filter((position) => position.symbol !== order.symbol);
    }
  }

  order.status = "filled";
  order.price = price;
  order.executionPrice = price;
  order.fee = fee;
  order.filledAt = timestamp.toISOString();
  order.reason = "";
  paperRecordEquitySnapshot(timestamp);
  return true;
}

function processPaperOpenOrders(timestamp = new Date()) {
  const settings = paperSettings();
  const clock = paperMarketClock(timestamp);
  if (!clock.isOpen && !settings.allowAfterHours) return 0;
  let filled = 0;
  paperOpenOrders().forEach((order) => {
    const quote = paperQuote(order.symbol);
    if (!paperOrderShouldFill(order, quote)) return;
    if (fillPaperOrder(order, quote, timestamp)) {
      filled += 1;
    }
  });
  if (filled) {
    state.paperTrading.orders = state.paperTrading.orders.slice(0, 120);
    paperRecordEquitySnapshot(timestamp);
  }
  return filled;
}

async function refreshPaperTrading(options = {}) {
  const { silent = false } = options;
  const apiKey = paperTradingApiKey();
  if (paperTradingLoading) return;
  if (!apiKey) {
    state.paperTrading.error = "Brak klucza";
    renderFinance();
    return;
  }

  paperTradingLoading = true;
  state.paperTrading.error = "";
  renderFinance();
  try {
    paperSyncSelectedSymbol();
    const symbols = [...new Set([
      paperSelectedSymbol(),
      ...state.paperTrading.watchlist,
      ...state.paperTrading.positions.map((position) => position.symbol),
      ...paperOpenOrders().map((order) => order.symbol)
    ].filter(Boolean))].slice(0, 24);
    const quoteResults = await Promise.allSettled(symbols.map((symbol) => fetchPaperQuote(symbol, apiKey)));
    const quotes = quoteResults
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
    if (!quotes.length) {
      const firstError = quoteResults.find((result) => result.status === "rejected")?.reason;
      throw new Error(firstError?.message || "Brak danych rynku");
    }
    quotes.forEach((quote) => {
      state.paperTrading.quotes[quote.symbol] = quote;
    });
    const selected = paperSelectedSymbol();
    const selectedQuote = quotes.find((quote) => quote.symbol === selected) || state.paperTrading.quotes[selected];
    if (selectedQuote && paperChartRange === "1D") {
      updatePaperChartSnapshot(selected, selectedQuote.price, new Date());
    }
    const filledCount = processPaperOpenOrders(new Date());
    paperRecordEquitySnapshot(new Date());
    state.paperTrading.lastSyncAt = new Date().toISOString();
    state.paperTrading.error = "";
    saveState();
    renderFinance();
    if (!silent) {
      setFeedback(filledCount ? `Odświeżono rynek i zrealizowano ${filledCount} zleceń.` : `Odświeżono rynek: ${selected}.`);
    }
  } catch (error) {
    state.paperTrading.error = String(error?.message || "Blad danych");
    renderFinance();
    if (!silent) {
      setFeedback("Nie udało się pobrać danych rynku.");
    }
  } finally {
    paperTradingLoading = false;
    renderFinance();
  }
}

function stopPaperTradingAutoRefresh() {
  clearInterval(paperTradingRefreshTimer);
  paperTradingRefreshTimer = null;
}

function syncPaperTradingAutoRefresh() {
  stopPaperTradingAutoRefresh();
  if (state.activeTab !== "finance" || !state.paperTrading.autoRefresh || !paperTradingApiKey()) return;
  paperTradingRefreshTimer = setInterval(() => {
    refreshPaperTrading({ silent: true });
  }, 180000);
}

function executePaperOrder(side, symbol, shares, options = {}) {
  const normalizedSymbol = String(symbol || "").trim().toUpperCase();
  const type = ["market", "limit", "stop"].includes(options.type) ? options.type : "market";
  const quantity = Number(shares || 0);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    setFeedback("Podaj liczbę akcji.");
    return false;
  }

  const quote = paperQuote(normalizedSymbol);
  const price = Number(quote?.price || 0);
  if (!price || !Number.isFinite(price)) {
    setFeedback("Najpierw odśwież kurs.");
    return false;
  }

  const limitPrice = Number(options.limitPrice || 0);
  const stopPrice = Number(options.stopPrice || 0);
  if (type === "limit" && (!Number.isFinite(limitPrice) || limitPrice <= 0)) {
    setFeedback("Podaj limit ceny.");
    return false;
  }
  if (type === "stop" && (!Number.isFinite(stopPrice) || stopPrice <= 0)) {
    setFeedback("Podaj stop ceny.");
    return false;
  }

  const timestamp = new Date();
  const clock = paperMarketClock(timestamp);
  const order = {
    id: uid("pord"),
    symbol: normalizedSymbol,
    side: side === "sell" ? "sell" : "buy",
    type,
    status: "open",
    shares: quantity,
    price: 0,
    executionPrice: 0,
    limitPrice: type === "limit" ? limitPrice : 0,
    stopPrice: type === "stop" ? stopPrice : 0,
    fee: 0,
    realizedPnl: 0,
    reason: "",
    thesis: String(options.thesis || "").trim(),
    createdAt: timestamp.toISOString(),
    filledAt: null
  };

  if (type === "market" && !clock.isOpen && !paperSettings().allowAfterHours) {
    rejectPaperOrder(order, "Rynek zamknięty");
    state.paperTrading.orders.unshift(order);
    state.paperTrading.orders = state.paperTrading.orders.slice(0, 120);
    saveState();
    renderFinance();
    setFeedback("Rynek zamknięty. Zlecenie po rynku zostało odrzucone.");
    return false;
  }

  state.paperTrading.orders.unshift(order);
  if ((clock.isOpen || paperSettings().allowAfterHours) && paperOrderShouldFill(order, quote)) {
    if (!fillPaperOrder(order, quote, timestamp)) {
      state.paperTrading.orders = state.paperTrading.orders.slice(0, 120);
      saveState();
      renderFinance();
      setFeedback(order.reason || "Zlecenie odrzucone.");
      return false;
    }
  }

  state.paperTrading.orders = state.paperTrading.orders.slice(0, 120);
  saveState();
  renderFinance();
  setFeedback(order.status === "filled"
    ? `${side === "buy" ? "Kupiono" : "Sprzedano"} ${normalizedSymbol} po ${formatUsd(order.executionPrice)}.`
    : `Dodano zlecenie: ${paperOrderTypeLabel(type)} dla ${normalizedSymbol}.`);
  return true;
}

function cancelPaperOrder(orderId) {
  const order = state.paperTrading.orders.find((entry) => entry.id === orderId);
  if (!order || order.status !== "open") return;
  order.status = "cancelled";
  order.reason = "Anulowane";
  saveState();
  renderFinance();
  setFeedback(`Anulowano zlecenie ${order.symbol}.`);
}

function resetPaperTradingAccount() {
  state.paperTrading.cash = paperInitialCash();
  state.paperTrading.positions = [];
  state.paperTrading.orders = [];
  state.paperTrading.equityHistory = [];
  paperRecordEquitySnapshot(new Date());
  saveState();
  renderFinance();
  setFeedback("Wyczyszczono konto symulatora.");
}

function renderFinanceEntries() {
  const node = document.getElementById("finance-list");
  node.innerHTML = "";
  document.getElementById("finance-entry-count").textContent = `${state.financeEntries.length}`;

  if (!state.financeEntries.length) {
    node.appendChild(emptyNode("Brak wpisow finansowych."));
    return;
  }

  state.financeEntries.slice().reverse().slice(0, 6).forEach((entry) => {
    const row = document.createElement("div");
    row.className = "list-item";
    row.innerHTML = `
      <div class="list-copy">
        <strong>${escapeHtml(entry.title)}</strong>
        <span>${entry.type === "income" ? "Przychod" : "Wydatek"} - ${formatZl(entry.amount)} - ${escapeHtml(entry.category || "Inne")}</span>
      </div>
    `;
    const tools = document.createElement("div");
    tools.className = "list-tools";
    tools.append(
      makeToolButton("Edytuj", () => editFinanceEntry(entry.id)),
      makeToolButton("Usuń", () => deleteFinanceEntry(entry.id), true)
    );
    row.appendChild(tools);
    node.appendChild(row);
  });
}

function renderPlannedExpenses() {
  const node = document.getElementById("planned-list");
  node.innerHTML = "";

  if (!state.plannedExpenses.length) {
    node.appendChild(emptyNode("Brak planowanych wydatkow."));
    return;
  }

  state.plannedExpenses.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "list-item";
    row.innerHTML = `
      <div class="list-copy">
        <strong>${escapeHtml(entry.title)}</strong>
        <span>${formatZl(entry.amount)} - ${escapeHtml(entry.dueLabel || "pozniej")}</span>
      </div>
    `;
    const tools = document.createElement("div");
    tools.className = "list-tools";
    tools.append(
      makeToolButton("Edytuj", () => editPlannedExpense(entry.id)),
      makeToolButton("Usuń", () => deletePlannedExpense(entry.id), true)
    );
    row.appendChild(tools);
    node.appendChild(row);
  });
}

function renderPaperWatchlist() {
  const node = document.getElementById("paper-watchlist");
  if (!node) return;
  node.innerHTML = "";
  state.paperTrading.watchlist.forEach((symbol) => {
    const quote = paperQuote(symbol);
    const meta = marketMeta(symbol);
    const row = document.createElement("div");
    row.className = `list-item finance-watchlist-row${paperSelectedSymbol() === symbol ? " active" : ""}`;
    row.setAttribute("role", "button");
    row.tabIndex = 0;
    row.innerHTML = `
      <div class="finance-watchlist-main">
        <div class="list-copy">
          <strong>${escapeHtml(symbol)}</strong>
          <span>${escapeHtml(meta.name)} · ${escapeHtml(meta.category)}</span>
        </div>
        <div class="finance-watchlist-quote">
          <strong>${quote ? formatInstrumentPrice(quote.price, symbol) : "--"}</strong>
          <span class="${quote && quote.changePercent < 0 ? "negative" : "positive"}">${quote ? formatPercent(quote.changePercent) : meta.exchange || meta.category}</span>
        </div>
      </div>
    `;
    const openSymbol = () => {
      setPaperSelectedSymbol(symbol);
      saveState();
      renderFinance();
      if (paperTradingApiKey()) {
        refreshPaperTrading({ silent: true });
      }
    };
    row.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      openSymbol();
    });
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSymbol();
      }
    });
    const tools = document.createElement("div");
    tools.className = "list-tools";
    tools.append(
      makeToolButton("Otwórz", openSymbol),
      makeToolButton("Usuń", () => {
        state.paperTrading.watchlist = state.paperTrading.watchlist.filter((entry) => entry !== symbol);
        delete state.paperTrading.quotes[symbol];
        paperSyncSelectedSymbol();
        saveState();
        renderFinance();
      }, true)
    );
    row.appendChild(tools);
    node.appendChild(row);
  });

  if (!state.paperTrading.watchlist.length) {
    node.appendChild(emptyNode("Dodaj ticker."));
  }
}

function renderPaperPositions() {
  const node = document.getElementById("paper-positions-list");
  if (!node) return;
  node.innerHTML = "";
  if (!state.paperTrading.positions.length) {
    node.appendChild(emptyNode("Brak pozycji."));
    return;
  }
  state.paperTrading.positions
    .slice()
    .sort((a, b) => a.symbol.localeCompare(b.symbol))
    .forEach((position) => {
      const quote = paperQuote(position.symbol);
      const marketValue = Number(quote?.price || position.avgCost || 0) * position.shares;
      const pnl = marketValue - (position.avgCost * position.shares);
      const pnlPercent = position.avgCost ? ((Number(quote?.price || position.avgCost || 0) - position.avgCost) / position.avgCost) * 100 : 0;
      const row = document.createElement("div");
      row.className = "list-item finance-position-row";
      row.innerHTML = `
        <div class="finance-position-main">
          <div class="list-copy">
            <strong>${escapeHtml(position.symbol)}</strong>
            <span>${position.shares} szt. · avg ${formatUsd(position.avgCost)}</span>
          </div>
          <div class="finance-position-quote">
            <strong>${formatUsd(marketValue)}</strong>
            <span class="${pnl >= 0 ? "positive" : "negative"}">${formatPercent(pnlPercent)}</span>
          </div>
        </div>
      `;
      const meta = document.createElement("div");
      meta.className = `quote-badge${pnl >= 0 ? " positive" : " negative"}`;
      meta.textContent = formatUsd(pnl);
      row.appendChild(meta);
      node.appendChild(row);
    });
}

function renderPaperOrders() {
  const node = document.getElementById("paper-orders-list");
  if (!node) return;
  node.innerHTML = "";
  if (!state.paperTrading.orders.length) {
    node.appendChild(emptyNode("Brak zleceń."));
    return;
  }
  state.paperTrading.orders.slice(0, 12).forEach((order) => {
    const priceLabel = order.status === "filled"
      ? formatUsd(order.executionPrice || order.price)
      : order.type === "limit"
        ? `Limit ${formatUsd(order.limitPrice)}`
        : order.type === "stop"
          ? `Stop ${formatUsd(order.stopPrice)}`
        : "Po rynku";
    const valueLabel = order.status === "filled"
      ? formatUsd((Number(order.executionPrice || order.price || 0) * Number(order.shares || 0)) + Number(order.fee || 0))
      : escapeHtml(paperOrderStatusLabel(order.status || "open"));
    const row = document.createElement("div");
    row.className = "list-item finance-order-row";
    row.innerHTML = `
      <div class="finance-order-main">
        <div class="list-copy">
          <strong>${escapeHtml(order.symbol)} - ${paperOrderSideLabel(order.side)} - ${paperOrderTypeLabel(order.type)}</strong>
          <span>${order.shares} szt. - ${paperOrderStatusLabel(order.status || "filled")} - ${formatShortDateLabel(order.filledAt || order.createdAt)}</span>
          ${order.thesis ? `<span>${escapeHtml(order.thesis)}</span>` : ""}
          ${order.reason ? `<span>${escapeHtml(order.reason)}</span>` : ""}
        </div>
        <div class="finance-order-meta">
          <strong>${priceLabel}</strong>
          <span>${valueLabel}</span>
        </div>
      </div>
    `;
    if (order.status === "open") {
      const tools = document.createElement("div");
      tools.className = "list-tools";
      tools.append(makeToolButton("Anuluj", () => cancelPaperOrder(order.id), true));
      row.appendChild(tools);
    }
    node.appendChild(row);
  });
}

function renderPaperSuggestions() {
  const node = document.getElementById("paper-market-suggestions");
  if (!node) return;
  const query = (document.getElementById("paper-market-search")?.value || "").trim().toLowerCase();
  const selectedCategory = String(paperInstrumentCategory || "ALL").toUpperCase();
  const results = MARKET_UNIVERSE
    .filter((entry) => selectedCategory === "ALL" || String(entry.category || "").toUpperCase() === selectedCategory)
    .filter((entry) => {
      const haystack = `${entry.symbol} ${entry.name} ${entry.category} ${entry.exchange || ""}`.toLowerCase();
      return !query || haystack.includes(query);
    })
    .slice(0, 40);
  node.innerHTML = "";
  if (!results.length) {
    node.appendChild(emptyNode("Brak instrumentów dla tego filtra."));
    return;
  }
  results.forEach((entry) => {
    const quote = paperQuote(entry.symbol);
    const row = document.createElement("div");
    row.className = "list-item finance-watchlist-row";
    row.innerHTML = `
      <div class="finance-watchlist-main">
        <div class="list-copy">
          <strong>${escapeHtml(entry.symbol)}</strong>
          <span>${escapeHtml(entry.name)} · ${escapeHtml(entry.category)}${entry.exchange ? ` · ${escapeHtml(entry.exchange)}` : ""}</span>
        </div>
        <div class="finance-watchlist-quote">
          <strong>${quote ? formatInstrumentPrice(quote.price, entry.symbol) : "--"}</strong>
          <span class="${quote && quote.changePercent < 0 ? "negative" : "positive"}">${quote ? formatPercent(quote.changePercent) : entry.currency || entry.category}</span>
        </div>
      </div>
    `;
    const tools = document.createElement("div");
    tools.className = "list-tools";
    tools.append(makeToolButton(state.paperTrading.watchlist.includes(entry.symbol) ? "Otwórz" : "Dodaj", () => {
      if (!state.paperTrading.watchlist.includes(entry.symbol)) {
        state.paperTrading.watchlist.unshift(entry.symbol);
        state.paperTrading.watchlist = [...new Set(state.paperTrading.watchlist)].slice(0, PAPER_WATCHLIST_LIMIT);
      }
      setPaperSelectedSymbol(entry.symbol);
      document.getElementById("paper-order-symbol").value = entry.symbol;
      paperSymbolSheetOpen = false;
      saveState();
      renderFinance();
      refreshPaperTrading({ silent: true });
    }));
    row.appendChild(tools);
    node.appendChild(row);
  });
}

function renderPaperCategories() {
  const node = document.getElementById("paper-market-categories");
  if (!node) return;
  const categories = ["ALL", ...new Set(MARKET_UNIVERSE.map((entry) => entry.category).filter(Boolean))];
  node.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `market-category-chip${paperInstrumentCategory === category ? " active" : ""}`;
    button.dataset.paperMarketCategory = category;
    button.textContent = category === "ALL" ? "Wszystkie" : category;
    node.appendChild(button);
  });
}

function renderPaperSymbolRail() {
  const node = document.getElementById("paper-symbol-rail");
  if (!node) return;
  node.innerHTML = "";
  const selected = paperSelectedSymbol();
  state.paperTrading.watchlist.slice(0, 12).forEach((symbol) => {
    const quote = paperQuote(symbol);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `symbol-rail-chip${symbol === selected ? " active" : ""}`;
    button.dataset.paperRailSymbol = symbol;
    button.innerHTML = `
      <strong>${escapeHtml(symbol)}</strong>
      <span class="${quote && quote.changePercent < 0 ? "negative" : "positive"}">${quote ? formatPercent(quote.changePercent) : marketMeta(symbol).category}</span>
    `;
    node.appendChild(button);
  });
}

function paperChartPointsForRange(points) {
  if (!points.length) return [];
  const normalized = points.slice();
  let selected = normalized;
  if (paperChartRange === "1M") selected = normalized.slice(-22);
  if (paperChartRange === "3M") selected = normalized.slice(-66);
  if (paperChartRange === "6M") selected = normalized.slice(-126);
  if (paperChartRange === "1Y") selected = normalized.slice(-252);
  return downsampleChartPoints(selected, 1200);
}

function downsampleChartPoints(points, maxPoints) {
  if (points.length <= maxPoints) return points;
  const step = (points.length - 1) / (maxPoints - 1);
  const sampled = [];
  for (let index = 0; index < maxPoints; index += 1) {
    sampled.push(points[Math.round(index * step)]);
  }
  return sampled;
}

function clearTradingViewChart(viewKey) {
  const view = paperChartViews[viewKey];
  if (!view) return;
  if (view.resizeObserver) {
    view.resizeObserver.disconnect();
  }
  if (view.chart) {
    view.chart.remove();
  }
  paperChartViews[viewKey] = { chart: null, series: null, volume: null, resizeObserver: null };
}

function makeChartSeries(chart, type, options) {
  const library = window.LightweightCharts;
  if (!library) return null;
  if (chart.addSeries && type === "candles" && library.CandlestickSeries) {
    return chart.addSeries(library.CandlestickSeries, options);
  }
  if (chart.addSeries && type === "line" && library.LineSeries) {
    return chart.addSeries(library.LineSeries, options);
  }
  if (chart.addSeries && type === "histogram" && library.HistogramSeries) {
    return chart.addSeries(library.HistogramSeries, options);
  }
  if (type === "candles" && chart.addCandlestickSeries) return chart.addCandlestickSeries(options);
  if (type === "line" && chart.addLineSeries) return chart.addLineSeries(options);
  if (type === "histogram" && chart.addHistogramSeries) return chart.addHistogramSeries(options);
  return null;
}

function renderChartEmptyState(container, message) {
  container.innerHTML = `
    <div class="chart-empty-state">
      <strong>${escapeHtml(message)}</strong>
      <code>cd sim-server; python -m uvicorn app.main:app --host 127.0.0.1 --port 8766</code>
    </div>
  `;
}

function renderTradingViewChart(containerId, points, viewKey) {
  const container = document.getElementById(containerId);
  if (!container) return;
  clearTradingViewChart(viewKey);
  const chartPoints = points.filter((point) => Number(point.close || point.value || 0) > 0);
  if (!window.LightweightCharts) {
    renderChartEmptyState(container, "Brak biblioteki wykresow.");
    return;
  }
  if (!chartPoints.length) {
    renderChartEmptyState(container, paperHistoryError || "Brak danych OHLCV.");
    return;
  }
  container.innerHTML = "";
  const library = window.LightweightCharts;
  const chart = library.createChart(container, {
    width: Math.max(320, container.clientWidth || 320),
    height: Math.max(320, container.clientHeight || 360),
    autoSize: true,
    layout: {
      background: { type: "solid", color: "#07090d" },
      textColor: "#9da7b8"
    },
    grid: {
      vertLines: { color: "#121923" },
      horzLines: { color: "#121923" }
    },
    rightPriceScale: {
      borderColor: "#202838",
      scaleMargins: { top: 0.08, bottom: 0.22 }
    },
    timeScale: {
      borderColor: "#202838",
      timeVisible: false,
      secondsVisible: false
    },
    crosshair: {
      mode: 1
    }
  });
  const series = paperChartMode === "line"
    ? makeChartSeries(chart, "line", {
        color: "#00c087",
        lineWidth: 2,
        priceLineVisible: true
      })
    : makeChartSeries(chart, "candles", {
        upColor: "#00c087",
        downColor: "#e53935",
        borderUpColor: "#00c087",
        borderDownColor: "#e53935",
        wickUpColor: "#74f2c8",
        wickDownColor: "#ff706b"
      });
  const volume = makeChartSeries(chart, "histogram", {
    priceFormat: { type: "volume" },
    priceScaleId: "",
    color: "rgba(141, 150, 168, 0.26)"
  });
  if (volume) {
    if (volume.priceScale) {
      volume.priceScale().applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });
    }
    volume.setData(chartPoints.map((point) => ({
      time: point.time,
      value: Number(point.volume || 0),
      color: Number(point.close || 0) >= Number(point.open || 0)
        ? "rgba(0, 192, 135, 0.28)"
        : "rgba(229, 57, 53, 0.28)"
    })));
  }
  if (series) {
    if (paperChartMode === "line") {
      series.setData(chartPoints.map((point) => ({ time: point.time, value: Number(point.close || point.value || 0) })));
    } else {
      series.setData(chartPoints.map((point) => ({
        time: point.time,
        open: Number(point.open),
        high: Number(point.high),
        low: Number(point.low),
        close: Number(point.close)
      })));
    }
  }
  chart.timeScale().fitContent();
  const resizeObserver = new ResizeObserver(() => {
    chart.applyOptions({
      width: Math.max(320, container.clientWidth || 320),
      height: Math.max(320, container.clientHeight || 360)
    });
  });
  resizeObserver.observe(container);
  paperChartViews[viewKey] = { chart, series, volume, resizeObserver };
}

function renderPaperChart() {
  const symbol = paperSelectedSymbol();
  const quote = paperQuote(symbol);
  const fallbackPoints = quote
    ? [
        { time: new Date(Date.now() - 86400000).toISOString().slice(0, 10), open: Number(quote.prevClose || quote.price || 0), high: Number(quote.prevClose || quote.price || 0), low: Number(quote.prevClose || quote.price || 0), close: Number(quote.prevClose || quote.price || 0), value: Number(quote.prevClose || quote.price || 0), volume: 0 },
        { time: new Date().toISOString().slice(0, 10), open: Number(quote.open || quote.price || 0), high: Number(quote.high || quote.price || 0), low: Number(quote.low || quote.price || 0), close: Number(quote.price || 0), value: Number(quote.price || 0), volume: 0 }
      ].filter((point) => Number.isFinite(point.value) && point.value > 0)
    : [];
  const basePoints = state.paperTrading.chart.points.length ? state.paperTrading.chart.points : fallbackPoints;
  const chartPoints = paperChartPointsForRange(basePoints);
  document.getElementById("paper-chart-symbol").textContent = symbol;
  document.getElementById("paper-chart-updated").textContent = paperHistoryError
    ? paperHistoryError
    : paperHistorySource || (state.paperTrading.chart.updatedAt || quote?.updatedAt
      ? formatTimeOnly(state.paperTrading.chart.updatedAt || quote?.updatedAt)
      : "-");
  document.querySelectorAll("[data-paper-range]").forEach((button) => {
    button.classList.toggle("active", button.dataset.paperRange === paperChartRange);
  });
  document.querySelectorAll("[data-paper-chart-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.paperChartMode === paperChartMode);
  });
  renderTradingViewChart("paper-chart", chartPoints, "main");
  if (paperChartFullscreenOpen) {
    setText("paper-chart-fullscreen-symbol", symbol);
    setText("paper-chart-fullscreen-status", paperHistorySource || "Historia OHLCV");
    renderTradingViewChart("paper-chart-fullscreen-canvas", chartPoints, "fullscreen");
  }
}

function renderPaperEquityChart() {
  const node = document.getElementById("paper-equity-chart");
  if (!node) return;
  const points = (state.paperTrading.equityHistory || []).slice(-60).map((entry) => ({
    value: Number(entry.value || 0),
    label: formatUsd(entry.value),
    bottom: formatTimeOnly(entry.createdAt)
  }));
  document.getElementById("paper-equity-chart-summary").textContent = `${formatSignedUsd(paperTotalReturn())}`;
  renderSimpleLineChart("paper-equity-chart", points.length ? points : [{
    value: paperEquity(),
    label: formatUsd(paperEquity()),
    bottom: "now"
  }], {
    baselineZero: false,
    compactLabels: true
  });
}

function agentSymbolsInput() {
  const value = document.getElementById("agent-symbols-input")?.value || "AAPL";
  return value.split(",").map((symbol) => symbol.trim().toUpperCase()).filter(Boolean);
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function agentRewardConfig() {
  return {
    return_weight: Number(document.getElementById("agent-return-weight-input")?.value || 1),
    drawdown_weight: Number(document.getElementById("agent-drawdown-weight-input")?.value || 0),
    volatility_weight: Number(document.getElementById("agent-volatility-weight-input")?.value || 0),
    cost_weight: Number(document.getElementById("agent-cost-weight-input")?.value || 0)
  };
}

function applyAgentRewardPreset(presetKey) {
  const preset = AGENT_REWARD_PRESETS[presetKey];
  if (!preset) return;
  document.getElementById("agent-return-weight-input").value = preset.return_weight;
  document.getElementById("agent-drawdown-weight-input").value = preset.drawdown_weight;
  document.getElementById("agent-volatility-weight-input").value = preset.volatility_weight;
  document.getElementById("agent-cost-weight-input").value = preset.cost_weight;
}

function currentAgentAction(options = {}) {
  const mode = document.getElementById("agent-mode-input").value;
  const action = options.random
    ? ["hold", "buy", "sell"][Math.floor(Math.random() * 3)]
    : document.getElementById("agent-action-input").value;
  const fraction = options.random
    ? Number((Math.random() * 0.35).toFixed(2))
    : Number(document.getElementById("agent-fraction-input").value || 0);
  return mode === "portfolio"
    ? { orders: Object.fromEntries(agentSymbolsInput().map((symbol) => [symbol, { action, fraction }])) }
    : { action, fraction };
}

function rememberAgentPayload(payload) {
  agentSession.lastPayload = payload;
  agentSession.history.push(payload);
  agentSession.history = agentSession.history.slice(-24);
  agentSession.totalReward += Number(payload.reward || 0);
  agentSession.stepCount = Number(payload?.observation?.account?.step || agentSession.stepCount);
}

function renderAgentLog() {
  const node = document.getElementById("agent-log-list");
  if (!node) return;
  if (!agentSession.history.length) {
    node.innerHTML = `<div class="empty-state">Reset srodowiska pokaze tu przebieg epizodu.</div>`;
    return;
  }
  node.innerHTML = "";
  agentSession.history.slice(-6).reverse().forEach((payload) => {
    const row = document.createElement("div");
    row.className = "list-item agent-log-row";
    const account = payload.observation?.account || {};
    row.innerHTML = `
      <div class="finance-watchlist-main">
        <strong>${escapeHtml(payload.info?.date || "-")}</strong>
        <span>krok ${Number(account.step || 0)} / ${Number(account.episode_length || 0)}</span>
      </div>
      <div class="finance-watchlist-quote">
        <strong>${formatUsd(Number(payload.info?.equity || 0))}</strong>
        <span>${Number(payload.reward || 0).toFixed(5)}</span>
      </div>
    `;
    node.appendChild(row);
  });
}

function agentStatusLabel(status) {
  return {
    candidate: "Dobry kandydat",
    research: "W badaniu",
    paper: "Paper trading",
    shadow: "Live shadow",
    blocked: "Odrzucony",
    done: "Zakończony",
    online: "Aktywny",
    offline: "Nieaktywny"
  }[status] || status || "W badaniu";
}

function renderAgentRuns() {
  const node = document.getElementById("agent-runs-list");
  if (!node) return;
  if (!agentSession.runsLoaded) {
    node.innerHTML = `<div class="empty-state">Kliknij „Testuj boty”, żeby zobaczyć ranking.</div>`;
    return;
  }
  if (!agentSession.runs.length) {
    node.innerHTML = `<div class="empty-state">Brak wyników. Zbuduj test albo uruchom selekcję botów.</div>`;
    return;
  }
  node.innerHTML = "";
  agentSession.runs.slice(0, 5).forEach((run) => {
    const finalEquity = Number(run.final_equity ?? run.best?.final_equity ?? 0);
    const totalReturn = Number(run.total_return ?? run.best?.total_return ?? 0);
    const drawdown = Number(run.max_drawdown ?? run.best?.max_drawdown ?? 0);
    const status = run.agent_status || "research";
    const label = agentStatusLabel(status);
    const name = run.case || run.name || run.run_name || run.run_id;
    const row = document.createElement("div");
    row.className = `list-item agent-log-row agent-ranking-row ${status}`;
    row.innerHTML = `
      <div class="finance-watchlist-main">
        <strong>${escapeHtml(run.strategy || run.best?.strategy || "bot")}</strong>
        <span>${escapeHtml(label)} · ryzyko ${formatPercent(drawdown * 100)} · score ${Number(run.robust_score || 0).toFixed(3)}</span>
      </div>
      <div class="finance-watchlist-quote">
        <strong>${formatPercent(totalReturn * 100)}</strong>
        <span>${formatUsd(finalEquity)}</span>
      </div>
      <small>${escapeHtml(name)}</small>
    `;
    node.appendChild(row);
  });
}

function renderAgentSimpleSummary() {
  const best = agentSession.runs?.[0];
  const payload = agentSession.lastPayload;
  setText("agent-simple-name", best?.strategy ? `${best.strategy} · ${agentStatusLabel(best.agent_status)}` : "Research Core");
  setText("agent-simple-copy", best
    ? `Zwrot ${formatPercent(Number(best.total_return || 0) * 100)}, drawdown ${formatPercent(Number(best.max_drawdown || 0) * 100)}.`
    : payload
      ? `Epizod: ${formatUsd(Number(payload.info?.equity || 0))}, drawdown ${formatPercent(Number(payload.info?.drawdown || 0) * 100)}.`
      : "Najpierw testy i paper trading. Bez realnych zleceń.");
}

function renderAgentResearchPanel() {
  setText("agent-research-status", agentSession.researchStatus?.status || (agentSession.researchLoaded ? "offline" : "-"));
  setText("agent-sec-cache", `${Number(agentSession.researchStatus?.sec_cached_files || 0)}`);
  setText("agent-news-cache", `${Number(agentSession.researchStatus?.news_cached_symbols || 0)}`);
  const node = document.getElementById("agent-research-list");
  if (!node) return;
  const rows = [];
  if (agentSession.featureSummary) {
    rows.push({
      title: `Dataset ${agentSession.featureSummary.dataset_id}`,
      meta: `${agentSession.featureSummary.row_count} wierszy - ${agentSession.featureSummary.symbols?.join(", ") || ""}`,
      value: "features"
    });
  }
  (agentSession.researchStatus?.investors || []).slice(0, 3).forEach((investor) => {
    rows.push({
      title: investor.name,
      meta: `13F - ${investor.style}`,
      value: investor.status
    });
  });
  if (!rows.length) {
    node.innerHTML = `<div class="empty-state">Sync danych pokaże cache SEC, newsy i 13F.</div>`;
    return;
  }
  node.innerHTML = "";
  rows.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "list-item agent-log-row";
    row.innerHTML = `
      <div class="finance-watchlist-main">
        <strong>${escapeHtml(entry.title)}</strong>
        <span>${escapeHtml(entry.meta)}</span>
      </div>
      <div class="finance-watchlist-quote">
        <span>${escapeHtml(entry.value)}</span>
      </div>
    `;
    node.appendChild(row);
  });
}

function renderAgentSignal() {
  const node = document.getElementById("agent-signal-card");
  if (!node) return;
  if (!agentSession.signal) {
    node.innerHTML = `
      <div class="agent-signal-head">
        <strong>${escapeHtml(paperSelectedSymbol())}: czeka na sygnał</strong>
        <span>research</span>
      </div>
      <p class="field-help">Kliknij „Pokaż sygnał”, żeby zobaczyć prostą decyzję bota dla aktualnego instrumentu.</p>
    `;
    return;
  }
  const signal = agentSession.signal;
  const actionLabel = {
    buy: "KUP",
    reduce: "ZMNIEJSZ",
    sell: "SPRZEDAJ",
    hold: "TRZYMAJ"
  }[signal.action] || String(signal.action || "TRZYMAJ").toUpperCase();
  node.innerHTML = `
    <div class="agent-signal-head">
      <strong>${escapeHtml(signal.symbol || paperSelectedSymbol())}: ${escapeHtml(actionLabel)}</strong>
      <span>${formatPercent(Number(signal.confidence || 0) * 100)} pewności</span>
    </div>
    <div class="agent-simple-metrics">
      <span>Waga: <strong>${Number(signal.target_weight || 0).toFixed(2)}</strong></span>
      <span>Ryzyko: <strong>${escapeHtml(signal.risk || "-")}</strong></span>
      <span>Status: <strong>${escapeHtml(agentStatusLabel(signal.status))}</strong></span>
    </div>
    <p class="field-help">${escapeHtml((signal.why || []).join(" · "))}</p>
  `;
}

async function loadAgentRuns() {
  try {
    const { payload } = await simApiFetch("/agents/rankings");
    agentSession.runs = Array.isArray(payload?.agents) ? payload.agents : [];
    agentSession.runsLoaded = true;
  } catch (error) {
    try {
      const { payload } = await simApiFetch("/experiments/runs");
      agentSession.runs = Array.isArray(payload?.runs) ? payload.runs : [];
      agentSession.runsLoaded = true;
    } catch (fallbackError) {
      agentSession.runs = [];
      agentSession.runsLoaded = true;
    }
  }
  renderAgentRuns();
  renderAgentSimpleSummary();
}

async function loadResearchStatus() {
  try {
    const { payload } = await simApiFetch("/research/status");
    agentSession.researchStatus = payload;
    agentSession.researchLoaded = true;
  } catch (error) {
    agentSession.researchStatus = null;
    agentSession.researchLoaded = true;
  }
  renderAgentResearchPanel();
}

async function syncAgentResearch() {
  agentSession.loading = true;
  renderAgentPanel();
  try {
    const { payload } = await simApiFetch("/research/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbols: agentSymbolsInput(), refresh: false })
    });
    agentSession.researchStatus = payload.status;
    agentSession.researchLoaded = true;
    setFeedback("Zsynchronizowano research cache.");
  } catch (error) {
    agentSession.error = String(error?.message || "Błąd research sync");
  } finally {
    agentSession.loading = false;
    renderAgentPanel();
  }
}

async function buildAgentFeatureDataset() {
  agentSession.loading = true;
  renderAgentPanel();
  try {
    const { payload } = await simApiFetch("/features/build-dataset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "features_ui_core",
        symbols: agentSymbolsInput(),
        start: document.getElementById("agent-start-input")?.value || "2018-01-01",
        end: document.getElementById("agent-end-input")?.value || null,
        lookback: Number(document.getElementById("agent-lookback-input")?.value || 60)
      })
    });
    agentSession.featureSummary = payload;
    setFeedback(`Zbudowano dataset: ${payload.row_count || 0} wierszy.`);
  } catch (error) {
    agentSession.error = String(error?.message || "Błąd datasetu");
  } finally {
    agentSession.loading = false;
    renderAgentPanel();
  }
}

async function loadAgentSignal() {
  try {
    const { payload } = await simApiFetch(`/agents/research-core/signals?symbol=${encodeURIComponent(paperSelectedSymbol())}`);
    agentSession.signal = payload;
  } catch (error) {
    agentSession.signal = null;
  }
  renderAgentSignal();
}

async function runSimpleAgentTest() {
  const selected = paperSelectedSymbol();
  const input = document.getElementById("agent-symbols-input");
  if (input && !agentSymbolsInput().includes(selected)) {
    input.value = `${selected},SPY`;
  }
  await syncAgentResearch();
  await buildAgentFeatureDataset();
  try {
    await simApiFetch("/agents/run-matrix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbols: agentSymbolsInput(),
        mode: document.getElementById("agent-mode-input")?.value || "portfolio",
        note: "UI simple mode research-first selection"
      })
    });
  } catch (error) {
    agentSession.error = String(error?.message || "Nie udało się odświeżyć rankingu botów");
  }
  await loadAgentRuns();
  await loadAgentSignal();
}

function renderAgentPanel() {
  const status = document.getElementById("agent-status");
  if (!status) return;
  const payload = agentSession.lastPayload;
  status.textContent = agentSession.loading
    ? "Liczy"
    : agentSession.error
      ? agentSession.error
      : agentSession.id
        ? `Sesja ${agentSession.id.slice(0, 8)}`
        : "Silnik lokalny";
  const chip = document.getElementById("agent-session-chip");
  if (chip) {
    chip.textContent = payload?.done ? "done" : agentSession.id ? "online" : "offline";
    chip.classList.toggle("active", Boolean(agentSession.id) && !payload?.done);
  }
  const equity = Number(payload?.info?.equity || 0);
  const episodeReturn = agentSession.startEquity > 0 ? ((equity - agentSession.startEquity) / agentSession.startEquity) * 100 : 0;
  const breakdown = payload?.info?.reward_breakdown || {};
  setText("agent-date", payload?.info?.date || "-");
  setText("agent-equity", payload?.info?.equity ? formatUsd(payload.info.equity) : "-");
  setText("agent-return", payload ? formatPercent(episodeReturn) : "-");
  setText("agent-total-reward", payload ? agentSession.totalReward.toFixed(5) : "-");
  setText("agent-reward", payload ? Number(payload.reward || 0).toFixed(5) : "-");
  setText("agent-drawdown", payload?.info?.drawdown != null
    ? formatPercent(Number(payload.info.drawdown || 0) * 100)
    : "-");
  setText("agent-breakdown-return", `return ${Number(breakdown.equity_return || 0).toFixed(5)}`);
  setText("agent-breakdown-drawdown", `drawdown ${Number(breakdown.drawdown_penalty || 0).toFixed(5)}`);
  setText("agent-breakdown-volatility", `volatility ${Number(breakdown.volatility_penalty || 0).toFixed(5)}`);
  setText("agent-breakdown-cost", `cost ${Number(breakdown.transaction_cost_penalty || 0).toFixed(5)}`);
  const disabled = !agentSession.id || agentSession.loading || Boolean(payload?.done);
  document.getElementById("agent-step-button").disabled = disabled;
  document.getElementById("agent-random-step-button").disabled = disabled;
  document.getElementById("agent-ten-steps-button").disabled = disabled;
  document.getElementById("agent-reset-button").disabled = agentSession.loading;
  renderAgentLog();
  renderAgentRuns();
  renderAgentResearchPanel();
  renderAgentSignal();
  renderAgentSimpleSummary();
}

async function resetAgentEnvironment() {
  const symbols = agentSymbolsInput();
  const mode = document.getElementById("agent-mode-input").value;
  const episodeLength = Number(document.getElementById("agent-episode-input").value || 120);
  const lookback = Number(document.getElementById("agent-lookback-input").value || 30);
  const cash = Number(document.getElementById("agent-cash-input")?.value || 100000);
  const seedValue = document.getElementById("agent-seed-input").value;
  const startValue = document.getElementById("agent-start-input")?.value || null;
  const endValue = document.getElementById("agent-end-input")?.value || null;
  agentSession.loading = true;
  agentSession.error = "";
  agentSession.history = [];
  agentSession.totalReward = 0;
  agentSession.startEquity = 0;
  agentSession.stepCount = 0;
  renderAgentPanel();
  try {
    const { payload, baseUrl } = await simApiFetch("/env/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbols,
        mode,
        episode_length: episodeLength,
        lookback,
        seed: seedValue === "" ? null : Number(seedValue),
        cash,
        start: startValue,
        end: endValue,
        costs: {
          commission: Number(paperSettings().commission || 0),
          slippage_bps: Number(paperSettings().slippageBps || 0)
        },
        reward: agentRewardConfig()
      })
    });
    agentSession.id = payload.session_id;
    agentSession.startEquity = Number(payload.info?.equity || cash);
    rememberAgentPayload(payload);
    setFeedback(`Zresetowano srodowisko agenta (${baseUrl.split(":").at(-1)}).`);
  } catch (error) {
    agentSession.id = "";
    agentSession.lastPayload = null;
    agentSession.error = String(error?.message || "Uruchom lokalny silnik symulacji");
    setFeedback("Uruchom lokalny silnik symulacji.");
  } finally {
    agentSession.loading = false;
    renderAgentPanel();
  }
}

async function stepAgentEnvironment(options = {}) {
  if (!agentSession.id) return;
  const body = currentAgentAction(options);
  agentSession.loading = true;
  agentSession.error = "";
  renderAgentPanel();
  try {
    const { payload } = await simApiFetch(`/env/${agentSession.id}/step`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    rememberAgentPayload(payload);
    setFeedback(payload.done ? "Epizod agenta zakonczony." : "Wykonano krok agenta.");
  } catch (error) {
    agentSession.error = String(error?.message || "Blad kroku agenta");
  } finally {
    agentSession.loading = false;
    renderAgentPanel();
  }
}

async function runAgentSteps(count, options = {}) {
  for (let index = 0; index < count; index += 1) {
    if (!agentSession.id || agentSession.loading || agentSession.lastPayload?.done) break;
    await stepAgentEnvironment(options);
  }
}

function renderFinanceHome() {
  const finance = financeSummary();
  const quote = paperQuote(paperSelectedSymbol());
  document.getElementById("finance-home-personal-summary").textContent = formatZl(finance.income - finance.expense);
  document.getElementById("finance-home-personal-copy").textContent = `${formatZl(finance.income)} przychodu, ${formatZl(finance.expense)} wydatkow, ${formatZl(plannedTotal())} planowanych.`;
  document.getElementById("finance-home-market-summary").textContent = paperSelectedSymbol();
  document.getElementById("finance-home-market-copy").textContent = quote
    ? `${formatInstrumentPrice(quote.price, paperSelectedSymbol())} ${formatPercent(quote.changePercent)} - konto ${formatUsd(paperEquity())}, ${formatPercent(paperReturnPercent())}`
    : `${state.paperTrading.watchlist.length} walorów, konto ${formatUsd(paperEquity())}, ${paperOpenOrders().length} oczekuje`;
}

function renderFinance() {
  const visible = {
    home: "finance-home-view",
    personal: "finance-personal-view",
    market: "finance-market-view"
  }[financeView] || "finance-home-view";
  ["finance-home-view", "finance-personal-view", "finance-market-view"].forEach((id) => {
    const node = document.getElementById(id);
    if (node) node.hidden = id !== visible;
  });
  document.body.classList.toggle("market-mode", financeView === "market");
  if (financeView === "market") {
    loadMarketUniverse();
  }

  const finance = financeSummary();
  const positionsValue = paperPositionsValue();
  const equity = paperEquity();
  const pnl = paperUnrealizedPnl();
  const realizedPnl = paperRealizedPnl();
  const totalReturn = paperTotalReturn();
  const clock = paperMarketClock();
  const selectedSymbol = paperSelectedSymbol();
  const selectedQuote = paperQuote(selectedSymbol);
  const selectedMeta = marketMeta(selectedSymbol);
  const selectedChartPoints = state.paperTrading.chart.symbol === selectedSymbol ? state.paperTrading.chart.points : [];
  const selectedChartLast = selectedChartPoints.at(-1) || null;
  const selectedChartPrev = selectedChartPoints.at(-2) || null;
  const selectedPrice = Number(selectedQuote?.price || selectedChartLast?.close || selectedChartLast?.value || 0);
  const selectedOpen = Number(selectedQuote?.open || selectedChartLast?.open || 0);
  const selectedHigh = Number(selectedQuote?.high || selectedChartLast?.high || 0);
  const selectedLow = Number(selectedQuote?.low || selectedChartLast?.low || 0);
  const selectedPrevClose = Number(selectedQuote?.prevClose || selectedChartPrev?.close || selectedChartPrev?.value || 0);
  const selectedChangePercent = selectedQuote
    ? Number(selectedQuote.changePercent || 0)
    : (selectedPrice && selectedPrevClose ? ((selectedPrice - selectedPrevClose) / selectedPrevClose) * 100 : 0);
  document.getElementById("finance-balance").textContent = formatZl(finance.income - finance.expense);
  document.getElementById("finance-income").textContent = formatZl(finance.income);
  document.getElementById("finance-expense").textContent = formatZl(finance.expense);
  document.getElementById("finance-planned").textContent = formatZl(plannedTotal());
  document.getElementById("evaluator-score").textContent = state.evaluator.score ?? "-";
  document.getElementById("evaluator-label").textContent = state.evaluator.label ?? "-";
  document.getElementById("evaluator-cpu").textContent = state.evaluator.costPerUse != null ? `${state.evaluator.costPerUse.toFixed(0)} zl` : "-";
  document.getElementById("paper-cash").textContent = formatUsd(state.paperTrading.cash);
  document.getElementById("paper-portfolio").textContent = formatUsd(positionsValue);
  document.getElementById("paper-equity").textContent = formatUsd(equity);
  document.getElementById("paper-pnl").textContent = formatUsd(pnl);
  document.getElementById("paper-realized-pnl").textContent = formatSignedUsd(realizedPnl);
  document.getElementById("paper-return").textContent = formatPercent(paperReturnPercent());
  document.getElementById("paper-fees").textContent = formatUsd(paperFeesPaid());
  document.getElementById("paper-open-orders").textContent = `${paperOpenOrders().length}`;
  document.getElementById("paper-account-position-count").textContent = `${state.paperTrading.positions.length}`;
  document.getElementById("paper-market-clock").textContent = `${clock.label} - ${clock.detail}`;
  document.getElementById("paper-feed-status").textContent = paperTradingLoading ? "Ładuje" : paperMarketStatus();
  document.getElementById("paper-feed-provider").textContent = state.paperTrading.provider.toUpperCase();
  document.getElementById("paper-selected-symbol").textContent = selectedSymbol;
  document.getElementById("paper-info-symbol").textContent = selectedSymbol;
  document.getElementById("paper-selected-company").textContent = `${selectedMeta.name} - ${selectedMeta.category}${selectedMeta.exchange ? ` - ${selectedMeta.exchange}` : ""}`;
  document.getElementById("paper-selected-price").textContent = selectedPrice ? formatInstrumentPrice(selectedPrice, selectedSymbol) : "--";
  document.getElementById("paper-selected-change").textContent = formatPercent(selectedChangePercent);
  document.getElementById("paper-selected-change").classList.toggle("negative", selectedChangePercent < 0);
  document.getElementById("paper-pnl").classList.toggle("negative", pnl < 0);
  document.getElementById("paper-realized-pnl").classList.toggle("negative", realizedPnl < 0);
  document.getElementById("paper-return").classList.toggle("negative", totalReturn < 0);
  document.getElementById("paper-selected-open").textContent = selectedOpen ? formatInstrumentPrice(selectedOpen, selectedSymbol) : "--";
  document.getElementById("paper-selected-high").textContent = selectedHigh ? formatInstrumentPrice(selectedHigh, selectedSymbol) : "--";
  document.getElementById("paper-selected-low").textContent = selectedLow ? formatInstrumentPrice(selectedLow, selectedSymbol) : "--";
  document.getElementById("paper-selected-prev").textContent = selectedPrevClose ? formatInstrumentPrice(selectedPrevClose, selectedSymbol) : "--";
  document.getElementById("paper-info-commission").textContent = formatUsd(paperSettings().commission);
  document.getElementById("paper-info-spread").textContent = `${paperSettings().spreadBps} bps`;
  document.getElementById("paper-info-slippage").textContent = `${paperSettings().slippageBps} bps`;
  document.getElementById("paper-api-input").value = state.paperTrading.apiKey || "";
  document.getElementById("paper-api-input").placeholder = state.paperTrading.apiKey ? "Klucz Finnhub" : "Wbudowany klucz aktywny";
  document.getElementById("paper-auto-button").textContent = state.paperTrading.autoRefresh ? "Auto 3 min: wł." : "Auto 3 min: wył.";
  document.getElementById("paper-commission-input").value = paperSettings().commission;
  document.getElementById("paper-spread-input").value = paperSettings().spreadBps;
  document.getElementById("paper-slippage-input").value = paperSettings().slippageBps;
  document.getElementById("paper-after-hours-input").checked = Boolean(paperSettings().allowAfterHours);
  document.getElementById("paper-watchlist-count").textContent = `${state.paperTrading.watchlist.length}`;
  document.getElementById("paper-position-count").textContent = `${state.paperTrading.positions.length}`;
  document.getElementById("paper-order-count").textContent = `${state.paperTrading.orders.length}`;
  const orderSymbolSelect = document.getElementById("paper-order-symbol");
  orderSymbolSelect.innerHTML = "";
  [...new Set([...state.paperTrading.watchlist, ...state.paperTrading.positions.map((position) => position.symbol)])].forEach((symbol) => {
    const option = document.createElement("option");
    option.value = symbol;
    option.textContent = symbol;
    if (symbol === selectedSymbol) option.selected = true;
    orderSymbolSelect.appendChild(option);
  });
  const side = document.getElementById("paper-order-side").value;
  const orderSymbol = orderSymbolSelect.value || selectedSymbol;
  const orderQuote = paperQuote(orderSymbol) || selectedQuote;
  const shares = Number(document.getElementById("paper-order-shares").value || 0);
  const orderType = document.getElementById("paper-order-type").value || "market";
  document.getElementById("paper-limit-price").hidden = orderType !== "limit";
  document.getElementById("paper-stop-price").hidden = orderType !== "stop";
  document.getElementById("paper-buy-button").classList.toggle("active", side === "buy");
  document.getElementById("paper-sell-button").classList.toggle("active", side === "sell");
  document.getElementById("paper-trade-bar-buy").classList.toggle("active", side === "buy");
  document.getElementById("paper-trade-bar-sell").classList.toggle("active", side === "sell");
  document.getElementById("paper-trade-bar-shares").textContent = `${Math.max(1, shares || 1)}`;
  document.getElementById("paper-order-backdrop").hidden = !paperOrderSheetOpen;
  document.getElementById("paper-symbol-backdrop").hidden = !paperSymbolSheetOpen;
  document.querySelector(".terminal-ticket-card")?.classList.toggle("sheet-open", paperOrderSheetOpen);
  document.querySelector(".terminal-search-card")?.classList.toggle("sheet-open", paperSymbolSheetOpen);
  document.getElementById("paper-chart-fullscreen").hidden = !paperChartFullscreenOpen;
  document.querySelectorAll("[data-market-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.marketPanel !== paperMarketPanel;
  });
  document.querySelectorAll("[data-market-panel-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.marketPanelTab === paperMarketPanel);
  });
  const estimateOrder = {
    side,
    type: orderType,
    limitPrice: Number(document.getElementById("paper-limit-price").value || 0),
    stopPrice: Number(document.getElementById("paper-stop-price").value || 0)
  };
  const estimatedPrice = orderQuote ? paperExecutionPrice(estimateOrder, orderQuote) : 0;
  const estimatedFee = Number(paperSettings().commission || 0);
  document.getElementById("paper-order-estimate").textContent = formatUsd((estimatedPrice * Math.max(0, shares)) + (shares > 0 ? estimatedFee : 0));
  document.getElementById("paper-order-available").textContent = `${paperPositionShares(orderSymbol)}`;
  document.getElementById("paper-order-submit").textContent = side === "buy" ? `Kup - ${paperOrderTypeLabel(orderType)}` : `Sprzedaj - ${paperOrderTypeLabel(orderType)}`;
  renderFinanceHome();
  renderFinanceEntries();
  renderPlannedExpenses();
  renderPaperCategories();
  renderPaperSuggestions();
  renderPaperWatchlist();
  renderPaperSymbolRail();
  renderPaperPositions();
  renderPaperOrders();
  renderPaperChart();
  renderPaperEquityChart();
  renderAgentPanel();
  if (financeView === "market") {
    ensurePaperHistory(selectedSymbol, paperChartRange);
    if (!agentSession.runsLoaded) {
      loadAgentRuns();
    }
    if (!agentSession.researchLoaded) {
      loadResearchStatus();
    }
  }
}

function renderTaskList() {
  const node = document.getElementById("task-list");
  node.innerHTML = "";
  const openCount = state.tasks.filter((task) => !task.done).length;
  document.getElementById("task-summary").textContent = `${openCount} open`;
  document.getElementById("me-task-count").textContent = `${state.tasks.length}`;

  if (!state.tasks.length) {
    node.appendChild(emptyNode("Brak taskow."));
    return;
  }

  state.tasks
    .slice()
    .sort((a, b) => Number(a.done) - Number(b.done))
    .forEach((task) => node.appendChild(renderTaskRow(task)));
}

function renderHabitList() {
  const node = document.getElementById("habit-list");
  node.innerHTML = "";
  document.getElementById("habit-summary").textContent = `${state.habits.filter((habit) => habit.done).length}/${state.habits.length}`;
  document.getElementById("me-habit-count").textContent = `${state.habits.length}`;

  if (!state.habits.length) {
    node.appendChild(emptyNode("Brak habitow."));
    return;
  }

  state.habits.forEach((habit) => node.appendChild(renderHabitRow(habit)));
}

function renderSupplements() {
  const node = document.getElementById("supplement-list");
  node.innerHTML = "";

  if (!state.supplements.length) {
    node.appendChild(emptyNode("Brak suplementow."));
    return;
  }

  state.supplements.forEach((supplement) => {
    const row = document.createElement("div");
    row.className = "list-item";
    row.innerHTML = `
      <div class="list-copy">
        <strong>${escapeHtml(supplement.name)}</strong>
        <span>${escapeHtml(supplement.dosage)}</span>
      </div>
    `;
    node.appendChild(row);
  });
}

function renderMe() {
  renderTaskList();
  renderHabitList();
  renderSupplements();
  document.getElementById("today-note").textContent = state.note;
}

function renderRestTimer() {
  const valueNode = document.getElementById("rest-timer-value");
  const statusNode = document.getElementById("rest-timer-status");
  if (!valueNode || !statusNode) return;
  valueNode.textContent = String(restTimerValue);
  statusNode.textContent = restTimerRunning ? "Running" : "Ready";
}

function toggleRestTimer() {
  if (restTimerRunning) {
    restTimerRunning = false;
    clearInterval(restTimerInterval);
    restTimerInterval = null;
    renderRestTimer();
    return;
  }

  restTimerRunning = true;
  renderRestTimer();
  restTimerInterval = setInterval(() => {
    if (restTimerValue > 0) {
      restTimerValue -= 1;
      renderRestTimer();
      return;
    }

    restTimerRunning = false;
    clearInterval(restTimerInterval);
    restTimerInterval = null;
    renderRestTimer();
    notifyPulse();
    setFeedback("Koniec przerwy.");
  }, 1000);
}

function resetRestTimer() {
  restTimerRunning = false;
  clearInterval(restTimerInterval);
  restTimerInterval = null;
  restTimerValue = 90;
  renderRestTimer();
}

function ensureMetronomeAudio() {
  if (!metronomeAudioContext) {
    metronomeAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (metronomeAudioContext.state === "suspended") {
    metronomeAudioContext.resume().catch(() => {});
  }
}

function playMetronomeClick() {
  try {
    ensureMetronomeAudio();
    const oscillator = metronomeAudioContext.createOscillator();
    const gain = metronomeAudioContext.createGain();
    const accented = metronomeBeatIndex === 0;
    oscillator.type = accented ? "triangle" : "sine";
    oscillator.frequency.value = accented ? 1620 : 1080;
    gain.gain.value = accented ? 0.07 : 0.04;
    oscillator.connect(gain);
    gain.connect(metronomeAudioContext.destination);
    oscillator.start();
    oscillator.stop(metronomeAudioContext.currentTime + (accented ? 0.06 : 0.04));
  } catch {
    // Silent fallback.
  }
}

function distortionCurve(amount = 18) {
  const samples = 256;
  const curve = new Float32Array(samples);
  const deg = Math.PI / 180;
  for (let index = 0; index < samples; index += 1) {
    const x = (index * 2) / samples - 1;
    curve[index] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

function schedulePickTransient(context, destination, startAt, level = 0.018) {
  const length = Math.max(1, Math.floor(context.sampleRate * 0.018));
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < length; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / length);
  }
  const source = context.createBufferSource();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(1200, startAt);
  gain.gain.setValueAtTime(level, startAt);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.018);
  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(startAt);
  source.stop(startAt + 0.02);
}

function scheduleTone(context, frequency, startAt, duration, { type = "triangle", gainValue = 0.06, profile = "piano" } = {}) {
  const safeProfile = EAR_SOUND_PROFILES[profile] ? profile : "piano";
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, startAt);

  const connectToDestination = (node) => {
    node.connect(gain);
    gain.connect(context.destination);
  };

  if (safeProfile === "keysPad") {
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(Math.min(2600, frequency * 7), startAt);
    filter.Q.setValueAtTime(0.8, startAt);
    const oscA = context.createOscillator();
    const oscB = context.createOscillator();
    oscA.type = "sine";
    oscB.type = "triangle";
    oscA.frequency.value = frequency;
    oscB.frequency.value = frequency;
    oscB.detune.value = 7;
    oscA.connect(filter);
    oscB.connect(filter);
    connectToDestination(filter);
    gain.gain.linearRampToValueAtTime(gainValue * 0.78, startAt + 0.14);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration + 0.28);
    oscA.start(startAt);
    oscB.start(startAt);
    oscA.stop(startAt + duration + 0.34);
    oscB.stop(startAt + duration + 0.34);
    return;
  }

  const oscillator = context.createOscillator();
  oscillator.frequency.value = frequency;

  if (safeProfile === "tone") {
    oscillator.type = type || "sine";
    connectToDestination(oscillator);
    gain.gain.linearRampToValueAtTime(gainValue, startAt + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  } else if (safeProfile === "cleanGuitar") {
    const filter = context.createBiquadFilter();
    const overtone = context.createOscillator();
    const overtoneGain = context.createGain();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(Math.min(5200, frequency * 8), startAt);
    filter.frequency.exponentialRampToValueAtTime(Math.min(2400, frequency * 5), startAt + duration * 0.72);
    filter.Q.setValueAtTime(1.2, startAt);
    oscillator.type = "sawtooth";
    overtone.type = "triangle";
    overtone.frequency.value = frequency * 2.01;
    overtoneGain.gain.setValueAtTime(gainValue * 0.22, startAt);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration * 0.45);
    oscillator.connect(filter);
    overtone.connect(overtoneGain);
    overtoneGain.connect(filter);
    schedulePickTransient(context, filter, startAt, gainValue * 0.16);
    connectToDestination(filter);
    gain.gain.linearRampToValueAtTime(gainValue * 1.05, startAt + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration * 0.68);
    overtone.start(startAt);
    overtone.stop(startAt + duration + 0.04);
  } else if (safeProfile === "distortedGuitar") {
    const shaper = context.createWaveShaper();
    const filter = context.createBiquadFilter();
    const sub = context.createOscillator();
    const subGain = context.createGain();
    shaper.curve = distortionCurve(42);
    shaper.oversample = "4x";
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(Math.min(2600, frequency * 5), startAt);
    filter.Q.setValueAtTime(0.9, startAt);
    oscillator.type = "sawtooth";
    sub.type = "square";
    sub.frequency.value = frequency / 2;
    subGain.gain.setValueAtTime(gainValue * 0.18, startAt);
    subGain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration * 0.78);
    oscillator.connect(shaper);
    sub.connect(subGain);
    subGain.connect(shaper);
    schedulePickTransient(context, shaper, startAt, gainValue * 0.12);
    shaper.connect(filter);
    connectToDestination(filter);
    gain.gain.linearRampToValueAtTime(gainValue * 0.74, startAt + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration * 0.82);
    sub.start(startAt);
    sub.stop(startAt + duration + 0.04);
  } else {
    const filter = context.createBiquadFilter();
    const high = context.createOscillator();
    const highGain = context.createGain();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(Math.min(5200, frequency * 9), startAt);
    filter.frequency.exponentialRampToValueAtTime(Math.min(2800, frequency * 6), startAt + duration);
    filter.Q.setValueAtTime(0.85, startAt);
    oscillator.type = "triangle";
    high.type = "sine";
    high.frequency.value = frequency * 2;
    highGain.gain.setValueAtTime(gainValue * 0.16, startAt);
    highGain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration * 0.52);
    oscillator.connect(filter);
    high.connect(highGain);
    highGain.connect(filter);
    connectToDestination(filter);
    gain.gain.linearRampToValueAtTime(gainValue * 0.95, startAt + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration * 0.95);
    high.start(startAt);
    high.stop(startAt + duration + 0.04);
  }

  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.08);
}

function playEarAudio(spec) {
  try {
    ensureMetronomeAudio();
    const ctx = metronomeAudioContext;
    const start = ctx.currentTime + 0.02;
    const profile = EAR_SOUND_PROFILES[spec.soundProfile] ? spec.soundProfile : "piano";
    const playNote = (frequency, noteStart, duration, options = {}) => {
      scheduleTone(ctx, frequency, noteStart, duration, { profile, ...options });
    };

    if (spec.engine === "interval") {
      const root = midiToFrequency(spec.rootMidi);
      const top = midiToFrequency(spec.rootMidi + spec.semitones);
      if (spec.mode === "harmonic") {
        playNote(root, start, 0.42, { type: "triangle", gainValue: 0.05 });
        playNote(top, start, 0.42, { type: "triangle", gainValue: 0.05 });
      } else {
        playNote(root, start, 0.24, { type: "triangle", gainValue: 0.06 });
        playNote(top, start + 0.34, 0.24, { type: "triangle", gainValue: 0.06 });
      }
      return;
    }

    if (spec.engine === "chord") {
      const notes = (spec.intervals || [0, 4, 7]).map((step) => midiToFrequency(spec.rootMidi + step));
      if (spec.mode === "arp") {
        notes.forEach((frequency, index) => {
          playNote(frequency, start + index * 0.16, 0.28, { type: "triangle", gainValue: 0.055 });
        });
      } else if (spec.mode === "broken") {
        notes.forEach((frequency, index) => {
          playNote(frequency, start + index * 0.11, 0.42, { type: "triangle", gainValue: 0.045 });
        });
      } else {
        notes.forEach((frequency) => {
          playNote(frequency, start, 0.56, { type: "triangle", gainValue: 0.045 });
        });
      }
      return;
    }

    if (spec.engine === "progression") {
      const progression = spec.progression?.chords || [];
      progression.forEach((entry, chordIndex) => {
        const chordStart = start + chordIndex * (spec.mode === "flow" ? 0.52 : spec.mode === "spread" ? 0.76 : 0.64);
        const intervals = applyChordInversion(CHORD_INTERVALS[entry.quality] || [0, 4, 7], spec.inversion || "root");
        if (spec.mode === "flow") {
          intervals.forEach((step, noteIndex) => {
            playNote(midiToFrequency(spec.rootMidi + (entry.rootShift || 0) + step), chordStart + noteIndex * 0.08, 0.28, { type: "triangle", gainValue: 0.045 });
          });
          return;
        }
        if (spec.mode === "spread") {
          const bass = intervals[0] ?? 0;
          playNote(midiToFrequency(spec.rootMidi + (entry.rootShift || 0) + bass - 12), chordStart, 0.3, { type: "triangle", gainValue: 0.04 });
          intervals.slice(1).forEach((step, noteIndex) => {
            playNote(midiToFrequency(spec.rootMidi + (entry.rootShift || 0) + step), chordStart + 0.12 + noteIndex * 0.05, 0.36, { type: "triangle", gainValue: 0.04 });
          });
          return;
        }
        intervals.forEach((step) => {
          playNote(midiToFrequency(spec.rootMidi + (entry.rootShift || 0) + step), chordStart, 0.42, { type: "triangle", gainValue: 0.043 });
        });
      });
      return;
    }

    if (spec.engine === "scale") {
      const phrase = spec.intervals || [0, 2, 4, 5, 7];
      phrase.forEach((step, index) => {
        playNote(midiToFrequency(spec.rootMidi + step), start + index * 0.16, 0.22, { type: "triangle", gainValue: 0.05 });
      });
      return;
    }

    if (spec.engine === "melody") {
      (spec.pattern || [0, 2, 4]).forEach((step, index) => {
        playNote(midiToFrequency(spec.rootMidi + step), start + index * 0.22, 0.24, { type: "triangle", gainValue: 0.055 });
      });
      return;
    }

    if (spec.engine === "pitch") {
      playNote(midiToFrequency(spec.midi), start, 0.52, { type: "triangle", gainValue: 0.06 });
      return;
    }

    if (spec.engine === "rhythm") {
      const beatLength = 0.42;
      (spec.pattern || []).forEach((point, index) => {
        const clickAt = start + point * beatLength;
        scheduleTone(ctx, 1120 + index * 20, clickAt, 0.06, { type: "square", gainValue: 0.045, profile: "tone" });
      });
    }
  } catch {
    // Silent fallback.
  }
}

function autoCorrelatePitch(buffer, sampleRate) {
  let rms = 0;
  for (let index = 0; index < buffer.length; index += 1) {
    rms += buffer[index] * buffer[index];
  }
  rms = Math.sqrt(rms / buffer.length);
  if (rms < 0.008) return -1;

  let bestOffset = -1;
  let bestCorrelation = 0;
  const minOffset = Math.floor(sampleRate / 1800);
  const maxOffset = Math.floor(sampleRate / 60);
  for (let offset = minOffset; offset <= maxOffset; offset += 1) {
    let correlation = 0;
    for (let index = 0; index < buffer.length - offset; index += 1) {
      correlation += 1 - Math.abs(buffer[index] - buffer[index + offset]);
    }
    correlation /= buffer.length - offset;
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }
  return bestCorrelation > 0.86 && bestOffset > 0 ? sampleRate / bestOffset : -1;
}

function nearestGuitarString(frequency) {
  return GUITAR_TUNER_STRINGS
    .map((stringInfo) => ({
      ...stringInfo,
      cents: Math.abs(centsFromTarget(frequency, stringInfo.frequency))
    }))
    .sort((a, b) => a.cents - b.cents)[0] || tunerTargetString();
}

function tickTuner() {
  if (!tunerRunning || !tunerAnalyser || !tunerAudioContext) return;
  const buffer = new Float32Array(tunerAnalyser.fftSize);
  tunerAnalyser.getFloatTimeDomainData(buffer);
  let frequency = autoCorrelatePitch(buffer, tunerAudioContext.sampleRate);
  if (frequency > 55 && frequency < 1800) {
    const previousStable = median(tunerFrequencyHistory);
    if (previousStable > 0 && frequency > previousStable * 1.88 && frequency < previousStable * 2.12) {
      frequency /= 2;
    } else if (previousStable > 0 && frequency * 2 > previousStable * 0.88 && frequency * 2 < previousStable * 1.12) {
      frequency *= 2;
    }
    tunerFrequencyHistory.push(frequency);
    tunerFrequencyHistory = tunerFrequencyHistory.slice(-7);
    const stableFrequency = median(tunerFrequencyHistory);
    const nearest = nearestGuitarString(stableFrequency);
    const target = tunerTargetString();
    const effectiveTarget = Math.abs(centsFromTarget(stableFrequency, target.frequency)) <= 55 ? target : nearest;
    tunerTargetStringId = effectiveTarget.id;
    tunerDetection = {
      frequency: stableFrequency,
      note: midiToNoteLabel(frequencyToMidiValue(stableFrequency)),
      cents: centsFromTarget(stableFrequency, effectiveTarget.frequency),
      targetId: effectiveTarget.id
    };
    const detectedMidi = Math.round(frequencyToMidiValue(stableFrequency));
    fretPracticeLastResult = {
      midi: detectedMidi,
      isCorrect: fretMidiAllowedByPattern(detectedMidi),
      at: Date.now()
    };
    renderTuner();
  }
  tunerAnimationFrame = requestAnimationFrame(tickTuner);
}

async function startTuner() {
  if (tunerRunning) return;
  try {
    tunerAudioContext = tunerAudioContext || new (window.AudioContext || window.webkitAudioContext)();
    if (tunerAudioContext.state === "suspended") {
      await tunerAudioContext.resume();
    }
    tunerStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });
    tunerSource = tunerAudioContext.createMediaStreamSource(tunerStream);
    tunerAnalyser = tunerAudioContext.createAnalyser();
    tunerAnalyser.fftSize = 4096;
    tunerSource.connect(tunerAnalyser);
    tunerRunning = true;
    setFeedback("Tuner slucha mikrofonu.");
    renderTuner();
    tickTuner();
  } catch (error) {
    tunerRunning = false;
    setFeedback("Nie udalo sie wlaczyc mikrofonu.");
    renderTuner();
  }
}

function stopTuner() {
  tunerRunning = false;
  if (tunerAnimationFrame) {
    cancelAnimationFrame(tunerAnimationFrame);
    tunerAnimationFrame = null;
  }
  if (tunerStream) {
    tunerStream.getTracks().forEach((track) => track.stop());
    tunerStream = null;
  }
  if (tunerSource) {
    try {
      tunerSource.disconnect();
    } catch {
      // Silent disconnect fallback.
    }
    tunerSource = null;
  }
  tunerAnalyser = null;
  tunerFrequencyHistory = [];
  fretPracticeLastResult = null;
  tunerDetection = { frequency: 0, note: "--", cents: 0, targetId: tunerTargetStringId };
  renderTuner();
}

function toggleTuner() {
  if (tunerRunning) stopTuner();
  else startTuner();
}

function renderMetronome() {
  const arcTrack = document.getElementById("metronome-arc-track");
  const arcProgress = document.getElementById("metronome-arc-progress");
  const arcKnob = document.getElementById("metronome-arc-knob");
  const arcHitbox = document.getElementById("metronome-arc-hitbox");
  const wheel = document.getElementById("metronome-wheel");
  const optionGrid = document.getElementById("metronome-option-grid");
  const dotsButton = document.getElementById("metronome-dots-button");
  const toggleButton = document.getElementById("metronome-toggle-button");
  const signaturePill = document.getElementById("signature-pill");
  const progressPercent = bpmProgress(metronomeBpm);
  const currentAngle = bpmToArcAngle(metronomeBpm);

  document.getElementById("metronome-bpm-display").textContent = `${metronomeBpm}`;
  if (arcTrack) {
    arcTrack.setAttribute("d", describeMetronomeArc(METRONOME_ARC_START, METRONOME_ARC_END));
  }
  if (arcProgress) {
    arcProgress.setAttribute("d", describeMetronomeArc(METRONOME_ARC_START, currentAngle));
  }
  if (arcHitbox) {
    arcHitbox.setAttribute("d", describeMetronomeArc(METRONOME_ARC_START, METRONOME_ARC_END));
    arcHitbox.setAttribute("tabindex", "0");
    arcHitbox.setAttribute("role", "slider");
    arcHitbox.setAttribute("aria-label", "Tempo");
    arcHitbox.setAttribute("aria-valuemin", "30");
    arcHitbox.setAttribute("aria-valuemax", "240");
    arcHitbox.setAttribute("aria-valuenow", String(metronomeBpm));
    arcHitbox.setAttribute("aria-valuetext", `${metronomeBpm} BPM`);
  }
  if (arcKnob) {
    const point = metronomePolarPoint(currentAngle);
    arcKnob.setAttribute("cx", point.x.toFixed(2));
    arcKnob.setAttribute("cy", point.y.toFixed(2));
  }
  if (dotsButton) {
    dotsButton.setAttribute("aria-expanded", metronomeOptionMode === "signature" ? "true" : "false");
  }
  if (signaturePill) {
    signaturePill.textContent = `${metronomeSignature}/${metronomeSignature === 6 ? 8 : 4}`;
    signaturePill.classList.toggle("active", metronomeOptionMode === "signature");
  }
  if (toggleButton) {
    toggleButton.textContent = metronomeRunning ? "Pauza" : "Start";
    toggleButton.dataset.state = metronomeRunning ? "pause" : "start";
    toggleButton.setAttribute("aria-label", metronomeRunning ? "Wstrzymaj metronom" : "Uruchom metronom");
  }
  if (optionGrid) {
    optionGrid.innerHTML = "";
    const items = metronomeOptionMode === "signature"
      ? [
          { type: "signature", value: 3, label: "3/4" },
          { type: "signature", value: 4, label: "4/4" },
          { type: "signature", value: 5, label: "5/4" },
          { type: "signature", value: 6, label: "6/8" }
        ]
      : [
          { type: "bpm", value: 60, label: "60" },
          { type: "bpm", value: 80, label: "80" },
          { type: "bpm", value: 100, label: "100" },
          { type: "bpm", value: 120, label: "120" }
        ];

    items.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `metronome-option-button${(item.type === "signature" ? metronomeSignature === item.value : metronomeBpm === item.value) ? " active" : ""}`;
      button.dataset.optionType = item.type;
      button.dataset.optionValue = String(item.value);
      button.textContent = item.label;
      optionGrid.appendChild(button);
    });
  }

  const dotsNode = document.getElementById("metronome-dots");
  dotsNode.innerHTML = "";
  for (let index = 0; index < metronomeSignature; index += 1) {
    const dot = document.createElement("span");
    dot.className = `beat-dot${index === 0 ? " accent" : ""}${metronomeRunning && index === metronomeBeatIndex ? " current" : ""}`;
    dotsNode.appendChild(dot);
  }

  if (state.activeTab === "guitar") {
    stabilizeGuitarLayout();
  }
}

function selectGuitarExercise(id) {
  state.guitarActiveId = id;
  state.guitarInspectId = id;
  const active = activeGuitarExercise();
  const stats = active ? exerciseSessionStats(active.id) : null;
  metronomeBpm = stats?.latestBpm || active?.targetBpm || 80;
  metronomeOptionMode = "bpm";
  saveState();
  renderAll();
  setFeedback(`Aktywne cwiczenie: ${active?.title || "brak"}.`);
}

function inspectGuitarExercise(id) {
  if (!state.guitarExercises.some((exercise) => exercise.id === id)) return;
  state.guitarInspectId = id;
  saveState();
  setGuitarView("detail", { scrollTop: true });
}

function openGuitarCreateView() {
  editingGuitarExerciseId = null;
  const nameInput = document.getElementById("guitar-exercise-name-input");
  const targetInput = document.getElementById("guitar-exercise-target-input");
  const minutesInput = document.getElementById("guitar-exercise-minutes-input");
  if (nameInput) nameInput.value = "";
  if (targetInput) targetInput.value = "";
  if (minutesInput) minutesInput.value = "";
  setGuitarView("create", { scrollTop: true });
  focusField("guitar-exercise-name-input");
}

function openGuitarTuner() {
  setGuitarView("tuner", { scrollTop: true });
}

function openGuitarEditView(id) {
  const exercise = state.guitarExercises.find((entry) => entry.id === id);
  if (!exercise) return;
  editingGuitarExerciseId = id;
  document.getElementById("guitar-exercise-name-input").value = exercise.title;
  document.getElementById("guitar-exercise-target-input").value = String(exercise.targetBpm);
  document.getElementById("guitar-exercise-minutes-input").value = String(exercise.practiceMinutes || 10);
  setGuitarView("create", { scrollTop: true });
  focusField("guitar-exercise-name-input");
}

function handleGuitarDetailToggle() {
  const exercise = inspectedGuitarExercise();
  if (!exercise) return;
  if (exercise.id === state.guitarActiveId) {
    clearActiveGuitarExercise();
    renderGuitarExerciseDetail();
    return;
  }
  selectGuitarExercise(exercise.id);
  renderGuitarExerciseDetail();
}

function stabilizeGuitarLayout() {
  if (guitarView !== "main") {
    lockedGuitarCardWidth = null;
    return;
  }
  const page = document.querySelector('.tab-page[data-tab="guitar"]');
  const feed = page?.querySelector(".section-feed");
  const card = page?.querySelector(".metronome-card");
  if (!page || !feed || !card) return;

  page.style.width = "100%";
  page.style.maxWidth = "100%";
  feed.style.width = "100%";
  feed.style.maxWidth = "100%";

  if (window.innerWidth > 520) {
    card.style.removeProperty("width");
    card.style.removeProperty("min-width");
    card.style.removeProperty("max-width");
    lockedGuitarCardWidth = null;
    return;
  }

  const feedWidth = Math.round(feed.getBoundingClientRect().width);
  if (!feedWidth) return;
  if (lockedGuitarCardWidth !== feedWidth) {
    lockedGuitarCardWidth = feedWidth;
  }
  card.style.width = `${lockedGuitarCardWidth}px`;
  card.style.minWidth = `${lockedGuitarCardWidth}px`;
  card.style.maxWidth = `${lockedGuitarCardWidth}px`;
}

function restartMetronomeInterval() {
  clearInterval(metronomeInterval);
  metronomeInterval = setInterval(() => {
    metronomeBeatIndex = (metronomeBeatIndex + 1) % metronomeSignature;
    playMetronomeClick();
    renderMetronome();
  }, Math.max(140, Math.round(60000 / metronomeBpm)));
}

function scheduleMetronomeRefresh() {
  if (!metronomeRunning) return;
  clearTimeout(metronomeRefreshTimer);
  metronomeRefreshTimer = setTimeout(() => {
    restartMetronomeInterval();
  }, 260);
}

function setMetronomeBpm(nextBpm) {
  metronomeBpm = clamp(Math.round(nextBpm), 30, 240);
  renderMetronome();
  scheduleMetronomeRefresh();
}

function setMetronomeSliderActive(active) {
  metronomeSliderActive = active;
  document.body.classList.toggle("metronome-dragging", active);
}

function updateMetronomeFromPoint(clientX, clientY) {
  const wheel = document.getElementById("metronome-wheel");
  if (!wheel) return;

  const rect = wheel.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const deltaX = clientX - centerX;
  const deltaY = clientY - centerY;
  const distance = Math.hypot(deltaX, deltaY);
  const scale = Math.min(rect.width, rect.height) / METRONOME_SVG_SIZE;
  const outerRadius = (METRONOME_RADIUS + 30) * scale;
  const innerRadius = (METRONOME_RADIUS - 34) * scale;
  const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 90;
  const normalized = angle > 180 ? angle - 360 : angle;
  if (distance < innerRadius || distance > outerRadius) return;
  setMetronomeBpm(angleToBpm(clamp(normalized, METRONOME_ARC_START, METRONOME_ARC_END)));
}

function registerTapTempo() {
  const now = Date.now();
  if (metronomeTapTimes.length && now - metronomeTapTimes[metronomeTapTimes.length - 1] > 2600) {
    metronomeTapTimes = [];
  }
  metronomeTapTimes = metronomeTapTimes.filter((time) => now - time < 5000);
  metronomeTapTimes.push(now);
  metronomeTapTimes = metronomeTapTimes.slice(-6);

  if (metronomeTapTimes.length < 2) {
    return;
  }

  const intervals = [];
  for (let index = 1; index < metronomeTapTimes.length; index += 1) {
    const gap = metronomeTapTimes[index] - metronomeTapTimes[index - 1];
    if (gap >= 220 && gap <= 2000) {
      intervals.push(gap);
    }
  }

  if (!intervals.length) return;
  const stableIntervals = intervals.slice(-4);
  const tappedBpm = clamp(Math.round(60000 / (stableIntervals.reduce((sum, value) => sum + value, 0) / stableIntervals.length)), 30, 240);
  setMetronomeBpm(tappedBpm);
}

function startMetronome() {
  if (metronomeRunning) return;
  if (pendingGuitarSession) {
    setFeedback("Zapisz albo pomin poprzednia sesje.");
    return;
  }
  metronomeRunning = true;
  metronomeStartedAt = Date.now();
  metronomeBeatIndex = 0;
  metronomeOptionMode = "bpm";
  clearTimeout(metronomeRefreshTimer);
  playMetronomeClick();
  renderMetronome();
  stabilizeGuitarLayout();
  restartMetronomeInterval();
  metronomeUiInterval = setInterval(renderMetronome, 1000);
}

function clearActiveGuitarExercise() {
  if (!state.guitarActiveId) return;
  state.guitarActiveId = null;
  metronomeOptionMode = "bpm";
  saveState();
  renderAll();
  setFeedback("Odznaczono aktywne cwiczenie.");
}

function openMusicHome() {
  setGuitarView("home");
}

function openGuitarHome() {
  setGuitarView("main", { scrollTop: true });
}

function openEarHome() {
  setGuitarView("ear-home", { scrollTop: true });
}

function openEarConfigView(type) {
  if (!EAR_LIBRARY[type]) return;
  state.earInspectType = type;
  earConfigType = type;
  saveState();
  setGuitarView("ear-config", { scrollTop: true });
}

function openEarDetailView(type) {
  if (!EAR_LIBRARY[type]) return;
  state.earInspectType = type;
  earConfigType = type;
  saveState();
  setGuitarView("ear-detail", { scrollTop: true });
}

function queueEarQuestionPlayback() {
  if (!earRoundSession) return;
  clearTimeout(earRoundSession.autoplayTimer);
  const question = earRoundSession.questions[earRoundSession.questionIndex];
  if (!question) return;
  earRoundSession.questionStartedAt = Date.now();
  earRoundSession.autoplayTimer = setTimeout(() => {
    playEarAudio(question.audio);
  }, 140);
}

function playCurrentEarQuestion() {
  const question = earRoundSession?.questions?.[earRoundSession.questionIndex];
  if (!question) return;
  playEarAudio(question.audio);
}

function startEarRoundFromCurrentConfig() {
  const config = currentEarConfig(earConfigType);
  if (!config.selectedItems.length) {
    setFeedback("Wybierz przynajmniej jeden element.");
    return;
  }
  state.earInspectType = earConfigType;
  saveState();
  earRoundSession = buildEarRound(config);
  setGuitarView("ear-round", { scrollTop: true });
  renderAll();
  queueEarQuestionPlayback();
}

function finishEarRound() {
  if (!earRoundSession) return;
  const answers = earRoundSession.answers.slice();
  const correct = answers.filter((answer) => answer.isCorrect).length;
  const totalQuestions = Math.max(earRoundSession.questions.length, 1);
  const accuracy = Math.round((correct / totalQuestions) * 100);
  const averageResponseTimeMs = answers.length
    ? Math.round(answers.reduce((sum, answer) => sum + Number(answer.responseTimeMs || 0), 0) / answers.length)
    : 0;
  state.earInspectType = earRoundSession.type;
  state.earRounds.push({
    id: uid("er"),
    type: earRoundSession.type,
    startedAt: new Date(earRoundSession.startedAt).toISOString(),
    endedAt: new Date().toISOString(),
    accuracy,
    correct,
    totalQuestions,
    averageResponseTimeMs,
    config: { ...earRoundSession.config, selectedItems: [...earRoundSession.config.selectedItems] },
    answers
  });
  saveState();
  earRoundSession = null;
  setGuitarView("ear-summary", { scrollTop: true });
  renderAll();
}

function submitEarAnswer(selectedAnswer) {
  const session = earRoundSession;
  const question = session?.questions?.[session.questionIndex];
  if (!session || !question || session.answeringLocked) return;

  session.answeringLocked = true;
  const isCorrect = question.correctAnswer === selectedAnswer;
  const responseTimeMs = Math.max(120, Date.now() - (session.questionStartedAt || Date.now()));
  session.answers.push({
    questionId: question.id,
    correctAnswer: question.correctAnswer,
    selectedAnswer,
    isCorrect,
    responseTimeMs
  });
  session.lastFeedback = { selected: selectedAnswer, correct: question.correctAnswer };
  renderEarRound();

  setTimeout(() => {
    if (!earRoundSession) return;
    earRoundSession.answeringLocked = false;
    earRoundSession.lastFeedback = null;
    earRoundSession.questionIndex += 1;
    if (earRoundSession.questionIndex >= earRoundSession.questions.length) {
      finishEarRound();
      return;
    }
    renderEarRound();
    queueEarQuestionPlayback();
  }, 620);
}

function cancelEarRound() {
  if (!earRoundSession) {
    setGuitarView("ear-config");
    return;
  }
  if (!confirm("Wyjsc z rundy?")) return;
  clearTimeout(earRoundSession.autoplayTimer);
  earRoundSession = null;
  setGuitarView("ear-config");
}

function bindPressAction(node, handler) {
  if (!node) return;
  let handledTouch = false;
  let lastHandledAt = 0;

  const invoke = (event) => {
    const now = Date.now();
    if (now - lastHandledAt < 280) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }
    lastHandledAt = now;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    handler();
  };

  node.addEventListener("touchend", (event) => {
    handledTouch = true;
    invoke(event);
    setTimeout(() => {
      handledTouch = false;
    }, 320);
  }, { passive: false });

  node.addEventListener("pointerup", (event) => {
    if (event.pointerType === "mouse") return;
    handledTouch = true;
    invoke(event);
    setTimeout(() => {
      handledTouch = false;
    }, 320);
  });

  node.addEventListener("click", (event) => {
    if (handledTouch) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    invoke(event);
  });
}

function stopMetronome(skipSave = false) {
  if (!metronomeRunning && !metronomeStartedAt) {
    renderMetronome();
    return;
  }

  clearInterval(metronomeInterval);
  clearInterval(metronomeUiInterval);
  clearTimeout(metronomeRefreshTimer);
  metronomeInterval = null;
  metronomeUiInterval = null;

  const durationSec = metronomeStartedAt ? Math.max(1, Math.floor((Date.now() - metronomeStartedAt) / 1000)) : 0;
  const active = activeGuitarExercise();

  metronomeRunning = false;
  metronomeStartedAt = null;
  metronomeBeatIndex = 0;

  if (!skipSave && active && durationSec > 0) {
    pendingGuitarSession = {
      exerciseId: active.id,
      exerciseTitle: active.title,
      durationSec,
      createdAt: new Date().toISOString()
    };
    renderGuitar();
    const bpmInput = document.getElementById("guitar-result-bpm-input");
    if (bpmInput) {
      bpmInput.value = "";
      setTimeout(() => bpmInput.focus(), 40);
    }
    return;
  }

  pendingGuitarSession = null;
  renderMetronome();
}

function savePendingGuitarSession() {
  if (!pendingGuitarSession) return;
  const input = document.getElementById("guitar-result-bpm-input");
  const bpm = Number(input?.value);
  if (!Number.isFinite(bpm) || bpm < 30 || bpm > 240) {
    setFeedback("Wpisz BPM z zakresu 30-240.");
    input?.focus();
    return;
  }

  state.guitarSessions.push({
    id: uid("gs"),
    exerciseId: pendingGuitarSession.exerciseId,
    exerciseTitle: pendingGuitarSession.exerciseTitle,
    bpm,
    durationSec: pendingGuitarSession.durationSec,
    createdAt: pendingGuitarSession.createdAt
  });
  state.guitarInspectId = pendingGuitarSession.exerciseId;
  pendingGuitarSession = null;
  saveState();
  renderAll();
  setFeedback(`Zapisano sesje: ${bpm} BPM, ${formatDuration(state.guitarSessions.at(-1)?.durationSec || 0)}.`);
}

function cancelPendingGuitarSession() {
  if (!pendingGuitarSession) return;
  pendingGuitarSession = null;
  renderGuitar();
  setFeedback("Sesja nie zostala zapisana.");
}

function notifyPulse() {
  if (navigator.vibrate) {
    navigator.vibrate([120, 80, 120]);
  }
}

function computeEvaluator(cost, uses, value, goalImpact) {
  const costPerUse = uses > 0 ? cost / uses : cost;
  const scoreRaw = (value * 4 + goalImpact * 4) - Math.min(costPerUse / 10, 20);
  const score = Math.max(Math.min(Math.round(scoreRaw), 99), 0);
  let label = "Srednio";
  if (score >= 65) label = "Ma sens";
  if (score < 40) label = "Raczej nie";
  return { score, label, costPerUse };
}

function toggleTask(id, forceDone = null) {
  state.tasks = state.tasks.map((task) => task.id === id ? { ...task, done: forceDone ?? !task.done } : task);
  saveState();
  renderAll();
}

function toggleHabit(id, forceDone = null) {
  state.habits = state.habits.map((habit) => habit.id === id ? { ...habit, done: forceDone ?? !habit.done } : habit);
  saveState();
  renderAll();
}

function editTask(id) {
  const task = state.tasks.find((entry) => entry.id === id);
  if (!task) return;
  const title = prompt("Task", task.title);
  if (title === null) return;
  const detail = prompt("Opis", task.detail || "");
  if (detail === null) return;
  state.tasks = state.tasks.map((entry) => entry.id === id ? {
    ...entry,
    title: title.trim() || entry.title,
    detail: detail.trim() || entry.detail
  } : entry);
  saveState();
  renderAll();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter((entry) => entry.id !== id);
  saveState();
  renderAll();
}

function editHabit(id) {
  const habit = state.habits.find((entry) => entry.id === id);
  if (!habit) return;
  const title = prompt("Habit", habit.title);
  if (title === null) return;
  const detail = prompt("Opis", habit.detail || "");
  if (detail === null) return;
  state.habits = state.habits.map((entry) => entry.id === id ? {
    ...entry,
    title: title.trim() || entry.title,
    detail: detail.trim() || entry.detail
  } : entry);
  saveState();
  renderAll();
}

function deleteHabit(id) {
  state.habits = state.habits.filter((entry) => entry.id !== id);
  saveState();
  renderAll();
}

function editWorkout(id) {
  const workout = state.workouts.find((entry) => entry.id === id);
  if (!workout) return;
  const title = prompt("Trening", workout.title);
  if (title === null) return;
  const duration = prompt("Minuty", String(workout.duration));
  if (duration === null) return;
  const focus = prompt("Cel", workout.focus || "");
  if (focus === null) return;
  state.workouts = state.workouts.map((entry) => entry.id === id ? {
    ...entry,
    title: title.trim() || entry.title,
    duration: Number.isFinite(Number(duration)) && Number(duration) > 0 ? Number(duration) : entry.duration,
    focus: focus.trim() || entry.focus
  } : entry);
  saveState();
  renderAll();
}

function deleteWorkout(id) {
  state.workouts = state.workouts.filter((entry) => entry.id !== id);
  saveState();
  renderAll();
}

function editWorkoutTemplate(id) {
  const template = state.workoutTemplates.find((entry) => entry.id === id);
  if (!template) return;
  const title = prompt("Szablon", template.title);
  if (title === null) return;
  const focus = prompt("Cel", template.focus);
  if (focus === null) return;
  const rest = prompt("Rest s", String(template.rest));
  if (rest === null) return;
  state.workoutTemplates = state.workoutTemplates.map((entry) => entry.id === id ? {
    ...entry,
    title: title.trim() || entry.title,
    focus: focus.trim() || entry.focus,
    rest: Number.isFinite(Number(rest)) ? Number(rest) : entry.rest
  } : entry);
  saveState();
  renderAll();
}

function applyWorkoutTemplate(id) {
  const template = state.workoutTemplates.find((entry) => entry.id === id);
  if (!template) return;
  state.workouts.push({
    id: uid("workout"),
    title: template.title,
    duration: template.exercises.length * 18,
    focus: template.focus,
    createdAt: new Date().toISOString()
  });
  restTimerValue = template.rest;
  saveState();
  renderAll();
  setFeedback(`Dodano trening z szablonu: ${template.title}.`);
}

function editSet(id) {
  const set = state.exerciseSets.find((entry) => entry.id === id);
  if (!set) return;
  const exercise = prompt("Cwiczenie", set.exercise);
  if (exercise === null) return;
  const reps = prompt("Reps", String(set.reps));
  if (reps === null) return;
  const weight = prompt("Kg", String(set.weight));
  if (weight === null) return;
  state.exerciseSets = state.exerciseSets.map((entry) => entry.id === id ? {
    ...entry,
    exercise: exercise.trim() || entry.exercise,
    reps: Number.isFinite(Number(reps)) ? Number(reps) : entry.reps,
    weight: Number.isFinite(Number(weight)) ? Number(weight) : entry.weight
  } : entry);
  saveState();
  renderAll();
}

function deleteSet(id) {
  state.exerciseSets = state.exerciseSets.filter((entry) => entry.id !== id);
  saveState();
  renderAll();
}

function editMeal(id) {
  const meal = state.meals.find((entry) => entry.id === id);
  if (!meal) return;
  const title = prompt("Posilek", meal.title);
  if (title === null) return;
  const calories = prompt("Kcal", String(meal.calories));
  if (calories === null) return;
  const protein = prompt("Bialko", String(meal.protein));
  if (protein === null) return;
  state.meals = state.meals.map((entry) => entry.id === id ? {
    ...entry,
    title: title.trim() || entry.title,
    calories: Number.isFinite(Number(calories)) ? Number(calories) : entry.calories,
    protein: Number.isFinite(Number(protein)) ? Number(protein) : entry.protein
  } : entry);
  saveState();
  renderAll();
}

function deleteMeal(id) {
  state.meals = state.meals.filter((entry) => entry.id !== id);
  saveState();
  renderAll();
}

function editFinanceEntry(id) {
  const entry = state.financeEntries.find((item) => item.id === id);
  if (!entry) return;
  const title = prompt("Wpis", entry.title);
  if (title === null) return;
  const amount = prompt("Kwota", String(entry.amount));
  if (amount === null) return;
  const category = prompt("Kategoria", entry.category || "");
  if (category === null) return;
  state.financeEntries = state.financeEntries.map((item) => item.id === id ? {
    ...item,
    title: title.trim() || item.title,
    amount: Number.isFinite(Number(amount)) ? Number(amount) : item.amount,
    category: category.trim() || item.category
  } : item);
  saveState();
  renderAll();
}

function deleteFinanceEntry(id) {
  state.financeEntries = state.financeEntries.filter((item) => item.id !== id);
  saveState();
  renderAll();
}

function editPlannedExpense(id) {
  const entry = state.plannedExpenses.find((item) => item.id === id);
  if (!entry) return;
  const title = prompt("Plan", entry.title);
  if (title === null) return;
  const amount = prompt("Kwota", String(entry.amount));
  if (amount === null) return;
  const due = prompt("Kiedy", entry.dueLabel || "");
  if (due === null) return;
  state.plannedExpenses = state.plannedExpenses.map((item) => item.id === id ? {
    ...item,
    title: title.trim() || item.title,
    amount: Number.isFinite(Number(amount)) ? Number(amount) : item.amount,
    dueLabel: due.trim() || item.dueLabel
  } : item);
  saveState();
  renderAll();
}

function deletePlannedExpense(id) {
  state.plannedExpenses = state.plannedExpenses.filter((item) => item.id !== id);
  saveState();
  renderAll();
}

function editGuitarExercise(id) {
  openGuitarEditView(id);
}

function deleteGuitarExercise(id) {
  const deletedInspected = state.guitarInspectId === id;
  if (editingGuitarExerciseId === id) {
    editingGuitarExerciseId = null;
  }
  state.guitarExercises = state.guitarExercises.filter((entry) => entry.id !== id);
  state.guitarSessions = state.guitarSessions.filter((entry) => entry.exerciseId !== id);
  if (state.guitarActiveId === id) {
    state.guitarActiveId = null;
  }
  if (state.guitarInspectId === id) {
    state.guitarInspectId = state.guitarActiveId || state.guitarExercises[0]?.id || null;
  }
  if (!state.guitarInspectId) {
    guitarView = "main";
  }
  if (deletedInspected) {
    guitarView = "main";
  }
  saveState();
  renderAll();
}

function deleteGuitarSession(id) {
  state.guitarSessions = state.guitarSessions.filter((entry) => entry.id !== id);
  saveState();
  renderAll();
}

function exportState() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `lifeos-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  setFeedback("Wyeksportowano JSON.");
}

function importState(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      if (!confirm("Nadpisac obecne dane importem?")) return;
      state = normalizeState(parsed);
      editingGuitarExerciseId = null;
      earConfigType = state.earInspectType || "intervals";
      earRoundSession = null;
      guitarView = "home";
      financeView = "home";
      resetRestTimer();
      stopMetronome(true);
      stopPaperTradingAutoRefresh();
      metronomeBpm = 80;
      saveState();
      renderAll();
      setFeedback("Zaimportowano JSON.");
    } catch {
      setFeedback("Nie udało się wczytać JSON.");
    }
  };
  reader.readAsText(file);
}

function resetState() {
  if (!confirm("Zresetowac demo data?")) return;
  state = cloneState(defaultState);
  editingGuitarExerciseId = null;
  earConfigType = state.earInspectType || "intervals";
  earRoundSession = null;
  guitarView = "home";
  financeView = "home";
  resetRestTimer();
  stopMetronome(true);
  stopPaperTradingAutoRefresh();
  metronomeBpm = 80;
  saveState();
  renderAll();
  setFeedback("Przywrocono demo data.");
}

function bindForms() {
  document.getElementById("task-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const titleInput = document.getElementById("task-input");
    const detailInput = document.getElementById("task-detail-input");
    const priorityInput = document.getElementById("task-priority-input");
    const title = titleInput.value.trim();
    if (!title) return;
    state.tasks.push({
      id: uid("task"),
      title,
      detail: detailInput.value.trim() || "Bez opisu",
      done: false,
      priority: priorityInput.value
    });
    titleInput.value = "";
    detailInput.value = "";
    priorityInput.value = "medium";
    saveState();
    renderAll();
    setFeedback(`Dodano task: ${title}.`);
  });

  document.getElementById("habit-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const titleInput = document.getElementById("habit-input");
    const detailInput = document.getElementById("habit-detail-input");
    const title = titleInput.value.trim();
    if (!title) return;
    state.habits.push({
      id: uid("habit"),
      title,
      detail: detailInput.value.trim() || "Minimum",
      done: false
    });
    titleInput.value = "";
    detailInput.value = "";
    saveState();
    renderAll();
    setFeedback(`Dodano habit: ${title}.`);
  });

  document.getElementById("note-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("note-input");
    const note = input.value.trim();
    if (!note) return;
    state.note = note;
    input.value = "";
    saveState();
    renderAll();
    setFeedback("Zapisano notatke.");
  });

  document.getElementById("weight-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("weight-input");
    const value = Number(input.value);
    if (!Number.isFinite(value) || value <= 0) return;
    state.weightHistory = [
      ...state.weightHistory.slice(-13),
      { id: uid("weight"), value, createdAt: new Date().toISOString() }
    ];
    input.value = "";
    saveState();
    renderAll();
    setFeedback(`Zapisano wage: ${value.toFixed(1)} kg.`);
  });

  document.getElementById("workout-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const titleInput = document.getElementById("workout-title-input");
    const durationInput = document.getElementById("workout-duration-input");
    const focusInput = document.getElementById("workout-focus-input");
    const title = titleInput.value.trim();
    const duration = Number(durationInput.value);
    if (!title || !Number.isFinite(duration) || duration <= 0) return;
    state.workouts.push({
      id: uid("workout"),
      title,
      duration,
      focus: focusInput.value.trim() || "general",
      createdAt: new Date().toISOString()
    });
    titleInput.value = "";
    durationInput.value = "";
    focusInput.value = "";
    saveState();
    renderAll();
    setFeedback(`Dodano trening: ${title}.`);
  });

  document.getElementById("set-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const exerciseInput = document.getElementById("set-exercise-input");
    const repsInput = document.getElementById("set-reps-input");
    const weightInput = document.getElementById("set-weight-input");
    const restInput = document.getElementById("set-rest-input");
    const exercise = exerciseInput.value.trim();
    const reps = Number(repsInput.value);
    const weight = Number(weightInput.value);
    const rest = Number(restInput.value || restTimerValue);
    if (!exercise || !Number.isFinite(reps) || reps <= 0 || !Number.isFinite(weight) || weight < 0) return;
    state.exerciseSets.push({
      id: uid("set"),
      exercise,
      reps,
      weight,
      rest: Number.isFinite(rest) && rest >= 0 ? rest : restTimerValue,
      createdAt: new Date().toISOString()
    });
    exerciseInput.value = "";
    repsInput.value = "";
    weightInput.value = "";
    restInput.value = String(restTimerValue);
    saveState();
    renderAll();
    setFeedback(`Dodano serie: ${exercise}.`);
  });

  document.getElementById("meal-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const titleInput = document.getElementById("meal-title-input");
    const kcalInput = document.getElementById("meal-kcal-input");
    const proteinInput = document.getElementById("meal-protein-input");
    const carbsInput = document.getElementById("meal-carbs-input");
    const fatsInput = document.getElementById("meal-fats-input");
    const title = titleInput.value.trim();
    const calories = Number(kcalInput.value);
    if (!title || !Number.isFinite(calories) || calories <= 0) return;
    state.meals.push({
      id: uid("meal"),
      title,
      calories,
      protein: Number(proteinInput.value) || 0,
      carbs: Number(carbsInput.value) || 0,
      fats: Number(fatsInput.value) || 0,
      createdAt: new Date().toISOString()
    });
    titleInput.value = "";
    kcalInput.value = "";
    proteinInput.value = "";
    carbsInput.value = "";
    fatsInput.value = "";
    saveState();
    renderAll();
    setFeedback(`Dodano posilek: ${title}.`);
  });

  document.getElementById("finance-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const typeInput = document.getElementById("finance-type-input");
    const titleInput = document.getElementById("finance-title-input");
    const amountInput = document.getElementById("finance-amount-input");
    const categoryInput = document.getElementById("finance-category-input");
    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    if (!title || !Number.isFinite(amount) || amount <= 0) return;
    state.financeEntries.push({
      id: uid("fin"),
      type: typeInput.value,
      title,
      amount,
      category: categoryInput.value.trim() || "Inne",
      createdAt: new Date().toISOString()
    });
    titleInput.value = "";
    amountInput.value = "";
    categoryInput.value = "";
    typeInput.value = "expense";
    saveState();
    renderAll();
    setFeedback(`Dodano wpis finansowy: ${title}.`);
  });

  document.getElementById("planned-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const titleInput = document.getElementById("planned-title-input");
    const amountInput = document.getElementById("planned-amount-input");
    const dateInput = document.getElementById("planned-date-input");
    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    if (!title || !Number.isFinite(amount) || amount <= 0) return;
    state.plannedExpenses.push({
      id: uid("plan"),
      title,
      amount,
      dueLabel: dateInput.value.trim() || "pozniej"
    });
    titleInput.value = "";
    amountInput.value = "";
    dateInput.value = "";
    saveState();
    renderAll();
    setFeedback(`Dodano planowany wydatek: ${title}.`);
  });

  document.getElementById("evaluator-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const cost = Number(document.getElementById("eval-cost-input").value);
    const uses = Number(document.getElementById("eval-uses-input").value);
    const value = Number(document.getElementById("eval-value-input").value);
    const goal = Number(document.getElementById("eval-goal-input").value);
    if (![cost, uses, value, goal].every(Number.isFinite)) return;
    state.evaluator = computeEvaluator(cost, uses, value, goal);
    saveState();
    renderAll();
    setFeedback(`Policzono zakup: ${state.evaluator.label}.`);
  });

  document.getElementById("paper-feed-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("paper-api-input");
    state.paperTrading.apiKey = input.value.trim();
    state.paperTrading.error = "";
    saveState();
    renderFinance();
    syncPaperTradingAutoRefresh();
    setFeedback("Zapisano klucz rynku.");
  });

  document.getElementById("paper-settings-form").addEventListener("submit", (event) => {
    event.preventDefault();
    state.paperTrading.settings = {
      commission: Math.max(0, Number(document.getElementById("paper-commission-input").value || 0)),
      spreadBps: Math.max(0, Number(document.getElementById("paper-spread-input").value || 0)),
      slippageBps: Math.max(0, Number(document.getElementById("paper-slippage-input").value || 0)),
      allowAfterHours: Boolean(document.getElementById("paper-after-hours-input").checked)
    };
    saveState();
    renderFinance();
    setFeedback("Zapisano warunki symulacji.");
  });

  document.getElementById("agent-reset-form").addEventListener("submit", (event) => {
    event.preventDefault();
    resetAgentEnvironment();
  });

  document.getElementById("agent-step-form").addEventListener("submit", (event) => {
    event.preventDefault();
    stepAgentEnvironment();
  });

  document.getElementById("agent-random-step-button").addEventListener("click", () => {
    stepAgentEnvironment({ random: true });
  });

  document.getElementById("agent-ten-steps-button").addEventListener("click", () => {
    runAgentSteps(10, { random: true });
  });

  document.getElementById("agent-reward-preset-input").addEventListener("change", (event) => {
    applyAgentRewardPreset(event.target.value);
  });

  document.getElementById("agent-runs-refresh").addEventListener("click", () => {
    loadAgentRuns();
  });

  document.getElementById("agent-simple-run").addEventListener("click", () => {
    runSimpleAgentTest();
  });

  document.getElementById("agent-research-sync").addEventListener("click", () => {
    syncAgentResearch();
  });

  document.getElementById("agent-feature-build").addEventListener("click", () => {
    buildAgentFeatureDataset();
  });

  document.getElementById("agent-signal-refresh").addEventListener("click", () => {
    loadAgentSignal();
  });

  ["agent-return-weight-input", "agent-drawdown-weight-input", "agent-volatility-weight-input", "agent-cost-weight-input"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
      document.getElementById("agent-reward-preset-input").value = "custom";
    });
  });

  document.getElementById("paper-account-reset").addEventListener("click", () => {
    resetPaperTradingAccount();
  });

  document.getElementById("paper-refresh-button").addEventListener("click", () => {
    refreshPaperTrading();
  });

  document.getElementById("paper-market-refresh").addEventListener("click", () => {
    refreshPaperTrading();
  });

  document.getElementById("paper-open-data-panel").addEventListener("click", () => {
    paperMarketPanel = "data";
    renderFinance();
  });

  document.getElementById("paper-auto-button").addEventListener("click", () => {
    state.paperTrading.autoRefresh = !state.paperTrading.autoRefresh;
    saveState();
    renderFinance();
    syncPaperTradingAutoRefresh();
    if (state.paperTrading.autoRefresh && paperTradingApiKey()) {
      refreshPaperTrading({ silent: true });
    }
  });

  document.getElementById("paper-watchlist-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("paper-symbol-input");
    const symbol = input.value.trim().toUpperCase();
    if (!symbol) return;
    if (state.paperTrading.watchlist.includes(symbol)) {
      setPaperSelectedSymbol(symbol);
      saveState();
      renderFinance();
      input.value = "";
      return;
    }
    if (state.paperTrading.watchlist.length >= PAPER_WATCHLIST_LIMIT) {
      setFeedback(`Limit obserwowanych instrumentów to ${PAPER_WATCHLIST_LIMIT}.`);
      return;
    }
    state.paperTrading.watchlist.push(symbol);
    setPaperSelectedSymbol(symbol);
    input.value = "";
    saveState();
    renderFinance();
    if (paperTradingApiKey()) {
      refreshPaperTrading({ silent: true });
    }
  });

  document.getElementById("paper-open-symbol-sheet").addEventListener("click", () => {
    paperSymbolSheetOpen = true;
    paperMarketPanel = "info";
    renderFinance();
    requestAnimationFrame(() => document.getElementById("paper-market-search")?.focus());
  });

  document.getElementById("paper-symbol-rail-search").addEventListener("click", () => {
    paperSymbolSheetOpen = true;
    renderFinance();
    requestAnimationFrame(() => document.getElementById("paper-market-search")?.focus());
  });

  document.getElementById("paper-symbol-sheet-close").addEventListener("click", () => {
    paperSymbolSheetOpen = false;
    renderFinance();
  });

  document.getElementById("paper-symbol-backdrop").addEventListener("click", () => {
    paperSymbolSheetOpen = false;
    renderFinance();
  });

  document.getElementById("paper-symbol-rail").addEventListener("click", (event) => {
    const button = event.target.closest("[data-paper-rail-symbol]");
    if (!button) return;
    const symbol = button.dataset.paperRailSymbol;
    setPaperSelectedSymbol(symbol);
    document.getElementById("paper-order-symbol").value = symbol;
    paperMarketPanel = "info";
    saveState();
    renderFinance();
    refreshPaperTrading({ silent: true });
  });

  document.getElementById("paper-order-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const side = document.getElementById("paper-order-side").value;
    const symbol = document.getElementById("paper-order-symbol").value;
    const type = document.getElementById("paper-order-type").value;
    const sharesInput = document.getElementById("paper-order-shares");
    const shares = Number(sharesInput.value);
    const limitPrice = Number(document.getElementById("paper-limit-price").value || 0);
    const stopPrice = Number(document.getElementById("paper-stop-price").value || 0);
    const thesisInput = document.getElementById("paper-order-thesis");
    if (executePaperOrder(side, symbol, shares, {
      type,
      limitPrice,
      stopPrice,
      thesis: thesisInput.value
    })) {
      sharesInput.value = "";
      thesisInput.value = "";
      document.getElementById("paper-limit-price").value = "";
      document.getElementById("paper-stop-price").value = "";
      paperOrderSheetOpen = false;
      paperMarketPanel = "portfolio";
    }
  });

  document.querySelectorAll("[data-open-finance-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextView = button.dataset.openFinanceView;
      setFinanceView(nextView, { scrollTop: true });
      if (nextView === "market" && paperTradingApiKey() && !paperTradingLoading) {
        refreshPaperTrading({ silent: true });
      }
    });
  });

  document.getElementById("finance-personal-back").addEventListener("click", () => {
    setFinanceView("home");
  });

  document.getElementById("finance-market-back").addEventListener("click", () => {
    setFinanceView("home");
  });

  document.getElementById("paper-buy-button").addEventListener("click", () => {
    document.getElementById("paper-order-side").value = "buy";
    renderFinance();
  });

  document.getElementById("paper-sell-button").addEventListener("click", () => {
    document.getElementById("paper-order-side").value = "sell";
    renderFinance();
  });

  document.getElementById("paper-trade-bar-buy").addEventListener("click", () => {
    document.getElementById("paper-order-side").value = "buy";
    paperOrderSheetOpen = true;
    renderFinance();
  });

  document.getElementById("paper-trade-bar-sell").addEventListener("click", () => {
    document.getElementById("paper-order-side").value = "sell";
    paperOrderSheetOpen = true;
    renderFinance();
  });

  document.getElementById("paper-open-order-sheet").addEventListener("click", () => {
    paperOrderSheetOpen = true;
    renderFinance();
  });

  document.getElementById("paper-order-sheet-close").addEventListener("click", () => {
    paperOrderSheetOpen = false;
    renderFinance();
  });

  document.getElementById("paper-order-backdrop").addEventListener("click", () => {
    paperOrderSheetOpen = false;
    renderFinance();
  });

  document.getElementById("paper-order-symbol").addEventListener("change", () => {
    renderFinance();
  });

  document.getElementById("paper-order-shares").addEventListener("input", () => {
    renderFinance();
  });

  document.getElementById("paper-order-type").addEventListener("change", () => {
    renderFinance();
  });

  document.getElementById("paper-limit-price").addEventListener("input", () => {
    renderFinance();
  });

  document.getElementById("paper-stop-price").addEventListener("input", () => {
    renderFinance();
  });

  document.getElementById("paper-market-search").addEventListener("input", () => {
    renderPaperSuggestions();
  });

  document.getElementById("paper-market-categories").addEventListener("click", (event) => {
    const button = event.target.closest("[data-paper-market-category]");
    if (!button) return;
    paperInstrumentCategory = button.dataset.paperMarketCategory || "ALL";
    renderPaperCategories();
    renderPaperSuggestions();
  });

  document.getElementById("paper-shares-minus").addEventListener("click", () => {
    const input = document.getElementById("paper-order-shares");
    const next = Math.max(1, Number(input.value || 1) - 1);
    input.value = `${next}`;
    renderFinance();
  });

  document.getElementById("paper-shares-plus").addEventListener("click", () => {
    const input = document.getElementById("paper-order-shares");
    const next = Math.max(1, Number(input.value || 0) + 1);
    input.value = `${next}`;
    renderFinance();
  });

  document.getElementById("paper-trade-bar-minus").addEventListener("click", () => {
    const input = document.getElementById("paper-order-shares");
    input.value = `${Math.max(1, Number(input.value || 1) - 1)}`;
    renderFinance();
  });

  document.getElementById("paper-trade-bar-plus").addEventListener("click", () => {
    const input = document.getElementById("paper-order-shares");
    input.value = `${Math.max(1, Number(input.value || 0) + 1)}`;
    renderFinance();
  });

  document.querySelectorAll("[data-paper-range]").forEach((button) => {
    button.addEventListener("click", () => {
      paperChartRange = button.dataset.paperRange || "6M";
      ensurePaperHistory(paperSelectedSymbol(), paperChartRange);
      renderFinance();
    });
  });

  document.querySelectorAll("[data-paper-chart-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      paperChartMode = button.dataset.paperChartMode || "candles";
      renderFinance();
    });
  });

  document.getElementById("paper-chart-fullscreen-button").addEventListener("click", () => {
    paperChartFullscreenOpen = true;
    renderFinance();
  });

  document.getElementById("paper-chart-fullscreen-close").addEventListener("click", () => {
    paperChartFullscreenOpen = false;
    clearTradingViewChart("fullscreen");
    renderFinance();
  });

  document.querySelectorAll("[data-market-panel-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      paperMarketPanel = button.dataset.marketPanelTab || "portfolio";
      renderFinance();
    });
  });

  document.getElementById("guitar-exercise-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const nameInput = document.getElementById("guitar-exercise-name-input");
    const targetInput = document.getElementById("guitar-exercise-target-input");
    const minutesInput = document.getElementById("guitar-exercise-minutes-input");
    const title = nameInput.value.trim();
    const targetBpm = Number(targetInput.value);
    const practiceMinutes = Number(minutesInput.value);
    if (!title || !Number.isFinite(targetBpm) || targetBpm <= 0 || !Number.isFinite(practiceMinutes) || practiceMinutes <= 0) return;
    let id = editingGuitarExerciseId;
    if (id) {
      state.guitarExercises = state.guitarExercises.map((entry) => entry.id === id ? {
        ...entry,
        title,
        targetBpm,
        practiceMinutes
      } : entry);
      if (state.guitarActiveId === id) {
        metronomeBpm = targetBpm;
      }
    } else {
      id = uid("gex");
      state.guitarExercises.push({
        id,
        title,
        targetBpm,
        practiceMinutes
      });
      state.guitarActiveId = id;
      metronomeBpm = targetBpm;
    }
    state.guitarInspectId = id;
    nameInput.value = "";
    targetInput.value = "";
    minutesInput.value = "";
    const wasEditing = Boolean(editingGuitarExerciseId);
    editingGuitarExerciseId = null;
    saveState();
    guitarView = "detail";
    renderAll();
    setFeedback(wasEditing ? `Zapisano zmiany: ${title}.` : `Dodano cwiczenie gitarowe: ${title}.`);
  });
}

function bindTabs() {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.tabButton === "guitar") {
        guitarView = "home";
      }
      if (button.dataset.tabButton === "finance") {
        financeView = "home";
      }
      setTab(button.dataset.tabButton);
    });
  });

  switchButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.switchTab === "guitar") {
        guitarView = "home";
      }
      if (button.dataset.switchTab === "finance") {
        financeView = "home";
      }
      setTab(button.dataset.switchTab);
    });
  });
}

function bindTools() {
  document.getElementById("rest-start-button").addEventListener("click", toggleRestTimer);
  document.getElementById("rest-reset-button").addEventListener("click", resetRestTimer);

  document.querySelectorAll("[data-rest-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      restTimerValue = Number(button.dataset.restPreset);
      restTimerRunning = false;
      clearInterval(restTimerInterval);
      restTimerInterval = null;
      renderRestTimer();
    });
  });

  document.getElementById("metronome-minus-button").addEventListener("click", () => {
    setMetronomeBpm(metronomeBpm - 1);
  });

  document.getElementById("metronome-plus-button").addEventListener("click", () => {
    setMetronomeBpm(metronomeBpm + 1);
  });

  document.getElementById("metronome-dots-button").addEventListener("click", () => {
    metronomeOptionMode = metronomeOptionMode === "signature" ? "bpm" : "signature";
    renderMetronome();
  });
  document.getElementById("signature-pill").addEventListener("click", () => {
    metronomeOptionMode = metronomeOptionMode === "signature" ? "bpm" : "signature";
    renderMetronome();
  });
  document.getElementById("metronome-option-grid").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-option-type]");
    if (!button) return;
    if (button.dataset.optionType === "bpm") {
      setMetronomeBpm(Number(button.dataset.optionValue));
      return;
    }
    metronomeSignature = Number(button.dataset.optionValue);
    metronomeBeatIndex = 0;
    metronomeOptionMode = "bpm";
    renderMetronome();
    scheduleMetronomeRefresh();
  });

  const arcHitbox = document.getElementById("metronome-arc-hitbox");
  const stopArcDrag = () => {
    setMetronomeSliderActive(false);
  };
  arcHitbox.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    setMetronomeSliderActive(true);
    arcHitbox.setPointerCapture?.(event.pointerId);
    updateMetronomeFromPoint(event.clientX, event.clientY);
  });
  arcHitbox.addEventListener("pointermove", (event) => {
    if (!metronomeSliderActive) return;
    event.preventDefault();
    updateMetronomeFromPoint(event.clientX, event.clientY);
  });
  arcHitbox.addEventListener("pointerup", stopArcDrag);
  arcHitbox.addEventListener("pointercancel", stopArcDrag);
  arcHitbox.addEventListener("lostpointercapture", stopArcDrag);
  arcHitbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      setMetronomeBpm(metronomeBpm - 1);
    }
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      setMetronomeBpm(metronomeBpm + 1);
    }
  });
  arcHitbox.addEventListener("touchstart", (event) => {
    const touch = event.touches?.[0];
    if (!touch) return;
    event.preventDefault();
    setMetronomeSliderActive(true);
    updateMetronomeFromPoint(touch.clientX, touch.clientY);
  }, { passive: false });
  arcHitbox.addEventListener("touchmove", (event) => {
    const touch = event.touches?.[0];
    if (!touch) return;
    event.preventDefault();
    setMetronomeSliderActive(true);
    updateMetronomeFromPoint(touch.clientX, touch.clientY);
  }, { passive: false });
  arcHitbox.addEventListener("touchend", stopArcDrag, { passive: true });
  arcHitbox.addEventListener("touchcancel", stopArcDrag, { passive: true });

  bindPressAction(document.getElementById("metronome-toggle-button"), () => {
    if (metronomeRunning) {
      stopMetronome(false);
    } else {
      startMetronome();
    }
  });
  bindPressAction(document.getElementById("metronome-tap-button"), registerTapTempo);
  bindPressAction(document.getElementById("guitar-active-clear"), clearActiveGuitarExercise);
  bindPressAction(document.getElementById("open-guitar-home"), () => setGuitarView("main", { scrollTop: true }));
  bindPressAction(document.getElementById("open-ear-home"), () => setGuitarView("ear-home", { scrollTop: true }));
  bindPressAction(document.getElementById("open-tuner-home"), openGuitarTuner);
  bindPressAction(document.getElementById("tuner-back"), openMusicHome);
  bindPressAction(document.getElementById("tuner-toggle"), toggleTuner);
  bindPressAction(document.getElementById("fretboard-fullscreen-open"), openFretboardFullscreen);
  bindPressAction(document.getElementById("fretboard-fullscreen-close"), closeFretboardFullscreen);
  bindPressAction(document.getElementById("guitar-open-create"), openGuitarCreateView);
  bindPressAction(document.getElementById("guitar-session-toggle"), () => {
    guitarSessionsExpanded = !guitarSessionsExpanded;
    renderGuitarSessions();
  });
  bindPressAction(document.getElementById("guitar-create-back"), () => {
    editingGuitarExerciseId = null;
    setGuitarView("main");
  });
  bindPressAction(document.getElementById("guitar-detail-back"), () => setGuitarView("main"));
  bindPressAction(document.getElementById("guitar-detail-use"), handleGuitarDetailToggle);
  bindPressAction(document.getElementById("guitar-detail-edit"), () => {
    const exercise = inspectedGuitarExercise();
    if (exercise) editGuitarExercise(exercise.id);
  });
  bindPressAction(document.getElementById("guitar-detail-delete"), () => {
    const exercise = inspectedGuitarExercise();
    if (exercise) deleteGuitarExercise(exercise.id);
  });
  bindPressAction(document.getElementById("guitar-result-save"), savePendingGuitarSession);
  bindPressAction(document.getElementById("guitar-result-cancel"), cancelPendingGuitarSession);
  bindPressAction(document.getElementById("ear-home-back"), openMusicHome);
  bindPressAction(document.getElementById("ear-home-last"), () => openEarConfigView(lastEarType()));
  bindPressAction(document.getElementById("ear-recommendation-start"), applyEarRecommendation);
  bindPressAction(document.getElementById("ear-config-back"), openEarHome);
  bindPressAction(document.getElementById("ear-start-round"), startEarRoundFromCurrentConfig);
  bindPressAction(document.getElementById("ear-round-back"), cancelEarRound);
  bindPressAction(document.getElementById("ear-round-play"), playCurrentEarQuestion);
  bindPressAction(document.getElementById("ear-round-replay"), playCurrentEarQuestion);
  bindPressAction(document.getElementById("ear-summary-back"), openEarHome);
  bindPressAction(document.getElementById("ear-summary-repeat"), () => {
    earConfigType = lastEarType();
    startEarRoundFromCurrentConfig();
  });
  bindPressAction(document.getElementById("ear-summary-stats"), () => openEarDetailView(lastEarType()));
  bindPressAction(document.getElementById("ear-summary-home"), openEarHome);
  bindPressAction(document.getElementById("ear-detail-back"), openEarHome);
  bindPressAction(document.getElementById("ear-detail-start"), () => openEarConfigView(state.earInspectType));
  document.getElementById("guitar-result-bpm-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      savePendingGuitarSession();
    }
  });

  const importInput = document.getElementById("import-input");
  document.getElementById("import-button").addEventListener("click", () => importInput.click());
  importInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    importState(file);
    event.target.value = "";
  });

  document.getElementById("export-button").addEventListener("click", exportState);
  document.getElementById("reset-button").addEventListener("click", resetState);
}

function renderAll() {
  renderHome();
  renderMusic();
  renderGym();
  renderFinance();
  renderMe();
  setTab(state.activeTab);
}

bindTabs();
bindForms();
bindTools();
applyResets();
renderAll();

document.addEventListener("dblclick", (event) => {
  event.preventDefault();
}, { passive: false });

document.addEventListener("gesturestart", (event) => {
  event.preventDefault();
}, { passive: false });

document.addEventListener("touchmove", (event) => {
  if (!metronomeSliderActive) return;
  event.preventDefault();
}, { passive: false });

document.addEventListener("touchend", () => {
  setMetronomeSliderActive(false);
}, { passive: true });

document.addEventListener("touchcancel", () => {
  setMetronomeSliderActive(false);
}, { passive: true });

window.addEventListener("resize", () => {
  renderMetronome();
  stabilizeGuitarLayout();
});

window.visualViewport?.addEventListener("resize", () => {
  stabilizeGuitarLayout();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
