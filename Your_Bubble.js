// ── Helpers ──────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

const emergencyNumbers = {
  US: '911', CA: '911', MX: '911',
  UK: '999',
  EU: '112', IN: '112',
  AU: '000', BR: '190', JP: '110', ZA: '10111'
};

const checkinQuestions = [
  "What's on your mind right now?",
  "How has your energy been today?",
  "How well did you sleep last night?",
  "What are you finding most challenging today?",
  "Is there something weighing on you right now?",
  "How connected do you feel to the people around you?",
];

// ── Survey ────────────────────────────────────────────
let surveyData = {};

function updateProgress(step) {
  document.querySelectorAll(`#surveyStep${step} .progress-dot`).forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i < step - 1)       dot.classList.add('done');
    else if (i === step - 1) dot.classList.add('active');
  });
}

document.getElementById('surveyForm1').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('userName').value.trim();
  if (!name) return;
  surveyData.name = name;
  updateProgress(2);
  showScreen('surveyStep2');
});

document.getElementById('PreviousStep1').addEventListener('click', function() {
  updateProgress(1);
  showScreen('surveyStep1');
});

document.getElementById('surveyForm2').addEventListener('submit', function(e) {
  e.preventDefault();
  const age      = document.querySelector('input[name="age"]:checked')?.value || null;
  const struggle = document.querySelector('input[name="struggle"]:checked')?.value || null;
  const help     = [...document.querySelectorAll('input[name="help"]:checked')].map(el => el.value);
  surveyData = { ...surveyData, age, struggle, help };
  updateProgress(3);
  showScreen('surveyStep3');
});

document.getElementById('PreviousStep2').addEventListener('click', function() {
  updateProgress(2);
  showScreen('surveyStep2');
});

document.getElementById('surveyForm3').addEventListener('submit', function(e) {
  e.preventDefault();
  const emergencyName  = document.getElementById('emergencyName').value.trim();
  const emergencyPhone = document.getElementById('emergencyPhone').value.trim();
  const country        = document.getElementById('userCountry').value;
  if (!emergencyName || !emergencyPhone) {
    alert('Please fill in your emergency contact details.');
    return;
  }
  surveyData = { ...surveyData, emergencyName, emergencyPhone, country };
  localStorage.setItem('surveyData', JSON.stringify(surveyData));
  localStorage.setItem('surveyCompleted', 'true');
  loadHome();
  showScreen('homeScreen');
});
// ── Side nav ─────────────────────────────────────────
function openSideNav() {
  document.getElementById('sideNav').classList.remove('hidden');
  document.getElementById('sideNavOverlay').classList.remove('hidden');
  setTimeout(() => document.getElementById('sideNav').classList.add('open'), 10);
}

function closeSideNav() {
  document.getElementById('sideNav').classList.remove('open');
  document.getElementById('sideNavOverlay').classList.add('hidden');
  setTimeout(() => document.getElementById('sideNav').classList.add('hidden'), 300);
}

document.getElementById('openSideNav').addEventListener('click', openSideNav);
document.getElementById('closeSideNav').addEventListener('click', closeSideNav);
document.getElementById('sideNavOverlay').addEventListener('click', closeSideNav);

document.getElementById('navJournaling').addEventListener('click', () => {
  closeSideNav();
  window.location.href = 'Journaling.html';
});
document.getElementById('navBreathing').addEventListener('click', () => {
  closeSideNav();
  window.location.href = 'Breathing.html';
});
document.getElementById('navDistraction').addEventListener('click', () => {
  closeSideNav();
  window.location.href = 'Distraction.html';
});
document.getElementById('navMovement').addEventListener('click', () => {
  closeSideNav();
  window.location.href = 'Movement.html';
});
document.getElementById('navCommunity').addEventListener('click', () => {
  closeSideNav();
  alert('index.html');
});
document.getElementById('navTalking').addEventListener('click', () => {
  closeSideNav();
  alert('Talking it out coming soon!');
});

// ── Load home ─────────────────────────────────────────
function loadHome() {
  const data = JSON.parse(localStorage.getItem('surveyData')) || {};
  document.getElementById('welcomeName').textContent = data.name || 'Friend';
  const q = checkinQuestions[Math.floor(Math.random() * checkinQuestions.length)];
  document.getElementById('checkinQuestion').textContent = q;
  if (data.country) {
    document.getElementById('countrySwitch').value = data.country;
    updateEmergencyNumber(data.country);
  }
  applyTheme(localStorage.getItem('theme') || 'default');
  initDatePicker();
  initCalendar();
}

const affirmations = [
  "I am open to healing. 💜",
  "I do not have to linger in dark places; there is help for me here.",
  "I am more than my circumstances dictate.",
  "I am good and getting better.",
  "I am growing and going at my own pace.",
  "I breathe in healing, I exhale the painful things that burden my heart.",
  "I release the fears that do not serve me.",
  "I am allowed to feel good.",
  "I strive for joy, not for perfection.",
  "My feelings deserve names, deserve recognition, deserve to be felt.",
  "My sensitivity is beautiful, and my feelings and emotions are valid.",
  "When I forgive myself, I free myself.",
  "When I release shame, I move into myself more beautifully.",
  "I am still learning, so it's okay to make mistakes.",
  "Sometimes the work is resting.",
  "There is growth in stillness.",
  "Asking for help is a sign of self-respect and self-awareness.",
  "I am safe and surrounded by love and support.",
  "I have come farther than I would have ever thought possible.",
  "There is something in this world that only I can do. That is why I am here.",
];
document.getElementById('welcomeAffirmation').textContent =
  affirmations[Math.floor(Math.random() * affirmations.length)];

// ── Mood system ───────────────────────────────────────
const specificMoods = {
  'very-unpleasant': [
    { emoji: '😰', label: 'Anxious' }, { emoji: '😢', label: 'Sad' },
    { emoji: '😤', label: 'Angry' },   { emoji: '😩', label: 'Overwhelmed' },
    { emoji: '😶', label: 'Numb' },    { emoji: '😓', label: 'Exhausted' }, { emoji: '🤔', label: 'Other' }
  ],
  'unpleasant': [
    { emoji: '😟', label: 'Worried' },      { emoji: '😞', label: 'Disappointed' },
    { emoji: '😒', label: 'Irritated' },    { emoji: '😴', label: 'Drained' },
    { emoji: '🥺', label: 'Lonely' },       { emoji: '😕', label: 'Confused' }, { emoji: '🤔', label: 'Other' }
  ],
  'neutral': [
    { emoji: '😑', label: 'Indifferent' }, { emoji: '🤔', label: 'Reflective' },
    { emoji: '😶', label: 'Blank' },       { emoji: '🙄', label: 'Restless' },
    { emoji: '😌', label: 'Okay' },        { emoji: '🫤', label: 'Uncertain' }, { emoji: '🤔', label: 'Other' }
  ],
  'pleasant': [
    { emoji: '😊', label: 'Happy' },    { emoji: '😌', label: 'Calm' },
    { emoji: '😴', label: 'Relaxed' },  { emoji: '😏', label: 'Satisfied' },
    { emoji: '🥰', label: 'Grateful' }, { emoji: '💪', label: 'Motivated' }, { emoji: '🤔', label: 'Other' }
  ],
  'very-pleasant': [
    { emoji: '😄', label: 'Joyful' },      { emoji: '🤩', label: 'Excited' },
    { emoji: '😇', label: 'Peaceful' },    { emoji: '🥳', label: 'Celebratory' },
    { emoji: '💫', label: 'Energized' },   { emoji: '❤️', label: 'Loved' },
    { emoji: '🤔', label: 'Other' }
  ],
};

// Step 1 → Step 2
document.querySelectorAll('#moodStep1 .mood-card').forEach(card => {
  card.addEventListener('click', function() {
    const mood  = this.dataset.mood;
    const label = this.dataset.label;

    document.querySelectorAll('#moodStep1 .mood-card').forEach(c => c.classList.remove('selected'));
    this.classList.add('selected');

    const grid = document.getElementById('specificMoodGrid');
    grid.innerHTML = '';

    specificMoods[mood].forEach(m => {
      const btn = document.createElement('button');
      btn.className = 'mood-card';
      btn.innerHTML = `<span class="mood-emoji">${m.emoji}</span><span class="mood-label">${m.label}</span>`;

      // Step 2 → Step 3
      btn.addEventListener('click', function() {
        document.querySelectorAll('#specificMoodGrid .mood-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        document.getElementById('moodValue').textContent = `${m.label} (${label})`;
        document.getElementById('moodSelected').classList.remove('hidden');
        localStorage.setItem('lastMood', m.label);
        setTimeout(() => {
          document.getElementById('moodStep2').classList.add('hidden');
          document.getElementById('moodStep3').classList.remove('hidden');
        }, 400);
      });

      grid.appendChild(btn);
    });

    document.getElementById('moodStep1').classList.add('hidden');
    document.getElementById('moodStep2').classList.remove('hidden');
  });
});

document.getElementById('moodBackBtn').addEventListener('click', () => {
  document.getElementById('moodStep2').classList.add('hidden');
  document.getElementById('moodStep1').classList.remove('hidden');
  document.getElementById('moodSelected').classList.add('hidden');
});

document.getElementById('moodBackBtn2').addEventListener('click', () => {
  document.getElementById('moodStep3').classList.add('hidden');
  document.getElementById('moodStep2').classList.remove('hidden');
});

document.getElementById('moodSubmitBtn').addEventListener('click', () => {
  const data = JSON.parse(localStorage.getItem('surveyData')) || {};
  const name  = data.name || 'Friend';
  const mood  = document.getElementById('moodValue').textContent;
  const elaboration = document.getElementById('moodElaboration').value.trim();

  const pickedDate = document.getElementById('moodDatePicker').value;
  const dateStr = new Date(pickedDate + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const logs = JSON.parse(localStorage.getItem('moodLogs') || '[]');
  logs.push({ mood, elaboration, date: dateStr });
  localStorage.setItem('moodLogs', JSON.stringify(logs));

  document.getElementById('moodConfirmText').textContent =
    `Thank you, ${name}, for logging your emotions on ${dateStr}.`;
  document.getElementById('moodStep3').classList.add('hidden');
  document.getElementById('moodStep4').classList.remove('hidden');
  document.getElementById('moodSelected').classList.add('hidden');
  renderCalendar();
});

document.getElementById('moodResetBtn').addEventListener('click', () => {
  document.getElementById('moodStep4').classList.add('hidden');
  document.getElementById('moodStep1').classList.remove('hidden');
  document.getElementById('moodElaboration').value = '';
  document.getElementById('moodSelected').classList.add('hidden');
  document.querySelectorAll('.mood-card').forEach(c => c.classList.remove('selected'));
});

// ── Date picker ───────────────────────────────────────
function initDatePicker() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('moodDatePicker').value = today;
}

// ── Calendar ──────────────────────────────────────────
let calYear, calMonth;

function initCalendar() {
  const now = new Date();
  calYear  = now.getFullYear();
  calMonth = now.getMonth();
  renderCalendar();
}

function renderCalendar() {
  const logs = JSON.parse(localStorage.getItem('moodLogs') || '[]');
  const logDates = {};
  logs.forEach(log => { logDates[log.date] = log; });

  document.getElementById('calTitle').textContent = new Date(calYear, calMonth)
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';

  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-day-name';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today       = new Date();

  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;

    const dateKey = new Date(calYear, calMonth, d).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    if (d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear())
      el.classList.add('today');

    if (logDates[dateKey]) {
      el.classList.add('has-log');
      el.addEventListener('click', () => showLogOverlay(logDates[dateKey], dateKey));
    }

    grid.appendChild(el);
  }
}

function showLogOverlay(log, dateStr) {
  document.getElementById('logOverlayDate').textContent = dateStr;
  document.getElementById('logOverlayContent').innerHTML = `
    <p style="color:#C9B8F4; margin-bottom:8px;">
      <strong style="color:#E8DFFE;">Mood:</strong> ${log.mood}
    </p>
    <p style="color:#C9B8F4;">
      <strong style="color:#E8DFFE;">Notes:</strong><br>
      ${log.elaboration || '<em style="color:#9B8AD4;">No notes added.</em>'}
    </p>`;
  document.getElementById('logOverlay').classList.remove('hidden');
}

document.getElementById('closeLogOverlay').addEventListener('click', () => {
  document.getElementById('logOverlay').classList.add('hidden');
});

document.getElementById('calPrev').addEventListener('click', () => {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
});

document.getElementById('calNext').addEventListener('click', () => {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
});

// ── Check-in submit ───────────────────────────────────
document.getElementById('checkinSubmitBtn').addEventListener('click', () => {
  const response = document.getElementById('response').value.trim();
  if (!response) return;
  const checkins = JSON.parse(localStorage.getItem('checkinLogs') || '[]');
  checkins.push({
    question: document.getElementById('checkinQuestion').textContent,
    response,
    date: new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
  });
  localStorage.setItem('checkinLogs', JSON.stringify(checkins));
  document.getElementById('response').value = '';
  const confirm = document.getElementById('checkinConfirm');
  confirm.classList.remove('hidden');
  setTimeout(() => confirm.classList.add('hidden'), 3000);
});

// ── "I'm not okay" overlay ────────────────────────────
document.getElementById('notOkayBtn').addEventListener('click', () => {
  document.getElementById('notOkayOverlay').classList.remove('hidden');
});
document.getElementById('closeOverlay').addEventListener('click', () => {
  document.getElementById('notOkayOverlay').classList.add('hidden');
});
document.getElementById('callEmergencyBtn').addEventListener('click', () => {
  const data = JSON.parse(localStorage.getItem('surveyData')) || {};
  window.location.href = `tel:${emergencyNumbers[data.country] || '911'}`;
});
document.getElementById('callContactBtn').addEventListener('click', () => {
  const data = JSON.parse(localStorage.getItem('surveyData')) || {};
  if (data.emergencyPhone) window.location.href = `tel:${data.emergencyPhone}`;
});
document.getElementById('breathingBtn').addEventListener('click', () => {
  document.getElementById('notOkayOverlay').classList.add('hidden');
  window.location.href = 'Breathing.html';
});
document.getElementById('distractionBtn').addEventListener('click', () => {
  document.getElementById('notOkayOverlay').classList.add('hidden');
  window.location.href = 'Distraction.html';
});

// ── Emergency FAB ─────────────────────────────────────
document.getElementById('emergencyFab').addEventListener('click', () => {
  document.getElementById('emergencyPanel').classList.toggle('hidden');
  document.getElementById('musicPanel').classList.add('hidden');
  updateEmergencyPanelInfo();
});
document.getElementById('closeEmergencyPanel').addEventListener('click', () => {
  document.getElementById('emergencyPanel').classList.add('hidden');
});
function updateEmergencyPanelInfo() {
  const data = JSON.parse(localStorage.getItem('surveyData')) || {};
  const number = emergencyNumbers[data.country] || '911';
  document.getElementById('emergencyNumberDisplay').textContent = number;
  document.getElementById('emergencyPanelContact').textContent =
    data.emergencyName ? `Contact: ${data.emergencyName}` : 'No contact saved';
}
document.getElementById('fabCallEmergency').addEventListener('click', () => {
  const data = JSON.parse(localStorage.getItem('surveyData')) || {};
  window.location.href = `tel:${emergencyNumbers[data.country] || '911'}`;
});
document.getElementById('fabCallContact').addEventListener('click', () => {
  const data = JSON.parse(localStorage.getItem('surveyData')) || {};
  if (data.emergencyPhone) window.location.href = `tel:${data.emergencyPhone}`;
});
document.getElementById('fabTextContact').addEventListener('click', () => {
  const data = JSON.parse(localStorage.getItem('surveyData')) || {};
  if (data.emergencyPhone) window.location.href = `sms:${data.emergencyPhone}`;
});

// ── Footer ────────────────────────────────────────────
const feedbackOverlay = document.getElementById('feedbackOverlay');
const aboutOverlay = document.getElementById('aboutOverlay');

document.getElementById('feedbackBtn').addEventListener('click', () => {
  window.location.href =
    "https://docs.google.com/forms/d/e/1FAIpQLSfubskvyd4ixQxPWCWVINFnJ_vDjAd2ftkFFj9PD2G4JmlVQg/viewform?usp=header";
});

document.getElementById('aboutBtn').addEventListener('click', () => {
  aboutOverlay.classList.remove('hidden');
});

document.getElementById('closeAboutBtn').addEventListener('click', () => {
  aboutOverlay.classList.add('hidden');
});

document.getElementById('footerSupportBtn').addEventListener('click', () => {
  document.getElementById('notOkayOverlay').classList.remove('hidden');
});

// ── Grounding sounds ──────────────────────────────────
const musicFab = document.getElementById('musicFab');
const musicPanel = document.getElementById('musicPanel');
const musicPlayPause = document.getElementById('musicPlayPause');
const musicVolume = document.getElementById('musicVolume');
const musicNowPlaying = document.getElementById('musicNowPlaying');
const soundscapeNames = {
  rain: 'Quiet Rain',
  waves: 'Soft Waves',
  warm: 'Warm Glow'
};

let audioContext = null;
let masterGain = null;
let activeAudioNodes = [];
let selectedSound = localStorage.getItem('groundingSound') || null;
let musicPlaying = false;

const savedVolumeValue = localStorage.getItem('groundingVolume');
const savedVolume = Number(savedVolumeValue);
if (savedVolumeValue !== null && Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 100) {
  musicVolume.value = savedVolume;
}

function updateMusicUI() {
  document.querySelectorAll('.soundscape-btn').forEach(button => {
    button.classList.toggle('active', button.dataset.sound === selectedSound);
  });

  musicPlayPause.disabled = !selectedSound;
  musicPlayPause.querySelector('i').className = musicPlaying ? 'fas fa-pause' : 'fas fa-play';
  musicPlayPause.querySelector('span').textContent = musicPlaying ? 'Pause' : 'Play';
  musicNowPlaying.textContent = selectedSound ? soundscapeNames[selectedSound] : 'Choose a sound';
  musicFab.classList.toggle('playing', musicPlaying);
  musicFab.setAttribute('aria-label', musicPlaying ? 'Open grounding sounds, currently playing' : 'Open grounding sounds');
}

function createNoiseBuffer(context) {
  const buffer = context.createBuffer(1, context.sampleRate * 4, context.sampleRate);
  const data = buffer.getChannelData(0);
  let lastValue = 0;

  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    lastValue = lastValue * 0.985 + white * 0.015;
    data[i] = lastValue * 3.2;
  }

  return buffer;
}

function connectNode(node) {
  activeAudioNodes.push(node);
  return node;
}

function makeNoiseLayer(filterType, frequency, gainValue, modulationRate = 0) {
  const source = connectNode(audioContext.createBufferSource());
  const filter = connectNode(audioContext.createBiquadFilter());
  const gain = connectNode(audioContext.createGain());

  source.buffer = createNoiseBuffer(audioContext);
  source.loop = true;
  filter.type = filterType;
  filter.frequency.value = frequency;
  gain.gain.value = gainValue;
  source.connect(filter).connect(gain).connect(masterGain);

  if (modulationRate > 0) {
    const lfo = connectNode(audioContext.createOscillator());
    const lfoGain = connectNode(audioContext.createGain());
    lfo.frequency.value = modulationRate;
    lfoGain.gain.value = gainValue * 0.65;
    lfo.connect(lfoGain).connect(gain.gain);
    lfo.start();
  }

  source.start();
}

function makeTone(frequency, gainValue, detune = 0) {
  const oscillator = connectNode(audioContext.createOscillator());
  const gain = connectNode(audioContext.createGain());
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  oscillator.detune.value = detune;
  gain.gain.value = gainValue;
  oscillator.connect(gain).connect(masterGain);
  oscillator.start();
}

function stopSoundscape() {
  activeAudioNodes.forEach(node => {
    try {
      if (typeof node.stop === 'function') node.stop();
      node.disconnect();
    } catch (error) {
      // Nodes may already be stopped or disconnected.
    }
  });
  activeAudioNodes = [];
  musicPlaying = false;
  updateMusicUI();
}

async function startSoundscape() {
  if (!selectedSound) return;

  stopSoundscape();
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  if (!audioContext) {
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
  }

  await audioContext.resume();
  masterGain.gain.setValueAtTime((Number(musicVolume.value) / 100) * 0.42, audioContext.currentTime);

  if (selectedSound === 'rain') {
    makeNoiseLayer('highpass', 900, 0.18);
    makeNoiseLayer('lowpass', 5200, 0.08, 0.13);
  } else if (selectedSound === 'waves') {
    makeNoiseLayer('lowpass', 850, 0.23, 0.09);
    makeTone(98, 0.025);
  } else {
    makeTone(174.61, 0.08);
    makeTone(261.63, 0.045, -5);
    makeTone(349.23, 0.025, 4);
  }

  musicPlaying = true;
  updateMusicUI();
}

document.querySelectorAll('.soundscape-btn').forEach(button => {
  button.addEventListener('click', async () => {
    const shouldRestart = musicPlaying;
    selectedSound = button.dataset.sound;
    localStorage.setItem('groundingSound', selectedSound);
    updateMusicUI();
    if (shouldRestart) await startSoundscape();
  });
});

musicPlayPause.addEventListener('click', async () => {
  if (musicPlaying) stopSoundscape();
  else await startSoundscape();
});

musicVolume.addEventListener('input', () => {
  localStorage.setItem('groundingVolume', musicVolume.value);
  if (masterGain && audioContext) {
    masterGain.gain.setTargetAtTime(
      (Number(musicVolume.value) / 100) * 0.42,
      audioContext.currentTime,
      0.04
    );
  }
});

musicFab.addEventListener('click', () => {
  musicPanel.classList.toggle('hidden');
  document.getElementById('emergencyPanel').classList.add('hidden');
});

document.getElementById('closeMusicPanel').addEventListener('click', () => {
  musicPanel.classList.add('hidden');
});

updateMusicUI();

// ── Settings ──────────────────────────────────────────
document.getElementById('settingsBtn').addEventListener('click', () => {
  document.getElementById('settingsPanel').classList.toggle('hidden');
});
document.getElementById('closeSettings').addEventListener('click', () => {
  document.getElementById('settingsPanel').classList.add('hidden');
});
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    applyTheme(this.dataset.theme);
    localStorage.setItem('theme', this.dataset.theme);
  });
});
function applyTheme(theme) {
  document.getElementById('homeScreen').dataset.theme = theme;
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === theme);
  });
}
document.getElementById('countrySwitch').addEventListener('change', function() {
  updateEmergencyNumber(this.value);
  const data = JSON.parse(localStorage.getItem('surveyData')) || {};
  data.country = this.value;
  localStorage.setItem('surveyData', JSON.stringify(data));
});
function updateEmergencyNumber(country) {
  const number = emergencyNumbers[country] || '911';
  document.getElementById('emergencyNumberDisplay').textContent = number;
}
document.getElementById('signOutBtn').addEventListener('click', () => {
  localStorage.removeItem('surveyCompleted');
  localStorage.removeItem('surveyData');
  localStorage.removeItem('theme');
  window.location.href = 'Starting_Page.html';
});
document.getElementById('editFormBtn').addEventListener('click', () => {
  localStorage.removeItem('surveyCompleted');
  document.getElementById('settingsPanel').classList.add('hidden');
  showScreen('surveyStep1');
});



// ── On page load ──────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('surveyCompleted') === 'true') {
    loadHome();
    showScreen('homeScreen');
  } else {
    showScreen('surveyStep1');
  }
});
