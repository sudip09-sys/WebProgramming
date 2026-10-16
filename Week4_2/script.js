const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Reading progress: a small interaction that responds to page scrolling.
const progress = $("#readingProgress");
function updateReadingProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (available > 0 ? window.scrollY / available * 100 : 0) + "%";
}
window.addEventListener("scroll", updateReadingProgress, { passive: true });
updateReadingProgress();

// LAB 01 — textContent treats the input as text, never as HTML.
const userInput = $("#userInput");
const textPreview = $("#textPreview");
function renderTextSample() {
  textPreview.textContent = userInput.value;
}
$("#renderText").addEventListener("click", renderTextSample);
userInput.addEventListener("input", renderTextSample);
userInput.addEventListener("keydown", event => {
  if (event.key === "Enter") renderTextSample();
});

// LAB 02 — this is a hard-coded, trusted example. Do not copy this pattern
// for arbitrary user input. The user's input is never passed to innerHTML.
const trustedMarkup = "<strong>Hello, world!</strong>";
$("#showMarkup").addEventListener("click", () => {
  $("#markupPreview").innerHTML = trustedMarkup;
});

// LAB 03 — scenario picker and safety decision.
const scenarios = [
  { text: "A profile page displays a visitor's custom status message.", correct: "textContent", why: "Correct. A status message is plain user text, so textContent displays it without parsing it as markup." },
  { text: "Your code inserts a fixed, developer-written <strong>Important</strong> label.", correct: "innerHTML", why: "Correct. This fixed snippet is trusted markup. In real projects, only use innerHTML when you control the content or have safely sanitized it." },
  { text: "A comment form shows a comment written by an unknown visitor.", correct: "textContent", why: "Correct. Treat visitor comments as untrusted text. Do not insert them directly into innerHTML." },
  { text: "A page needs to display a name typed into a search box.", correct: "textContent", why: "Correct. The name is plain text. textContent is the straightforward safer choice." }
];
let scenarioIndex = 0;
const safetyFeedback = $("#safetyFeedback");
$$("[data-choice]").forEach(button => button.addEventListener("click", () => {
  const scenario = scenarios[scenarioIndex];
  const correct = button.dataset.choice === scenario.correct;
  $$(".choice").forEach(choice => choice.classList.toggle("selected", choice === button));
  safetyFeedback.className = "feedback " + (correct ? "correct" : "incorrect");
  safetyFeedback.textContent = (correct ? "✓ Nice choice. " : "Not quite. ") + scenario.why;
}));
$("#nextScenario").addEventListener("click", () => {
  scenarioIndex = (scenarioIndex + 1) % scenarios.length;
  $("#scenarioText").textContent = scenarios[scenarioIndex].text;
  safetyFeedback.className = "feedback";
  safetyFeedback.textContent = "Choose an approach to check your answer.";
  $$(".choice").forEach(choice => choice.classList.remove("selected"));
  $("#nextScenario").innerHTML = scenarioIndex === scenarios.length - 1 ? "Restart scenarios <span>↻</span>" : "Next scenario <span>→</span>";
});

// QUICK CHECK — three multiple-choice questions with explanations.
const questions = [
  { q: "A user enters their name in a profile form. Which property should display it as plain text?", a: "textContent", choices: [["innerHTML", "Interpret it as markup"], ["textContent", "Display it as text"]], explanation: "textContent is the safer, direct choice for plain user-provided text." },
  { q: "What happens when a string containing <strong>Hi</strong> is assigned to innerHTML?", a: "innerHTML", choices: [["It always stays literal text", "Nothing is displayed"], ["innerHTML", "The browser parses the markup"], ["It is automatically sanitized", "The browser removes all tags"]], explanation: "innerHTML parses the string as HTML. It does not automatically make untrusted content safe." },
  { q: "You need to show an untrusted visitor comment. Which is the best default?", a: "textContent", choices: [["textContent", "Treat it as plain text"], ["innerHTML", "Let it create elements"]], explanation: "Treat user input as text. If rich HTML is truly needed, use a trusted sanitization process before rendering." }
];
let questionIndex = 0;
let answered = false;
const quizFeedback = $("#quizFeedback");
function renderQuestion() {
  const item = questions[questionIndex];
  answered = false;
  $("#quizQuestion").textContent = item.q;
  $("#quizCount").textContent = String(questionIndex + 1).padStart(2, "0") + " — " + String(questions.length).padStart(2, "0");
  $("#quizProgress").textContent = "QUESTION " + String(questionIndex + 1).padStart(2, "0") + " / " + String(questions.length).padStart(2, "0");
  $("#quizBar").style.width = ((questionIndex + 1) / questions.length * 100) + "%";
  quizFeedback.textContent = "";
  $("#nextQuestion").disabled = true;
  $("#nextQuestion").textContent = questionIndex === questions.length - 1 ? "Try again ↻" : "Next question →";
  const choices = $("#quizChoices");
  choices.replaceChildren();
  item.choices.forEach((choice, i) => {
    const value = choice[0] === "innerHTML" || choice[0] === "textContent" ? choice[0] : (choice[0] === "The browser parses the markup" ? "innerHTML" : choice[0] === "Treat it as plain text" ? "textContent" : choice[0]);
    const button = document.createElement("button");
    button.className = "quiz-choice";
    button.dataset.answer = value;
    const letter = document.createElement("span");
    letter.className = "choice-letter";
    letter.textContent = String.fromCharCode(65 + i);
    const label = document.createElement("span");
    const code = document.createElement("code");
    code.textContent = choice[0];
    const small = document.createElement("small");
    small.textContent = choice[1];
    label.append(code, small);
    const arrow = document.createElement("span");
    arrow.className = "choice-arrow";
    arrow.textContent = "↗";
    button.append(letter, label, arrow);
    button.addEventListener("click", () => answerQuestion(button, value));
    choices.append(button);
  });
}
function answerQuestion(button, value) {
  if (answered) return;
  answered = true;
  const item = questions[questionIndex];
  const correct = value === item.a;
  $$(".quiz-choice").forEach(choice => {
    choice.disabled = true;
    if (choice.dataset.answer === item.a) choice.classList.add("correct");
  });
  if (!correct) button.classList.add("wrong");
  quizFeedback.textContent = (correct ? "✓ Correct! " : "Not quite. ") + item.explanation;
  $("#nextQuestion").disabled = false;
  $("#nextQuestion").textContent = questionIndex === questions.length - 1 ? "Finish / restart ↻" : "Next question →";
}
$("#nextQuestion").addEventListener("click", () => {
  if (!answered) return;
  questionIndex = (questionIndex + 1) % questions.length;
  renderQuestion();
});
renderQuestion();

// Keep links and keyboard interactions accessible; all user input is displayed
// using textContent, never injected as HTML.
