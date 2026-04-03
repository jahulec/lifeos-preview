const STORAGE_KEY = "lifeos-preview-state-v4";
const LEGACY_KEYS = ["lifeos-preview-state-v3"];

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
  supplements: [
    { name: "Creatine", dosage: "5 g" },
    { name: "Omega-3", dosage: "2 caps" },
    { name: "Magnesium", dosage: "evening" }
  ]
};

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
let guitarView = "main";
const guitarScrollMemory = { main: 0, detail: 0, create: 0 };
let editingGuitarExerciseId = null;
let guitarSessionsExpanded = false;

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
  state.activeTab = tab;
  tabPages.forEach((page) => page.classList.toggle("active", page.dataset.tab === tab));
  tabButtons.forEach((button) => button.classList.toggle("active", button.dataset.tabButton === tab));
  if (tab === "guitar") {
    requestAnimationFrame(() => {
      renderMetronome();
      stabilizeGuitarLayout();
      window.scrollTo({ top: guitarScrollMemory[guitarView] || 0, behavior: "auto" });
    });
  }
  saveState();
}

function setGuitarView(view, options = {}) {
  const { scrollTop = false } = options;
  guitarScrollMemory[guitarView] = window.scrollY || window.pageYOffset || 0;
  guitarView = view;
  renderGuitar();
  requestAnimationFrame(() => {
    window.scrollTo({ top: scrollTop ? 0 : (guitarScrollMemory[view] || 0), behavior: "auto" });
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
  const guitarDone = guitarSessionsToday().length ? 1 : 0;
  const total = state.habits.length + state.tasks.length + 2;
  const completed = doneHabits + doneTasks + workoutDone + guitarDone;
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

  if (!guitarSessionsToday().length && priorities.length < 3) {
    priorities.push({
      type: "tab",
      tab: "guitar",
      focus: "guitar-exercise-name-input",
      title: "Gitara 10 min",
      detail: "Jedna sesja BPM podtrzymuje progres."
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
    toggle.setAttribute("aria-label", task.done ? "Undo" : "Done");
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
    makeToolButton("Edit", () => editTask(task.id)),
    makeToolButton("Del", () => deleteTask(task.id), true)
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
    toggle.setAttribute("aria-label", habit.done ? "Undo" : "Done");
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
    makeToolButton("Edit", () => editHabit(habit.id)),
    makeToolButton("Del", () => deleteHabit(habit.id), true)
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
      tools.appendChild(makeToolButton("Done", () => toggleTask(item.id, true)));
    } else {
      tools.appendChild(makeToolButton("Open", () => {
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
  const guitarTodaySec = guitarSessionsToday().reduce((sum, entry) => sum + Number(entry.durationSec || 0), 0);
  const latest = latestWeight();

  document.getElementById("home-progress-value").textContent = `${progress.percent}%`;
  document.getElementById("home-progress-bar").style.width = `${progress.percent}%`;
  document.getElementById("home-progress-copy").textContent = `${progress.completed} z ${progress.total} rzeczy domkniete dzisiaj.`;
  document.getElementById("home-weight").textContent = latest ? `${Number(latest.value).toFixed(1)} kg` : "-";
  document.getElementById("home-tasks-open").textContent = `${progress.openTasks}`;
  document.getElementById("home-guitar-output").textContent = formatDuration(guitarTodaySec);
  document.getElementById("home-gym-output").textContent = `${workoutsThisWeek().length}/4`;
  document.getElementById("home-kcal").textContent = `${nutrition.calories}`;
  document.getElementById("home-protein").textContent = `${nutrition.protein} g`;
  document.getElementById("home-balance").textContent = formatZl(todayFinance.income - todayFinance.expense);
  document.getElementById("home-guitar-copy").textContent = `${state.guitarExercises.length} cwiczen, top ${guitarOverview().topBpm} BPM.`;
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
      makeToolButton(exercise.id === state.guitarActiveId ? "Off" : "Uzyj", () => {
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
    tools.append(makeToolButton("Del", () => deleteGuitarSession(session.id), true));
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
    useButton.textContent = exercise && exercise.id === state.guitarActiveId ? "Off" : "Uzyj";
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
      makeToolButton("Uzyj", () => applyWorkoutTemplate(template.id)),
      makeToolButton("Edit", () => editWorkoutTemplate(template.id))
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
      makeToolButton("Edit", () => editWorkout(workout.id)),
      makeToolButton("Del", () => deleteWorkout(workout.id), true)
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
      makeToolButton("Edit", () => editSet(set.id)),
      makeToolButton("Del", () => deleteSet(set.id), true)
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
      makeToolButton("Edit", () => editMeal(meal.id)),
      makeToolButton("Del", () => deleteMeal(meal.id), true)
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
      makeToolButton("Edit", () => editFinanceEntry(entry.id)),
      makeToolButton("Del", () => deleteFinanceEntry(entry.id), true)
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
      makeToolButton("Edit", () => editPlannedExpense(entry.id)),
      makeToolButton("Del", () => deletePlannedExpense(entry.id), true)
    );
    row.appendChild(tools);
    node.appendChild(row);
  });
}

function renderFinance() {
  const finance = financeSummary();
  document.getElementById("finance-balance").textContent = formatZl(finance.income - finance.expense);
  document.getElementById("finance-income").textContent = formatZl(finance.income);
  document.getElementById("finance-expense").textContent = formatZl(finance.expense);
  document.getElementById("finance-planned").textContent = formatZl(plannedTotal());
  document.getElementById("evaluator-score").textContent = state.evaluator.score ?? "-";
  document.getElementById("evaluator-label").textContent = state.evaluator.label ?? "-";
  document.getElementById("evaluator-cpu").textContent = state.evaluator.costPerUse != null ? `${state.evaluator.costPerUse.toFixed(0)} zl` : "-";
  renderFinanceEntries();
  renderPlannedExpenses();
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
  const focus = prompt("Focus", workout.focus || "");
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
  const focus = prompt("Focus", template.focus);
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
      resetRestTimer();
      stopMetronome(true);
      metronomeBpm = 80;
      saveState();
      renderAll();
      setFeedback("Zaimportowano JSON.");
    } catch {
      setFeedback("Nie udalo sie wczytac JSON.");
    }
  };
  reader.readAsText(file);
}

function resetState() {
  if (!confirm("Zresetowac demo data?")) return;
  state = cloneState(defaultState);
  editingGuitarExerciseId = null;
  resetRestTimer();
  stopMetronome(true);
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
    button.addEventListener("click", () => setTab(button.dataset.tabButton));
  });

  switchButtons.forEach((button) => {
    button.addEventListener("click", () => setTab(button.dataset.switchTab));
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
  renderGuitar();
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
