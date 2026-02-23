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

// Fallback Data (In case API fails)
const BACKUP_ANIME = [
  { id: 1, title: { romaji: "Cowboy Bebop", english: "Cowboy Bebop", native: "カウボーイビバップ" }, coverImage: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1-CXtrrkMpJ8Zq.png" }, averageScore: 86, genres: ["Action", "Sci-Fi"], description: "2071년, 우주 현상금 사냥꾼들의 이야기." },
  { id: 5114, title: { romaji: "Fullmetal Alchemist: Brotherhood", english: "Fullmetal Alchemist: Brotherhood", native: "鋼の錬金術師 FULLMETAL ALCHEMIST" }, coverImage: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx5114-KKo3D7XNce7V.jpg" }, averageScore: 90, genres: ["Action", "Adventure"], description: "연금술사 형제의 잃어버린 몸을 찾기 위한 여정." },
  { id: 30276, title: { romaji: "One Punch Man", english: "One Punch Man", native: "ワンパンマン" }, coverImage: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx30276-802ba7J827i3.jpg" }, averageScore: 83, genres: ["Action", "Comedy"], description: "모든 적을 한 방에 끝내는 히어로 사이타마." },
  { id: 16498, title: { romaji: "Shingeki no Kyojin", english: "Attack on Titan", native: "進撃の巨人" }, coverImage: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16498-m5ZMNtFioc7j.jpg" }, averageScore: 85, genres: ["Action", "Drama"], description: "식인 거인에 맞선 인류의 최후의 항전." },
  { id: 21519, title: { romaji: "Kimi no Na wa.", english: "Your Name.", native: "君の名は。" }, coverImage: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21519-IVCd8XTSX28d.jpg" }, averageScore: 89, genres: ["Romance", "Supernatural"], description: "꿈속에서 몸이 뒤바뀐 도시 소년과 시골 소녀." },
  { id: 9253, title: { romaji: "Steins;Gate", english: "Steins;Gate", native: "シュタインズ・ゲート" }, coverImage: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx9253-7pdcVzQskqx5.jpg" }, averageScore: 90, genres: ["Sci-Fi", "Thriller"], description: "우연히 과거로 메일을 보내는 타임머신을 발명하게 된 이야기." },
];

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

function generateAnalysis(ans) {
  const moods = { Action: "짜릿한 액션", Comedy: "유쾌한 웃음", Drama: "깊은 여운", Romance: "설레는 로맨스" };
  const worlds = { Fantasy: "판타지 세계", SciFi: "SF 세계관", SliceofLife: "일상의 이야기", Supernatural: "신비로운 세계" };
  
  return `${worlds[ans.world] || ans.world} 속에서 펼쳐지는 ${moods[ans.mood] || ans.mood} 애니메이션을 추천합니다.`;
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
          <span style="color:#a0a0ff;font-weight:600">AniList</span> 데이터베이스에서<br>
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
        <p style="color:#7777aa;font-size:14px">AniList DB 연결 중...</p>
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
        <div style="text-align:center;padding:20px;color:#ffaa88;margin-bottom:20px;font-size:14px">
          ⚠️ ${state.error} 대신 인기 추천작을 보여드릴게요!
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
                  <p style="font-size:12px;color:#7777aa">${anime.title?.native || ''}</p>
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
    fetchAniListRecommendations();
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

async function fetchAniListRecommendations() {
  state.phase = "loading";
  state.loadingMessage = "취향 분석 중...";
  render();

  state.analysisText = generateAnalysis(state.answers);
  
  // Direct Genre Mapping (Simple & Robust)
  const genreSet = new Set();
  // Valid AniList Genres: Action, Adventure, Comedy, Drama, Fantasy, Horror, Mecha, Mystery, Psychological, Romance, Sci-Fi, Slice of Life, Sports, Supernatural, Thriller
  if(state.answers.mood) genreSet.add(state.answers.mood);
  if(state.answers.world) genreSet.add(state.answers.world);
  if(state.answers.theme) genreSet.add(state.answers.theme);
  
  const genres = Array.from(genreSet);
  const randomPage = Math.floor(Math.random() * 5) + 1;

  const query = `
    query ($genres: [String], $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(
          type: ANIME
          genre_in: $genres
          sort: [SCORE_DESC, POPULARITY_DESC]
          isAdult: false
        ) {
          id
          title { romaji english native }
          synonyms
          coverImage { large }
          bannerImage
          description(asHtml: false)
          averageScore
          episodes
          genres
          studios(isMain: true) { nodes { name } }
        }
      }
    }
  `;

  const variables = {
    genres: genres.length > 0 ? genres : ["Action"], // Fallback genre
    page: randomPage,
    perPage: 18
  };

  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    
    if (!res.ok) throw new Error("Network response was not ok");
    
    const data = await res.json();
    if (data.errors) throw new Error(data.errors[0].message);
    
    let rawResults = data?.data?.Page?.media || [];
    
    if (rawResults.length === 0) {
      throw new Error("No results found");
    }

    state.results = shuffleArray(rawResults);
    state.phase = "results";
  } catch (e) {
    console.error("API Error, using fallback:", e);
    state.error = "네트워크 상태가 불안정하여 인기작을 보여드립니다.";
    // USE FALLBACK DATA
    state.results = shuffleArray([...BACKUP_ANIME]);
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

document.addEventListener("DOMContentLoaded", () => {
  render();
});