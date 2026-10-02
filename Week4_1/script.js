// STUDYHUB DOM LAB
// This project intentionally uses a different UI and interaction structure,
// while practicing the DOM/event concepts from class.

// ---------- CLOCK ----------
const liveClock = document.querySelector("#liveClock");

function updateClock(){
  const now = new Date();
  liveClock.textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();


// ---------- THEME ----------
const themeToggle = document.querySelector("#themeToggle");
const mobileTheme = document.querySelector("#mobileTheme");

function toggleTheme(){
  document.body.classList.toggle("dark");
  const icon = document.body.classList.contains("dark") ? "☀" : "☾";
  themeToggle.innerHTML = icon + " <span>" + (icon === "☀" ? "Light mode" : "Dark mode") + "</span>";
  mobileTheme.textContent = icon;
}
themeToggle.addEventListener("click", toggleTheme);
mobileTheme.addEventListener("click", toggleTheme);


// ---------- PAGE NAVIGATION ----------
const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
const jumpTasks = document.querySelector("#jumpTasks");

function openPage(target){
  pages.forEach(page => page.classList.remove("active-page"));
  document.querySelector("#" + target).classList.add("active-page");

  navItems.forEach(item => {
    item.classList.toggle("active", item.dataset.target === target);
  });
  window.scrollTo({top:0, behavior:"smooth"});
}

navItems.forEach(item => {
  item.addEventListener("click", () => openPage(item.dataset.target));
});
jumpTasks.addEventListener("click", () => openPage("tasks"));


// ---------- FOCUS TIMER ----------
const timerDisplay = document.querySelector("#timerDisplay");
const timerBar = document.querySelector("#timerBar");
const timerState = document.querySelector("#timerState");
const startTimer = document.querySelector("#startTimer");
const pauseTimer = document.querySelector("#pauseTimer");
const resetTimer = document.querySelector("#resetTimer");

let seconds = 25 * 60;
let timerId = null;
let sessions = 0;

function renderTimer(){
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  timerDisplay.textContent =
    String(min).padStart(2,"0") + ":" + String(sec).padStart(2,"0");

  const progress = ((25 * 60 - seconds) / (25 * 60)) * 100;
  timerBar.style.width = Math.max(0, progress) + "%";
}

startTimer.addEventListener("click", () => {
  if(timerId !== null) return;

  timerState.textContent = "FOCUSING";

  timerId = setInterval(() => {
    seconds--;
    renderTimer();

    if(seconds <= 0){
      clearInterval(timerId);
      timerId = null;
      sessions++;
      document.querySelector("#sessionCount").textContent = sessions;
      timerState.textContent = "DONE";
      alert("Focus session complete! Great work 🎉");
    }
  },1000);
});

pauseTimer.addEventListener("click", () => {
  clearInterval(timerId);
  timerId = null;
  timerState.textContent = "PAUSED";
});

resetTimer.addEventListener("click", () => {
  clearInterval(timerId);
  timerId = null;
  seconds = 25 * 60;
  timerState.textContent = "READY";
  renderTimer();
});

renderTimer();


// ---------- PROFILE MODAL ----------
const modal = document.querySelector("#profileModal");
const editProfile = document.querySelector("#editProfile");
const closeModal = document.querySelector("#closeModal");
const saveProfile = document.querySelector("#saveProfile");
const editName = document.querySelector("#editName");
const editMajor = document.querySelector("#editMajor");

editProfile.addEventListener("click", () => modal.classList.remove("hidden"));
closeModal.addEventListener("click", () => modal.classList.add("hidden"));

saveProfile.addEventListener("click", () => {
  const name = editName.value.trim();
  const major = editMajor.value.trim();

  if(!name || !major){
    alert("Please enter both fields.");
    return;
  }

  document.querySelector("#profileName").textContent = name;
  document.querySelector("#profileMajor").textContent = major;
  document.querySelector("#profileAvatar").textContent = name[0].toUpperCase();
  document.querySelector(".user-mini strong").textContent = name;
  document.querySelector(".user-mini small").textContent = major;

  modal.classList.add("hidden");
});


// ---------- TASK MANAGER ----------
const newTask = document.querySelector("#newTask");
const taskCategory = document.querySelector("#taskCategory");
const taskPriority = document.querySelector("#taskPriority");
const addTask = document.querySelector("#addTask");
const taskContainer = document.querySelector("#taskContainer");
const taskError = document.querySelector("#taskError");
const dashboardTasks = document.querySelector("#dashboardTasks");

let tasks = [
  {id:1, title:"Practice querySelector() and events", category:"Coding", priority:"High", done:false},
  {id:2, title:"Review database lecture", category:"Database", priority:"Normal", done:false},
  {id:3, title:"Practice Korean vocabulary", category:"Korean", priority:"Low", done:true}
];

let activeFilter = "All";

function renderTasks(){
  taskContainer.innerHTML = "";

  const filtered = tasks.filter(task =>
    activeFilter === "All" || task.category === activeFilter
  );

  if(filtered.length === 0){
    taskContainer.innerHTML = '<div class="card"><p style="color:var(--muted)">No tasks in this category.</p></div>';
  }

  filtered.forEach(task => {
    const row = document.createElement("div");
    row.className = "task-row" + (task.done ? " completed" : "");
    row.dataset.id = task.id;

    row.innerHTML = `
      <input class="task-check" type="checkbox" ${task.done ? "checked" : ""}>
      <div class="task-info">
        <strong>${escapeHTML(task.title)}</strong>
        <small>${task.category} • <span class="${task.priority === "High" ? "priority-high" : task.priority === "Low" ? "priority-low" : ""}">${task.priority} priority</span></small>
      </div>
      <button class="delete">Delete</button>
    `;

    taskContainer.appendChild(row);
  });

  renderDashboardTasks();
  updateStats();
}

function renderDashboardTasks(){
  dashboardTasks.innerHTML = "";

  tasks.slice(0,4).forEach(task => {
    const item = document.createElement("div");
    item.className = "quick-item" + (task.done ? " done" : "");

    item.innerHTML = `
      <span>${task.done ? "✓" : "○"}</span>
      <span>${escapeHTML(task.title)}</span>
      <span class="category">${task.category}</span>
    `;

    dashboardTasks.appendChild(item);
  });

  if(tasks.length === 0){
    dashboardTasks.innerHTML = '<div class="quick-item">No tasks yet — add one in My Tasks.</div>';
  }
}

function updateStats(){
  const completed = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  document.querySelector("#dashCompleted").textContent = completed;
  document.querySelector("#dashProgress").textContent = progress + "%";
  document.querySelector("#dashProgressBar").style.width = progress + "%";
  document.querySelector("#dashCompletedText").textContent =
    total ? completed + " of " + total + " tasks" : "Start your first task";
}

function escapeHTML(value){
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function createTask(){
  const title = newTask.value.trim();

  if(!title){
    taskError.textContent = "Enter a task before adding it.";
    return;
  }

  taskError.textContent = "";

  tasks.push({
    id: Date.now(),
    title,
    category: taskCategory.value,
    priority: taskPriority.value,
    done:false
  });

  newTask.value = "";
  renderTasks();
}

addTask.addEventListener("click", createTask);

newTask.addEventListener("keydown", e => {
  if(e.key === "Enter") createTask();
});


// Event delegation: the parent handles all task check/delete actions.
taskContainer.addEventListener("click", e => {
  const row = e.target.closest(".task-row");
  if(!row) return;

  const id = Number(row.dataset.id);
  const task = tasks.find(t => t.id === id);

  if(e.target.matches(".delete")){
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
  }

  if(e.target.matches(".task-check")){
    task.done = e.target.checked;
    renderTasks();
  }
});


// ---------- TASK FILTER ----------
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");

    activeFilter = button.dataset.filter;
    renderTasks();
  });
});


// ---------- STUDENT LIVE SEARCH ----------
const studentSearch = document.querySelector("#studentSearch");
const studentCards = document.querySelectorAll(".person");
const studentResult = document.querySelector("#studentResult");
const noMatch = document.querySelector("#noMatch");

studentSearch.addEventListener("input", e => {
  const term = e.target.value.toLowerCase().trim();
  let count = 0;

  studentCards.forEach(card => {
    const match = card.dataset.search.includes(term);
    card.style.display = match ? "flex" : "none";
    if(match) count++;
  });

  studentResult.textContent = count + (count === 1 ? " student" : " students");
  noMatch.style.display = count === 0 ? "block" : "none";
});


// ---------- ATTENDANCE ----------
const attendanceData = [
  ["Sudip", true],
  ["Azim", true],
  ["Shonx", true],
  ["Eric", true],
  ["Roshan", true]
];

const attendanceList = document.querySelector("#attendanceList");

function renderAttendance(){
  attendanceList.innerHTML = "";

  attendanceData.forEach((student, index) => {
    const row = document.createElement("div");
    row.className = "att-row" + (!student[1] ? " absent" : "");
    row.dataset.index = index;

    row.innerHTML = `
      <span class="att-name">${student[0]}</span>
      <button class="att-button ${student[1] ? "present" : "absent"}">
        ${student[1] ? "Present" : "Absent"}
      </button>
    `;

    attendanceList.appendChild(row);
  });

  updateAttendanceStats();
}

// Event delegation on ONE parent.
attendanceList.addEventListener("click", e => {
  if(!e.target.matches(".att-button")) return;

  const row = e.target.closest(".att-row");
  const index = Number(row.dataset.index);

  attendanceData[index][1] = !attendanceData[index][1];
  renderAttendance();
});

function updateAttendanceStats(){
  const present = attendanceData.filter(s => s[1]).length;
  const total = attendanceData.length;
  const absent = total - present;
  const rate = Math.round((present / total) * 100);

  document.querySelector("#presentNumber").textContent = present;
  document.querySelector("#absentNumber").textContent = absent;
  document.querySelector("#donutText").textContent = present + "/" + total;
  document.querySelector("#attendanceRate").textContent = rate + "%";
  document.querySelector("#dashPresent").textContent = present + "/" + total;

  const degrees = rate * 3.6;
  document.querySelector(".donut").style.background =
    `conic-gradient(var(--green) 0deg ${degrees}deg, #e9ebf0 ${degrees}deg 360deg)`;
}

renderTasks();
renderAttendance();
