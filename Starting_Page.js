const canvas = document.getElementById('bubbleCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const CYCLE = 12000;
const PHASE_IN   = 0.33;
const PHASE_HOLD = 0.50;
const NUM_CYCLES = 3;

const gradColors = [
  { r: 155, g: 138, b: 212 },
  { r: 107, g: 79,  b: 191 },
  { r: 78,  g: 61,  b: 168 },
  { r: 45,  g: 27,  b: 94  },
  { r: 197, g: 180, b: 255 },
];

function lerpColor(a, b, t) {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

function getGradColor(t) {
  t = Math.max(0, Math.min(1, t));
  const scaled = t * (gradColors.length - 1);
  const i = Math.min(Math.floor(scaled), gradColors.length - 2);
  const c = lerpColor(gradColors[i], gradColors[i + 1], scaled - i);
  return `rgb(${c.r},${c.g},${c.b})`;
}

let smallBalls = [];
function initSmallBalls() {
  smallBalls = [];
  for (let i = 0; i < 7; i++) {
    smallBalls.push({
      angle:    (i / 7) * Math.PI * 2,
      baseDist: 130 + Math.random() * 50,
      size:     24,
      colorT:   0.1,
      phase:    Math.random() * Math.PI * 2,
    });
  }
}
initSmallBalls();

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function getBreathProgress(elapsed) {
  const t = (elapsed % CYCLE) / CYCLE;
  if (t < PHASE_IN)   return easeInOut(t / PHASE_IN);
  if (t < PHASE_HOLD) return 1;
  return easeInOut(1 - (t - PHASE_HOLD) / (1 - PHASE_HOLD));
}

function drawLabel(elapsed) {
  const t = (elapsed % CYCLE) / CYCLE;
  let label;
  if (t < PHASE_IN)        label = 'Breathe in...';
  else if (t < PHASE_HOLD) label = 'Hold...';
  else                     label = 'Breathe out...';

  ctx.font = '18px sans-serif';
  ctx.fillStyle = '#C9B8F4';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, canvas.width / 2, canvas.height / 2 + 160);
}

function drawBall(x, y, r, colorT) {
  if (r < 1) return;
  const grad = ctx.createRadialGradient(
    x - r * 0.25, y - r * 0.25, r * 0.1,
    x, y, r
  );
  grad.addColorStop(0, getGradColor(Math.min(colorT + 0.25, 1)));
  grad.addColorStop(1, getGradColor(colorT));
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.globalAlpha = 0.92;
  ctx.fill();
  ctx.globalAlpha = 1;
}

let startTime = null;
let animId = null;
let finished = false;

function breatheAnimate(ts) {
  if (!startTime) startTime = ts;
  const elapsed = ts - startTime;

  if (!finished && elapsed >= CYCLE * NUM_CYCLES) {
    finished = true;
    cancelAnimationFrame(animId);
    skipBreathing();
    return;
  }

  const progress = getBreathProgress(elapsed);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  for (const b of smallBalls) {
    const shrink = 1 - progress * 0.72;
    const dist   = b.baseDist * (1 - progress * 0.78);
    const wobble = Math.sin(elapsed * 0.0008 + b.phase) * 6;
    const bx = cx + Math.cos(b.angle + elapsed * 0.0003) * (dist + wobble);
    const by = cy + Math.sin(b.angle + elapsed * 0.0003) * (dist + wobble);
    drawBall(bx, by, b.size * shrink, b.colorT);
  }

  const mainR = 60 + progress * 80;
  drawBall(cx, cy, mainR, 0.4 + progress * 0.3);

  drawLabel(elapsed);

  animId = requestAnimationFrame(breatheAnimate);
}

animId = requestAnimationFrame(breatheAnimate);

document.getElementById('skipBtn').addEventListener('click', skipBreathing);
document.getElementById('loginBtn').addEventListener('click', showLogin);
document.getElementById('signupBtn').addEventListener('click', showSignup);

function skipBreathing() {
  if (animId) cancelAnimationFrame(animId);
  document.getElementById('breathingScreen').classList.replace('visible', 'hidden');
  document.getElementById('authChoiceScreen').classList.replace('hidden', 'visible');
}

function showLogin() {
  document.getElementById('authChoiceScreen').classList.add('hidden');
  document.getElementById('authChoiceScreen').classList.remove('visible');
  document.getElementById('signupScreen').classList.add('hidden');
  document.getElementById('signupScreen').classList.remove('visible');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('loginScreen').classList.add('visible');
}

function showSignup() {
  document.getElementById('authChoiceScreen').classList.add('hidden');
  document.getElementById('authChoiceScreen').classList.remove('visible');
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('visible');
  document.getElementById('signupScreen').classList.remove('hidden');
  document.getElementById('signupScreen').classList.add('visible');
}
// Login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const savedUsername = localStorage.getItem('savedUsername');
  const savedPassword = localStorage.getItem('savedPassword');

  if ((username === 'admin' && password === '1234') ||
      (username === savedUsername && password === savedPassword)) {
    document.getElementById('errorMsg').style.color = '#A8F4B8';
    document.getElementById('errorMsg').textContent = 'Login successful!';
    setTimeout(() => {
      goToNextScreen();
    }, 1000);
  } else {
    document.getElementById('errorMsg').style.color = '#F4A4A4';
    document.getElementById('errorMsg').textContent = 'Invalid username or password.';
  }
});

// Signup form submission
document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const newUsername = document.getElementById('newUsername').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (newPassword !== confirmPassword) {
    document.getElementById('signupMsg').style.color = '#F4A4A4';
    document.getElementById('signupMsg').textContent = 'Passwords do not match.';
    return;
  }

  localStorage.setItem('savedUsername', newUsername);
  localStorage.setItem('savedPassword', newPassword);

  document.getElementById('signupMsg').style.color = '#A8F4B8';
  document.getElementById('signupMsg').textContent = 'Signup successful!';
  setTimeout(() => {
    showLogin();
    document.getElementById('signupMsg').textContent = '';
  }, 1000);
});

function goToNextScreen() {
  localStorage.removeItem('surveyCompleted');
  localStorage.removeItem('surveyData');
  window.location.href = 'Your_Bubble.html';
}