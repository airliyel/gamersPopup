const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const questionTitle = document.getElementById("question-title");
const answerList = document.getElementById("answer-list");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

let currentQuestionIndex = 0;
let scores = {};

function resetTest() {
  currentQuestionIndex = 0;
  scores = {
    challenge: 0,
    exploration: 0,
    narrative: 0,
    relationship: 0,
    growth: 0,
    experimentation: 0
  };
}

function showScreen(screen) {
  [startScreen, questionScreen, resultScreen].forEach((element) => {
    element.classList.add("hidden");
  });
  screen.classList.remove("hidden");
}

function renderQuestion() {
  const question = testData.questions[currentQuestionIndex];
  const total = testData.questions.length;

  questionTitle.textContent = question.question;
  progressText.textContent = `${currentQuestionIndex + 1} / ${total}`;
  progressFill.style.width = `${((currentQuestionIndex + 1) / total) * 100}%`;

  answerList.innerHTML = "";

  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.textContent = answer.text;
    button.addEventListener("click", () => selectAnswer(answer));
    answerList.appendChild(button);
  });
}

function selectAnswer(answer) {
  Object.entries(answer.scores).forEach(([type, value]) => {
    scores[type] += value;
  });

  currentQuestionIndex += 1;

  if (currentQuestionIndex < testData.questions.length) {
    renderQuestion();
  } else {
    renderResult();
  }
}

function renderResult() {
  const resultType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const result = testData.results[resultType];

  document.getElementById("result-emoji").textContent = result.emoji;
  document.getElementById("result-title").textContent = result.title;
  document.getElementById("result-summary").textContent = result.summary;

  const keywordContainer = document.getElementById("result-keywords");
  keywordContainer.innerHTML = "";
  result.keywords.forEach((keyword) => {
    const span = document.createElement("span");
    span.className = "keyword";
    span.textContent = keyword;
    keywordContainer.appendChild(span);
  });

  const gameList = document.getElementById("result-games");
  gameList.innerHTML = "";
  result.games.forEach((game) => {
    const item = document.createElement("li");
    item.textContent = game;
    gameList.appendChild(item);
  });

  showScreen(resultScreen);
}

startButton.addEventListener("click", () => {
  resetTest();
  showScreen(questionScreen);
  renderQuestion();
});

restartButton.addEventListener("click", () => {
  resetTest();
  showScreen(questionScreen);
  renderQuestion();
});
