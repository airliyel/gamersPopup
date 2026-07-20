const testData = {
  questions: [
    {
      id: "q1",
      question: "낯선 게임 세계에 도착했습니다. 가장 먼저 하는 행동은?",
      answers: [
        { text: "주변 지형과 숨겨진 길을 살펴본다.", scores: { exploration: 3, challenge: 1 } },
        { text: "가장 가까운 NPC에게 말을 건다.", scores: { narrative: 2, relationship: 2 } },
        { text: "퀘스트와 성장 방법부터 확인한다.", scores: { growth: 3, challenge: 1 } },
        { text: "위험해 보이는 장소로 바로 들어간다.", scores: { challenge: 3, experimentation: 1 } }
      ]
    },
    {
      id: "q2",
      question: "강한 보스에게 여러 번 패배했습니다. 당신의 다음 선택은?",
      answers: [
        { text: "패턴을 분석하며 계속 도전한다.", scores: { challenge: 3, growth: 1 } },
        { text: "장비와 능력을 키운 뒤 다시 온다.", scores: { growth: 3, challenge: 1 } },
        { text: "다른 길이나 우회 방법을 찾아본다.", scores: { exploration: 2, experimentation: 2 } },
        { text: "보스와 관련된 이야기나 설정을 찾아본다.", scores: { narrative: 3, relationship: 1 } }
      ]
    },
    {
      id: "q3",
      question: "게임에서 가장 오래 기억에 남는 순간은?",
      answers: [
        { text: "어려운 보스를 처음 쓰러뜨린 순간", scores: { challenge: 3, growth: 1 } },
        { text: "좋아하는 캐릭터와의 대화", scores: { relationship: 3, narrative: 1 } },
        { text: "우연히 발견한 숨겨진 장소", scores: { exploration: 3, experimentation: 1 } },
        { text: "나만의 방식으로 만든 결과물", scores: { experimentation: 2, growth: 2 } }
      ]
    },
    {
      id: "q4",
      question: "게임에서 선택지가 주어진다면 어떤 선택을 하나요?",
      answers: [
        { text: "가장 옳다고 느껴지는 선택", scores: { narrative: 2, relationship: 2 } },
        { text: "결과가 가장 궁금한 선택", scores: { experimentation: 3, exploration: 1 } },
        { text: "보상이 가장 좋은 선택", scores: { growth: 3, challenge: 1 } },
        { text: "평소의 나와 다른 선택", scores: { experimentation: 2, narrative: 2 } }
      ]
    },
    {
      id: "q5",
      question: "게임 속에서 가장 중요하다고 생각하는 것은?",
      answers: [
        { text: "실력이 늘고 있다는 감각", scores: { challenge: 2, growth: 2 } },
        { text: "세계와 이야기에 몰입하는 경험", scores: { narrative: 3, exploration: 1 } },
        { text: "캐릭터와 관계를 쌓는 과정", scores: { relationship: 3, narrative: 1 } },
        { text: "정해진 답 없이 자유롭게 시도하는 것", scores: { experimentation: 3, exploration: 1 } }
      ]
    }
  ],
  results: {
    challenge: {
      emoji: "⚔️",
      title: "끝까지 해내는 도전가",
      summary: "실패를 피하기보다 그 안에서 규칙을 찾아내는 타입입니다. 어려운 순간일수록 더 강한 성취감을 느낍니다.",
      keywords: ["도전", "숙련", "성취", "집중"],
      games: ["Hollow Knight", "DELTARUNE"]
    },
    exploration: {
      emoji: "🧭",
      title: "길을 잃어도 즐거운 탐험가",
      summary: "정해진 목적지보다 우연히 발견한 장소와 숨겨진 이야기에 더 끌립니다. 샛길도 하나의 중요한 경험입니다.",
      keywords: ["탐험", "발견", "세계관", "비밀"],
      games: ["Hollow Knight", "Stardew Valley"]
    },
    narrative: {
      emoji: "📖",
      title: "이야기를 따라 걷는 관찰자",
      summary: "전투나 보상보다 캐릭터의 감정과 세계의 맥락을 중요하게 생각합니다. 선택의 의미를 오래 곱씹는 편입니다.",
      keywords: ["서사", "선택", "감정", "몰입"],
      games: ["UNDERTALE", "DELTARUNE"]
    },
    relationship: {
      emoji: "💬",
      title: "마음을 연결하는 관계형 플레이어",
      summary: "게임 속 인물과 관계를 맺고 공동체를 만들어 가는 과정에서 가장 큰 즐거움을 느낍니다.",
      keywords: ["관계", "대화", "공감", "공동체"],
      games: ["Stardew Valley", "UNDERTALE"]
    },
    growth: {
      emoji: "🌱",
      title: "차근차근 쌓아 올리는 성장가",
      summary: "작은 성장을 반복해 더 나은 상태에 도달하는 과정을 좋아합니다. 목표와 진척도가 분명할수록 몰입이 커집니다.",
      keywords: ["성장", "수집", "계획", "효율"],
      games: ["Stardew Valley", "Hollow Knight"]
    },
    experimentation: {
      emoji: "✨",
      title: "정답 밖을 걷는 실험가",
      summary: "정해진 방식보다 나만의 방법을 찾는 데 재미를 느낍니다. 예상 밖의 선택과 새로운 조합을 즐기는 타입입니다.",
      keywords: ["실험", "자유", "창의", "변주"],
      games: ["UNDERTALE", "Stardew Valley"]
    }
  }
};
