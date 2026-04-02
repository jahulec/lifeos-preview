const STORAGE_KEY = "lifeos-preview-state-v3";

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

const defaultState = {
  activeTab: "today",
  meta: {
    lastDailyReset: todayKey(),
    lastWeeklyReset: weekKey()
  },
  note: "Zamknij najpierw rzeczy o wysokim zwrocie: trening, 2-3 taski i prosty rytm dnia.",
  habits: [
    { id: "habit-1", title: "Morning mobility", detail: "2 min minimum", done: true },
    { id: "habit-2", title: "Deep work", detail: "90 min bez rozproszen", done: true },
    { id: "habit-3", title: "Evening walk", detail: "10 min minimum", done: false }
  ],
  tasks: [
    { id: "task-1", title: "Zaloguj wage", detail: "rano", done: true, priority: "high" },
    { id: "task-2", title: "Upper A", detail: "bench, row, split squat", done: false, priority: "high" },
    { id: "task-3", title: "Plan na jutro", detail: "top 3 przed 21:30", done: false, priority: "medium" }
  ],
  workouts: [
    { id: "workout-1", title: "Upper A", duration: 68, focus: "strength", dateLabel: "Mon", createdAt: isoDaysAgo(5, 18) },
    { id: "workout-2", title: "Lower A", duration: 74, focus: "legs", dateLabel: "Wed", createdAt: isoDaysAgo(3, 18) },
    { id: "workout-3", title: "Pull", duration: 42, focus: "back", dateLabel: "Thu", createdAt: isoDaysAgo(2, 18) },
    { id: "workout-4", title: "Push", duration: 55, focus: "chest", dateLabel: "Sat", createdAt: isoDaysAgo(0, 12) }
  ],
  workoutTemplates: [
    { id: "tpl-1", title: "Upper A", focus: "strength", rest: 90, exercises: ["Bench Press", "Chest Row", "Overhead Press"] },
    { id: "tpl-2", title: "Lower A", focus: "legs", rest: 120, exercises: ["Split Squat", "RDL", "Leg Curl"] },
    { id: "tpl-3", title: "Pull", focus: "back", rest: 75, exercises: ["Pull-up", "Row", "Curl"] }
  ],
  meals: [
    { id: "meal-1", title: "High protein breakfast", calories: 640, protein: 42, carbs: 51, fats: 24, createdAt: isoDaysAgo(0, 8) },
    { id: "meal-2", title: "Post workout bowl", calories: 780, protein: 53, carbs: 84, fats: 19, createdAt: isoDaysAgo(0, 15) },
    { id: "meal-3", title: "Dinner", calories: 620, protein: 38, carbs: 46, fats: 22, createdAt: isoDaysAgo(0, 19) }
  ],
  mealTemplates: [
    { id: "meal-tpl-1", title: "Breakfast", calories: 640, protein: 42, carbs: 51, fats: 24 },
    { id: "meal-tpl-2", title: "Post workout bowl", calories: 780, protein: 53, carbs: 84, fats: 19 },
    { id: "meal-tpl-3", title: "Light dinner", calories: 520, protein: 35, carbs: 34, fats: 21 }
  ],
  exerciseSets: [
    { id: "set-1", exercise: "Bench Press", reps: 8, weight: 72.5, rest: 90, dateLabel: "Today", createdAt: isoDaysAgo(0, 12) },
    { id: "set-2", exercise: "Bench Press", reps: 7, weight: 72.5, rest: 90, dateLabel: "Today", createdAt: isoDaysAgo(0, 12) },
    { id: "set-3", exercise: "Chest Row", reps: 10, weight: 36, rest: 75, dateLabel: "Today", createdAt: isoDaysAgo(0, 12) }
  ],
  weightHistory: [
    { dateLabel: "D1", value: 81.2, createdAt: isoDaysAgo(5, 8) },
    { dateLabel: "D2", value: 80.9, createdAt: isoDaysAgo(4, 8) },
    { dateLabel: "D3", value: 80.8, createdAt: isoDaysAgo(3, 8) },
    { dateLabel: "D4", value: 80.6, createdAt: isoDaysAgo(2, 8) },
    { dateLabel: "D5", value: 80.5, createdAt: isoDaysAgo(1, 8) },
    { dateLabel: "D6", value: 80.4, createdAt: isoDaysAgo(0, 8) }
  ],
  supplements: [
    { name: "Creatine", dosage: "5 g" },
    { name: "Omega-3", dosage: "2 caps" },
    { name: "Magnesium", dosage: "evening" }
  ]
};

function cloneState(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeState(rawState) {
  const state = { ...cloneState(defaultState), ...rawState };
  state.meta = state.meta && typeof state.meta === "object" ? state.meta : cloneState(defaultState.meta);
  state.habits = Array.isArray(state.habits) ? state.habits : cloneState(defaultState.habits);
  state.tasks = Array.isArray(state.tasks) ? state.tasks : cloneState(defaultState.tasks);
  state.workouts = Array.isArray(state.workouts) ? state.workouts : cloneState(defaultState.workouts);
  state.workoutTemplates = Array.isArray(state.workoutTemplates) ? state.workoutTemplates : cloneState(defaultState.workoutTemplates);
  state.meals = Array.isArray(state.meals) ? state.meals : cloneState(defaultState.meals);
  state.mealTemplates = Array.isArray(state.mealTemplates) ? state.mealTemplates : cloneState(defaultState.mealTemplates);
  state.exerciseSets = Array.isArray(state.exerciseSets) ? state.exerciseSets : cloneState(defaultState.exerciseSets);
  state.weightHistory = Array.isArray(state.weightHistory) ? state.weightHistory : cloneState(defaultState.weightHistory);
  state.supplements = Array.isArray(state.supplements) ? state.supplements : cloneState(defaultState.supplements);
  state.note = typeof state.note === "string" ? state.note : defaultState.note;
  state.activeTab = typeof state.activeTab === "string" ? state.activeTab : "today";
  state.meta.lastDailyReset = state.meta.lastDailyReset || todayKey();
  state.meta.lastWeeklyReset = state.meta.lastWeeklyReset || weekKey();
  state.workouts = state.workouts.map((entry, index) => ({ ...entry, createdAt: entry.createdAt || isoDaysAgo(Math.max(0, state.workouts.length - index - 1), 18) }));
  state.meals = state.meals.map((entry, index) => ({ ...entry, createdAt: entry.createdAt || isoDaysAgo(Math.max(0, state.meals.length - index - 1), 12) }));
  state.exerciseSets = state.exerciseSets.map((entry) => ({ ...entry, createdAt: entry.createdAt || isoDaysAgo(0, 12) }));
  state.weightHistory = state.weightHistory.map((entry, index) => ({ ...entry, createdAt: entry.createdAt || isoDaysAgo(Math.max(0, state.weightHistory.length - index - 1), 8) }));
  return state;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeState(JSON.parse(raw)) : cloneState(defaultState);
  } catch {
    return cloneState(defaultState);
  }
}

let state = loadState();
let restTimerValue = 90;
let restTimerRunning = false;
let restTimerInterval = null;

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

const tabPages = [...document.querySelectorAll(".tab-page")];
const tabButtons = [...document.querySelectorAll("[data-tab-button]")];
const switchButtons = [...document.querySelectorAll("[data-switch-tab]")];

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function setTab(tab) {
  state.activeTab = tab;
  tabPages.forEach((page) => page.classList.toggle("active", page.dataset.tab === tab));
  tabButtons.forEach((button) => button.classList.toggle("active", button.dataset.tabButton === tab));

  const titles = {
    today: "Today",
    zones: "Strefy",
    capture: "Capture",
    insights: "Insights",
    me: "Ja"
  };

  document.getElementById("screen-title").textContent = titles[tab] || "LifeOS";
  saveState();
}

function focusField(id) {
  const target = document.getElementById(id);
  if (target) {
    setTimeout(() => target.focus(), 120);
  }
}

function computeProgress() {
  const doneHabits = state.habits.filter((item) => item.done).length;
  const doneTasks = state.tasks.filter((item) => item.done).length;
  const total = state.habits.length + state.tasks.length;
  const completed = doneHabits + doneTasks;

  return {
    total,
    completed,
    percent: total ? Math.round((completed / total) * 100) : 0,
    doneHabits,
    doneTasks,
    openTasks: state.tasks.filter((item) => !item.done).length
  };
}

function latestWeight() {
  const entry = state.weightHistory.at(-1);
  return entry ? entry.value : null;
}

function totalTrainingMinutes() {
  return state.workouts.reduce((sum, workout) => sum + Number(workout.duration || 0), 0);
}

function workoutsThisWeek() {
  const currentWeek = weekKey();
  return state.workouts.filter((workout) => weekKey(new Date(workout.createdAt)) === currentWeek);
}

function mealsToday() {
  const today = todayKey();
  return state.meals.filter((meal) => todayKey(new Date(meal.createdAt)) === today);
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

function averageWeight() {
  if (!state.weightHistory.length) return null;
  const sum = state.weightHistory.reduce((acc, item) => acc + Number(item.value), 0);
  return sum / state.weightHistory.length;
}

function exerciseSummary() {
  const grouped = new Map();

  state.exerciseSets.forEach((entry) => {
    const current = grouped.get(entry.exercise) ?? { sets: 0, topWeight: 0 };
    current.sets += 1;
    current.topWeight = Math.max(current.topWeight, Number(entry.weight || 0));
    grouped.set(entry.exercise, current);
  });

  return [...grouped.entries()]
    .map(([exercise, data]) => ({ exercise, ...data }))
    .sort((a, b) => b.sets - a.sets)
    .slice(0, 4);
}

function priorityLabel(priority) {
  return { high: "High", medium: "Medium", low: "Low" }[priority] || "Medium";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setFeedback(message) {
  document.getElementById("capture-feedback").textContent = message;
}

function renderToday() {
  const progress = computeProgress();
  const nutrition = nutritionToday();
  document.getElementById("main-progress-value").textContent = `${progress.percent}%`;
  document.getElementById("main-progress-bar").style.width = `${progress.percent}%`;
  document.getElementById("top-progress-chip").textContent = `${progress.percent}%`;
  document.getElementById("hero-meta-left").textContent = `${progress.completed} z ${progress.total}`;
  document.getElementById("hero-meta-right").textContent = `${progress.openTasks} open`;
  document.getElementById("hero-title").textContent = progress.percent >= 70 ? "Spokojny momentum" : "Wracamy do rytmu";
  document.getElementById("hero-subtitle").textContent =
    progress.percent >= 70
      ? "Domknij tylko to, co faktycznie przesuwa dzien."
      : "Zrob kilka prostych rzeczy i odbuduj flow.";

  const weight = latestWeight();
  const weekCount = workoutsThisWeek().length;
  document.getElementById("latest-weight").textContent = weight ? `${weight.toFixed(1)} kg` : "-";
  document.getElementById("open-task-count").textContent = String(progress.openTasks);
  document.getElementById("habit-done-count").textContent = `${progress.doneHabits}/${state.habits.length}`;
  document.getElementById("week-workout-count").textContent = `${weekCount}/4`;
  document.getElementById("habit-summary").textContent = `${progress.doneHabits}/${state.habits.length}`;
  document.getElementById("task-summary").textContent = `${progress.openTasks} open`;
  document.getElementById("workout-summary").textContent = `${totalTrainingMinutes()} min`;
  document.getElementById("set-summary").textContent = `${state.exerciseSets.length} wpisow`;
  document.getElementById("template-summary").textContent = `${state.workoutTemplates.length}`;
  document.getElementById("meal-summary").textContent = `${nutrition.calories} kcal`;
  document.getElementById("today-kcal").textContent = `${nutrition.calories}`;
  document.getElementById("today-protein").textContent = `${nutrition.protein} g`;
  document.getElementById("today-macros").textContent = `${nutrition.carbs}/${nutrition.fats}`;
  document.getElementById("today-note").textContent = state.note;

  renderHabitList();
  renderTaskList();
  renderWorkoutList();
  renderTemplateList();
  renderMealList();
  renderSetList();
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
  button.addEventListener("click", onClick);
  return button;
}

function renderListItem(item, type) {
  const wrapper = document.createElement("div");
  wrapper.className = `list-item ${item.done ? "done" : ""}`;

  const toggle = document.createElement("button");
  toggle.className = "list-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-label", item.done ? "Undo" : "Done");
  toggle.addEventListener("click", () => {
    if (type === "habit") {
      state.habits = state.habits.map((habit) => habit.id === item.id ? { ...habit, done: !habit.done } : habit);
      setFeedback(`Habit: ${item.title}`);
    } else {
      state.tasks = state.tasks.map((task) => task.id === item.id ? { ...task, done: !task.done } : task);
      setFeedback(`Task: ${item.title}`);
    }
    saveState();
    renderAll();
  });

  const copy = document.createElement("div");
  copy.className = "list-copy";
  const detail = type === "task" ? `${item.detail || "Bez opisu"} - ${priorityLabel(item.priority)}` : (item.detail || "Minimum");
  copy.innerHTML = `<strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(detail)}</span>`;

  const tools = document.createElement("div");
  tools.className = "list-tools";
  tools.append(
    makeToolButton("Edit", () => type === "habit" ? editHabit(item.id) : editTask(item.id)),
    makeToolButton("Del", () => type === "habit" ? deleteHabit(item.id) : deleteTask(item.id), true)
  );

  wrapper.append(toggle, copy, tools);
  return wrapper;
}

function renderHabitList() {
  const node = document.getElementById("habit-list");
  node.innerHTML = "";
  if (!state.habits.length) {
    node.appendChild(emptyNode("Brak habitow."));
    return;
  }
  state.habits.forEach((habit) => node.appendChild(renderListItem(habit, "habit")));
}

function renderTaskList() {
  const node = document.getElementById("task-list");
  node.innerHTML = "";
  if (!state.tasks.length) {
    node.appendChild(emptyNode("Brak taskow."));
    return;
  }

  state.tasks
    .slice()
    .sort((a, b) => Number(a.done) - Number(b.done))
    .forEach((task) => node.appendChild(renderListItem(task, "task")));
}

function renderWorkoutList() {
  const node = document.getElementById("workout-list");
  node.innerHTML = "";
  if (!state.workouts.length) {
    node.appendChild(emptyNode("Brak treningow."));
    return;
  }

  state.workouts.slice().reverse().slice(0, 4).forEach((workout) => {
    const wrapper = document.createElement("div");
    wrapper.className = "list-item";
    wrapper.innerHTML = `
      <div class="list-toggle" aria-hidden="true"></div>
      <div class="list-copy">
        <strong>${escapeHtml(workout.title)}</strong>
        <span>${escapeHtml(workout.focus)} - ${workout.duration} min - ${escapeHtml(workout.dateLabel)}</span>
      </div>
    `;

    const tools = document.createElement("div");
    tools.className = "list-tools";
    tools.append(
      makeToolButton("Edit", () => editWorkout(workout.id)),
      makeToolButton("Del", () => deleteWorkout(workout.id), true)
    );
    wrapper.appendChild(tools);
    node.appendChild(wrapper);
  });
}

function renderTemplateList() {
  const node = document.getElementById("template-list");
  node.innerHTML = "";

  if (!state.workoutTemplates.length) {
    node.appendChild(emptyNode("Brak szablonow."));
    return;
  }

  state.workoutTemplates.forEach((template) => {
    const item = document.createElement("div");
    item.className = "template-item";
    item.innerHTML = `
      <div class="template-top">
        <div class="list-copy">
          <strong>${escapeHtml(template.title)}</strong>
          <span>${escapeHtml(template.focus)} - rest ${template.rest}s</span>
        </div>
      </div>
      <div class="template-meta">${escapeHtml(template.exercises.join(", "))}</div>
    `;

    const actions = document.createElement("div");
    actions.className = "template-actions";
    const start = document.createElement("button");
    start.type = "button";
    start.className = "template-start";
    start.textContent = "Uzyj";
    start.addEventListener("click", () => applyWorkoutTemplate(template.id));
    actions.appendChild(start);
    actions.appendChild(makeToolButton("Edit", () => editTemplate(template.id)));
    item.appendChild(actions);
    node.appendChild(item);
  });
}

function renderMealList() {
  const node = document.getElementById("meal-list");
  node.innerHTML = "";
  const meals = mealsToday().slice().reverse();

  if (!meals.length) {
    node.appendChild(emptyNode("Brak posilkow dzisiaj."));
    return;
  }

  meals.slice(0, 4).forEach((meal) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `
      <div class="list-copy">
        <strong>${escapeHtml(meal.title)}</strong>
        <span>${meal.calories} kcal - P ${meal.protein} / W ${meal.carbs} / T ${meal.fats}</span>
      </div>
    `;

    const tools = document.createElement("div");
    tools.className = "list-tools";
    tools.append(
      makeToolButton("Edit", () => editMeal(meal.id)),
      makeToolButton("Del", () => deleteMeal(meal.id), true)
    );
    item.appendChild(tools);
    node.appendChild(item);
  });
}

function renderMealTemplateList() {
  const node = document.getElementById("meal-template-list");
  node.innerHTML = "";
  document.getElementById("meal-template-summary").textContent = `${state.mealTemplates.length}`;

  if (!state.mealTemplates.length) {
    node.appendChild(emptyNode("Brak szablonow jedzenia."));
    return;
  }

  state.mealTemplates.forEach((template) => {
    const item = document.createElement("div");
    item.className = "template-item";
    item.innerHTML = `
      <div class="template-top">
        <div class="list-copy">
          <strong>${escapeHtml(template.title)}</strong>
          <span>${template.calories} kcal</span>
        </div>
      </div>
      <div class="template-meta">P ${template.protein} / W ${template.carbs} / T ${template.fats}</div>
    `;

    const actions = document.createElement("div");
    actions.className = "template-actions";
    const start = document.createElement("button");
    start.type = "button";
    start.className = "template-start";
    start.textContent = "Uzyj";
    start.addEventListener("click", () => applyMealTemplate(template.id));
    actions.appendChild(start);
    actions.appendChild(makeToolButton("Edit", () => editMealTemplate(template.id)));
    item.appendChild(actions);
    node.appendChild(item);
  });
}

function renderSetList() {
  const node = document.getElementById("set-list");
  node.innerHTML = "";
  if (!state.exerciseSets.length) {
    node.appendChild(emptyNode("Brak serii."));
    return;
  }

  state.exerciseSets.slice().reverse().slice(0, 4).forEach((set) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `
      <div class="list-toggle" aria-hidden="true"></div>
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
    item.appendChild(tools);
    node.appendChild(item);
  });
}

function renderZones() {
  const progress = computeProgress();
  const fitnessProgress = Math.min(Math.round((state.workouts.length / 5) * 100), 100);
  const zones = [
    { title: "Fitness", copy: "Trening, waga, output i baza progresu.", percent: fitnessProgress },
    { title: "Habits", copy: "Codzienny rytm z minimalnym progiem wejscia.", percent: state.habits.length ? Math.round((progress.doneHabits / state.habits.length) * 100) : 0 },
    { title: "Tasks", copy: "Inbox i egzekucja najwazniejszych rzeczy.", percent: state.tasks.length ? Math.round((progress.doneTasks / state.tasks.length) * 100) : 0 },
    { title: "Finanse", copy: "Pozniej: cashflow, wydatki i ocena zakupow.", percent: 14 },
    { title: "Gitara", copy: "Pozniej: BPM, metronom i skill tracker.", percent: 8 }
  ];

  const node = document.getElementById("zones-list");
  node.innerHTML = "";
  zones.forEach((zone) => {
    const item = document.createElement("article");
    item.className = "glass zone-item";
    item.innerHTML = `
      <div class="zone-top">
        <div>
          <h3 class="zone-title">${escapeHtml(zone.title)}</h3>
          <p class="zone-copy">${escapeHtml(zone.copy)}</p>
        </div>
        <span class="zone-percent">${zone.percent}%</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${zone.percent}%"></div></div>
    `;
    node.appendChild(item);
  });
}

function renderWeightChart() {
  const values = state.weightHistory.map((item) => item.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = Math.max(max - min, 0.1);
  const node = document.getElementById("weight-chart");
  node.innerHTML = "";

  state.weightHistory.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "line-row";
    const percent = Math.round(((entry.value - min) / span) * 100);
    row.innerHTML = `
      <span>${escapeHtml(entry.dateLabel)}</span>
      <div class="line-track"><i style="width:${Math.max(percent, 12)}%"></i></div>
      <strong>${entry.value.toFixed(1)}</strong>
    `;
    node.appendChild(row);
  });
}

function renderTrainingChart() {
  const node = document.getElementById("training-chart");
  node.innerHTML = "";
  const maxMinutes = Math.max(...state.workouts.map((entry) => entry.duration), 1);

  state.workouts.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <span>${escapeHtml(entry.dateLabel)}</span>
      <div class="bar-track"><i style="width:${Math.round((entry.duration / maxMinutes) * 100)}%"></i></div>
      <strong>${entry.duration}m</strong>
    `;
    node.appendChild(row);
  });
}

function renderInsights() {
  renderWeightChart();
  renderTrainingChart();
  renderExerciseSummary();

  const average = averageWeight();
  const nutrition = nutritionToday();
  document.getElementById("average-weight").textContent = average ? `${average.toFixed(1)} kg` : "-";
  document.getElementById("total-training-minutes").textContent = `${totalTrainingMinutes()}`;
  document.getElementById("insight-progress").textContent = `${computeProgress().percent}%`;
  document.getElementById("insight-kcal").textContent = `${nutrition.calories}`;
  document.getElementById("insight-protein").textContent = `${nutrition.protein} g`;
  document.getElementById("insight-carb-fat").textContent = `${nutrition.carbs}/${nutrition.fats}`;
  document.getElementById("review-copy").textContent =
    computeProgress().percent >= 70
      ? "Dobry tydzien. Najmocniej dziala rytm i regularnosc."
      : "System potrzebuje prostszego domykania rzeczy. Zacznij od 2-3 pewniakow dziennie.";
}

function renderExerciseSummary() {
  const node = document.getElementById("exercise-summary-list");
  node.innerHTML = "";
  const summary = exerciseSummary();

  if (!summary.length) {
    node.appendChild(emptyNode("Brak cwiczen."));
    return;
  }

  summary.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `
      <div class="list-copy">
        <strong>${escapeHtml(entry.exercise)}</strong>
        <span>${entry.sets} sets - top ${entry.topWeight} kg</span>
      </div>
    `;
    node.appendChild(item);
  });
}

function renderMe() {
  const node = document.getElementById("supplement-list");
  node.innerHTML = "";
  state.supplements.forEach((supplement) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `
      <div class="list-copy">
        <strong>${escapeHtml(supplement.name)}</strong>
        <span>${escapeHtml(supplement.dosage)}</span>
      </div>
    `;
    node.appendChild(item);
  });
}

function renderDate() {
  const formatter = new Intl.DateTimeFormat("pl-PL", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
  document.getElementById("today-date").textContent = formatter.format(new Date());
}

function renderRestTimer() {
  const valueNode = document.getElementById("rest-timer-value");
  const statusNode = document.getElementById("rest-timer-status");
  const startButton = document.getElementById("rest-start-button");
  if (!valueNode || !statusNode || !startButton) return;

  valueNode.textContent = String(restTimerValue);
  statusNode.textContent = restTimerRunning ? "Running" : "Ready";
  startButton.textContent = restTimerRunning ? "Pause" : "Start";
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
    notifyTimerComplete();
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

function notifyTimerComplete() {
  if (navigator.vibrate) {
    navigator.vibrate([120, 80, 120]);
  }

  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.value = 0.05;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.18);
    oscillator.onended = () => audioContext.close();
  } catch {
    // Silent fallback for unsupported browsers.
  }
}

function editHabit(id) {
  const habit = state.habits.find((item) => item.id === id);
  if (!habit) return;
  const title = prompt("Habit", habit.title);
  if (title === null) return;
  const detail = prompt("Opis", habit.detail);
  if (detail === null) return;
  state.habits = state.habits.map((item) => item.id === id ? { ...item, title: title.trim() || item.title, detail: detail.trim() || "Minimum" } : item);
  setFeedback(`Zmieniono habit: ${title.trim() || habit.title}.`);
  saveState();
  renderAll();
}

function editTask(id) {
  const task = state.tasks.find((item) => item.id === id);
  if (!task) return;
  const title = prompt("Task", task.title);
  if (title === null) return;
  const detail = prompt("Opis", task.detail);
  if (detail === null) return;
  state.tasks = state.tasks.map((item) => item.id === id ? { ...item, title: title.trim() || item.title, detail: detail.trim() || "Bez opisu" } : item);
  setFeedback(`Zmieniono task: ${title.trim() || task.title}.`);
  saveState();
  renderAll();
}

function editWorkout(id) {
  const workout = state.workouts.find((item) => item.id === id);
  if (!workout) return;
  const title = prompt("Trening", workout.title);
  if (title === null) return;
  const duration = prompt("Minuty", String(workout.duration));
  if (duration === null) return;
  const numeric = Number(duration);
  state.workouts = state.workouts.map((item) => item.id === id ? {
    ...item,
    title: title.trim() || item.title,
    duration: Number.isFinite(numeric) && numeric > 0 ? numeric : item.duration
  } : item);
  setFeedback(`Zmieniono trening: ${title.trim() || workout.title}.`);
  saveState();
  renderAll();
}

function editTemplate(id) {
  const template = state.workoutTemplates.find((item) => item.id === id);
  if (!template) return;
  const title = prompt("Szablon", template.title);
  if (title === null) return;
  const focus = prompt("Focus", template.focus);
  if (focus === null) return;
  const rest = prompt("Rest s", String(template.rest));
  if (rest === null) return;

  state.workoutTemplates = state.workoutTemplates.map((item) => item.id === id ? {
    ...item,
    title: title.trim() || item.title,
    focus: focus.trim() || item.focus,
    rest: Number.isFinite(Number(rest)) && Number(rest) > 0 ? Number(rest) : item.rest
  } : item);

  setFeedback(`Zmieniono szablon: ${title.trim() || template.title}.`);
  saveState();
  renderAll();
}

function applyWorkoutTemplate(id) {
  const template = state.workoutTemplates.find((item) => item.id === id);
  if (!template) return;

  const dayLabel = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date());
  state.workouts.push({
    id: uid("workout"),
    title: template.title,
    duration: template.exercises.length * 18,
    focus: template.focus,
    dateLabel: dayLabel,
    createdAt: new Date().toISOString()
  });

  restTimerValue = template.rest;
  renderRestTimer();
  setFeedback(`Dodano trening z szablonu: ${template.title}.`);
  saveState();
  renderAll();
}

function editMeal(id) {
  const meal = state.meals.find((item) => item.id === id);
  if (!meal) return;
  const title = prompt("Posilek", meal.title);
  if (title === null) return;
  const calories = prompt("Kcal", String(meal.calories));
  if (calories === null) return;
  const protein = prompt("Bialko", String(meal.protein));
  if (protein === null) return;
  const carbs = prompt("Wegle", String(meal.carbs));
  if (carbs === null) return;
  const fats = prompt("Tluscze", String(meal.fats));
  if (fats === null) return;

  state.meals = state.meals.map((item) => item.id === id ? {
    ...item,
    title: title.trim() || item.title,
    calories: Number.isFinite(Number(calories)) ? Number(calories) : item.calories,
    protein: Number.isFinite(Number(protein)) ? Number(protein) : item.protein,
    carbs: Number.isFinite(Number(carbs)) ? Number(carbs) : item.carbs,
    fats: Number.isFinite(Number(fats)) ? Number(fats) : item.fats
  } : item);

  setFeedback(`Zmieniono posilek: ${title.trim() || meal.title}.`);
  saveState();
  renderAll();
}

function deleteMeal(id) {
  state.meals = state.meals.filter((item) => item.id !== id);
  setFeedback("Usunieto posilek.");
  saveState();
  renderAll();
}

function editMealTemplate(id) {
  const template = state.mealTemplates.find((item) => item.id === id);
  if (!template) return;
  const title = prompt("Szablon posilku", template.title);
  if (title === null) return;
  const calories = prompt("Kcal", String(template.calories));
  if (calories === null) return;

  state.mealTemplates = state.mealTemplates.map((item) => item.id === id ? {
    ...item,
    title: title.trim() || item.title,
    calories: Number.isFinite(Number(calories)) ? Number(calories) : item.calories
  } : item);

  setFeedback(`Zmieniono szablon jedzenia: ${title.trim() || template.title}.`);
  saveState();
  renderAll();
}

function applyMealTemplate(id) {
  const template = state.mealTemplates.find((item) => item.id === id);
  if (!template) return;

  state.meals.push({
    id: uid("meal"),
    title: template.title,
    calories: template.calories,
    protein: template.protein,
    carbs: template.carbs,
    fats: template.fats,
    createdAt: new Date().toISOString()
  });

  setFeedback(`Dodano posilek z szablonu: ${template.title}.`);
  saveState();
  renderAll();
}

function deleteHabit(id) {
  state.habits = state.habits.filter((item) => item.id !== id);
  setFeedback("Usunieto habit.");
  saveState();
  renderAll();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter((item) => item.id !== id);
  setFeedback("Usunieto task.");
  saveState();
  renderAll();
}

function deleteWorkout(id) {
  state.workouts = state.workouts.filter((item) => item.id !== id);
  setFeedback("Usunieto trening.");
  saveState();
  renderAll();
}

function editSet(id) {
  const set = state.exerciseSets.find((item) => item.id === id);
  if (!set) return;
  const exercise = prompt("Cwiczenie", set.exercise);
  if (exercise === null) return;
  const reps = prompt("Reps", String(set.reps));
  if (reps === null) return;
  const weight = prompt("Kg", String(set.weight));
  if (weight === null) return;
  const rest = prompt("Rest s", String(set.rest));
  if (rest === null) return;

  state.exerciseSets = state.exerciseSets.map((item) => item.id === id ? {
    ...item,
    exercise: exercise.trim() || item.exercise,
    reps: Number.isFinite(Number(reps)) && Number(reps) > 0 ? Number(reps) : item.reps,
    weight: Number.isFinite(Number(weight)) && Number(weight) >= 0 ? Number(weight) : item.weight,
    rest: Number.isFinite(Number(rest)) && Number(rest) >= 0 ? Number(rest) : item.rest
  } : item);

  setFeedback(`Zmieniono serie: ${exercise.trim() || set.exercise}.`);
  saveState();
  renderAll();
}

function deleteSet(id) {
  state.exerciseSets = state.exerciseSets.filter((item) => item.id !== id);
  setFeedback("Usunieto serie.");
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

function resetState() {
  if (!confirm("Zresetowac demo data?")) return;
  state = cloneState(defaultState);
  resetRestTimer();
  saveState();
  renderAll();
  setFeedback("Przywrocono demo data.");
}

function bindForms() {
  document.getElementById("weight-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("weight-input");
    const value = Number(input.value);
    if (!Number.isFinite(value) || value <= 0) return;

    state.weightHistory = [...state.weightHistory.slice(-6), {
      dateLabel: `D${state.weightHistory.length + 1}`,
      value,
      createdAt: new Date().toISOString()
    }];
    input.value = "";
    setFeedback(`Zapisano wage ${value.toFixed(1)} kg.`);
    saveState();
    renderAll();
  });

  document.getElementById("task-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const titleInput = document.getElementById("task-input");
    const detailInput = document.getElementById("task-detail-input");
    const priorityInput = document.getElementById("task-priority-input");
    const title = titleInput.value.trim();
    if (!title) return;

    state.tasks.unshift({
      id: uid("task"),
      title,
      detail: detailInput.value.trim() || "Bez opisu",
      priority: priorityInput.value,
      done: false
    });

    titleInput.value = "";
    detailInput.value = "";
    priorityInput.value = "medium";
    setFeedback(`Dodano task: ${title}.`);
    saveState();
    renderAll();
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
    setFeedback(`Dodano habit: ${title}.`);
    saveState();
    renderAll();
  });

  document.getElementById("workout-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const titleInput = document.getElementById("workout-title-input");
    const durationInput = document.getElementById("workout-duration-input");
    const focusInput = document.getElementById("workout-focus-input");
    const title = titleInput.value.trim();
    const duration = Number(durationInput.value);
    if (!title || !Number.isFinite(duration) || duration <= 0) return;

    const dayLabel = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date());
    state.workouts.push({
      id: uid("workout"),
      title,
      duration,
      focus: focusInput.value.trim() || "general",
      dateLabel: dayLabel,
      createdAt: new Date().toISOString()
    });

    titleInput.value = "";
    durationInput.value = "";
    focusInput.value = "";
    setFeedback(`Dodano trening: ${title}.`);
    saveState();
    renderAll();
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
      dateLabel: "Today",
      createdAt: new Date().toISOString()
    });

    exerciseInput.value = "";
    repsInput.value = "";
    weightInput.value = "";
    restInput.value = String(restTimerValue);
    setFeedback(`Dodano serie: ${exercise}.`);
    saveState();
    renderAll();
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
    const protein = Number(proteinInput.value);
    const carbs = Number(carbsInput.value);
    const fats = Number(fatsInput.value);

    if (!title || !Number.isFinite(calories) || calories <= 0) return;

    state.meals.push({
      id: uid("meal"),
      title,
      calories,
      protein: Number.isFinite(protein) ? protein : 0,
      carbs: Number.isFinite(carbs) ? carbs : 0,
      fats: Number.isFinite(fats) ? fats : 0,
      createdAt: new Date().toISOString()
    });

    titleInput.value = "";
    kcalInput.value = "";
    proteinInput.value = "";
    carbsInput.value = "";
    fatsInput.value = "";
    setFeedback(`Dodano posilek: ${title}.`);
    saveState();
    renderAll();
  });

  document.getElementById("note-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("note-input");
    const note = input.value.trim();
    if (!note) return;
    state.note = note;
    input.value = "";
    setFeedback("Zapisano notatke dnia.");
    saveState();
    renderAll();
  });
}

function bindTabs() {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => setTab(button.dataset.tabButton));
  });

  switchButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setTab(button.dataset.switchTab);
      focusField(button.dataset.focus);
    });
  });
}

function bindTools() {
  document.getElementById("export-button").addEventListener("click", exportState);
  document.getElementById("reset-button").addEventListener("click", resetState);
  document.querySelectorAll("[data-rest-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      restTimerValue = Number(button.dataset.restPreset);
      restTimerRunning = false;
      clearInterval(restTimerInterval);
      restTimerInterval = null;
      renderRestTimer();
    });
  });

  document.getElementById("rest-start-button").addEventListener("click", toggleRestTimer);
  document.getElementById("rest-reset-button").addEventListener("click", resetRestTimer);
}

function renderAll() {
  renderDate();
  renderToday();
  renderZones();
  renderInsights();
  renderMe();
  renderMealTemplateList();
  renderRestTimer();
  setTab(state.activeTab);
}

bindTabs();
bindForms();
bindTools();
applyResets();
renderAll();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
