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
];

// Fallback Data (In case of API limit or zero results)
const BACKUP_ANIME = [
  { id: 1, title: { romaji: "Cowboy Bebop", english: "Cowboy Bebop", native: "カウボーイビバップ" }, coverImage: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1-CXtrrkMpJ8Zq.png" }, averageScore: 86, genres: ["Action", "Sci-Fi"], description: "2071년, 우주 현상금 사냥꾼들의 스타일리시한 액션 활극." },
  { id: 16498, title: { romaji: "Shingeki no Kyojin", english: "Attack on Titan", native: "進撃の巨人" }, coverImage: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16498-m5ZMNtFioc7j.jpg" }, averageScore: 85, genres: ["Action", "Drama"], description: "식인 거인에 맞선 인류의 처절한 생존 투쟁." },
  { id: 21519, title: { romaji: "Kimi no Na wa.", english: "Your Name.", native: "君の名は。" }, coverImage: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21519-IVCd8XTSX28d.jpg" }, averageScore: 89, genres: ["Romance", "Supernatural"], description: "꿈속에서 몸이 뒤바뀐 도시 소년과 시골 소녀의 기적 같은 이야기." },
  { id: 140960, title: { romaji: "SPY x FAMILY", english: "SPY x FAMILY", native: "SPY×FAMILY" }, coverImage: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx140960-Yl5M3AiLjmkr.jpg" }, averageScore: 86, genres: ["Comedy", "Action"], description: "스파이, 암살자, 초능력자가 가짜 가족이 되어 펼치는 코미디." }
];

// ── STATE ──
const state = {
  phase: "intro", // intro | quiz | loading | results
  currentQ: 0,
  answers: {},
  selected: null,
  results: [],
  visibleCount: 3,
  error: null,
  analysisText: "",
};

const app = document.getElementById("app");

// ── LOGIC ──

function generateAnalysis(ans) {
  const moods = { Action: "강렬한 에너지", Comedy: "즐거운 웃음", Drama: "깊은 몰입감", Romance: "설레는 감정" };
  const worlds = { Fantasy: "환상적인 세계", "Sci-Fi": "미래지향적 풍경", "Slice of Life": "소소한 일상", Supernatural: "신비로운 분위기" };
  return `${worlds[ans.world] || "매력적인 세계"}에서 펼쳐지는 ${moods[ans.mood] || "특별한"} 이야기를 선호하시는군요. 당신의 취향 DNA에 새겨진 최고의 작품들을 선별했습니다.`;
}

function getKoreanTitle(media) {
  const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  const krSynonym = media.synonyms?.find(s => koreanRegex.test(s));
  if (krSynonym) return krSynonym;
  if (media.title.native && koreanRegex.test(media.title.native)) return media.title.native;
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
          <span style="color:#a0a0ff;font-weight:600">AniList API</span> 실시간 데이터를 기반으로<br>
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
            ${state.currentQ < QUESTIONS.length - 1 ? "다음 단계 →" : "결과 보기 ✨"}
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
        <p style="font-size:20px;font-weight:700;margin-bottom:8px">AniList 실시간 데이터 분석 중...</p>
        <p style="color:#7777aa;font-size:14px">당신의 취향 DNA와 매칭되는 작품을 찾는 중입니다.</p>
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
          취향 분석 리포트
        </h2>
        
        <div style="background:rgba(255,255,255,0.05);padding:24px;border-radius:16px;margin-bottom:32px;border:1px solid rgba(120,120,255,0.2);line-height:1.7;color:#e8e8ff;max-width:800px;margin-left:auto;margin-right:auto;text-align:left">
          <p style="font-size:16px;font-weight:500">${state.analysisText}</p>
        </div>
      </div>

      ${state.error ? `
        <div style="text-align:center;padding:20px;color:#ffaa88;margin-bottom:30px;background:rgba(255,100,100,0.1);border-radius:10px;font-size:14px">
          ⚠️ ${state.error} 대신 인기 명작을 추천해 드릴게요.
        </div>
      ` : ''}

      <div class="anime-grid">
        ${visibleItems.map((anime, i) => {
          const krTitle = getKoreanTitle(anime);
          const titleMain = krTitle || anime.title.english || anime.title.romaji;
          const titleSub = krTitle ? (anime.title.english || anime.title.romaji) : (anime.title.native || "");

          return `
          <div class="anime-card fade-up" style="animation-delay:${i * 0.1}s" 
               onclick="window.open('https://anilist.co/anime/${anime.id}', '_blank')">
            <div class="cover-wrap">
              <img class="cover-img" src="${anime.bannerImage || anime.coverImage.large}" alt="cover">
              <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(10,10,26,0.95) 0%,transparent 50%)"></div>
              
              ${anime.averageScore ? `
                <div class="score-badge">★ ${(anime.averageScore / 10).toFixed(1)}</div>
              ` : ''}
            </div>

            <div class="card-body">
              <div class="title-row">
                <img class="thumb-img" src="${anime.coverImage.large}" alt="">
                <div style="flex:1;min-width:0">
                  <h3 class="anime-title">${titleMain}</h3>
                  <p style="font-size:12px;color:#7777aa;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${titleSub}</p>
                </div>
              </div>

              <div class="genre-row">
                ${anime.genres ? anime.genres.slice(0, 3).map(g => `<span class="genre-chip">${g}</span>`).join('') : ''}
              </div>

              <p class="anime-desc">${truncate(anime.description?.replace(/<[^>]*>/g, "") || "설명이 없습니다.", 100)}</p>

              <div class="cta-box">상세 정보 확인 →</div>
            </div>
          </div>
        `}).join('')}
      </div>

      ${state.results.length > state.visibleCount ? `
        <div style="text-align:center;margin-bottom:40px">
           <button class="primary-btn" onclick="showMore()" style="padding:14px 40px;font-size:14px;background:rgba(120,120,255,0.1);box-shadow:none">
             나머지 추천 작품 더 보기 (+${state.results.length - state.visibleCount})
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
  render();
};

window.handleNext = async () => {
  if (!state.selected) return;
  state.answers[QUESTIONS[state.currentQ].id] = state.selected;

  if (state.currentQ < QUESTIONS.length - 1) {
    state.currentQ++;
    state.selected = null;
    render();
  } else {
    await fetchAniListResults();
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

async function fetchAniListResults() {
  state.phase = "loading";
  render();

  state.analysisText = generateAnalysis(state.answers);

  // Use genre_in (OR condition) to ensure results
  const genres = [state.answers.mood, state.answers.world, state.answers.theme].filter(Boolean);
  const randomPage = Math.floor(Math.random() * 5) + 1;

  const query = `
    query ($genres: [String], $page: Int) {
      Page(page: $page, perPage: 21) {
        media(type: ANIME, genre_in: $genres, sort: [SCORE_DESC, POPULARITY_DESC], isAdult: false) {
          id
          title { romaji english native }
          synonyms
          coverImage { large }
          bannerImage
          description
          averageScore
          genres
        }
      }
    }
  `;

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query, variables: { genres, page: randomPage } }),
    });

    const data = await response.json();
    if (data.errors) throw new Error(data.errors[0].message);

    let fetchedResults = data.data.Page.media || [];
    
    if (fetchedResults.length === 0) {
        throw new Error("결과 없음");
    }

    state.results = shuffleArray(fetchedResults);
    state.phase = "results";
  } catch (e) {
    console.error("AniList Fetch Error:", e);
    state.error = "실시간 데이터를 가져오지 못했습니다.";
    // Backup Data
    state.results = shuffleArray([...BACKUP_ANIME]);
    state.phase = "results";
  }
  render();
}

// Initial Render
document.addEventListener("DOMContentLoaded", render);