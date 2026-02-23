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

// Define Genres (AniList Genres)
const GENRES = {
  intense: ["Action", "Thriller", "Psychological"],
  fun: ["Comedy", "Slice of Life"],
  thoughtful: ["Psychological", "Sci-Fi", "Drama"],
  emotional: ["Drama", "Romance"],
  fantasy: ["Fantasy", "Adventure"],
  scifi: ["Sci-Fi", "Mecha"],
  real: ["Slice of Life", "Sports"],
  history: [], // Historical is a tag
  growth: ["Sports", "Adventure"],
  love: ["Romance"],
  mystery: ["Mystery", "Thriller"],
  drama: ["Drama"],
};

// Define Tags (AniList Tags)
const TAGS = {
  fun: ["Parody"],
  thoughtful: ["Philosophy"],
  emotional: ["Iyashikei"],
  fantasy: ["Isekai", "Magic"],
  scifi: ["Cyberpunk", "Space"],
  real: ["School"],
  history: ["Historical", "Samurai"],
  growth: ["Shounen", "Coming of Age"],
  love: ["Shoujo", "Love Triangle"],
  mystery: ["Detective"],
  drama: ["Tragedy"],
};

const STATUS_MAP = {
  short: { perPage: 18, format: ["TV_SHORT", "OVA", "MOVIE", "TV"] },
  medium: { perPage: 18, format: ["TV"] },
  long: { perPage: 18, format: ["TV"] },
  ongoing: { perPage: 18, status: "RELEASING" },
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
};

// ── DOM ELEMENTS ──
const app = document.getElementById("app");

// ── LOGIC ──

function generateAnalysis(ans) {
  const moods = {
    intense: "강렬한 자극과 몰입감을 원하시며,",
    fun: "가볍게 웃으며 즐길 수 있는 시간을 찾고 계시고,",
    thoughtful: "깊은 생각에 잠길 수 있는 철학적인 이야기를 선호하며,",
    emotional: "마음을 울리는 감동적인 서사를 기대하시네요."
  };
  const worlds = {
    fantasy: "현실을 벗어난 환상적인 판타지 세계에서",
    scifi: "미래 기술과 우주가 펼쳐지는 SF 세계관 속에서",
    real: "우리네 일상과 맞닿은 현실적인 배경 안에서",
    history: "지나간 시대의 향수와 역사가 숨 쉬는 곳에서"
  };
  const themes = {
    growth: "주인공이 시련을 딛고 성장하는 뜨거운 이야기",
    love: "설레는 사랑과 인간관계의 미묘한 감정선",
    mystery: "한 치 앞을 알 수 없는 미스터리와 반전",
    drama: "삶의 희로애락을 진지하게 다루는 드라마"
  };

  return `${moods[ans.mood]} ${worlds[ans.world]} 펼쳐지는 ${themes[ans.theme]}를 추천해 드립니다. 당신의 취향 DNA를 분석한 결과, 다음 작품들이 가장 높은 매칭률을 보였습니다.`;
}

function buildCriteria(answers) {
  let genres = new Set();
  let tags = new Set();

  // Mood
  if (GENRES[answers.mood]) GENRES[answers.mood].forEach(g => genres.add(g));
  if (TAGS[answers.mood]) TAGS[answers.mood].forEach(t => tags.add(t));

  // World
  if (GENRES[answers.world]) GENRES[answers.world].forEach(g => genres.add(g));
  if (TAGS[answers.world]) TAGS[answers.world].forEach(t => tags.add(t));

  // Theme
  if (GENRES[answers.theme]) GENRES[answers.theme].forEach(g => genres.add(g));
  if (TAGS[answers.theme]) TAGS[answers.theme].forEach(t => tags.add(t));

  return {
    genres: [...genres].slice(0, 3), // Limit genre count
    tags: [...tags].slice(0, 3) // Limit tag count
  };
}

function getKoreanTitle(media) {
  const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  const krSynonym = media.synonyms?.find(s => koreanRegex.test(s));
  if (krSynonym) return krSynonym;
  if (koreanRegex.test(media.title.native)) return media.title.native;
  return null;
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
          <span style="color:#a0a0ff;font-weight:600">AniList</span>의 50만 개 데이터에서<br>
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
          <span id="progressText">${Math.round(progress)}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" id="progressBar" style="width: ${progress}%"></div>
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
        <p style="font-size:20px;font-weight:700;margin-bottom:8px">DNA 분석 중...</p>
        <p style="color:#7777aa;font-size:14px">AniList DB 검색 중 (50만+ 작품)</p>
      </div>
    </div>
  `;
}

function renderResults() {
  const criteria = buildCriteria(state.answers);
  const displayTags = [...criteria.genres, ...criteria.tags];
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

        <div class="tags-wrap">
          ${displayTags.map(g => `<span class="tag">#${g}</span>`).join('')}
        </div>
      </div>

      ${state.error ? `
        <div style="text-align:center;padding:40px;color:#ff8888;background:rgba(255,80,80,0.05);border:1px solid rgba(255,80,80,0.2);border-radius:16px;margin-bottom:32px">
          ${state.error}
        </div>
      ` : ''}

      ${state.results.length === 0 && !state.error ? `
        <div style="text-align:center;padding:40px;color:#aaa;">
          조건에 맞는 애니메이션을 찾지 못했습니다 😢<br>다시 시도해보세요.
        </div>
      ` : ''}

      <div class="anime-grid">
        ${visibleItems.map((anime, i) => {
          const krTitle = getKoreanTitle(anime);
          const titleMain = krTitle || anime.title.english || anime.title.romaji;
          
          return `
          <div class="anime-card fade-up" style="animation-delay:${i * 0.1}s" 
               onclick="window.open('https://anilist.co/anime/${anime.id}', '_blank')">
            <div class="cover-wrap">
              ${anime.bannerImage || anime.coverImage?.large ? `
                <img class="cover-img" src="${anime.bannerImage || anime.coverImage?.large}" alt="cover">
              ` : `
                <div style="position:absolute;inset:0;background:linear-gradient(135deg,#1a0a3a,#0a1a3a);display:flex;align-items:center;justify-content:center;font-size:48px">🎌</div>
              `}
              <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(10,10,26,0.95) 0%,transparent 50%)"></div>
              
              ${anime.averageScore ? `
                <div class="score-badge">★ ${(anime.averageScore / 10).toFixed(1)}</div>
              ` : ''}
            </div>

            <div class="card-body">
              <div class="title-row">
                <img class="thumb-img" src="${anime.coverImage?.large}" alt="">
                <div style="flex:1;min-width:0">
                  <h3 class="anime-title">${titleMain}</h3>
                  <p style="font-size:12px;color:#7777aa">${anime.studios?.nodes?.[0]?.name || 'Unknown Studio'}</p>
                </div>
              </div>

              <div class="genre-row">
                ${anime.genres?.slice(0, 3).map(g => `<span class="genre-chip">${g}</span>`).join('')}
              </div>

              ${anime.description ? `
                <p class="anime-desc">${truncate(anime.description.replace(/<[^>]*>/g, ""), 90)}</p>
              ` : ''}

              <div class="cta-box">상세 정보 보기 →</div>
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

// ── ACTION HANDLERS ──

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
  const nextBtn = document.getElementById('nextBtn');
  if (nextBtn) nextBtn.disabled = false;
};

window.handleNext = async () => {
  if (!state.selected) return;
  const q = QUESTIONS[state.currentQ];
  state.answers[q.id] = state.selected;

  if (state.currentQ < QUESTIONS.length - 1) {
    state.currentQ++;
    state.selected = null;
    render();
  } else {
    await fetchRecommendations();
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
  state.analysisText = "";
  render();
};

async function fetchRecommendations() {
  state.phase = "loading";
  render();

  state.analysisText = generateAnalysis(state.answers);

  const criteria = buildCriteria(state.answers);
  const lengthConfig = STATUS_MAP[state.answers.length] || {};
  const randomPage = Math.floor(Math.random() * 3) + 1;

  // IMPORTANT: Split genre_in and tag_in for correct API usage
  // If no genres/tags found, fallback to 'Action' to avoid empty results
  const genres = criteria.genres.length > 0 ? criteria.genres : null;
  const tags = criteria.tags.length > 0 ? criteria.tags : null;

  const query = `
    query ($genres: [String], $tags: [String], $page: Int, $perPage: Int, $sort: [MediaSort], $status: MediaStatus) {
      Page(page: $page, perPage: $perPage) {
        media(
          type: ANIME
          genre_in: $genres
          tag_in: $tags
          sort: $sort
          status: $status
          isAdult: false
          averageScore_greater: 60
        ) {
          id
          title { romaji english native }
          synonyms 
          coverImage { large }
          bannerImage
          description(asHtml: false)
          averageScore
          episodes
          status
          genres
          seasonYear
          studios(isMain: true) {
            nodes { name }
          }
        }
      }
    }
  `;

  const variables = {
    page: randomPage,
    perPage: 24,
    sort: ["SCORE_DESC", "POPULARITY_DESC"],
    ...(genres ? { genres } : {}),
    ...(tags ? { tags } : {}),
    ...(lengthConfig.status ? { status: lengthConfig.status } : {}),
  };
  
  // Debug log
  console.log("Fetching AniList:", variables);

  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    
    const data = await res.json();
    if (data.errors) {
      console.error("AniList Error:", data.errors);
      throw new Error(data.errors[0].message);
    }
    
    let rawResults = data?.data?.Page?.media || [];
    console.log("Results found:", rawResults.length);

    if (rawResults.length === 0 && genres && tags) {
        // Retry logic: If too strict (genre + tag), try only genre
        console.log("No results, retrying with only genres...");
        const retryVars = { ...variables };
        delete retryVars.tags;
        
        const retryRes = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ query, variables: retryVars }),
        });
        const retryData = await retryRes.json();
        rawResults = retryData?.data?.Page?.media || [];
    }

    state.results = shuffleArray(rawResults);
    state.phase = "results";
  } catch (e) {
    state.error = "API 오류가 발생했어요: " + e.message;
    state.phase = "results";
  }
  render();
}

render();