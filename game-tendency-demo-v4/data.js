const testData = {
  dimensions: {
    challenge: "도전",
    exploration: "탐험",
    narrative: "서사",
    relationship: "관계",
    growth: "성장",
    experimentation: "실험"
  },
  startQuestion: "q1",
  questions: {
    q1: {
      label: "SCENE 01 · FIRST STEP",
      question: "처음 보는 게임을 시작했습니다. 가장 먼저 마음이 가는 곳은?",
      answers: [
        { text: "지도 끝에 보이는 수상한 길", scores: { exploration: 3, experimentation: 1 }, next: "q2a" },
        { text: "이야기를 시작할 것 같은 NPC", scores: { relationship: 2, narrative: 2 }, next: "q2b" },
        { text: "장비와 스킬을 확인할 수 있는 메뉴", scores: { growth: 3, challenge: 1 }, next: "q2a" },
        { text: "당장 싸워볼 수 있는 가장 강한 적", scores: { challenge: 3, experimentation: 1 }, next: "q2b" }
      ]
    },
    q2a: {
      label: "SCENE 02 · DISCOVERY",
      question: "샛길 끝에서 용도를 알 수 없는 아이템을 발견했습니다.",
      answers: [
        { text: "어디에 쓰이는지 주변을 더 뒤져본다.", scores: { exploration: 3, narrative: 1 }, next: "q3" },
        { text: "일단 여러 곳에 사용해 보며 실험한다.", scores: { experimentation: 3, challenge: 1 }, next: "q3" },
        { text: "나중을 위해 챙겨두고 원래 목표로 돌아간다.", scores: { growth: 2, exploration: 1 }, next: "q3" },
        { text: "설명문과 관련 인물의 반응부터 확인한다.", scores: { narrative: 2, relationship: 2 }, next: "q3" }
      ]
    },
    q2b: {
      label: "SCENE 02 · ENCOUNTER",
      question: "처음 만난 인물이 당신에게 의미심장한 말을 남깁니다.",
      answers: [
        { text: "대사를 다시 떠올리며 숨은 의미를 생각한다.", scores: { narrative: 3, exploration: 1 }, next: "q3" },
        { text: "다시 찾아가 다른 대화가 열리는지 확인한다.", scores: { relationship: 3, narrative: 1 }, next: "q3" },
        { text: "그 말이 공략에 어떤 영향을 주는지 판단한다.", scores: { growth: 2, challenge: 2 }, next: "q3" },
        { text: "일부러 반대 행동을 해 반응을 보고 싶다.", scores: { experimentation: 3, narrative: 1 }, next: "q3" }
      ]
    },
    q3: {
      label: "SCENE 03 · FAILURE",
      question: "같은 보스에게 다섯 번째로 패배했습니다. 다음 행동은?",
      answers: [
        { text: "공격 패턴을 한 번 더 관찰하고 바로 재도전한다.", scores: { challenge: 3, growth: 1 }, next: "q4" },
        { text: "장비와 능력을 정비한 뒤 다시 돌아온다.", scores: { growth: 3, challenge: 1 }, next: "q4" },
        { text: "혹시 싸우지 않는 방법이 있는지 찾아본다.", scores: { experimentation: 2, exploration: 2 }, next: "q4" },
        { text: "이 보스가 왜 싸우는지부터 궁금해진다.", scores: { narrative: 3, relationship: 1 }, next: "q4" }
      ]
    },
    q4: {
      label: "SCENE 04 · CHOICE",
      question: "중요한 선택지가 나타났지만 결과는 알 수 없습니다.",
      answers: [
        { text: "내가 옳다고 느끼는 선택을 한다.", scores: { relationship: 2, narrative: 2 }, next: "q5" },
        { text: "가장 예상 밖의 결과가 나올 선택을 한다.", scores: { experimentation: 3, narrative: 1 }, next: "q5" },
        { text: "지금까지 모은 정보로 가장 유리한 선택을 한다.", scores: { growth: 3, challenge: 1 }, next: "q5" },
        { text: "선택 전 주변과 인물들을 더 조사한다.", scores: { exploration: 2, narrative: 2 }, next: "q5" }
      ]
    },
    q5: {
      label: "SCENE 05 · FREE TIME",
      question: "메인 목표를 잠시 미뤄도 되는 자유 시간이 생겼습니다.",
      answers: [
        { text: "아직 가지 않은 지역을 모두 돌아본다.", scores: { exploration: 3, experimentation: 1 }, next: "q6" },
        { text: "마음에 든 인물들의 일상을 찾아간다.", scores: { relationship: 3, narrative: 1 }, next: "q6" },
        { text: "재료를 모으고 장비와 공간을 정리한다.", scores: { growth: 3, challenge: 1 }, next: "q6" },
        { text: "평소 하지 않던 행동과 조합을 시험한다.", scores: { experimentation: 3, exploration: 1 }, next: "q6" }
      ]
    },
    q6: {
      label: "SCENE 06 · MEMORY",
      question: "게임을 다 끝낸 뒤 가장 오래 남는 장면은?",
      answers: [
        { text: "몇 시간 끝에 어려운 구간을 돌파한 순간", scores: { challenge: 3, growth: 1 }, next: "q7" },
        { text: "나만 알고 싶은 숨겨진 장소를 발견한 순간", scores: { exploration: 3, narrative: 1 }, next: "q7" },
        { text: "한 인물과의 관계가 달라진 순간", scores: { relationship: 3, narrative: 1 }, next: "q7" },
        { text: "내 선택으로 예상 못 한 장면이 열린 순간", scores: { experimentation: 2, narrative: 2 }, next: "q7" }
      ]
    },
    q7: {
      label: "SCENE 07 · MY WAY",
      question: "친구가 '그렇게 플레이하면 손해'라고 말합니다.",
      answers: [
        { text: "그래도 내가 즐거운 방식으로 계속한다.", scores: { experimentation: 3, relationship: 1 }, next: "q8" },
        { text: "효율적인 방법을 배우고 더 잘해 본다.", scores: { growth: 3, challenge: 1 }, next: "q8" },
        { text: "그 방식에서 놓치는 것이 없는지 비교해 본다.", scores: { exploration: 2, growth: 2 }, next: "q8" },
        { text: "친구가 왜 그 방식을 좋아하는지 이야기해 본다.", scores: { relationship: 3, narrative: 1 }, next: "q8" }
      ]
    },
    q8: {
      label: "SCENE 08 · ONE MORE GAME",
      question: "새 게임을 다시 켜게 만드는 가장 강한 이유는?",
      answers: [
        { text: "아직 넘지 못한 도전이 남아 있어서", scores: { challenge: 3, growth: 1 }, next: null },
        { text: "아직 발견하지 못한 장소와 비밀이 있어서", scores: { exploration: 3, experimentation: 1 }, next: null },
        { text: "다른 선택과 이야기를 확인하고 싶어서", scores: { narrative: 2, experimentation: 2 }, next: null },
        { text: "그 세계의 인물들이 다시 보고 싶어서", scores: { relationship: 3, narrative: 1 }, next: null }
      ]
    }
  },
  results: {
    challenge: {
      character: { name: "호넷", image: "assets/characters/hornet.svg" },
      typeNoun: "도전가",
      typeAdjective: "도전적인",
      code: "TYPE 01 · CHALLENGER",
      emoji: "⚔️",
      title: "끝을 볼 때까지, 도전가",
      catchphrase: "실패는 멈추라는 신호가 아니라, 다음 시도를 위한 단서입니다.",
      summary: "어려운 구간을 스스로 이해하고 돌파하는 과정에서 가장 큰 재미를 느낍니다. 남들이 지나친 작은 변화도 읽어내며, 어제의 나보다 한 단계 나아지는 순간을 기억합니다.",
      secondary: "당신의 끈기는 다른 성향과 만나 더 선명해집니다.",
      keywords: ["집중", "숙련", "재도전", "성취"],
      quote: "한 번만 더. 이번에는 분명 다르게 할 수 있어.",
      games: [
        { title: "Hollow Knight", reason: "패턴을 익히고 스스로 길을 돌파하는 성취" },
        { title: "Hollow Knight: Silksong", reason: "더 빠르고 유연한 움직임으로 마주하는 새로운 도전" }
      ]
    },
    exploration: {
      character: { name: "기사", image: "assets/characters/knight.svg" },
      typeNoun: "모험가",
      typeAdjective: "모험적인",
      code: "TYPE 02 · EXPLORER",
      emoji: "🧭",
      title: "길을 잃어도 좋은, 탐험가",
      catchphrase: "목적지보다 그곳까지 가는 동안 발견한 것들이 더 중요합니다.",
      summary: "지도에 표시되지 않은 장소, 설명되지 않은 흔적, 우연히 만난 장면에 끌립니다. 누가 알려준 정답보다 직접 발견한 작은 비밀을 오래 기억하는 플레이어입니다.",
      secondary: "당신의 호기심은 다른 성향을 만날 때 새로운 이야기가 됩니다.",
      keywords: ["탐험", "발견", "샛길", "세계관"],
      quote: "여긴 굳이 갈 필요가 없다고? 그래서 더 가보고 싶어.",
      games: [
        { title: "Hollow Knight", reason: "헤매는 과정 자체가 보상이 되는 세계" },
        { title: "Stardew Valley", reason: "계절과 장소마다 천천히 발견하는 작은 변화" }
      ]
    },
    narrative: {
      character: { name: "프리스크", image: "assets/characters/frisk.svg" },
      typeNoun: "스토리텔러",
      typeAdjective: "서사적인",
      code: "TYPE 03 · STORY SEEKER",
      emoji: "📖",
      title: "선택의 의미를 찾는, 이야기 수집가",
      catchphrase: "당신에게 좋은 게임은 엔딩 뒤에도 생각이 이어지는 게임입니다.",
      summary: "대사의 뉘앙스와 선택의 여운, 세계에 남겨진 흔적을 세심하게 읽습니다. 무슨 일이 일어났는지뿐 아니라 왜 그런 일이 일어났는지를 궁금해합니다.",
      secondary: "당신의 해석은 함께 드러난 보조성향에 따라 다른 결을 갖습니다.",
      keywords: ["서사", "선택", "감정", "여운"],
      quote: "그때 다른 말을 골랐다면, 이 이야기는 어떻게 달라졌을까?",
      games: [
        { title: "UNDERTALE", reason: "행동과 선택을 끝까지 기억하는 이야기" },
        { title: "DELTARUNE", reason: "정해진 운명과 선택 사이에서 생기는 질문" }
      ]
    },
    relationship: {
      character: { name: "루이스", image: "assets/characters/lewis.svg" },
      typeNoun: "관계가",
      typeAdjective: "관계 중심의",
      code: "TYPE 04 · HEART KEEPER",
      emoji: "💬",
      title: "세계보다 사람을 기억하는, 관계 수집가",
      catchphrase: "게임이 끝나도 그 안에서 만난 인물들은 쉽게 떠나지 않습니다.",
      summary: "캐릭터와 대화하고 관계가 변하는 과정에서 깊은 몰입을 느낍니다. 효율적인 선택보다 마음이 가는 선택을 하며, 작은 반응의 변화도 소중하게 받아들입니다.",
      secondary: "당신의 공감은 보조성향과 만나 플레이의 방향을 정합니다.",
      keywords: ["관계", "대화", "공감", "기억"],
      quote: "보상은 없어도 괜찮아. 그냥 이 사람이 어떻게 지내는지 궁금해.",
      games: [
        { title: "Stardew Valley", reason: "일상 속 대화와 관계가 천천히 쌓이는 마을" },
        { title: "UNDERTALE", reason: "적조차 하나의 인물로 기억하게 만드는 만남" }
      ]
    },
    growth: {
      character: { name: "수지", image: "assets/characters/susie.svg" },
      typeNoun: "성장가",
      typeAdjective: "성장하는",
      code: "TYPE 05 · BUILDER",
      emoji: "🌱",
      title: "오늘을 쌓아 내일을 만드는, 성장 설계자",
      catchphrase: "작은 진전이 반복될 때, 게임의 세계는 나만의 것으로 바뀝니다.",
      summary: "수집하고 정리하고 발전시키는 흐름을 즐깁니다. 목표가 보이면 자연스럽게 다음 단계를 계획하며, 처음과 달라진 나의 상태를 확인할 때 큰 만족을 느낍니다.",
      secondary: "당신의 계획은 보조성향에 따라 도전이나 관계, 탐험으로 이어집니다.",
      keywords: ["성장", "수집", "계획", "완성"],
      quote: "조금씩 쌓이면 결국 내가 원하는 모습이 될 거야.",
      games: [
        { title: "Stardew Valley", reason: "하루씩 쌓아 완성하는 농장과 생활" },
        { title: "Hollow Knight", reason: "능력과 이해가 함께 넓혀 가는 탐험 범위" }
      ]
    },
    experimentation: {
      character: { name: "크리스", image: "assets/characters/kris.svg" },
      typeNoun: "자유가",
      typeAdjective: "자유로운",
      code: "TYPE 06 · WILD CARD",
      emoji: "✨",
      title: "정답 밖에서 노는, 자유 실험가",
      catchphrase: "누군가 만든 길보다 내가 발견한 방법이 더 재미있습니다.",
      summary: "정해진 공략을 그대로 따르기보다 새로운 조합과 예상 밖의 선택을 시험합니다. 실패하더라도 새로운 반응을 발견했다면 충분히 가치 있는 플레이였다고 느낍니다.",
      secondary: "당신의 자유로움은 보조성향과 만나 호기심이나 이야기로 확장됩니다.",
      keywords: ["실험", "자유", "변주", "호기심"],
      quote: "이게 될 것 같지는 않지만, 그래서 한번 해보고 싶어.",
      games: [
        { title: "UNDERTALE", reason: "당연한 RPG의 규칙을 다른 방식으로 시험하는 선택" },
        { title: "DELTARUNE", reason: "행동과 반응 사이의 미묘한 차이를 찾아보는 재미" }
      ]
    }
  }
};
