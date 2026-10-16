"use strict";
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Global light/dark mode, remembered on this device.
const themeToggle = $("#siteThemeToggle");
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === "dark";
  $("#siteThemeSymbol").textContent = dark ? "☀" : "☾";
  $("#siteThemeCopy").textContent = dark ? "Light mode" : "Dark mode";
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  document.querySelector('meta[name="theme-color"]').content = dark ? "#111612" : "#f7f7f4";
  try { localStorage.setItem("web-studio-theme", theme); } catch (error) {}
}
let savedTheme = "light";
try { savedTheme = localStorage.getItem("web-studio-theme") || "light"; } catch (error) {}
applyTheme(savedTheme);
themeToggle.addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));

// Subtle reading progress indicator.
const progress = $("#readingProgress");
function updateReadingProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (available > 0 ? window.scrollY / available * 100 : 0) + "%";
}
window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", updateReadingProgress);
updateReadingProgress();

// E1 — Click counter: the stage turns green at five clicks.
let clickTotal = 0;
const counterStage = $("#counterStage");
const clickCount = $("#clickCount");
const counterCaption = $("#counterCaption");
const counterStatus = $("#counterStatus");
const countButton = $("#countButton");
function updateCounter() {
  clickCount.textContent = String(clickTotal).padStart(2, "0");
  counterStatus.textContent = Math.min(clickTotal, 5) + " / 5 clicks";
  const unlocked = clickTotal >= 5;
  counterStage.classList.toggle("is-unlocked", unlocked);
  counterCaption.textContent = unlocked ? "Milestone unlocked. Nice work!" : (5 - clickTotal) + " more click" + (5 - clickTotal === 1 ? "" : "s") + " to unlock the green state.";
  countButton.firstChild.textContent = unlocked ? "Milestone reached " : "Count a click ";
  countButton.querySelector("span").textContent = unlocked ? "✓" : "＋";
}
countButton.addEventListener("click", () => { clickTotal += 1; updateCounter(); });
$("#resetCounter").addEventListener("click", () => { clickTotal = 0; updateCounter(); });
updateCounter();

// E2 — Profile card theme toggle.
const profileDemo = $("#profileDemo");
const profileThemeToggle = $("#themeToggle");
profileThemeToggle.addEventListener("click", () => {
  const isDark = profileDemo.classList.toggle("dark-theme");
  profileThemeToggle.setAttribute("aria-pressed", String(isDark));
  $("#themeIcon").textContent = isDark ? "☀" : "☾";
  $("#themeLabel").textContent = isDark ? "Light mode" : "Dark mode";
});

// E3 — To-do list: add, complete, delete, and clear completed tasks.
const todoForm = $("#todoForm");
const todoInput = $("#todoInput");
const todoList = $("#todoList");
const todoFeedback = $("#todoFeedback");
function updateTodoCount() {
  const total = $$(".todo-item", todoList).length;
  const complete = $$(".todo-item input[type='checkbox']:checked", todoList).length;
  $("#todoCount").textContent = String(total).padStart(2, "0") + " TASK" + (total === 1 ? "" : "S");
  if (total && complete === total) todoFeedback.textContent = "Everything is checked off. Excellent!";
  else if (!total) todoFeedback.textContent = "Your list is clear. Add a task to get started.";
  else todoFeedback.textContent = complete + " of " + total + " tasks complete. Keep going.";
  todoFeedback.classList.remove("error");
}
function addTodo(text) {
  const taskText = text.trim();
  if (!taskText) {
    todoFeedback.textContent = "Type a task first, then add it.";
    todoFeedback.classList.add("error");
    todoInput.focus();
    return;
  }
  const item = document.createElement("li");
  item.className = "todo-item";
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  const task = document.createElement("span");
  task.textContent = taskText;
  label.append(checkbox, task);
  const remove = document.createElement("button");
  remove.className = "delete-task";
  remove.type = "button";
  remove.setAttribute("aria-label", "Delete " + taskText);
  remove.textContent = "×";
  item.append(label, remove);
  todoList.append(item);
  todoInput.value = "";
  todoInput.focus();
  updateTodoCount();
}
todoForm.addEventListener("submit", event => {
  event.preventDefault();
  addTodo(todoInput.value);
});
todoList.addEventListener("change", event => {
  if (event.target.matches("input[type='checkbox']")) {
    event.target.closest(".todo-item").classList.toggle("is-complete", event.target.checked);
    updateTodoCount();
  }
});
todoList.addEventListener("click", event => {
  const remove = event.target.closest(".delete-task");
  if (!remove) return;
  remove.closest(".todo-item").remove();
  updateTodoCount();
});
$("#clearCompleted").addEventListener("click", () => {
  $$(" .todo-item input[type='checkbox']:checked", todoList).forEach(box => box.closest(".todo-item").remove());
  updateTodoCount();
});
updateTodoCount();

// E4 — Live search filters the sample directory by name, major, or year.
const students = [
  { name: "Mina Park", major: "Computer Engineering", year: "YEAR 1", initials: "MP" },
  { name: "Joon Kim", major: "Visual Design", year: "YEAR 2", initials: "JK" },
  { name: "Ari Chen", major: "Computer Science", year: "YEAR 1", initials: "AC" },
  { name: "Yuna Lee", major: "Media & Communication", year: "YEAR 3", initials: "YL" },
  { name: "Daniel Choi", major: "Visual Design", year: "YEAR 2", initials: "DC" },
  { name: "Sora Han", major: "Computer Engineering", year: "YEAR 4", initials: "SH" }
];
const studentSearch = $("#studentSearch");
const studentList = $("#studentList");
function renderStudents() {
  const query = studentSearch.value.trim().toLowerCase();
  const matches = students.filter(student => [student.name, student.major, student.year].some(value => value.toLowerCase().includes(query)));
  studentList.replaceChildren();
  matches.forEach(student => {
    const row = document.createElement("div");
    row.className = "student-row";
    const avatar = document.createElement("span");
    avatar.className = "student-avatar";
    avatar.textContent = student.initials;
    const info = document.createElement("div");
    info.className = "student-info";
    const name = document.createElement("strong");
    name.textContent = student.name;
    const major = document.createElement("p");
    major.textContent = student.major;
    info.append(name, major);
    const year = document.createElement("span");
    year.className = "student-year";
    year.textContent = student.year;
    row.append(avatar, info, year);
    studentList.append(row);
  });
  $("#studentResultCount").textContent = String(matches.length).padStart(2, "0") + " STUDENT" + (matches.length === 1 ? "" : "S");
  $("#studentEmpty").hidden = matches.length > 0;
  studentList.hidden = matches.length === 0;
}
studentSearch.addEventListener("input", renderStudents);
document.addEventListener("keydown", event => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
    event.preventDefault();
    studentSearch.focus();
  }
});
renderStudents();
