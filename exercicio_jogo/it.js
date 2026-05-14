
const cursorEl = document.getElementById('cursor');

document.addEventListener('mousemove', e => {
  cursorEl.style.left = e.clientX + 'px';
  cursorEl.style.top  = e.clientY + 'px';
  spawnTrail(e.clientX, e.clientY);
});

document.addEventListener('mousedown', () => cursorEl.classList.add('clicking'));
document.addEventListener('mouseup',   () => cursorEl.classList.remove('clicking'));

function spawnTrail(x, y) {
  const d = document.createElement('div');
  d.className = 'trail-dot';
  d.style.left   = x + 'px';
  d.style.top    = y + 'px';
  d.style.background = `hsl(${Math.random() * 20}, 100%, 50%)`;
  d.style.width  = (Math.random() * 6 + 3) + 'px';
  d.style.height = d.style.width;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 500);
}

const GAME_DURATION  = 20;
const SPAWN_MIN      = 500;
const SPAWN_MAX      = 900;
const ENEMY_LIFE_MIN = 900;
const ENEMY_LIFE_MAX = 1600;
const CLOWN_FACES    = ['🤡', '😈', '👁️', '🎭', '💀'];


let score     = 0;
let hits      = 0;
let combo     = 0;
let timeLeft  = GAME_DURATION;
let gameActive   = false;
let spawnTimer   = null;
let countdownTimer = null;


const arena   = document.getElementById('arena');
const overlay = document.getElementById('overlay');
const btnStart = document.getElementById('btn-start');
const scoreEl = document.getElementById('score-value');
const hitsEl  = document.getElementById('hits-value');
const timerEl = document.getElementById('timer-value');
const comboEl = document.getElementById('combo-value');
const ovTitle = document.getElementById('overlay-title');
const ovBody  = document.getElementById('overlay-body');
const ovScore = document.getElementById('overlay-score');


function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function randFloat(a, b) {
  return Math.random() * (b - a) + a;
}


function spawnBalloon() {
  const b = document.createElement('div');
  b.className   = 'balloon';
  b.textContent = '🎈';
  b.style.left  = randInt(5, 90) + '%';
  b.style.bottom = '-10%';

  const dur = randFloat(3, 6);
  b.style.setProperty('--dur',  dur + 's');
  b.style.setProperty('--tilt', randFloat(-20, 20) + 'deg');
  b.style.fontSize = randFloat(1.2, 2.5) + 'rem';

  arena.appendChild(b);
  setTimeout(() => b.remove(), dur * 1000);
}

setInterval(spawnBalloon, 2000);


function createBloodSplat(x, y) {
  const splat = document.createElement('div');
  splat.className = 'blood-splat';
  splat.style.left = x + 'px';
  splat.style.top  = y + 'px';

  const n = randInt(6, 12);
  for (let i = 0; i < n; i++) {
    const drop  = document.createElement('div');
    drop.className = 'blood-drop';

    const angle = (i / n) * Math.PI * 2;
    const dist  = randInt(20, 45);
    const size  = randInt(4, 14);

    drop.style.width  = size + 'px';
    drop.style.height = size + 'px';
    drop.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    drop.style.setProperty('--dy', Math.sin(angle) * dist + 'px');

    splat.appendChild(drop);
  }

  arena.appendChild(splat);
  setTimeout(() => splat.remove(), 700);
}


function createScorePop(x, y, pts) {
  const el = document.createElement('div');
  el.className  = pts > 0 ? 'score-pop' : 'miss-pop';
  el.textContent = pts > 0 ? `+${pts}` : 'MISS';
  el.style.left = x + 'px';
  el.style.top  = y + 'px';
  arena.appendChild(el);
  setTimeout(() => el.remove(), 800);
}


function spawnEnemy() {
  if (!gameActive) return;

  const w = arena.offsetWidth;
  const h = arena.offsetHeight;
  const SIZE = 72;

  const x = randInt(10, w - SIZE - 10);
  const y = randInt(10, h - SIZE - 80);

  const enemy = document.createElement('div');
  enemy.className   = 'pennywise';
  enemy.textContent = CLOWN_FACES[randInt(0, CLOWN_FACES.length - 1)];
  enemy.style.left  = x + 'px';
  enemy.style.top   = y + 'px';

  let clicked = false;

  enemy.addEventListener('click', e => {
    e.stopPropagation();
    if (clicked || !gameActive) return;
    clicked = true;

    
    combo++;
    const pts = 10 * Math.min(combo, 5);
    score += pts;
    hits++;

    scoreEl.textContent = score;
    hitsEl.textContent  = hits;
    comboEl.textContent = `x${Math.min(combo, 5)}`;

   
    const aRect = arena.getBoundingClientRect();
    const ex = e.clientX - aRect.left;
    const ey = e.clientY - aRect.top;

    createBloodSplat(ex, ey);
    createScorePop(ex, ey - 20, pts);

    
    enemy.classList.add('dying');
    setTimeout(() => enemy.remove(), 260);

    
    arena.style.transform = `translate(${randInt(-3, 3)}px, ${randInt(-3, 3)}px)`;
    setTimeout(() => arena.style.transform = '', 80);
  });

  arena.appendChild(enemy);


  const life = randInt(ENEMY_LIFE_MIN, ENEMY_LIFE_MAX);
  setTimeout(() => {
    if (clicked) return;
    if (enemy.parentNode) {
      combo = 0;
      comboEl.textContent = 'x1';
      enemy.style.transition = 'opacity 0.3s';
      enemy.style.opacity    = '0';
      setTimeout(() => enemy.remove(), 320);
    }
  }, life);
}


arena.addEventListener('click', e => {
  if (!gameActive) return;
  if (e.target === arena) {
    combo = 0;
    comboEl.textContent = 'x1';
    const aRect = arena.getBoundingClientRect();
    createScorePop(e.clientX - aRect.left, e.clientY - aRect.top, 0);
  }
});


function startCountdown() {
  timerEl.textContent = timeLeft;
  countdownTimer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 5) timerEl.classList.add('urgent');
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function startGame() {
  
  score    = 0;
  hits     = 0;
  combo    = 0;
  timeLeft = GAME_DURATION;

  scoreEl.textContent = '0';
  hitsEl.textContent  = '0';
  timerEl.textContent = GAME_DURATION;
  comboEl.textContent = 'x1';
  timerEl.classList.remove('urgent');

 
  arena.querySelectorAll('.pennywise').forEach(e => e.remove());

  overlay.classList.add('hidden');
  gameActive = true;


  const scheduleSpawn = () => {
    if (!gameActive) return;
    spawnEnemy();
    spawnTimer = setTimeout(scheduleSpawn, randInt(SPAWN_MIN, SPAWN_MAX));
  };
  scheduleSpawn();

  startCountdown();
}


function endGame() {
  gameActive = false;
  clearInterval(countdownTimer);
  clearTimeout(spawnTimer);

  setTimeout(() => {
    arena.querySelectorAll('.pennywise').forEach(e => e.remove());

    let grade;
    if      (hits >= 20) grade = '🎈 MESTRE DO ESGOTO';
    else if (hits >= 12) grade = '🤡 CAÇADOR DE PALHAÇOS';
    else if (hits >= 6)  grade = '😨 SOBREVIVENTE';
    else                 grade = '😱 DERRY TE CONSUMIU';

    ovTitle.textContent       = '— FIM —';
    ovBody.textContent        = grade;
    ovScore.style.display     = 'block';
    ovScore.textContent       = `${score} pts · ${hits} acertos`;
    btnStart.textContent      = 'JOGAR NOVAMENTE';
    overlay.classList.remove('hidden');
  }, 300);
}


btnStart.addEventListener('click', startGame);