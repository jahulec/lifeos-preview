const STORAGE_KEY = "lifeos-preview-state";

const defaultState = {
  activeTab: "today",
  habits: [
    { id: "habit-1", title: "Morning mobility", detail: "2 min minimum, 8 min target", done: true },
    { id: "habit-2", title: "Deep work block", detail: "90 min without notifications", done: true },
    { id: "habit-3", title: "Evening walk", detail: "At least 6k steps", done: false }
  ],
  tasks: [
    { id: "task-1", title: "Log body weight", detail: "Before breakfast", done: true, priority: "high" },
    { id: "task-2", title: "Finish workout A", detail: "Bench, rows, split squat", done: false, priority: "high" },
    { id: "task-3", title: "Plan tomorrow top 3", detail: "Before 21:30", done: false, priority: "medium" }
  ],
  weightHistory: [81.2, 80.9, 80.8, 80.6, 80.5, 80.4],
  trainingMinutes: [
    { label: "Mon", value: 68 },
    { label: "Tue", value: 0 },
    { label: "Wed", value: 74 },
    { label: "Thu", value: 42 },
    { label: "Fri", value: 0 },
    { label: "Sat", value: 70 },
    { label: "Sun", value: 55 }
  ],
  note: "Energia jest dobra. Trzymaj rytm i nie rozwadniaj dnia dodatkowymi rzeczami.",
  supplements: [
    { name: "Creatine", dosage: "5 g codziennie" },
    { name: "Omega-3", dosage: "2 kapsułki dziennie" },
    { name: "Magnesium", dosage: "1 porcja wieczorem" }
  ]
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

let state = loadState();

const tabPages = [...document.querySelectorAll(".tab-page")];
const tabButtons = [...document.querySelectorAll("[data-tab-button]")];
const switchButtons = [...document.querySelectorAll("[data-switch-tab]")];

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
    doneTasks
  };
}

function renderToday() {
  const progress = computeProgress();
  document.getElementById("main-progress-value").textContent = `${progress.percent}%`;
  document.getElementById("main-progress-bar").style.width = `${progress.percent}%`;
  document.getElementById("hero-meta-left").textContent = `${progress.completed} z ${progress.total} kluczowych akcji`;
  document.getElementById("hero-title").textContent = progress.percent >= 75 ? "Dzień pod kontrolą" : "Wracamy do rytmu";
  document.getElementById("hero-subtitle").textContent =
    progress.percent >= 75
      ? "Masz dobry momentum. Domknij tylko to, co naprawdę ważne."
      : "Odetnij szum i zamknij kilka prostych rzeczy, żeby wrócić do flow.";

  document.getElementById("habit-summary").textContent = `${progress.doneHabits}/${state.habits.length}`;
  document.getElementById("task-summary").textContent = `${state.tasks.filter((task) => !task.done).length} otwarte`;
  document.getElementById("latest-weight").textContent = `${state.weightHistory.at(-1).toFixed(1)} kg`;

  const habitList = document.getElementById("habit-list");
  habitList.innerHTML = "";
  state.habits.forEach((habit) => {
    habitList.appendChild(renderListItem(habit, "habit"));
  });

  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";
  state.tasks.slice(0, 4).forEach((task) => {
    taskList.appendChild(renderListItem(task, "task"));
  });
}

function renderListItem(item, type) {
  const wrapper = document.createElement("div");
  wrapper.className = `list-item ${item.done ? "done" : ""}`;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.addEventListener("click", () => {
    if (type === "habit") {
      state.habits = state.habits.map((habit) => habit.id === item.id ? { ...habit, done: !habit.done } : habit);
    } else {
      state.tasks = state.tasks.map((task) => task.id === item.id ? { ...task, done: !task.done } : task);
    }
    saveState();
    renderAll();
  });

  const copy = document.createElement("div");
  copy.className = "list-copy";
  copy.innerHTML = `<strong>${item.title}</strong><span>${item.detail}</span>`;

  wrapper.append(toggle, copy);
  return wrapper;
}

function renderZones() {
  const zones = [
    {
      title: "Fitness",
      copy: "Trening, waga, kalorie, makra, suplementy i body stats w jednym rytmie.",
      percent: 75
    },
    {
      title: "Habits",
      copy: "Spokojny system nawyków z minimum version i realnym użyciem każdego dnia.",
      percent: 67
    },
    {
      title: "Tasks",
      copy: "Inbox, today i recurring tasks bez ciężaru klasycznego task managera.",
      percent: 67
    },
    {
      title: "Finanse",
      copy: "Faza 2: cashflow, wydatki, plany i ocena jakości zakupów.",
      percent: 18
    },
    {
      title: "Gitara",
      copy: "Faza 3: metronom, BPM tracker i progres ćwiczeń.",
      percent: 9
    }
  ];

  const list = document.getElementById("zones-list");
  list.innerHTML = "";
  zones.forEach((zone) => {
    const node = document.createElement("article");
    node.className = "glass zone-item";
    node.innerHTML = `
      <div class="zone-top">
        <div>
          <h3 class="zone-title">${zone.title}</h3>
          <p class="zone-copy">${zone.copy}</p>
        </div>
        <span class="zone-percent">${zone.percent}%</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${zone.percent}%"></div></div>
    `;
    list.appendChild(node);
  });
}

function renderInsights() {
  const maxWeight = Math.max(...state.weightHistory);
  const minWeight = Math.min(...state.weightHistory);
  const span = Math.max(maxWeight - minWeight, 0.1);
  const weightChart = document.getElementById("weight-chart");
  weightChart.innerHTML = "";

  state.weightHistory.forEach((value, index) => {
    const row = document.createElement("div");
    row.className = "line-row";
    const percent = Math.round(((value - minWeight) / span) * 100);
    row.innerHTML = `
      <span>D${index + 1}</span>
      <div class="line-track"><i style="width:${Math.max(percent, 10)}%"></i></div>
      <strong>${value.toFixed(1)}</strong>
    `;
    weightChart.appendChild(row);
  });

  const trainingChart = document.getElementById("training-chart");
  trainingChart.innerHTML = "";
  const maxMinutes = Math.max(...state.trainingMinutes.map((entry) => entry.value), 1);

  state.trainingMinutes.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <span>${entry.label}</span>
      <div class="bar-track"><i style="width:${Math.round((entry.value / maxMinutes) * 100)}%"></i></div>
      <strong>${entry.value}m</strong>
    `;
    trainingChart.appendChild(row);
  });

  const progress = computeProgress();
  document.getElementById("review-copy").textContent =
    progress.percent >= 70
      ? "To wygląda jak tydzień z dobrym rdzeniem. Najmocniej działa rytm w habitach i utrzymany kontakt z treningiem."
      : "Masz dobry fundament, ale system potrzebuje szybszego domykania prostych rzeczy. Zacznij od habitów i jednego treningu bez perfekcjonizmu.";
}

function renderMe() {
  const supplementList = document.getElementById("supplement-list");
  supplementList.innerHTML = "";
  state.supplements.forEach((supplement) => {
    const node = document.createElement("div");
    node.className = "list-item";
    node.innerHTML = `
      <div class="list-copy">
        <strong>${supplement.name}</strong>
        <span>${supplement.dosage}</span>
      </div>
    `;
    supplementList.appendChild(node);
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

function bindForms() {
  document.getElementById("weight-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("weight-input");
    const value = Number(input.value);
    if (!Number.isFinite(value) || value <= 0) return;

    state.weightHistory = [...state.weightHistory.slice(-5), value];
    input.value = "";
    document.getElementById("capture-feedback").textContent = `Zapisano wagę ${value.toFixed(1)} kg.`;
    saveState();
    renderAll();
  });

  document.getElementById("task-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("task-input");
    const title = input.value.trim();
    if (!title) return;

    state.tasks.unshift({
      id: `task-${Date.now()}`,
      title,
      detail: "Dodane z Capture",
      done: false,
      priority: "medium"
    });
    input.value = "";
    document.getElementById("capture-feedback").textContent = `Dodano task: ${title}.`;
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
    document.getElementById("capture-feedback").textContent = "Zapisano notatkę dnia.";
    saveState();
    renderAll();
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
renderAll();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
