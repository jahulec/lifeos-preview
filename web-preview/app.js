const STORAGE_KEY = "lifeos-preview-state-v2";

const defaultState = {
  activeTab: "today",
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
    { id: "workout-1", title: "Upper A", duration: 68, focus: "strength", dateLabel: "Mon" },
    { id: "workout-2", title: "Lower A", duration: 74, focus: "legs", dateLabel: "Wed" },
    { id: "workout-3", title: "Pull", duration: 42, focus: "back", dateLabel: "Thu" },
    { id: "workout-4", title: "Push", duration: 55, focus: "chest", dateLabel: "Sat" }
  ],
  weightHistory: [
    { dateLabel: "D1", value: 81.2 },
    { dateLabel: "D2", value: 80.9 },
    { dateLabel: "D3", value: 80.8 },
    { dateLabel: "D4", value: 80.6 },
    { dateLabel: "D5", value: 80.5 },
    { dateLabel: "D6", value: 80.4 }
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
  state.habits = Array.isArray(state.habits) ? state.habits : cloneState(defaultState.habits);
  state.tasks = Array.isArray(state.tasks) ? state.tasks : cloneState(defaultState.tasks);
  state.workouts = Array.isArray(state.workouts) ? state.workouts : cloneState(defaultState.workouts);
  state.weightHistory = Array.isArray(state.weightHistory) ? state.weightHistory : cloneState(defaultState.weightHistory);
  state.supplements = Array.isArray(state.supplements) ? state.supplements : cloneState(defaultState.supplements);
  state.note = typeof state.note === "string" ? state.note : defaultState.note;
  state.activeTab = typeof state.activeTab === "string" ? state.activeTab : "today";
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

function averageWeight() {
  if (!state.weightHistory.length) return null;
  const sum = state.weightHistory.reduce((acc, item) => acc + Number(item.value), 0);
  return sum / state.weightHistory.length;
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
  document.getElementById("latest-weight").textContent = weight ? `${weight.toFixed(1)} kg` : "-";
  document.getElementById("open-task-count").textContent = String(progress.openTasks);
  document.getElementById("habit-done-count").textContent = `${progress.doneHabits}/${state.habits.length}`;
  document.getElementById("week-workout-count").textContent = String(state.workouts.length);
  document.getElementById("habit-summary").textContent = `${progress.doneHabits}/${state.habits.length}`;
  document.getElementById("task-summary").textContent = `${progress.openTasks} open`;
  document.getElementById("workout-summary").textContent = `${totalTrainingMinutes()} min`;
  document.getElementById("today-note").textContent = state.note;

  renderHabitList();
  renderTaskList();
  renderWorkoutList();
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

  const average = averageWeight();
  document.getElementById("average-weight").textContent = average ? `${average.toFixed(1)} kg` : "-";
  document.getElementById("total-training-minutes").textContent = `${totalTrainingMinutes()}`;
  document.getElementById("insight-progress").textContent = `${computeProgress().percent}%`;
  document.getElementById("review-copy").textContent =
    computeProgress().percent >= 70
      ? "Dobry tydzien. Najmocniej dziala rytm i regularnosc."
      : "System potrzebuje prostszego domykania rzeczy. Zacznij od 2-3 pewniakow dziennie.";
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
      value
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
      dateLabel: dayLabel
    });

    titleInput.value = "";
    durationInput.value = "";
    focusInput.value = "";
    setFeedback(`Dodano trening: ${title}.`);
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
}

function renderAll() {
  renderDate();
  renderToday();
  renderZones();
  renderInsights();
  renderMe();
  setTab(state.activeTab);
}

bindTabs();
bindForms();
bindTools();
renderAll();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
