export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const DIRECTION_ORDER = ["up", "down", "left", "right"];

export function createInitialState({
  width = 20,
  height = 20,
  rng = Math.random,
} = {}) {
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  const snake = [
    { x: centerX, y: centerY },
    { x: centerX - 1, y: centerY },
    { x: centerX - 2, y: centerY },
  ];

  return {
    width,
    height,
    snake,
    direction: "right",
    nextDirection: "right",
    food: spawnFood(width, height, snake, rng),
    score: 0,
    status: "ready",
  };
}

export function restartState(state, rng = Math.random) {
  return createInitialState({
    width: state.width,
    height: state.height,
    rng,
  });
}

export function queueDirection(state, direction) {
  if (!DIRECTION_ORDER.includes(direction)) {
    return state;
  }

  const current = state.nextDirection ?? state.direction;
  if (isOpposite(current, direction)) {
    return state;
  }

  if (current === direction) {
    return state;
  }

  return {
    ...state,
    nextDirection: direction,
  };
}

export function stepGame(state, rng = Math.random) {
  if (state.status !== "running") {
    return state;
  }

  const nextDirection = state.nextDirection ?? state.direction;
  const head = state.snake[0];
  const delta = DIRECTIONS[nextDirection];
  const rawNextHead = { x: head.x + delta.x, y: head.y + delta.y };
  const wrapWalls = Boolean(state.rules?.wrapWalls);
  const nextHead = wrapWalls
    ? wrapCell(rawNextHead, state.width, state.height)
    : rawNextHead;

  if (!wrapWalls && hitsBoundary(nextHead, state.width, state.height)) {
    return {
      ...state,
      direction: nextDirection,
      nextDirection,
      status: "gameover",
    };
  }

  const willEat = nextHead.x === state.food.x && nextHead.y === state.food.y;
  const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);

  if (hasCell(bodyToCheck, nextHead)) {
    return {
      ...state,
      direction: nextDirection,
      nextDirection,
      status: "gameover",
    };
  }

  const nextSnake = [nextHead, ...state.snake];
  if (!willEat) {
    nextSnake.pop();
  }

  return {
    ...state,
    snake: nextSnake,
    direction: nextDirection,
    nextDirection,
    food: willEat ? spawnFood(state.width, state.height, nextSnake, rng) : state.food,
    score: willEat ? state.score + 1 : state.score,
  };
}

function wrapCell(cell, width, height) {
  let x = cell.x;
  let y = cell.y;
  if (x < 0) x = width - 1;
  if (x >= width) x = 0;
  if (y < 0) y = height - 1;
  if (y >= height) y = 0;
  return { x, y };
}

export function startGame(state) {
  return state.status === "gameover"
    ? { ...state, status: "running" }
    : { ...state, status: "running" };
}

export function togglePause(state) {
  if (state.status === "gameover" || state.status === "ready") {
    return state;
  }

  return {
    ...state,
    status: state.status === "paused" ? "running" : "paused",
  };
}

export function spawnFood(width, height, snake, rng = Math.random) {
  const occupied = new Set(snake.map((cell) => `${cell.x},${cell.y}`));
  const freeCells = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        freeCells.push({ x, y });
      }
    }
  }

  if (freeCells.length === 0) {
    return snake[0];
  }

  const index = Math.floor(rng() * freeCells.length);
  return freeCells[index];
}

function hasCell(cells, target) {
  return cells.some((cell) => cell.x === target.x && cell.y === target.y);
}

function hitsBoundary(cell, width, height) {
  return cell.x < 0 || cell.y < 0 || cell.x >= width || cell.y >= height;
}

function isOpposite(a, b) {
  return (
    (a === "up" && b === "down") ||
    (a === "down" && b === "up") ||
    (a === "left" && b === "right") ||
    (a === "right" && b === "left")
  );
}
