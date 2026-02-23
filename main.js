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
      { label: "⚔️ 마법과 모험의 판타지", value: "Fantasy", desc: "용사, 마법사, 다른 세계" },
      { label: "🚀 미래와 기술의 SF", value: "Sci-Fi", desc: "우주, 로봇, 디스토피아" },
      { label: "🏫 현실 속 일상", value: "Slice of Life", desc: "학교, 직장, 소소한 하루" },
      { label: "🏯 과거와 역사 속으로", value: "Historical", desc: "사무라이, 귀족, 전쟁" },
    ],
  },
  {
    id: "theme",
    emoji: "✨",
    question: "어떤 이야기에 끌리나요?",
    subtitle: "당신의 마음을 사로잡는 테마",
    options: [
      { label: "👊 성장과 열정", value: "Action", desc: "한계를 넘는 주인공의 성장" },
      { label: "💕 사랑과 감정", value: "Romance", desc: "설레고 아프고 아름다운 관계" },
      { label: "🔍 미스터리와 반전", value: "Mystery", desc: "예측불가, 끝까지 긴장감" },
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
      { label: "🎲 예측 불가능하면 최고", value: "unpredictable", desc: "반전 또 반전" },
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

const GENRE_MAP = {
  mood: {
    intense: ["Action", "Psychological", "Thriller"],
    fun: ["Comedy", "Slice of Life"],
    thoughtful: ["Psychological", "Drama", "Sci-Fi"],
    emotional: ["Drama", "Romance"],
  },
  theme: {
    Action: ["Action", "Adventure", "Sports"],
    Romance: ["Romance", "Drama"],
    Mystery: ["Mystery", "Psychological", "Thriller"],
    Drama: ["Drama", "Slice of Life"],
  },
};

const STATUS_MAP = {
  short: { perPage: 10, format: ["TV_SHORT", "OVA", "MOVIE"] },
  medium: { perPage: 10, format: ["TV"] },
  long: { perPage: 10, format: ["TV"] },
  ongoing: { perPage: 10, status: "RELEASING" },
};

// ── STATE ──
const state = {
  phase: "intro", // intro | quiz | loading | results
  currentQ: 0,
  answers: {},
  selected: null,
  results: [],
  error: null,
};

// ── DOM ELEMENTS ──
const app = document.getElementById("app");

// ── LOGIC ──

function buildGenres(answers) {
  const genres = new Set();
  if (answers.mood) {
    GENRE_MAP.mood[answers.mood]?.forEach((g) => genres.add(g));
  }
  if (answers.theme) {
    GENRE_MAP.theme[answers.theme]?.forEach((g) => genres.add(g));
  }
  if (answers.world && !["Slice of Life"].includes(answers.world)) {
    genres.add(answers.world);
  } else if (answers.world === "Slice of Life") {
    genres.add("Slice of Life");
  }
  if (answers.world === "Historical") {
    genres.add("Historical");
  }
  return [...genres].slice(0, 3);
}

function truncate(str, n) {
  return str && str.length > n ? str.slice(0, n) + "..." : str;
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
          단 5가지 질문으로 당신의 취향을 분석해<br>
          <span style="color:#a0a0ff;font-weight:600">AniList</span>에서 딱 맞는 애니를 찾아드려요.<br>
          MBTI보다 정확한 애니 궁합 테스트 🌙
        </p>
        <div class="feature-grid">
          <div class="feature-item">
            <div class="feature-icon">🧬</div>
            <span style="font-size:12px;color:#7777aa">5가지 질문</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔗</div>
            <span style="font-size:12px;color:#7777aa">실시간 DB</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <span style="font-size:12px;color:#7777aa">9개 추천</span>
          </div>
        </div>
        <button class="primary-btn" onclick="startQuiz()">테스트 시작하기 →</button>
      </div>
    </div>
  `;
}

function renderQuiz() {
  const q = QUESTIONS[state.currentQ];
  const progress = ((state.currentQ + (state.selected ? 1 : 0)) / QUESTIONS.length) * 100;

  app.innerHTML = `
    <div class="quiz-container fade-up">
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
            <button class="option-btn ${state.selected === opt.value ? 'selected' : ''}" 
              onclick="handleSelect('${opt.value}')">
              ${state.selected === opt.value ? '<div class="check-mark">✓</div>' : ''}
              <div style="font-size:18px;font-weight:700;margin-bottom:6px">${opt.label}</div>
              <div style="font-size:13px;color:#7777aa">${opt.desc}</div>
            </button>
          `).join('')}
        </div>

        <div style="display:flex;justify-content:center">
          <button class="primary-btn" onclick="handleNext()" ${!state.selected ? 'disabled' : ''}>
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
        <p style="font-size:20px;font-weight:700;margin-bottom:8px">당신의 애니를 찾는 중...</p>
        <p style="color:#7777aa;font-size:14px">AniList에서 50만+ 작품 중 분석 중 🔍</p>
      </div>
    </div>
  `;
}

function renderResults() {
  const tags = buildGenres(state.answers);
  
  app.innerHTML = `
    <div class="results-container fade-up">
      <div style="text-align:center;margin-bottom:60px">
        <div style="font-size:13px;letter-spacing:4px;color:#7777ff;margin-bottom:16px;font-weight:600">✦ 당신을 위한 픽 ✦</div>
        <h2 style="font-size:clamp(32px,6vw,56px);font-weight:900;margin-bottom:16px;background:linear-gradient(135deg,#ffffff,#a0a0ff,#ff6bff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-1px">
          당신에게 어울리는 애니
        </h2>
        <p style="color:#7777aa;font-size:15px">취향 분석 결과 기반으로 AniList에서 가져온 추천이에요</p>
      </div>

      <div class="tags-wrap">
        ${tags.map(g => `<span class="tag">#${g}</span>`).join('')}
      </div>

      ${state.error ? `
        <div style="text-align:center;padding:40px;color:#ff8888;background:rgba(255,80,80,0.05);border:1px solid rgba(255,80,80,0.2);border-radius:16px;margin-bottom:32px">
          ${state.error}
        </div>
      ` : ''}

      <div class="anime-grid">
        ${state.results.map((anime, i) => `
          <div class="anime-card fade-up" style="animation-delay:${i * 0.1}s" 
               onclick="window.open('https://anilist.co/anime/${anime.id}', '_blank')">
            <div class="cover-wrap">
              ${anime.bannerImage || anime.coverImage?.large ? `
                <img class="cover-img" src="${anime.bannerImage || anime.coverImage?.large}" alt="${anime.title?.romaji}">
              ` : `
                <div style="position:absolute;inset:0;background:linear-gradient(135deg,#1a0a3a,#0a1a3a);display:flex;align-items:center;justify-content:center;font-size:48px">🎌</div>
              `}
              <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(10,10,26,0.95) 0%,transparent 50%)"></div>
              
              ${anime.averageScore ? `
                <div class="score-badge">★ ${(anime.averageScore / 10).toFixed(1)}</div>
              ` : ''}
              
              ${i < 3 ? `
                <div class="rank-badge" style="background:${
                  ['linear-gradient(135deg, #FFD700, #FFA500)', 'linear-gradient(135deg, #C0C0C0, #a0a0a0)', 'linear-gradient(135deg, #CD7F32, #8B4513)'][i]
                };color:${i === 0 ? '#000' : '#fff'}">
                  ${['🥇 1위', '🥈 2위', '🥉 3위'][i]}
                </div>
              ` : ''}
            </div>

            <div class="card-body">
              <div class="title-row">
                <img class="thumb-img" src="${anime.coverImage?.large}" alt="">
                <div style="flex:1;min-width:0">
                  <h3 class="anime-title">${anime.title?.english || anime.title?.romaji}</h3>
                  ${anime.title?.romaji !== (anime.title?.english) ? `
                    <p style="font-size:12px;color:#7777aa">${anime.title?.romaji}</p>
                  ` : ''}
                </div>
              </div>

              <div class="meta-row">
                ${anime.episodes ? `<span class="meta-chip">${anime.episodes}화</span>` : ''}
                ${anime.seasonYear ? `<span class="meta-chip">${anime.seasonYear}</span>` : ''}
                ${anime.studios?.nodes?.[0] ? `<span class="meta-chip" style="background:rgba(255,100,255,0.08);color:#cc90cc">${anime.studios.nodes[0].name}</span>` : ''}
              </div>

              <div class="genre-row">
                ${anime.genres?.slice(0, 3).map(g => `<span class="genre-chip">${g}</span>`).join('')}
              </div>

              ${anime.description ? `
                <p class="anime-desc">${truncate(anime.description.replace(/<[^>]*>/g, ""), 120)}</p>
              ` : ''}

              <div class="cta-box">AniList에서 보기 →</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="text-align:center">
        <button class="restart-btn" onclick="restart()">🔄 다시 테스트하기</button>
      </div>
    </div>
  `;
}

// ── ACTION HANDLERS ──

window.startQuiz = () => {
  state.phase = "quiz";
  render();
};

window.handleSelect = (val) => {
  state.selected = val;
  render(); // Re-render to show selection state
};

window.handleNext = async () => {
  if (!state.selected) return;
  
  const q = QUESTIONS[state.currentQ];
  state.answers[q.id] = state.selected;

  if (state.currentQ < QUESTIONS.length - 1) {
    // Animate out? Simple transition for now
    state.currentQ++;
    state.selected = null;
    render();
  } else {
    await fetchRecommendations();
  }
};

window.restart = () => {
  state.phase = "intro";
  state.currentQ = 0;
  state.answers = {};
  state.selected = null;
  state.results = [];
  state.error = null;
  render();
};

async function fetchRecommendations() {
  state.phase = "loading";
  render();

  const genres = buildGenres(state.answers);
  const lengthConfig = STATUS_MAP[state.answers.length] || {};

  const query = `
    query ($genres: [String], $page: Int, $perPage: Int, $sort: [MediaSort], $status: MediaStatus) {
      Page(page: $page, perPage: $perPage) {
        media(
          type: ANIME
          genre_in: $genres
          sort: $sort
          status: $status
          isAdult: false
          averageScore_greater: 65
        ) {
          id
          title { romaji english native }
          coverImage { large }
          bannerImage
          description(asHtml: false)
          averageScore
          episodes
          status
          genres
          season
          seasonYear
          studios(isMain: true) {
            nodes { name }
          }
        }
      }
    }
  `;

  const variables = {
    genres: genres.length > 0 ? genres : ["Action"],
    page: 1,
    perPage: 12,
    sort: ["SCORE_DESC", "POPULARITY_DESC"],
    ...(lengthConfig.status ? { status: lengthConfig.status } : {}),
  };

  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    const data = await res.json();
    if (data.errors) throw new Error(data.errors[0].message);
    state.results = data?.data?.Page?.media || [];
    state.phase = "results";
  } catch (e) {
    state.error = "API 오류가 발생했어요: " + e.message;
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

// Initial Render
render();
