const $ = (id) => document.getElementById(id);
const screens = [$("start-screen"), $("question-screen"), $("loading-screen"), $("result-screen")];
const dimensionOrder = ["action", "social", "mastery", "achievement", "immersion", "creativity"];
let currentQuestionId = testData.startQuestion;
let scores = {};
let history = [];
let playerName = "";
let lastResultData = null;

function freshScores(){ return Object.fromEntries(dimensionOrder.map(k=>[k,0])); }
function showScreen(target){ screens.forEach(s=>s.classList.add("hidden")); target.classList.remove("hidden"); window.scrollTo({top:0,behavior:"smooth"}); }
function resetTest(){ currentQuestionId=testData.startQuestion; scores=freshScores(); history=[]; }
function renderQuestion(){
  const q=testData.questions[currentQuestionId], step=history.length+1, total=Object.keys(testData.questions).length;
  $("progress-text").textContent=`${String(step).padStart(2,"0")} / ${String(total).padStart(2,"0")}`;
  $("progress-fill").style.width=`${((step-1)/total)*100}%`;
  $("question-label").textContent=q.label; $("question-title").textContent=q.question;
  $("back-button").disabled=history.length===0;
  const list=$("answer-list"); list.innerHTML="";
  q.answers.forEach((a,i)=>{ const b=document.createElement("button"); b.className="answer-button"; b.innerHTML=`<span class="answer-index">✦</span><span>${a.text}</span>`; b.addEventListener("click",()=>chooseAnswer(a)); list.appendChild(b); });
}
function chooseAnswer(a){
  history.push({questionId:currentQuestionId,scores:{...a.scores}});
  Object.entries(a.scores).forEach(([k,v])=>scores[k]+=v);
  if(a.next){ currentQuestionId=a.next; renderQuestion(); }
  else showLoadingThenResult();
}

const loadingFlavors = [
  { game:"UNDERTALE", text:"샌즈와 당신의 선택에 대해 토론하는 중…" },
  { game:"UNDERTALE", text:"파피루스가 아주 멋진 결과를 준비하는 중…" },
  { game:"DELTARUNE", text:"랄세이가 당신의 모험을 기록하는 중…" },
  { game:"DELTARUNE", text:"스팸톤과 최고의 결과를 협상하는 중…" },
  { game:"STARDEW VALLEY", text:"파스닙에 물을 주는 중…" },
  { game:"STARDEW VALLEY", text:"오늘의 행운을 확인하는 중…" },
  { game:"HOLLOW KNIGHT", text:"호넷에게 바느질을 배우는 중…" },
  { game:"HOLLOW KNIGHT", text:"코니퍼와 플레이 지도를 그리는 중…" }
];

function pickLoadingSequence(){
  const gameNames=[...new Set(loadingFlavors.map(x=>x.game))];
  return gameNames.map(game=>{
    const pool=loadingFlavors.filter(x=>x.game===game);
    return pool[Math.floor(Math.random()*pool.length)];
  }).sort(()=>Math.random()-.5);
}

function showLoadingThenResult(){
  const sequence=pickLoadingSequence();
  showScreen($("loading-screen"));
  const text=$("loading-text"), fill=$("loading-fill"), percent=$("loading-percent");
  let i=0;
  fill.style.width="4%"; percent.textContent="4%";
  text.textContent=sequence[0].text;
  const timer=setInterval(()=>{
    i++;
    const pct=Math.min(92, 8 + i*23);
    fill.style.width=`${pct}%`; percent.textContent=`${pct}%`;
    if(i<sequence.length){ text.textContent=sequence[i].text; }
    else {
      clearInterval(timer);
      text.textContent="당신에게 어울리는 플레이 방식을 찾았습니다.";
      fill.style.width="100%"; percent.textContent="100%";
      setTimeout(renderResult,650);
    }
  },800);
}
function goBack(){ const prev=history.pop(); if(!prev)return; Object.entries(prev.scores).forEach(([k,v])=>scores[k]-=v); currentQuestionId=prev.questionId; renderQuestion(); }
function rankedScores(){ return dimensionOrder.map(k=>[k,scores[k]]).sort((a,b)=>b[1]-a[1] || dimensionOrder.indexOf(a[0])-dimensionOrder.indexOf(b[0])); }
function comboKey(a,b){ return dimensionOrder.indexOf(a)<dimensionOrder.indexOf(b)?`${a}-${b}`:`${b}-${a}`; }
function normalizedScores(){ const max=Math.max(...dimensionOrder.map(k=>scores[k]),1); return Object.fromEntries(dimensionOrder.map(k=>[k,Math.round((scores[k]/max)*100)])); }

function polygonPoints(values,cx,cy,r){ return values.map((v,i)=>{const a=-Math.PI/2+i*Math.PI/3;const rr=r*(v/100);return `${cx+Math.cos(a)*rr},${cy+Math.sin(a)*rr}`;}).join(" "); }
function renderRadar(norm){
  const svg=$("radar-chart"), cx=210,cy=210,r=138;
  let html="";
  [20,40,60,80,100].forEach(level=>{html+=`<polygon class="radar-grid" points="${polygonPoints(Array(6).fill(level),cx,cy,r)}"></polygon>`});
  dimensionOrder.forEach((k,i)=>{const a=-Math.PI/2+i*Math.PI/3,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;html+=`<line class="radar-axis" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"></line>`});
  html+=`<polygon class="radar-value" points="${polygonPoints(dimensionOrder.map(k=>norm[k]),cx,cy,r)}"></polygon>`;
  dimensionOrder.forEach((k,i)=>{const a=-Math.PI/2+i*Math.PI/3,x=cx+Math.cos(a)*(r+38),y=cy+Math.sin(a)*(r+38);html+=`<text class="radar-label" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle">${testData.dimensions[k]} ${norm[k]}</text>`});
  svg.innerHTML=html;
}
function renderResult(){
  const ranking=rankedScores(), [primary]=ranking[0], [secondary]=ranking[1], key=comboKey(primary,secondary), combo=testData.combinations[key], norm=normalizedScores();
  $("result-player-name").textContent=`${playerName}님의 게임 동기 프로필`;
  $("result-code").textContent=`${testData.dimensions[primary]} × ${testData.dimensions[secondary]} · ${combo.game}`;
  $("result-title").textContent=combo.title;
  $("matched-character").textContent=`MATCHED CHARACTER · ${combo.character}`;
  $("result-summary").textContent=combo.description;
  $("top-motivation-copy").textContent=`${testData.dimensions[primary]} 성향과 ${testData.dimensions[secondary]} 성향이 가장 강하게 나타났습니다. ${testData.dimensionDescriptions[primary]}와 ${testData.dimensionDescriptions[secondary]}를 함께 추구하는 플레이어입니다.`;
  const kw=$("result-keywords");kw.innerHTML="";combo.keywords.forEach(x=>{const s=document.createElement("span");s.className="keyword";s.textContent=`#${x}`;kw.appendChild(s)});
  const grid=$("score-grid");grid.innerHTML="";dimensionOrder.forEach(k=>{const d=document.createElement("div");d.className="score-card panel";d.innerHTML=`<span>${testData.dimensions[k]}</span><strong>${norm[k]}</strong><div class="mini-track"><i style="width:${norm[k]}%"></i></div><small>${testData.dimensionDescriptions[k]}</small>`;grid.appendChild(d)});
  renderRadar(norm); lastResultData={ranking,primary,secondary,combo,norm}; $("save-status").textContent=""; showScreen($("result-screen"));
}

$("start-button").addEventListener("click",()=>{const v=$("nickname-input").value.trim();if(!v){$("input-message").textContent="닉네임을 입력해 주세요.";$("nickname-input").focus();return;}playerName=v;$("input-message").textContent="";resetTest();showScreen($("question-screen"));renderQuestion();});
$("restart-button").addEventListener("click",()=>{resetTest();showScreen($("start-screen"));$("nickname-input").focus();});
function restartFromBeginning(){
  resetTest();
  lastResultData=null;
  $("nickname-input").value="";
  $("input-message").textContent="";
  showScreen($("start-screen"));
  setTimeout(()=>$("nickname-input").focus(),250);
}
$("back-button").addEventListener("click",goBack);$("nickname-input").addEventListener("keydown",e=>{if(e.key==="Enter")$("start-button").click();});

function rr(ctx,x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function wrap(ctx,text,x,y,max,lineH,maxLines=99){let line="",lines=[];for(const ch of [...text]){const t=line+ch;if(ctx.measureText(t).width>max&&line){lines.push(line);line=ch;if(lines.length>=maxLines)break}else line=t}if(line&&lines.length<maxLines)lines.push(line);lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lineH));return y+lines.length*lineH}
function drawRadarCanvas(ctx,norm,cx,cy,r){
  const vals=dimensionOrder.map(k=>norm[k]);
  const pts=(arr)=>arr.map((v,i)=>{const a=-Math.PI/2+i*Math.PI/3,rr=r*v/100;return [cx+Math.cos(a)*rr,cy+Math.sin(a)*rr]});
  [20,40,60,80,100].forEach(l=>{const p=pts(Array(6).fill(l));ctx.beginPath();p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.strokeStyle="#aab7b5";ctx.lineWidth=2;ctx.stroke()});
  dimensionOrder.forEach((k,i)=>{const a=-Math.PI/2+i*Math.PI/3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.strokeStyle="#bdc6c3";ctx.lineWidth=2;ctx.stroke()});
  const p=pts(vals);ctx.beginPath();p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle="rgba(8,174,183,.22)";ctx.fill();ctx.strokeStyle="#08aeb7";ctx.lineWidth=6;ctx.stroke();
  dimensionOrder.forEach((k,i)=>{const a=-Math.PI/2+i*Math.PI/3,x=cx+Math.cos(a)*(r+68),y=cy+Math.sin(a)*(r+68);ctx.fillStyle="#063451";ctx.font="700 25px system-ui";ctx.textAlign="center";ctx.fillText(`${testData.dimensions[k]} ${norm[k]}`,x,y)});
}
async function createResultCanvas(){
  const {primary,secondary,combo,norm}=lastResultData;
  const c=document.createElement("canvas");c.width=1080;c.height=1600;const ctx=c.getContext("2d");
  ctx.fillStyle="#fff35a";ctx.fillRect(0,0,c.width,c.height);

  rr(ctx,54,50,972,1500,18,"#fffef1","#174d64");
  ctx.fillStyle="#08aeb7";ctx.fillRect(54,50,972,74);
  ctx.strokeStyle="#174d64";ctx.lineWidth=3;ctx.strokeRect(54,50,972,74);
  ctx.fillStyle="#063451";ctx.textAlign="center";ctx.font="800 27px monospace";ctx.fillText("PLAYER STATUS: SAVE FILE 001",540,96);

  ctx.textAlign="center";ctx.fillStyle="#6d8186";ctx.font="600 25px system-ui";ctx.fillText(`${playerName}님의 게임 동기 프로필`,540,170);

  rr(ctx,105,210,870,690,14,"#fffef1","#174d64");
  ctx.setLineDash([8,8]);ctx.strokeStyle="#08aeb7";ctx.lineWidth=2;ctx.strokeRect(125,230,830,650);ctx.setLineDash([]);
  ctx.fillStyle="#08aeb7";ctx.font="800 25px system-ui";ctx.fillText("PLAYER PROFILE",540,275);
  drawRadarCanvas(ctx,norm,540,510,205);
  ctx.fillStyle="#08aeb7";ctx.font="800 22px monospace";ctx.fillText(`${testData.dimensions[primary]} × ${testData.dimensions[secondary]} · ${combo.game}`,540,780);
  ctx.fillStyle="#063451";ctx.font="900 46px system-ui";wrap(ctx,combo.title,540,835,700,56,2);
  ctx.fillStyle="#6d8186";ctx.font="700 23px system-ui";ctx.fillText(`MATCHED CHARACTER · ${combo.character}`,540,925);

  ctx.textAlign="left";ctx.fillStyle="#063451";ctx.font="800 22px Georgia,serif";ctx.fillText("TOP MOTIVATIONS",105,985);
  ctx.fillStyle="#5f747a";ctx.font="500 23px system-ui";wrap(ctx,combo.description,105,1035,870,36,4);

  dimensionOrder.forEach((k,i)=>{
    const col=i%2,row=Math.floor(i/2),x=105+col*455,y=1185+row*115;
    ctx.fillStyle="#fffef1";ctx.fillRect(x,y,415,90);ctx.strokeStyle="#174d64";ctx.lineWidth=2;ctx.strokeRect(x,y,415,90);
    ctx.fillStyle="#063451";ctx.font="italic 800 22px Georgia,serif";ctx.textAlign="left";ctx.fillText(testData.dimensions[k],x+18,y+30);
    ctx.textAlign="right";ctx.font="700 18px monospace";ctx.fillText(norm[k],x+397,y+30);
    rr(ctx,x+18,y+42,379,16,6,"#fffef1","#174d64");rr(ctx,x+22,y+46,(371*norm[k])/100,8,4,"#063451");
    ctx.textAlign="left";ctx.fillStyle="#70848a";ctx.font="500 14px system-ui";ctx.fillText(testData.dimensionDescriptions[k],x+18,y+76);
  });

  ctx.textAlign="center";ctx.fillStyle="#063451";ctx.font="700 20px system-ui";ctx.fillText(combo.keywords.map(k=>`#${k}`).join("   "),540,1510);
  return c;
}
$("save-image-button").addEventListener("click",async()=>{const b=$("save-image-button"),s=$("save-status");b.disabled=true;b.textContent="이미지 생성 중…";try{const c=await createResultCanvas(),blob=await new Promise(r=>c.toBlob(r,"image/png")),safe=playerName.replace(/[\\/:*?\"<>|]/g,"_"),name=`${safe}-플레이어-스테이터스.png`,file=new File([blob],name,{type:"image/png"});if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({title:`${playerName}님의 플레이어 스테이터스`,files:[file]});s.textContent="결과 이미지를 공유했습니다.";return}catch(e){if(e.name==="AbortError")return}}const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);s.textContent="PNG 결과 이미지를 저장했습니다."}catch(e){console.error(e);s.textContent="이미지를 생성하지 못했습니다."}finally{b.disabled=false;b.textContent="결과 이미지 저장하기"}});
