// Change this if your backend runs on a different host/port.
const API_BASE = "http://127.0.0.1:8000";

const topicEl = document.getElementById("topic");
const difficultyEl = document.getElementById("difficulty");
const generateBtn = document.getElementById("generate-btn");
const generateErrorEl = document.getElementById("generate-error");

const questionPanel = document.getElementById("question-panel");
const questionTextEl = document.getElementById("question-text");
const answerEl = document.getElementById("answer");
const evaluateBtn = document.getElementById("evaluate-btn");
const evaluateErrorEl = document.getElementById("evaluate-error");

const feedbackPanel = document.getElementById("feedback-panel");
const feedbackTextEl = document.getElementById("feedback-text");
const scoreBadge = document.getElementById("score-badge");
const scoreValueEl = document.getElementById("score-value");

const loadingOverlay = document.getElementById("loading-overlay");
const loadingMessageEl = document.getElementById("loading-message");

let currentQuestion = "";

function showLoading(message) {
  loadingMessageEl.textContent = message;
  loadingOverlay.hidden = false;
}

function hideLoading() {
  loadingOverlay.hidden = true;
}

function showError(el, message) {
  el.textContent = message;
  el.hidden = false;
}

function hideError(el) {
  el.hidden = true;
}

// Pulls a score like "Score: 7/10" or "7/10" out of the feedback text, if present.
function extractScore(text) {
  const match = text.match(/(\d{1,2})\s*\/\s*10/);
  if (!match) return null;
  const value = parseInt(match[1], 10);
  return value >= 0 && value <= 10 ? value : null;
}

async function generateQuestion() {
  hideError(generateErrorEl);
  generateBtn.disabled = true;
  showLoading("Generating question...");

  try {
    const response = await fetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: topicEl.value,
        difficulty: difficultyEl.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to generate question.");
    }

    currentQuestion = data.question;
    questionTextEl.textContent = currentQuestion;
    questionPanel.hidden = false;
    feedbackPanel.hidden = true;
    answerEl.value = "";
    questionPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    showError(
      generateErrorEl,
      err.message || "Something went wrong while generating the question. Is the backend running?"
    );
  } finally {
    generateBtn.disabled = false;
    hideLoading();
  }
}

async function evaluateAnswer() {
  hideError(evaluateErrorEl);

  if (!answerEl.value.trim()) {
    showError(evaluateErrorEl, "Write an answer before submitting.");
    return;
  }

  evaluateBtn.disabled = true;
  showLoading("Evaluating your answer...");

  try {
    const response = await fetch(`${API_BASE}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: currentQuestion,
        answer: answerEl.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to evaluate answer.");
    }

    feedbackTextEl.textContent = data.feedback;

    const score = extractScore(data.feedback);
    if (score !== null) {
      scoreValueEl.textContent = score;
      scoreBadge.hidden = false;
    } else {
      scoreBadge.hidden = true;
    }

    feedbackPanel.hidden = false;
    feedbackPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    showError(
      evaluateErrorEl,
      err.message || "Something went wrong while evaluating your answer. Is the backend running?"
    );
  } finally {
    evaluateBtn.disabled = false;
    hideLoading();
  }
}

generateBtn.addEventListener("click", generateQuestion);
evaluateBtn.addEventListener("click", evaluateAnswer);
