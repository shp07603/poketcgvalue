// ── CONSTANTS ──
const QUESTIONS = [
  {
    id: "mood",
    emoji: "🌙",
    question: "지금 이 순간, 당신의 마음은?",
    subtitle: "지금 당신에게 어울리는 감정을 골라보세요",
    options: [
      { label: "🔥 뜨겁고 격렬하게", value: "intense", desc: "심장이 두근거리는 강렬함" },
      { label: "😂 유쾌하고 가볍게", value: "fun", desc: "웃음과 설렘이 가득한" },
      { label: "💭 조용히 생각에 잠기고 싶어", value: "thoughtful", desc: "철학적이고 깊은 이야기" },
      { label: "🌸 따뜻하고 감성적으로", value: "emotional", desc: "마음을 울리는 감동" },
    ],
  },
  {
    id: "world",
    emoji: "🗺️",
    question: "어떤 세계로 떠나고 싶나요?",
    subtitle: "내가 살고 싶은 애니의 배경",
    options: [
      { label: "⚔️ 마법과 모험의 판타지", value: "fantasy", desc: "용사, 마법사, 다른 세계" },
      { label: "🚀 미래와 기술의 SF", value: "scifi", desc: "우주, 로봇, 디스토피아" },
      { label: "🏫 현실 속 일상", value: "real", desc: "학교, 직장, 소소한 하루" },
      { label: "🏯 과거와 역사 속으로", value: "history", desc: "사무라이, 귀족, 전쟁" },
    ],
  },
  {
    id: "theme",
    emoji: "✨",
    question: "어떤 이야기에 끌리나요?",
    subtitle: "당신의 마음을 사로잡는 테마",
    options: [
      { label: "👊 성장과 열정", value: "growth", desc: "한계를 넘는 주인공의 성장" },
      { label: "💕 사랑과 감정", value: "love", desc: "설레고 아프고 아름다운 관계" },
      { label: "🔍 미스터리와 반전", value: "mystery", desc: "예측불가, 끝까지 긴장감" },
      { label: "😢 감동과 눈물", value: "drama", desc: "삶의 희로애락을 담은 이야기" },
    ],
  },
  // Pace and Length are used for filtering logic or just analysis text
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
];

// MAL Genre IDs (Jikan v4)
// Action:1, Adventure:2, Comedy:4, Drama:8, Fantasy:10, Romance:22, Sci-Fi:24, Slice of Life:36
// Mystery:7, Supernatural:37, Sports:30, Suspense:41
const GENRE_MAP = {
  // Mood
  intense: [1, 41], // Action, Suspense
  fun: [4, 36],     // Comedy, Slice of Life
  thoughtful: [8, 7], // Drama, Mystery
  emotional: [8, 22], // Drama, Romance
  // World
  fantasy: [10, 2], // Fantasy, Adventure
  scifi: [24],      // Sci-Fi
  real: [36],       // Slice of Life
  history: [13],    // Historical (ID 13)
  // Theme
  growth: [27, 30], // Shounen(27), Sports(30)
  love: [22],       // Romance
  mystery: [7, 41], // Mystery, Suspense
  drama: [8],       // Drama
};

// ── STATE ──
const state = {
  phase: "intro",
  currentQ: 0,
  answers: {},
  selected: null,
  results: [],
  visibleCount: 3,
  error: null,
  analysisText: "",
  loadingMessage: "DNA 분석 중..."
};

// ── DOM ELEMENTS ──
const app = document.getElementById("app");

// ── LOGIC ──

function getGenreIds(answers) {
  const ids = new Set();
  if (GENRE_MAP[answers.mood]) GENRE_MAP[answers.mood].forEach(id => ids.add(id));
  if (GENRE_MAP[answers.world]) GENRE_MAP[answers.world].forEach(id => ids.add(id));
  if (GENRE_MAP[answers.theme]) GENRE_MAP[answers.theme].forEach(id => ids.add(id));
  return Array.from(ids);
}

function generateAnalysis(ans) {
  const moods = { intense: "강렬한 자극", fun: "유쾌한 웃음", thoughtful: "깊은 사색", emotional: "따뜻한 감동" };
  const worlds = { fantasy: "환상의 세계", scifi: "미래와 우주", real: "현실의 일상", history: "역사의 현장" };
  return `${worlds[ans.world]}에서 펼쳐지는 ${moods[ans.mood]}을(를) 선호하시네요.`;
}

// ── RENDER FUNCTIONS ──

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
          <span style="color:#a0a0ff;font-weight:600">Jikan API</span>(MyAnimeList) 데이터에서<br>
          딱 맞는 인생작을 찾아드립니다.
        </p>
        <button class="primary-btn" onclick="startQuiz()">테스트 시작하기 →</button>
      </div>
    </div>
  `;
}

function renderQuiz() {
  const q = QUESTIONS[state.currentQ];
  const progress = ((state.currentQ) / QUESTIONS.length) * 100;

  app.innerHTML = `
    <div class="quiz-container fade-up" id="quizContainer">
      <div class="progress-bar-wrap">
        <div class="progress-info">
          <span>질문 ${state.currentQ + 1} / ${QUESTIONS.length}</span>
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
            <button class="option-btn" data-value="${opt.value}" onclick="handleSelect('${opt.value}')">
              <div class="check-mark hidden">✓</div>
              <div style="font-size:18px;font-weight:700;margin-bottom:6px">${opt.label}</div>
              <div style="font-size:13px;color:#7777aa">${opt.desc}</div>
            </button>
          `).join('')}
        </div>

        <div style="display:flex;justify-content:center">
          <button id="nextBtn" class="primary-btn" onclick="handleNext()" disabled>
            ${state.currentQ < QUESTIONS.length - 1 ? "다음 →" : "결과 보기 ✨"}
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
        <p style="font-size:20px;font-weight:700;margin-bottom:8px">${state.loadingMessage}</p>
        <p style="color:#7777aa;font-size:14px">Jikan API 연결 중...</p>
      </div>
    </div>
  `;
}

function renderResults() {
  const visibleItems = state.results.slice(0, state.visibleCount);
  
  app.innerHTML = `
    <div class="results-container fade-up">
      <div style="text-align:center;margin-bottom:40px">
        <div style="font-size:13px;letter-spacing:4px;color:#7777ff;margin-bottom:16px;font-weight:600">✦ ANALYSIS REPORT ✦</div>
        <h2 style="font-size:clamp(28px,5vw,48px);font-weight:900;margin-bottom:24px;background:linear-gradient(135deg,#ffffff,#a0a0ff,#ff6bff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-1px">
          당신의 취향 분석 결과
        </h2>
        
        <div style="background:rgba(255,255,255,0.05);padding:24px;border-radius:16px;margin-bottom:32px;border:1px solid rgba(120,120,255,0.2);line-height:1.7;color:#e8e8ff;max-width:800px;margin-left:auto;margin-right:auto">
          <p style="font-size:16px;font-weight:500">${state.analysisText}</p>
        </div>
      </div>

      ${state.error ? `
        <div style="text-align:center;padding:40px;color:#ff8888;background:rgba(255,80,80,0.05);border:1px solid rgba(255,80,80,0.2);border-radius:16px;margin-bottom:32px">
          ${state.error}
        </div>
      ` : ''}

      <div class="anime-grid">
        ${visibleItems.map((anime, i) => {
          const title = anime.title_korean || anime.title_english || anime.title;
          return `
          <div class="anime-card fade-up" style="animation-delay:${i * 0.1}s" 
               onclick="window.open('${anime.url}', '_blank')">
            <div class="cover-wrap">
              ${anime.images?.jpg?.large_image_url ? `
                <img class="cover-img" src="${anime.images.jpg.large_image_url}" alt="cover">
              ` : `
                <div style="position:absolute;inset:0;background:linear-gradient(135deg,#1a0a3a,#0a1a3a);display:flex;align-items:center;justify-content:center;font-size:48px">🎌</div>
              `}
              <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(10,10,26,0.95) 0%,transparent 50%)"></div>
              
              ${anime.score ? `
                <div class="score-badge">★ ${anime.score}</div>
              ` : ''}
            </div>

            <div class="card-body">
              <div class="title-row">
                <img class="thumb-img" src="${anime.images?.jpg?.small_image_url}" alt="">
                <div style="flex:1;min-width:0">
                  <h3 class="anime-title">${title}</h3>
                  <p style="font-size:12px;color:#7777aa">${anime.year ? anime.year : 'Unknown'}</p>
                </div>
              </div>

              <div class="genre-row">
                ${anime.genres?.slice(0, 3).map(g => `<span class="genre-chip">${g.name}</span>`).join('')}
              </div>

              ${anime.synopsis ? `
                <p class="anime-desc">${anime.synopsis.slice(0, 100)}...</p>
              ` : ''}

              <div class="cta-box">MyAnimeList에서 보기 →</div>
            </div>
          </div>
        `}).join('')}
      </div>

      ${state.results.length > state.visibleCount ? `
        <div style="text-align:center;margin-bottom:40px">
           <button class="primary-btn" onclick="showMore()" style="padding:14px 40px;font-size:14px;background:rgba(120,120,255,0.1)">
             + 더 보기 (${state.results.length - state.visibleCount})
           </button>
        </div>
      ` : ''}

      <div style="text-align:center">
        <button class="restart-btn" onclick="restart()">🔄 다시 테스트하기</button>
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
  document.querySelectorAll('.option-btn').forEach(btn => {
    if (btn.dataset.value === val) {
      btn.classList.add('selected');
      btn.querySelector('.check-mark').classList.remove('hidden');
    } else {
      btn.classList.remove('selected');
      btn.querySelector('.check-mark').classList.add('hidden');
    }
  });
  document.getElementById('nextBtn').disabled = false;
};

window.handleNext = () => {
  if (!state.selected) return;
  const q = QUESTIONS[state.currentQ];
  state.answers[q.id] = state.selected;

  if (state.currentQ < QUESTIONS.length - 1) {
    state.currentQ++;
    state.selected = null;
    render();
  } else {
    fetchJikanRecommendations();
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

async function fetchJikanRecommendations() {
  state.phase = "loading";
  state.loadingMessage = "Jikan API 연결 중...";
  render();

  state.analysisText = generateAnalysis(state.answers);
  
  const genres = getGenreIds(state.answers);
  // Jikan v4 uses 'genres' parameter (comma separated IDs)
  // 'order_by=score' & 'sort=desc' for best results
  const genreString = genres.join(',');
  const url = `https://api.jikan.moe/v4/anime?genres=${genreString}&order_by=score&sort=desc&min_score=7&limit=20&sfw=true`;
  
  console.log("Fetching Jikan:", url);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Jikan API Error: ${res.status}`);
    const data = await res.json();
    
    // Jikan has rate limits, handle empty data
    if (!data.data || data.data.length === 0) {
      throw new Error("조건에 맞는 애니를 찾지 못했습니다.");
    }

    // Shuffle client-side
    state.results = data.data.sort(() => 0.5 - Math.random());
    state.phase = "results";
  } catch (e) {
    console.error(e);
    state.error = "추천을 가져오지 못했어요. 잠시 후 다시 시도해주세요. (API 제한)";
    state.phase = "results";
  }
  render();
}

function render() {
  if (state.phase === "intro") renderIntro();
  else if (state.phase === "quiz") renderQuiz();
  else if (state.phase === "loading") renderLoading();
  else if (state.phase === "results") renderResults();
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  render();
});
