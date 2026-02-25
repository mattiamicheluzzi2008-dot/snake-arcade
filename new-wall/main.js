import {
  createInitialState,
  queueDirection,
  restartState,
  startGame,
  stepGame,
  togglePause,
} from "./snake-game.js";

const GRID_SIZE = 20;
const STORAGE_KEY = "snake-arcade-meta-v2";

const DIFFICULTIES = {
  easy: { label: "Facile", tickMs: 170 },
  medium: { label: "Media", tickMs: 130 },
  hard: { label: "Difficile", tickMs: 95 },
  smooth: { label: "Smooth 120Hz", tickMs: 80, smooth: true },
};

const THEMES = ["dark", "light", "green", "gold"];

const SKINS = [
  { id: "classic", name: "Classica Verde", cost: 0, tier: "Base", ability: "Bilanciata", body: "#2fbe68", head: "#d4ffe3" },
  {
    id: "vip-carbon-platinum",
    name: "Carbon Platinum VIP",
    cost: 0,
    tier: "VIP",
    ability: "Tutte le abilità",
    rules: { wrapWalls: true },
    coinBonus: 3,
    tickDelta: -14,
    body:
      "linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.02) 45%), repeating-linear-gradient(45deg, rgba(255,255,255,0.16) 0 2px, rgba(0,0,0,0.18) 2px 4px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.06) 0 2px, rgba(0,0,0,0.2) 2px 4px), #7b8594",
    head:
      "linear-gradient(135deg, #ffffff, #dbe4ef 45%, #b8c4d6), repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0 2px, rgba(0,0,0,0.08) 2px 4px), #c7d2e0",
  },
  { id: "retro", name: "Retro Lime", cost: 10, tier: "Retro", ability: "+1 coin per mela", coinBonus: 1, body: "#9ddc39", head: "#efffb8" },
  { id: "platinum", name: "Platino", cost: 18, tier: "Premium", ability: "Warp muri", rules: { wrapWalls: true }, body: "#b8bec8", head: "#f5f7fa" },
  { id: "gold", name: "Oro", cost: 34, tier: "Premium", ability: "+2 coin per mela", coinBonus: 2, body: "#d3a437", head: "#ffe9a6" },
  {
    id: "carbon",
    name: "Carbon Fiber",
    cost: 52,
    tier: "Elite",
    ability: "Warp muri +1 coin",
    rules: { wrapWalls: true },
    coinBonus: 1,
    body:
      "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.00) 55%), repeating-linear-gradient(45deg, rgba(255,255,255,0.10) 0 2px, rgba(0,0,0,0.15) 2px 4px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.04) 0 2px, rgba(0,0,0,0.18) 2px 4px), #2b2f35",
    head:
      "linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,255,255,0.02) 60%), repeating-linear-gradient(45deg, rgba(255,255,255,0.13) 0 2px, rgba(0,0,0,0.18) 2px 4px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0 2px, rgba(0,0,0,0.18) 2px 4px), #565d67",
  },
  { id: "ocean", name: "Ocean Wave", cost: 14, tier: "Color", ability: "Tick -8ms", tickDelta: -8, body: "linear-gradient(135deg, #0ea5e9, #1d4ed8)", head: "linear-gradient(135deg, #bfdbfe, #60a5fa)" },
  { id: "sunset", name: "Sunset", cost: 16, tier: "Color", ability: "Tick -6ms", tickDelta: -6, body: "linear-gradient(135deg, #fb7185, #f59e0b)", head: "linear-gradient(135deg, #ffe4b5, #ffd1dc)" },
  { id: "violet-flux", name: "Violet Flux", cost: 20, tier: "Color", ability: "+1 coin per mela", coinBonus: 1, body: "linear-gradient(135deg, #8b5cf6, #ec4899)", head: "linear-gradient(135deg, #ddd6fe, #fbcfe8)" },
  { id: "ice", name: "Ice Glass", cost: 22, tier: "Premium", ability: "Tick -10ms", tickDelta: -10, body: "linear-gradient(135deg, #93c5fd, #e0f2fe)", head: "linear-gradient(135deg, #ffffff, #dbeafe)" },
  { id: "lava", name: "Lava Core", cost: 24, tier: "Premium", ability: "+1 coin per mela", coinBonus: 1, body: "linear-gradient(135deg, #ef4444, #f97316 55%, #facc15)", head: "linear-gradient(135deg, #fff7cc, #fdba74)" },
  { id: "forest", name: "Forest Moss", cost: 12, tier: "Color", ability: "Tick +8ms", tickDelta: 8, body: "linear-gradient(135deg, #15803d, #84cc16)", head: "linear-gradient(135deg, #dcfce7, #bef264)" },
  { id: "candy", name: "Candy Pop", cost: 26, tier: "Premium", ability: "+1 coin + Tick -6ms", coinBonus: 1, tickDelta: -6, body: "linear-gradient(135deg, #f472b6, #38bdf8, #fde047)", head: "linear-gradient(135deg, #fff1f2, #e0f2fe)" },
  { id: "neon-grid", name: "Neon Grid", cost: 28, tier: "Premium", ability: "Tick -12ms", tickDelta: -12, body: "linear-gradient(135deg, #22d3ee, #a855f7), repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 4px)", head: "linear-gradient(135deg, #ecfeff, #f5d0fe)" },
  { id: "ember", name: "Ember Dust", cost: 19, tier: "Color", ability: "Tick -4ms", tickDelta: -4, body: "linear-gradient(135deg, #fb7185, #7c2d12)", head: "linear-gradient(135deg, #fecaca, #fdba74)" },
  { id: "aurora", name: "Aurora", cost: 32, tier: "Elite", ability: "Warp muri + Tick -8ms", rules: { wrapWalls: true }, tickDelta: -8, body: "linear-gradient(135deg, #22c55e, #06b6d4, #8b5cf6)", head: "linear-gradient(135deg, #dcfce7, #cffafe, #ede9fe)" },
  { id: "omni-100", name: "Omni Serpent", cost: 100, tier: "Legend", ability: "Tutte le abilità", rules: { wrapWalls: true }, coinBonus: 3, tickDelta: -14, body: "linear-gradient(135deg, #facc15, #22d3ee, #a855f7, #f43f5e)", head: "linear-gradient(135deg, #ffffff, #fde68a, #ddd6fe)" },
];

const arcadeHomeEl = document.querySelector("#arcadeHome");
const homeSnakeBtn = document.querySelector("#homeSnakeBtn");
const homeSnakeSmoothBtn = document.querySelector("#homeSnakeSmoothBtn");

const snakeScreenEl = document.querySelector("#snakeScreen");
const panelEl = snakeScreenEl;
const boardEl = document.querySelector("#board");
const scoreEl = document.querySelector("#score");
const bestScoreEl = document.querySelector("#bestScore");
const statusEl = document.querySelector("#status");
const coinsDisplayEl = document.querySelector("#coinsDisplay");
const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const topArcadeBtn = document.querySelector("#topArcadeBtn");
const topShopBtn = document.querySelector("#topShopBtn");
const pcModeBtn = document.querySelector("#pcModeBtn");
const mobileModeBtn = document.querySelector("#mobileModeBtn");
const controlButtons = document.querySelectorAll("[data-dir]");

const overlayEl = document.querySelector("#snakeOverlay");
const snakeMenuScreenEl = document.querySelector("#snakeMenuScreen");
const snakeLevelsScreenEl = document.querySelector("#snakeLevelsScreen");
const snakeShopScreenEl = document.querySelector("#snakeShopScreen");
const snakeMenuEyebrowEl = document.querySelector("#snakeMenuEyebrow");
const snakeMenuTitleEl = document.querySelector("#snakeMenuTitle");
const snakeMenuTextEl = document.querySelector("#snakeMenuText");
const snakePageTitleEl = document.querySelector("#snakePageTitle");
const snakePageSubtitleEl = document.querySelector("#snakePageSubtitle");
const overlayPlayBtn = document.querySelector("#overlayPlayBtn");
const overlayBackHomeBtn = document.querySelector("#overlayBackHomeBtn");
const levelsBackBtn = document.querySelector("#levelsBackBtn");
const levelsShopBtn = document.querySelector("#levelsShopBtn");
const overlayStartBtn = document.querySelector("#overlayStartBtn");
const shopBackBtn = document.querySelector("#shopBackBtn");
const shopBackHomeBtn = document.querySelector("#shopBackHomeBtn");
const difficultyButtons = document.querySelectorAll("[data-difficulty]");
const shopCoinsEl = document.querySelector("#shopCoins");
const shopActiveSkinEl = document.querySelector("#shopActiveSkin");
const shopListEl = document.querySelector("#shopList");
const ownedSkinsListEl = document.querySelector("#ownedSkinsList");
const themeListEl = document.querySelector("#themeList");
const snakeLayerEl = document.createElement("div");

let state = createInitialState({ width: GRID_SIZE, height: GRID_SIZE });
let cells = [];
let selectedDifficulty = "easy";
let inputMode = window.matchMedia("(max-width: 768px)").matches ? "mobile" : "pc";
let tickTimeoutId = null;
let appView = "home";
let overlayVisible = true;
let overlayScreen = "menu";
let shopBackScreen = "menu";
let overlayPausedGame = false;
let currentGameVariant = "classic";
let shopUiDirty = true;
let animationFrameId = null;
let lastTickAt = performance.now();
let lastTickDurationMs = DIFFICULTIES.easy.tickMs;
let prevSnakeForAnim = state.snake.map(cloneCell);
let currSnakeForAnim = state.snake.map(cloneCell);
let snakeSegmentEls = [];

let meta = loadMeta();

boardEl.style.setProperty("--cols", String(state.width));
snakeLayerEl.className = "snake-layer";
boardEl.appendChild(snakeLayerEl);
buildBoard(state.width, state.height);
setDifficulty(selectedDifficulty);
setInputMode(inputMode);
applyActiveSkin();
applySkinRulesToState();
applyTheme();
updateSnakeModeUI();
render();
scheduleNextTick();
startAnimationLoop();

homeSnakeBtn.addEventListener("click", () => openSnakePage("classic"));
homeSnakeSmoothBtn.addEventListener("click", () => openSnakePage("smooth"));
overlayPlayBtn.addEventListener("click", () => {
  if (currentGameVariant === "smooth") {
    setDifficulty("smooth");
    restartAndStart();
    return;
  }
  showOverlay("levels", { pauseGame: false });
});
overlayBackHomeBtn.addEventListener("click", () => goToArcadeHome());
levelsBackBtn.addEventListener("click", () => showOverlay("menu", { pauseGame: false }));
levelsShopBtn.addEventListener("click", () => openShop("levels", false));
overlayStartBtn.addEventListener("click", () => restartAndStart());
shopBackBtn.addEventListener("click", () => {
  if (shopBackScreen === "game") {
    hideOverlay();
    return;
  }
  showOverlay(shopBackScreen, { pauseGame: false });
});
shopBackHomeBtn.addEventListener("click", () => goToArcadeHome());

startBtn.addEventListener("click", () => restartAndStart());
pauseBtn.addEventListener("click", () => {
  if (overlayVisible) {
    hideOverlay();
    return;
  }
  if (state.status === "ready" || state.status === "gameover") {
    showOverlay(currentGameVariant === "smooth" ? "menu" : "levels", { pauseGame: false });
    return;
  }
  state = togglePause(state);
  pauseBtn.textContent = state.status === "paused" ? "Riprendi" : "Pausa";
  render();
});

topArcadeBtn.addEventListener("click", () => goToArcadeHome());
topShopBtn.addEventListener("click", () => openShop(overlayVisible ? overlayScreen : "game"));

pcModeBtn.addEventListener("click", async () => {
  setInputMode("pc");
  await enterFullscreenIfPossible();
});
mobileModeBtn.addEventListener("click", async () => {
  setInputMode("mobile");
  await exitFullscreenIfPossible();
});

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setDifficulty(button.dataset.difficulty);
    render();
  });
});

themeListEl.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-theme]");
  if (!btn) return;
  setTheme(btn.dataset.theme);
});

controlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyDirection(button.dataset.dir);
    boardEl.focus();
  });
});

shopListEl.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-buy-skin]");
  if (!btn) return;
  handleSkinBuy(btn.dataset.skinId);
});

ownedSkinsListEl.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-equip-skin]");
  if (!btn) return;
  handleSkinEquip(btn.dataset.skinId);
});

document.addEventListener("keydown", onKeyDown);
boardEl.addEventListener("click", () => boardEl.focus());
document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement !== panelEl && inputMode === "pc") {
    setInputMode("mobile");
  }
});

function gameTick() {
  const prevStatus = state.status;
  const prevScore = state.score;
  const prevSnake = state.snake.map(cloneCell);
  const tickMs = getCurrentTickMs();
  state = stepGame(state);
  lastTickDurationMs = tickMs;
  lastTickAt = performance.now();
  prevSnakeForAnim = prevSnake;
  currSnakeForAnim = state.snake.map(cloneCell);

  const gainedCoins = state.score - prevScore;
  if (gainedCoins > 0) {
    meta.coins += gainedCoins * getActiveSkinCoinMultiplier();
    if (state.score > meta.bestScore) {
      meta.bestScore = state.score;
    }
    shopUiDirty = true;
    saveMeta();
  }

  if (prevStatus !== state.status && state.status === "gameover") {
    pauseBtn.textContent = "Pausa";
    showOverlay("menu");
  } else {
    render();
  }

  scheduleNextTick();
}

function scheduleNextTick() {
  window.clearTimeout(tickTimeoutId);
  const tickMs = getCurrentTickMs();
  tickTimeoutId = window.setTimeout(gameTick, tickMs);
}

function buildBoard(width, height) {
  const total = width * height;
  const fragment = document.createDocumentFragment();
  cells = Array.from({ length: total }, () => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.setAttribute("role", "gridcell");
    fragment.appendChild(cell);
    return cell;
  });
  boardEl.replaceChildren(fragment, snakeLayerEl);
}

function render() {
  arcadeHomeEl.hidden = appView !== "home";
  snakeScreenEl.hidden = appView !== "snake";
  overlayEl.hidden = !overlayVisible || appView !== "snake";

  renderOverlayScreen();
  renderOverlayShop();
  applyActiveSkin();
  renderThemeButtons();

  scoreEl.textContent = String(state.score);
  bestScoreEl.textContent = String(meta.bestScore);
  statusEl.textContent = statusLabel(state.status);
  coinsDisplayEl.textContent = String(meta.coins);
  shopCoinsEl.textContent = String(meta.coins);
  shopActiveSkinEl.textContent = getSkin(meta.activeSkin).name;

  for (const cell of cells) {
    cell.className = "cell";
  }

  const foodIndex = indexFor(state.food.x, state.food.y, state.width);
  if (cells[foodIndex]) cells[foodIndex].classList.add("cell--food");

  state.snake.forEach((segment, index) => {
    if (usesSmoothVisualSnake()) return;
    const cellIndex = indexFor(segment.x, segment.y, state.width);
    const cell = cells[cellIndex];
    if (!cell) return;
    cell.classList.add("cell--snake");
    if (index === 0) cell.classList.add("cell--head");
  });
}

function renderOverlayScreen() {
  overlayEl.dataset.screen = overlayScreen;
  snakeMenuScreenEl.hidden = overlayScreen !== "menu";
  snakeLevelsScreenEl.hidden = overlayScreen !== "levels";
  snakeShopScreenEl.hidden = overlayScreen !== "shop";
}

function renderOverlayShop() {
  if (!overlayVisible || overlayScreen !== "shop") {
    return;
  }
  if (!shopUiDirty) {
    return;
  }
  renderShopList();
  renderOwnedSkins();
  shopUiDirty = false;
}

function renderShopList() {
  const owned = new Set(meta.ownedSkins);
  shopListEl.innerHTML = getSortedSkins().map((skin) => {
    const isOwned = owned.has(skin.id);
    const canBuy = meta.coins >= skin.cost;
    const disabled = isOwned || (!isOwned && !canBuy);
    const abilityMeta = getSkinAbilityMeta(skin);
    return `
      <article class="shop-card ${isOwned ? "shop-card--owned" : ""}">
        <div class="shop-card__preview" data-preview-skin="${skin.id}">
          <span class="shop-card__segment shop-card__segment--head"></span>
          <span class="shop-card__segment shop-card__segment--body"></span>
          <span class="shop-card__segment shop-card__segment--body"></span>
        </div>
        <div class="shop-card__body">
          <div>
            <h3>${skin.name}</h3>
            <p>${skin.tier} · ${skin.ability ?? "Base"}</p>
          </div>
          <div class="shop-card__side">
            <span
              class="shop-card__ability-icon"
              title="${abilityMeta.label}"
              aria-label="${abilityMeta.label}"
            >${abilityMeta.icon}</span>
            <span class="shop-card__price">${isOwned ? "Posseduta" : `${skin.cost} coin`}</span>
          </div>
        </div>
        <button
          type="button"
          class="shop-card__action"
          data-buy-skin="1"
          data-skin-id="${skin.id}"
          ${disabled ? "disabled" : ""}
        >
          ${isOwned ? "Comprata" : "Compra"}
        </button>
      </article>
    `;
  }).join("");

  applyPreviewSkins(shopListEl);
}

function renderOwnedSkins() {
  const ownedIds = new Set(meta.ownedSkins);
  const owned = getSortedSkins().filter((skin) => ownedIds.has(skin.id));
  ownedSkinsListEl.innerHTML = owned.map((skin) => {
    const isActive = meta.activeSkin === skin.id;
    const abilityMeta = getSkinAbilityMeta(skin);
    return `
      <article class="owned-skin ${isActive ? "owned-skin--active" : ""}">
        <div class="shop-card__preview" data-preview-skin="${skin.id}">
          <span class="shop-card__segment shop-card__segment--head"></span>
          <span class="shop-card__segment shop-card__segment--body"></span>
          <span class="shop-card__segment shop-card__segment--body"></span>
        </div>
        <div class="owned-skin__meta">
          <strong>${skin.name}</strong>
          <span>${skin.tier} · ${skin.ability ?? "Base"}</span>
        </div>
        <span
          class="shop-card__ability-icon owned-skin__ability"
          title="${abilityMeta.label}"
          aria-label="${abilityMeta.label}"
        >${abilityMeta.icon}</span>
        <button
          type="button"
          class="shop-card__action"
          data-equip-skin="1"
          data-skin-id="${skin.id}"
          ${isActive ? "disabled" : ""}
        >
          ${isActive ? "Attiva" : "Usa"}
        </button>
      </article>
    `;
  }).join("");

  applyPreviewSkins(ownedSkinsListEl);
}

function applyPreviewSkins(root) {
  for (const preview of root.querySelectorAll("[data-preview-skin]")) {
    const skin = getSkin(preview.dataset.previewSkin);
    preview.style.setProperty("--preview-body", skin.body);
    preview.style.setProperty("--preview-head", skin.head);
  }
}

function onKeyDown(event) {
  const key = event.key.toLowerCase();

  if (appView === "home") {
    if (key === "enter" || key === " ") {
      event.preventDefault();
      openSnakePage();
    }
    return;
  }

  if (overlayVisible) {
    if (overlayScreen === "levels" && (key === "1" || key === "2" || key === "3")) {
      event.preventDefault();
      setDifficulty(key === "1" ? "easy" : key === "2" ? "medium" : "hard");
      render();
      return;
    }
    if ((key === "enter" || key === " ") && state.status === "ready") {
      event.preventDefault();
      if (overlayScreen === "menu") {
        if (currentGameVariant === "smooth") restartAndStart();
        else showOverlay("levels", { pauseGame: false });
      }
      else if (overlayScreen === "levels") restartAndStart();
      return;
    }
    if (key === "escape" && state.status !== "ready") {
      event.preventDefault();
      hideOverlay();
      return;
    }
  }

  if (key === " " || key === "spacebar") {
    event.preventDefault();
    if (overlayVisible) {
      hideOverlay();
    } else if (state.status === "running" || state.status === "paused") {
      state = togglePause(state);
      pauseBtn.textContent = state.status === "paused" ? "Riprendi" : "Pausa";
      render();
    }
    return;
  }

  if (key === "enter") {
    event.preventDefault();
    if (!overlayVisible && (state.status === "ready" || state.status === "gameover")) {
      showOverlay(currentGameVariant === "smooth" ? "menu" : "levels", { pauseGame: false });
    }
    return;
  }

  const directionByKey = {
    arrowup: "up",
    w: "up",
    arrowdown: "down",
    s: "down",
    arrowleft: "left",
    a: "left",
    arrowright: "right",
    d: "right",
  };
  const direction = directionByKey[key];
  if (!direction) return;
  event.preventDefault();
  applyDirection(direction);
}

function applyDirection(direction) {
  if (appView !== "snake" || overlayVisible) return;
  if (state.status !== "running") return;
  state = queueDirection(state, direction);
  render();
}

function restartAndStart() {
  state = restartState(state);
  applySkinRulesToState();
  state = startGame(state);
  prevSnakeForAnim = state.snake.map(cloneCell);
  currSnakeForAnim = state.snake.map(cloneCell);
  lastTickAt = performance.now();
  lastTickDurationMs = getCurrentTickMs();
  pauseBtn.textContent = "Pausa";
  overlayVisible = false;
  overlayPausedGame = false;
  render();
  boardEl.focus();
}

function openSnakePage(variant = "classic") {
  currentGameVariant = variant === "smooth" ? "smooth" : "classic";
  if (currentGameVariant === "smooth") {
    setDifficulty("smooth");
  } else if (selectedDifficulty === "smooth") {
    setDifficulty("easy");
  }
  appView = "snake";
  overlayVisible = true;
  overlayScreen = "menu";
  updateSnakeModeUI();
  render();
}

function goToArcadeHome() {
  appView = "home";
  overlayVisible = true;
  overlayScreen = "menu";
  if (state.status === "running") {
    state = togglePause(state);
    pauseBtn.textContent = "Riprendi";
  }
  exitFullscreenIfPossible();
  render();
}

function showOverlay(screen, { pauseGame = true } = {}) {
  overlayVisible = true;
  setOverlayScreen(screen);
  if (screen === "shop") {
    shopUiDirty = true;
  }
  if (pauseGame && state.status === "running") {
    state = togglePause(state);
    pauseBtn.textContent = "Riprendi";
    overlayPausedGame = true;
  }
  render();
}

function hideOverlay() {
  overlayVisible = false;
  if (overlayPausedGame && state.status === "paused") {
    state = togglePause(state);
    pauseBtn.textContent = "Pausa";
  }
  overlayPausedGame = false;
  render();
}

function openShop(backScreen = "menu", pauseGame = true) {
  shopBackScreen = backScreen;
  showOverlay("shop", { pauseGame });
}

function setOverlayScreen(screen) {
  const allowed = new Set(["menu", "levels", "shop"]);
  const normalized = allowed.has(screen) ? screen : "menu";
  overlayScreen = currentGameVariant === "smooth" && normalized === "levels" ? "menu" : normalized;
}

function setInputMode(mode) {
  inputMode = mode === "mobile" ? "mobile" : "pc";
  panelEl.dataset.inputMode = inputMode;
  pcModeBtn.classList.toggle("is-active", inputMode === "pc");
  mobileModeBtn.classList.toggle("is-active", inputMode === "mobile");
}

function updateSnakeModeUI() {
  const smooth = currentGameVariant === "smooth";
  snakePageTitleEl.textContent = smooth ? "Snake Smooth" : "Snake";
  snakePageSubtitleEl.textContent = smooth
    ? "Modalità fluida separata (120Hz style)"
    : "Modalità classica su griglia";
  snakeMenuEyebrowEl.textContent = smooth ? "Snake Smooth" : "Snake";
  snakeMenuTitleEl.textContent = smooth ? "Menu Smooth" : "Menu";
  snakeMenuTextEl.textContent = smooth
    ? "Modalità fluida come gioco separato. Premi Play per iniziare direttamente."
    : "Apri il negozio in alto a destra oppure premi Play per scegliere il livello.";
}

async function enterFullscreenIfPossible() {
  if (!document.fullscreenEnabled || document.fullscreenElement === panelEl) return;
  try {
    await panelEl.requestFullscreen();
  } catch {}
}

async function exitFullscreenIfPossible() {
  if (document.fullscreenElement !== panelEl) return;
  try {
    await document.exitFullscreen();
  } catch {}
}

function setDifficulty(level) {
  if (!DIFFICULTIES[level]) return;
  selectedDifficulty = level;
  difficultyButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.difficulty === level);
  });
  lastTickDurationMs = getCurrentTickMs();
  scheduleNextTick();
}

function handleSkinBuy(skinId) {
  const skin = getSkin(skinId);
  const owned = new Set(meta.ownedSkins);
  if (!skin || owned.has(skin.id) || meta.coins < skin.cost) return;
  meta.coins -= skin.cost;
  owned.add(skin.id);
  meta.ownedSkins = [...owned];
  shopUiDirty = true;
  saveMeta();
  render();
}

function handleSkinEquip(skinId) {
  if (!meta.ownedSkins.includes(skinId)) return;
  meta.activeSkin = skinId;
  applySkinRulesToState();
  shopUiDirty = true;
  saveMeta();
  applyActiveSkin();
  lastTickDurationMs = getCurrentTickMs();
  scheduleNextTick();
  render();
}

function applyActiveSkin() {
  const skin = getSkin(meta.activeSkin);
  panelEl.dataset.skin = skin.id;
  panelEl.style.setProperty("--snake-color", skin.body);
  panelEl.style.setProperty("--snake-head-color", skin.head);
}

function applyTheme() {
  document.body.dataset.theme = THEMES.includes(meta.theme) ? meta.theme : "dark";
}

function setTheme(theme) {
  if (!THEMES.includes(theme)) return;
  meta.theme = theme;
  shopUiDirty = true;
  saveMeta();
  applyTheme();
  render();
}

function renderThemeButtons() {
  for (const btn of themeListEl.querySelectorAll("[data-theme]")) {
    btn.classList.toggle("is-active", btn.dataset.theme === meta.theme);
  }
}

function applySkinRulesToState() {
  const skin = getSkin(meta.activeSkin);
  state = {
    ...state,
    rules: {
      wrapWalls: Boolean(skin.rules?.wrapWalls),
    },
  };
}

function getCurrentTickMs() {
  const skin = getSkin(meta.activeSkin);
  const delta = Number.isFinite(skin.tickDelta) ? skin.tickDelta : 0;
  return Math.max(55, DIFFICULTIES[selectedDifficulty].tickMs + delta);
}

function getActiveSkinCoinMultiplier() {
  const skin = getSkin(meta.activeSkin);
  const explicit = Number.isFinite(skin.coinBonus) ? skin.coinBonus : 0;
  const costBased =
    skin.cost >= 50 ? 2
    : skin.cost >= 30 ? 1
    : 0;
  return 1 + Math.max(explicit, costBased);
}

function isSmoothMode() {
  return Boolean(DIFFICULTIES[selectedDifficulty]?.smooth);
}

function usesSmoothVisualSnake() {
  return currentGameVariant === "smooth";
}

function startAnimationLoop() {
  const frame = (now) => {
    renderSmoothSnakeLayer(now);
    animationFrameId = window.requestAnimationFrame(frame);
  };
  animationFrameId = window.requestAnimationFrame(frame);
}

function renderSmoothSnakeLayer(now) {
  const active =
    appView === "snake" &&
    usesSmoothVisualSnake() &&
    (!overlayVisible || overlayScreen === "shop" || overlayScreen === "levels" || overlayScreen === "menu");

  if (!active) {
    snakeLayerEl.hidden = true;
    return;
  }

  snakeLayerEl.hidden = false;
  ensureSnakeSegments(currSnakeForAnim.length);

  const alphaBase = Math.max(0, Math.min(1, (now - lastTickAt) / Math.max(1, lastTickDurationMs)));
  const alpha = state.status === "running" ? alphaBase : 1;
  const layerRect = snakeLayerEl.getBoundingClientRect();
  const width = layerRect.width;
  const height = layerRect.height;
  const gapPx = 1;
  const cellW = (width - gapPx * (state.width - 1)) / state.width;
  const cellH = (height - gapPx * (state.height - 1)) / state.height;

  currSnakeForAnim.forEach((curr, index) => {
    const prev = prevSnakeForAnim[index] ?? curr;
    const segmentEl = snakeSegmentEls[index];
    const interp = interpolateCell(prev, curr, alpha, state.width, state.height, Boolean(state.rules?.wrapWalls));
    const x = interp.x * (cellW + gapPx);
    const y = interp.y * (cellH + gapPx);
    segmentEl.hidden = false;
    segmentEl.className = `snake-segment${index === 0 ? " snake-segment--head" : ""}`;
    segmentEl.style.transform = `translate(${x}px, ${y}px)`;
    segmentEl.style.width = `${cellW}px`;
    segmentEl.style.height = `${cellH}px`;
  });

  for (let i = currSnakeForAnim.length; i < snakeSegmentEls.length; i += 1) {
    snakeSegmentEls[i].hidden = true;
  }
}

function ensureSnakeSegments(count) {
  while (snakeSegmentEls.length < count) {
    const el = document.createElement("div");
    el.className = "snake-segment";
    snakeLayerEl.appendChild(el);
    snakeSegmentEls.push(el);
  }
}

function interpolateCell(prev, curr, alpha, width, height, wrapWalls) {
  let dx = curr.x - prev.x;
  let dy = curr.y - prev.y;

  if (wrapWalls) {
    if (prev.x === width - 1 && curr.x === 0) dx = 1;
    if (prev.x === 0 && curr.x === width - 1) dx = -1;
    if (prev.y === height - 1 && curr.y === 0) dy = 1;
    if (prev.y === 0 && curr.y === height - 1) dy = -1;
  }

  if (Math.abs(dx) > 1 || Math.abs(dy) > 1) return curr;

  let x = prev.x + dx * alpha;
  let y = prev.y + dy * alpha;

  if (wrapWalls) {
    if (x < 0) x += width;
    if (x >= width) x -= width;
    if (y < 0) y += height;
    if (y >= height) y -= height;
  }

  return {
    x,
    y,
  };
}

function cloneCell(cell) {
  return { x: cell.x, y: cell.y };
}

function getSkin(id) {
  return SKINS.find((skin) => skin.id === id) ?? SKINS[0];
}

function getSortedSkins() {
  return [...SKINS].sort((a, b) => getSkinPowerScore(a) - getSkinPowerScore(b));
}

function getSkinPowerScore(skin) {
  let score = skin.cost;
  if (skin.rules?.wrapWalls) score += 18;
  if (Number.isFinite(skin.coinBonus)) score += skin.coinBonus * 8;
  if (Number.isFinite(skin.tickDelta) && skin.tickDelta < 0) score += Math.abs(skin.tickDelta);
  if (Number.isFinite(skin.tickDelta) && skin.tickDelta > 0) score -= Math.min(6, skin.tickDelta / 2);
  return score;
}

function getSkinAbilityMeta(skin) {
  if (skin.rules?.wrapWalls && Number.isFinite(skin.coinBonus) && skin.coinBonus > 0) {
    return { icon: "◎", label: "Warp muri + bonus coin" };
  }
  if (skin.rules?.wrapWalls) {
    return { icon: "⇄", label: "Warp muri" };
  }
  if (Number.isFinite(skin.coinBonus) && skin.coinBonus > 0) {
    return { icon: "◉", label: `Bonus coin x${1 + skin.coinBonus}` };
  }
  if (Number.isFinite(skin.tickDelta) && skin.tickDelta < 0) {
    return { icon: "⚡", label: "Velocità aumentata" };
  }
  if (Number.isFinite(skin.tickDelta) && skin.tickDelta > 0) {
    return { icon: "◌", label: "Controllo più lento" };
  }
  return { icon: "•", label: "Abilità base" };
}

function loadMeta() {
  const fallback = {
    coins: 0,
    bestScore: 0,
    ownedSkins: ["classic", "vip-carbon-platinum"],
    activeSkin: "classic",
    theme: "dark",
  };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    const owned = Array.isArray(parsed.ownedSkins) ? parsed.ownedSkins : ["classic"];
    if (!owned.includes("classic")) owned.unshift("classic");
    if (!owned.includes("vip-carbon-platinum")) owned.unshift("vip-carbon-platinum");
    const active = owned.includes(parsed.activeSkin) ? parsed.activeSkin : "classic";
    const coins = Number.isFinite(parsed.coins) ? Math.max(0, Math.floor(parsed.coins)) : 0;
    const bestScore = Number.isFinite(parsed.bestScore) ? Math.max(0, Math.floor(parsed.bestScore)) : 0;
    const theme = THEMES.includes(parsed.theme) ? parsed.theme : "dark";
    return { coins, bestScore, ownedSkins: [...new Set(owned)], activeSkin: active, theme };
  } catch {
    return fallback;
  }
}

function saveMeta() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
  } catch {}
}

function indexFor(x, y, width) {
  return y * width + x;
}

function statusLabel(status) {
  if (status === "running") return "In gioco";
  if (status === "paused") return "In pausa";
  if (status === "gameover") return "Game over";
  return "Pronto";
}

window.addEventListener("beforeunload", () => {
  window.clearTimeout(tickTimeoutId);
  if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
});
