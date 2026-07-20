const $ = (id) => document.getElementById(id);
const screens = [$("start-screen"), $("question-screen"), $("result-screen")];

let currentQuestionId = testData.startQuestion;
let scores = {};
let history = [];

function freshScores() {
  return Object.fromEntries(Object.keys(testData.dimensions).map((key) => [key, 0]));
}

function showScreen(target) {
  screens.forEach((screen) => screen.classList.add("hidden"));
  target.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetTest() {
  currentQuestionId = testData.startQuestion;
  scores = freshScores();
  history = [];
}

function renderQuestion() {
  const question = testData.questions[currentQuestionId];
  const step = history.length + 1;
  const total = 8;

  $("progress-text").textContent = `${String(step).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  $("progress-fill").style.width = `${(step / total) * 100}%`;
  $("question-label").textContent = question.label;
  $("question-title").textContent = question.question;
  $("back-button").classList.toggle("invisible", history.length === 0);

  const list = $("answer-list");
  list.innerHTML = "";
  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.innerHTML = `<span class="answer-index">${String.fromCharCode(65 + index)}</span><span>${answer.text}</span>`;
    button.addEventListener("click", () => chooseAnswer(answer));
    list.appendChild(button);
  });
}

function chooseAnswer(answer) {
  history.push({ questionId: currentQuestionId, scores: { ...answer.scores } });
  Object.entries(answer.scores).forEach(([type, value]) => scores[type] += value);

  if (answer.next) {
    currentQuestionId = answer.next;
    renderQuestion();
  } else {
    renderResult();
  }
}

function goBack() {
  const previous = history.pop();
  if (!previous) return;
  Object.entries(previous.scores).forEach(([type, value]) => scores[type] -= value);
  currentQuestionId = previous.questionId;
  renderQuestion();
}

function rankedScores() {
  return Object.entries(scores).sort((a, b) => b[1] - a[1]);
}

function renderResult() {
  const ranking = rankedScores();
  const [primaryType, primaryScore] = ranking[0];
  const [secondaryType] = ranking[1];
  const result = testData.results[primaryType];
  const secondary = testData.results[secondaryType];
  const maxScore = Math.max(...ranking.map(([, score]) => score), 1);

  $("result-emoji").textContent = result.emoji;
  $("result-code").textContent = result.code;
  $("result-title").textContent = result.title;
  $("result-catchphrase").textContent = result.catchphrase;
  $("result-summary").textContent = result.summary;
  $("result-quote").textContent = `“${result.quote}”`;

  $("secondary-title").textContent = secondary.title;
  $("secondary-summary").textContent = `${secondary.catchphrase} ${result.secondary}`;

  const bars = $("trait-bars");
  bars.innerHTML = "";
  ranking.forEach(([type, score]) => {
    const percent = Math.round((score / maxScore) * 100);
    const row = document.createElement("div");
    row.className = "trait-row";
    row.innerHTML = `
      <div class="trait-meta"><span>${testData.dimensions[type]}</span><strong>${score}</strong></div>
      <div class="trait-track"><div class="trait-fill" style="width:${percent}%"></div></div>`;
    bars.appendChild(row);
  });

  const keywordContainer = $("result-keywords");
  keywordContainer.innerHTML = "";
  result.keywords.forEach((keyword) => {
    const span = document.createElement("span");
    span.className = "keyword";
    span.textContent = `#${keyword}`;
    keywordContainer.appendChild(span);
  });

  const gameContainer = $("result-games");
  gameContainer.innerHTML = "";
  result.games.forEach((game, index) => {
    const card = document.createElement("article");
    card.className = "game-card";
    card.innerHTML = `<span>0${index + 1}</span><div><strong>${game.title}</strong><p>${game.reason}</p></div>`;
    gameContainer.appendChild(card);
  });

  showScreen($("result-screen"));
}

$("start-button").addEventListener("click", () => {
  resetTest();
  showScreen($("question-screen"));
  renderQuestion();
});
$("restart-button").addEventListener("click", () => {
  resetTest();
  showScreen($("question-screen"));
  renderQuestion();
});
$("back-button").addEventListener("click", goBack);
