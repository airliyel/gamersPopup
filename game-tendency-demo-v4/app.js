const $ = (id) => document.getElementById(id);
const screens = [$("start-screen"), $("question-screen"), $("result-screen")];

let currentQuestionId = testData.startQuestion;
let scores = {};
let history = [];
let playerName = "";
let lastResultData = null;

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

  const combinedTitle = `${secondary.typeAdjective} ${result.typeNoun}`;
  const characterImage = $("result-character-image");
  characterImage.src = result.character.image;
  characterImage.alt = `${result.character.name} 성향을 상징하는 캐릭터 일러스트`;
  characterImage.onerror = () => {
    characterImage.style.display = "none";
    characterImage.parentElement.classList.add("image-missing");
  };

  $("result-character-name").textContent = result.character.name;
  $("result-code").textContent = `${result.code} · ${secondary.character.name} SUB TYPE`;
  $("result-title").textContent = combinedTitle;
  $("result-catchphrase").textContent = result.catchphrase;
  $("result-summary").textContent = result.summary;
  $("result-quote").textContent = `“${result.quote}”`;
  $("character-pair").innerHTML = `
    <span class="character-chip">주특성 <strong>${result.character.name}</strong></span>
    <span class="character-chip">부특성 <strong>${secondary.character.name}</strong></span>`;

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

  $("result-player-name").textContent = `${playerName}님의 게임 성향`;
  lastResultData = { ranking, primaryType, secondaryType, result, secondary, combinedTitle, maxScore };
  $("save-status").textContent = "";
  showScreen($("result-screen"));
}

$("start-button").addEventListener("click", () => {
  const input = $("nickname-input");
  const value = input.value.trim();
  if (!value) {
    $("input-message").textContent = "닉네임을 입력해 주세요.";
    input.focus();
    return;
  }
  playerName = value;
  $("input-message").textContent = "";
  resetTest();
  showScreen($("question-screen"));
  renderQuestion();
});
$("restart-button").addEventListener("click", () => {
  resetTest();
  showScreen($("start-screen"));
  $("nickname-input").focus();
});
$("back-button").addEventListener("click", goBack);


$("nickname-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") $("start-button").click();
});

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = Infinity) {
  const chars = [...text];
  let line = "";
  const lines = [];
  for (const char of chars) {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = char;
      if (lines.length >= maxLines) break;
    } else {
      line = test;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  lines.forEach((item, index) => ctx.fillText(item, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

function loadCanvasImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function createResultCanvas() {
  if (!lastResultData) throw new Error("결과 데이터가 없습니다.");
  const { ranking, result, secondary, combinedTitle, maxScore } = lastResultData;
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");

  const bg = ctx.createLinearGradient(0, 0, 1080, 1350);
  bg.addColorStop(0, "#17141f");
  bg.addColorStop(1, "#0d0c11");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(118,78,255,.16)";
  ctx.beginPath(); ctx.arc(130, 120, 250, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(227,255,98,.08)";
  ctx.beginPath(); ctx.arc(990, 1220, 300, 0, Math.PI * 2); ctx.fill();

  roundRect(ctx, 52, 52, 976, 1246, 34, "rgba(27,25,34,.97)", "#3a3544");

  ctx.textAlign = "left";
  ctx.fillStyle = "#e3ff62";
  ctx.font = "800 24px system-ui, sans-serif";
  ctx.fillText("FANGAMER POP-UP · SAVE FILE 001", 92, 104);
  ctx.textAlign = "right";
  ctx.fillStyle = "#aaa4b5";
  ctx.font = "700 22px system-ui, sans-serif";
  ctx.fillText(playerName, 988, 104);

  roundRect(ctx, 92, 146, 330, 420, 26, "#25222e", "#3a3544");
  try {
    const character = await loadCanvasImage(result.character.image);
    const ratio = Math.min(290 / character.width, 350 / character.height);
    const w = character.width * ratio;
    const h = character.height * ratio;
    ctx.drawImage(character, 257 - w / 2, 172 + (350 - h) / 2, w, h);
  } catch (_) {
    ctx.fillStyle = "#e3ff62";
    ctx.font = "800 96px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✦", 257, 370);
  }
  ctx.textAlign = "center";
  ctx.fillStyle = "#aaa4b5";
  ctx.font = "700 19px system-ui, sans-serif";
  ctx.fillText(`MATCHED · ${result.character.name}`, 257, 535);

  ctx.textAlign = "left";
  ctx.fillStyle = "#e3ff62";
  ctx.font = "800 21px system-ui, sans-serif";
  ctx.fillText(`${result.code} · ${secondary.character.name} SUB TYPE`, 470, 185);
  ctx.fillStyle = "#f6f3fa";
  ctx.font = "900 54px system-ui, sans-serif";
  let nextY = wrapText(ctx, combinedTitle, 470, 250, 500, 65, 3);
  ctx.fillStyle = "#e3ff62";
  ctx.fillRect(470, nextY + 12, 4, 116);
  ctx.fillStyle = "#f6f3fa";
  ctx.font = "700 28px system-ui, sans-serif";
  nextY = wrapText(ctx, `“${result.quote}”`, 496, nextY + 44, 460, 43, 4);

  roundRect(ctx, 470, Math.max(nextY + 24, 470), 225, 54, 27, "#302c39", "#3a3544");
  roundRect(ctx, 712, Math.max(nextY + 24, 470), 225, 54, 27, "#302c39", "#3a3544");
  ctx.font = "700 19px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#f6f3fa";
  const chipY = Math.max(nextY + 58, 504);
  ctx.fillText(`주특성 · ${result.character.name}`, 582, chipY);
  ctx.fillText(`부특성 · ${secondary.character.name}`, 824, chipY);

  ctx.strokeStyle = "#3a3544"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(92, 610); ctx.lineTo(988, 610); ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#f6f3fa";
  ctx.font = "800 30px system-ui, sans-serif";
  ctx.fillText(result.catchphrase, 540, 672);
  ctx.fillStyle = "#aaa4b5";
  ctx.font = "500 24px system-ui, sans-serif";
  wrapText(ctx, result.summary, 540, 720, 790, 39, 5);

  ctx.textAlign = "left";
  ctx.fillStyle = "#e3ff62";
  ctx.font = "800 20px system-ui, sans-serif";
  ctx.fillText("MY PLAY STYLE", 112, 915);
  const topTraits = ranking.slice(0, 4);
  topTraits.forEach(([type, score], index) => {
    const y = 960 + index * 70;
    ctx.fillStyle = "#f6f3fa";
    ctx.font = "700 21px system-ui, sans-serif";
    ctx.fillText(testData.dimensions[type], 112, y);
    ctx.textAlign = "right";
    ctx.fillStyle = "#aaa4b5";
    ctx.fillText(String(score), 968, y);
    ctx.textAlign = "left";
    roundRect(ctx, 112, y + 16, 856, 12, 6, "#403a49");
    roundRect(ctx, 112, y + 16, 856 * (score / maxScore), 12, 6, "#e3ff62");
  });

  ctx.fillStyle = "#aaa4b5";
  ctx.font = "600 19px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(result.keywords.map((item) => `#${item}`).join("   "), 540, 1260);
  ctx.fillStyle = "#777180";
  ctx.font = "500 16px system-ui, sans-serif";
  ctx.fillText("본 결과는 팝업 체험을 위한 게임 성향 콘텐츠입니다.", 540, 1286);
  return canvas;
}

$("save-image-button").addEventListener("click", async () => {
  const button = $("save-image-button");
  const status = $("save-status");
  button.disabled = true;
  button.textContent = "이미지 생성 중…";
  status.textContent = "";
  try {
    const canvas = await createResultCanvas();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    const safeName = playerName.replace(/[\\/:*?\"<>|]/g, "_");
    const fileName = `${safeName}-게임-성향.png`;
    const file = new File([blob], fileName, { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ title: `${playerName}님의 게임 성향`, files: [file] });
        status.textContent = "결과 이미지를 공유했습니다.";
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = "PNG 결과 이미지를 저장했습니다.";
  } catch (error) {
    console.error(error);
    status.textContent = "이미지를 생성하지 못했습니다. 다른 브라우저에서 다시 시도해 주세요.";
  } finally {
    button.disabled = false;
    button.textContent = "결과 이미지 저장하기";
  }
});
