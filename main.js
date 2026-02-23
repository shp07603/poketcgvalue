// ── CONSTANTS ──
const QUESTIONS = [
  {
    id: "mood",
    emoji: "🌙",
    question: "지금 이 순간, 당신의 마음은?",
    subtitle: "지금 당신에게 어울리는 감정을 골라보세요",
    options: [
      { label: "🔥 뜨겁고 격렬하게", value: "Action", desc: "심장이 두근거리는 강렬함" },
      { label: "😂 유쾌하고 가볍게", value: "Comedy", desc: "웃음과 설렘이 가득한" },
      { label: "💭 조용히 생각에 잠기고 싶어", value: "Drama", desc: "철학적이고 깊은 이야기" },
      { label: "🌸 따뜻하고 감성적으로", value: "Romance", desc: "마음을 울리는 감동" },
    ],
  },
  {
    id: "world",
    emoji: "🗺️",
    question: "어떤 세계로 떠나고 싶나요?",
    subtitle: "내가 살고 싶은 애니의 배경",
    options: [
      { label: "⚔️ 마법과 모험의 판타지", value: "Fantasy", desc: "용사, 마법사, 다른 세계" },
      { label: "🚀 미래와 기술의 SF", value: "Sci-Fi", desc: "우주, 로봇, 디스토피아" },
      { label: "🏫 현실 속 일상", value: "Slice of Life", desc: "학교, 직장, 소소한 하루" },
      { label: "👻 미스터리한 초자연적 세계", value: "Supernatural", desc: "귀신, 요괴, 불가사의" },
    ],
  },
  {
    id: "theme",
    emoji: "✨",
    question: "어떤 이야기에 끌리나요?",
    subtitle: "당신의 마음을 사로잡는 테마",
    options: [
      { label: "👊 성장과 열정", value: "Sports", desc: "한계를 넘는 주인공의 성장" },
      { label: "💕 사랑과 감정", value: "Romance", desc: "설레고 아프고 아름다운 관계" },
      { label: "🔍 미스터리와 반전", value: "Thriller", desc: "예측불가, 끝까지 긴장감" },
      { label: "😢 감동과 눈물", value: "Drama", desc: "삶의 희로애락을 담은 이야기" },
    ],
  },
  {
    id: "pace",
    emoji: "⏳",
    question: "스토리 진행 속도는?",
    subtitle: "당신이 선호하는 서사의 리듬",
    options: [
      { label: "⚡ 빠르게! 항상 뭔가 터져야 해", value: "fast", desc: "쉴 틈 없는 전개" },
      { label: "🌊 천천히, 여운 있게", value: "slow", desc: "깊이 스며드는 이야기" },
      { label: "🎯 적당히 균형 있게", value: "balanced", desc: "긴장과 휴식의 균형" },
      { label: "🎲 예측 불가능하면 최고", value: "random", desc: "반전 또 반전" },
    ],
  },
  {
    id: "length",
    emoji: "📺",
    question: "얼마나 깊이 빠져들 준비가 됐나요?",
    subtitle: "선호하는 애니 분량",
    options: [
      { label: "💫 한 호흡에 끝내고 싶어 (1~12화)", value: "short", desc: "집중해서 완주!" },
      { label: "📖 딱 적당한 분량 (13~26화)", value: "medium", desc: "하루이틀이면 정주행" },
      { label: "🌌 세계에 완전히 빠지고 싶어 (26화+)", value: "long", desc: "긴 여정의 감동" },
      { label: "🔄 지금도 방영 중인 것도 괜찮아", value: "ongoing", desc: "매주 설레는 업데이트" },
    ],
  },
];

// ── ROBUST LOCAL DATABASE (GUARANTEED RESULTS) ──
const ANIME_DB = {
  Action: [
    { id: 1, title: "강철의 연금술사 BROTHERHOOD", titleEn: "Fullmetal Alchemist: Brotherhood", score: 9.1, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx5114-KKo3D7XNce7V.jpg", genres: ["Action", "Adventure"], desc: "연금술의 금기를 어긴 형제가 잃어버린 몸을 되찾기 위해 떠나는 장대한 여정." },
    { id: 2, title: "귀멸의 칼날", titleEn: "Demon Slayer", score: 8.9, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101922-PEn1sxc9hJIh.jpg", genres: ["Action", "Supernatural"], desc: "혈귀에게 가족을 잃은 소년 탄지로가 혈귀 사냥꾼이 되어 싸우는 이야기." },
    { id: 3, title: "주술회전", titleEn: "Jujutsu Kaisen", score: 8.7, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113415-bbBWj4pEfseh.jpg", genres: ["Action", "Fantasy"], desc: "저주를 삼킨 소년이 최강의 주술사가 되기 위해 주술고전에 입학하며 벌어지는 이야기." },
    { id: 4, title: "원펀맨", titleEn: "One Punch Man", score: 8.8, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx30276-802ba7J827i3.jpg", genres: ["Action", "Comedy"], desc: "취미로 히어로를 하는 남자, 사이타마. 너무 강해서 모든 적을 한 방에 끝낸다." },
    { id: 5, title: "진격의 거인", titleEn: "Attack on Titan", score: 9.0, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16498-m5ZMNtFioc7j.jpg", genres: ["Action", "Drama"], desc: "식인 거인이 지배하는 세상, 벽 안에 갇힌 인류의 처절한 생존과 비밀." },
    { id: 6, title: "나의 히어로 아카데미아", titleEn: "My Hero Academia", score: 8.5, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21459-o5172gko9iXW.jpg", genres: ["Action", "School"], desc: "개성이 없던 소년 미도리야가 최고의 히어로가 되기 위해 성장하는 이야기." },
    { id: 7, title: "헌터X헌터 (2011)", titleEn: "Hunter x Hunter (2011)", score: 9.0, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx11061-sIpBprNrMz0R.png", genres: ["Action", "Adventure"], desc: "아버지와 같은 헌터가 되기 위해 모험을 떠나는 곤의 우정과 성장." },
    { id: 8, title: "카우보이 비밥", titleEn: "Cowboy Bebop", score: 8.9, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1-CXtrrkMpJ8Zq.png", genres: ["Action", "Sci-Fi"], desc: "2071년 우주, 현상금 사냥꾼 스파이크와 동료들의 스타일리시한 하드보일드 액션." }
  ],
  Comedy: [
    { id: 9, title: "스파이 패밀리", titleEn: "SPY x FAMILY", score: 8.6, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx140960-Yl5M3AiLjmkr.jpg", genres: ["Comedy", "Action"], desc: "스파이, 암살자, 초능력자가 서로 정체를 숨기고 가짜 가족이 되어 펼치는 코미디." },
    { id: 10, title: "카구야 님은 고백받고 싶어", titleEn: "Kaguya-sama: Love is War", score: 8.8, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101921-VPvH2GMQXljP.jpg", genres: ["Comedy", "Romance"], desc: "천재들의 연애 두뇌전. 먼저 고백하는 쪽이 지는 것이다!" },
    { id: 11, title: "은혼", titleEn: "Gintama", score: 9.0, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx918-0j8Q6a3M7jLq.png", genres: ["Comedy", "Action"], desc: "에도 시대, 사무라이 정신을 가진 긴토키와 해결사 친구들의 엉망진창 코미디." },
    { id: 12, title: "사이키 쿠스오의 재난", titleEn: "The Disastrous Life of Saiki K.", score: 8.6, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21804-1426w1d3s3sI.png", genres: ["Comedy", "Supernatural"], desc: "초능력자지만 평범하게 살고 싶은 사이키 쿠스오의 고난 가득한 일상." },
    { id: 13, title: "코노스바", titleEn: "KonoSuba", score: 8.4, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21202-T53Jq775q8xR.png", genres: ["Comedy", "Fantasy"], desc: "이세계로 전생했지만 트롤링 파티원들과 함께하는 잉여신 아쿠아의 모험." }
  ],
  Romance: [
    { id: 14, title: "너의 이름은.", titleEn: "Your Name.", score: 9.2, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21519-IVCd8XTSX28d.jpg", genres: ["Romance", "Drama"], desc: "꿈속에서 몸이 뒤바뀐 도시 소년 타키와 시골 소녀 미츠하의 기적 같은 사랑 이야기." },
    { id: 15, title: "목소리의 형태", titleEn: "A Silent Voice", score: 9.0, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20954-UMb6KI78iYWH.jpg", genres: ["Romance", "Drama"], desc: "청각 장애 소녀 쇼코와 그녀를 괴롭혔던 소년 쇼야의 진정한 화해와 구원." },
    { id: 16, title: "호리미야", titleEn: "Horimiya", score: 8.6, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx124080-h8EPH92nyRsq.jpg", genres: ["Romance", "School"], desc: "학교와 밖에서의 모습이 전혀 다른 두 남녀의 달콤하고 비밀스러운 연애." },
    { id: 17, title: "4월은 너의 거짓말", titleEn: "Your Lie in April", score: 8.9, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20665-J5ig2qQYq3tq.png", genres: ["Romance", "Music"], desc: "트라우마로 피아노를 칠 수 없는 소년이 자유로운 바이올리니스트 소녀를 만나다." },
    { id: 18, title: "후르츠 바스켓 (2019)", titleEn: "Fruits Basket", score: 8.8, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx104044-XytrK8G7g66G.jpg", genres: ["Romance", "Drama"], desc: "이성과 껴안으면 동물로 변하는 저주에 걸린 가문과 함께 살게 된 소녀의 치유 로맨스." }
  ],
  Drama: [
    { id: 19, title: "바이올렛 에버가든", titleEn: "Violet Evergarden", score: 8.9, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21827-10F6m5085s5s.png", genres: ["Drama", "Fantasy"], desc: "전쟁 도구로 살았던 소녀가 편지 대필가가 되어 '사랑'의 의미를 깨달아가는 감동 대작." },
    { id: 20, title: "클라나드", titleEn: "Clannad", score: 8.8, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx2167-37Qz4L1R033N.png", genres: ["Drama", "Romance"], desc: "가족과 친구, 연인의 소중함을 깨닫게 해주는 눈물 없이는 볼 수 없는 명작." },
    { id: 21, title: "그날 본 꽃의 이름을 우리는 아직 모른다", titleEn: "Anohana", score: 8.7, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx9989-qM739752mJkK.png", genres: ["Drama", "Supernatural"], desc: "어린 시절 죽은 친구의 유령이 나타나면서 멀어졌던 친구들이 다시 모여 상처를 치유한다." },
    { id: 22, title: "몬스터", titleEn: "Monster", score: 8.9, img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx19-M52X862Xq5x8.png", genres: ["Drama", "Thriller"], desc: "천재 외과 의사가 살려낸 소년이 연쇄살인마가 되어 돌아왔다. 인간 본성에 대한 깊은 통찰." }
  ]
};

// ── STATE ──
const state = {
  phase: "intro", // intro | quiz | loading | results
  currentQ: 0,
  answers: {},
  selected: null,
  results: [],
  visibleCount: 3,
  analysisText: "",
};

const app = document.getElementById("app");

// ── LOGIC ──

function generateAnalysis(ans) {
  const moods = { Action: "강렬한 에너지", Comedy: "즐거운 웃음", Drama: "깊은 몰입감", Romance: "설레는 감정" };
  const worlds = { Fantasy: "환상적인 세계", "Sci-Fi": "미래지향적 풍경", "Slice of Life": "소소한 일상", Supernatural: "신비로운 분위기" };
  return `${worlds[ans.world] || "매력적인 세계"}에서 펼쳐지는 ${moods[ans.mood] || "특별한"} 이야기를 선호하시는군요. 당신의 취향 DNA에 새겨진 최고의 작품들을 선별했습니다.`;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function truncate(str, n) {
  return str && str.length > n ? str.slice(0, n) + "..." : str;
}

// ── RENDERERS ──

function render() {
  if (state.phase === "intro") renderIntro();
  else if (state.phase === "quiz") renderQuiz();
  else if (state.phase === "loading") renderLoading();
  else if (state.phase === "results") renderResults();
}

function renderIntro() {
  app.innerHTML = `
    <div class="intro-container">
      <div class="fade-up">
        <div class="intro-eyebrow">✦ Anime DNA ✦</div>
        <h1 class="intro-title">당신의 애니는</h1>
        <h1 class="intro-subtitle">무엇인가요?</h1>
      </div>
      <div class="fade-up delay-2">
        <p class="intro-desc">
          단 4가지 질문으로 당신의 취향을 분석해<br>
          <span style="color:#a0a0ff;font-weight:600">엄선된 데이터베이스</span>에서<br>
          가장 완벽하게 어울리는 작품을 찾아드립니다.
        </p>
        <button class="primary-btn" onclick="startQuiz()">분석 시작하기 →</button>
      </div>
    </div>
  `;
}

function renderQuiz() {
  const q = QUESTIONS[state.currentQ];
  const progress = (state.currentQ / QUESTIONS.length) * 100;

  app.innerHTML = `
    <div class="quiz-container fade-up">
      <div class="progress-bar-wrap">
        <div class="progress-info">
          <span>STEP ${state.currentQ + 1} / ${QUESTIONS.length}</span>
          <span>${Math.round(progress)}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
      </div>

      <div class="quiz-content">
        <div class="question-header">
          <div class="question-emoji">${q.emoji}</div>
          <h2 class="question-text">${q.question}</h2>
          <p style="color:#7777aa;font-size:14px">${q.subtitle}</p>
        </div>

        <div class="options-grid">
          ${q.options.map(opt => `
            <button class="option-btn ${state.selected === opt.value ? 'selected' : ''}" 
                    onclick="handleSelect('${opt.value}')">
              <div class="check-mark ${state.selected === opt.value ? '' : 'hidden'}">✓</div>
              <div style="font-size:18px;font-weight:700;margin-bottom:6px">${opt.label}</div>
              <div style="font-size:13px;color:#7777aa">${opt.desc}</div>
            </button>
          `).join('')}
        </div>

        <div style="display:flex;justify-content:center">
          <button id="nextBtn" class="primary-btn" onclick="handleNext()" ${!state.selected ? 'disabled' : ''}>
            ${state.currentQ < QUESTIONS.length - 1 ? "다음 단계 →" : "DNA 분석 결과 보기 ✨"}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderLoading() {
  app.innerHTML = `
    <div class="loading-container fade-up">
      <div class="spinner"></div>
      <div style="text-align:center">
        <p style="font-size:20px;font-weight:700;margin-bottom:8px">당신의 DNA를 분석 중입니다...</p>
        <p style="color:#7777aa;font-size:14px">취향 패턴 매칭 완료</p>
      </div>
    </div>
  `;
}

function renderResults() {
  const visibleItems = state.results.slice(0, state.visibleCount);
  
  app.innerHTML = `
    <div class="results-container fade-up">
      <div style="text-align:center;margin-bottom:40px">
        <div style="font-size:13px;letter-spacing:4px;color:#7777ff;margin-bottom:16px;font-weight:600">✦ ANALYSIS COMPLETED ✦</div>
        <h2 style="font-size:clamp(28px,5vw,48px);font-weight:900;margin-bottom:24px;background:linear-gradient(135deg,#ffffff,#a0a0ff,#ff6bff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-1px">
          취향 분석 리포트
        </h2>
        
        <div style="background:rgba(255,255,255,0.05);padding:24px;border-radius:16px;margin-bottom:32px;border:1px solid rgba(120,120,255,0.2);line-height:1.7;color:#e8e8ff;max-width:800px;margin-left:auto;margin-right:auto;text-align:left">
          <p style="font-size:16px;font-weight:500">${state.analysisText}</p>
        </div>
      </div>

      <div class="anime-grid">
        ${visibleItems.map((anime, i) => `
          <div class="anime-card fade-up" style="animation-delay:${i * 0.1}s" 
               onclick="window.open('https://anilist.co/anime/${anime.id}', '_blank')">
            <div class="cover-wrap">
              <img class="cover-img" src="${anime.img}" alt="cover">
              <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(10,10,26,0.95) 0%,transparent 50%)"></div>
              <div class="score-badge">★ ${anime.score}</div>
            </div>

            <div class="card-body">
              <div class="title-row">
                <img class="thumb-img" src="${anime.img}" alt="">
                <div style="flex:1;min-width:0">
                  <h3 class="anime-title">${anime.title}</h3>
                  <p style="font-size:12px;color:#7777aa;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${anime.titleEn}</p>
                </div>
              </div>

              <div class="genre-row">
                ${anime.genres.map(g => `<span class="genre-chip">${g}</span>`).join('')}
              </div>

              <p class="anime-desc">${truncate(anime.desc, 80)}</p>

              <div class="cta-box">상세 정보 보기 →</div>
            </div>
          </div>
        `).join('')}
      </div>

      ${state.results.length > state.visibleCount ? `
        <div style="text-align:center;margin-bottom:40px">
           <button class="primary-btn" onclick="showMore()" style="padding:14px 40px;font-size:14px;background:rgba(120,120,255,0.1);box-shadow:none">
             나머지 추천 작품 더 보기 (+${state.results.length - state.visibleCount})
           </button>
        </div>
      ` : ''}

      <div style="text-align:center">
        <button class="restart-btn" onclick="restart()">🔄 처음부터 다시 하기</button>
      </div>
    </div>
  `;
}

// ── ACTIONS ──

window.startQuiz = () => {
  state.phase = "quiz";
  render();
};

window.handleSelect = (val) => {
  state.selected = val;
  render();
};

window.handleNext = () => {
  if (!state.selected) return;
  state.answers[QUESTIONS[state.currentQ].id] = state.selected;

  if (state.currentQ < QUESTIONS.length - 1) {
    state.currentQ++;
    state.selected = null;
    render();
  } else {
    // Process Results Locally
    processResults();
  }
};

window.showMore = () => {
  state.visibleCount += 3;
  render();
};

window.restart = () => {
  state.phase = "intro";
  state.currentQ = 0;
  state.answers = {};
  state.selected = null;
  state.results = [];
  state.visibleCount = 3;
  state.error = null;
  render();
};

function processResults() {
  state.phase = "loading";
  render();

  state.analysisText = generateAnalysis(state.answers);

  // 1. Get primary mood results
  let moodResults = ANIME_DB[state.answers.mood] || [];
  
  // 2. Get fallback/mix results from other categories if needed (Optional, keeping it simple for now)
  // For now, just shuffle the mood results to vary the order
  let finalResults = shuffleArray([...moodResults]);

  // If list is small, add some randoms from other categories to fill up?
  // Currently DB has enough per category (4-8 items). 
  
  state.results = finalResults;
  
  // Simulate processing time for UX
  setTimeout(() => {
    state.phase = "results";
    render();
  }, 1500);
}

// Start
document.addEventListener("DOMContentLoaded", render);
