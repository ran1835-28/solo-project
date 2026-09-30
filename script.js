/* script.js */

// DATA LAYER: Reads, structures, and returns primary pet state models.
function getPetData() {
  const savedState = localStorage.getItem('pixelPalState');
  const now = Date.now();

  if (savedState) {
    const parsed = JSON.parse(savedState);
    return { ...parsed, lastCheck: now, previousLastCheck: parsed.lastCheck || now };
  }

  return {
    name: 'Pixel',
    stage: 'Baby',
    coins: 50,
    hunger: 80,
    energy: 90,
    happy: 85,
    cleanliness: 100,
    poopCount: 0,
    isSleeping: false,
    lastCheck: now,
    previousLastCheck: now
  };
}

let petState = getPetData();
let chopCount = 0;
let catchScore = 0;
let preparedFoodItem = null;

// LOGIC LAYER: Contains rules for state persistence, stat changes, mini-game progress, and away calculations.
function savePetState() {
  localStorage.setItem('pixelPalState', JSON.stringify(petState));
}

function processElapsedAwayTime() {
  const now = Date.now();
  const elapsedMinutes = Math.floor((now - petState.previousLastCheck) / (1000 * 60));
  
  if (elapsedMinutes > 1) {
    const hungerDrop = Math.min(100, elapsedMinutes * 2);
    const energyDrop = petState.isSleeping ? 0 : Math.min(100, elapsedMinutes * 1);
    const happyDrop = Math.min(100, elapsedMinutes * 2);
    
    petState.hunger = Math.max(0, petState.hunger - hungerDrop);
    petState.energy = petState.isSleeping ? Math.min(100, petState.energy + elapsedMinutes * 3) : Math.max(0, petState.energy - energyDrop);
    petState.happy = Math.max(0, petState.happy - happyDrop);

    if (petState.hunger < 30 && Math.random() > 0.4) {
      petState.poopCount = Math.min(3, petState.poopCount + 1);
      petState.cleanliness = Math.max(0, petState.cleanliness - 30);
    }

    savePetState();
    return `Welcome back! You were away for ${elapsedMinutes} minute(s). Pixel missed you!`;
  }
  return null;
}

function updateStatsDecay() {
  if (!petState.isSleeping) {
    petState.hunger = Math.max(0, petState.hunger - 1);
    petState.energy = Math.max(0, petState.energy - 1);
    petState.happy = Math.max(0, petState.happy - 1);
  } else {
    petState.energy = Math.min(100, petState.energy + 2);
  }

  if (petState.hunger < 20 && Math.random() < 0.05 && petState.poopCount < 3) {
    petState.poopCount += 1;
    petState.cleanliness = Math.max(0, petState.cleanliness - 25);
  }

  petState.lastCheck = Date.now();
  petState.previousLastCheck = petState.lastCheck;
  savePetState();
  renderPetDisplay();
}

function processApplyPreparedFood() {
  if (preparedFoodItem) {
    petState.hunger = Math.min(100, petState.hunger + 30);
    petState.happy = Math.min(100, petState.happy + 10);
    preparedFoodItem = null;
    savePetState();
    renderPetDisplay();
  }
}

// DISPLAY LAYER: UI views switcher, DOM meters renderer, event handler bindings, and mini-game controls.
function renderPetDisplay() {
  document.getElementById('pet-name').textContent = petState.name;
  document.getElementById('pet-stage').textContent = petState.stage;
  document.getElementById('coin-count').textContent = `🪙 ${petState.coins}`;

  document.getElementById('meter-hunger').style.width = `${petState.hunger}%`;
  document.getElementById('meter-energy').style.width = `${petState.energy}%`;
  document.getElementById('meter-happy').style.width = `${petState.happy}%`;
  document.getElementById('meter-clean').style.width = `${petState.cleanliness}%`;

  const avatar = document.getElementById('pet-avatar');
  const bubble = document.getElementById('thought-bubble');

  if (petState.isSleeping) {
    avatar.textContent = '😴';
    bubble.textContent = 'Zzz...';
  } else if (petState.hunger < 30) {
    avatar.textContent = '🥺';
    bubble.textContent = 'I need food!';
  } else if (petState.poopCount > 0) {
    avatar.textContent = '🤢';
    bubble.textContent = 'Clean my room!';
  } else if (petState.happy > 70) {
    avatar.textContent = '😸';
    bubble.textContent = 'Love you!';
  } else {
    avatar.textContent = '🐱';
    bubble.textContent = 'Play with me!';
  }

  const poopContainer = document.getElementById('poop-container');
  poopContainer.textContent = '💩'.repeat(petState.poopCount);
}

function switchView(targetViewId) {
  document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('active'));
  document.getElementById(targetViewId).classList.add('active');
}

function initMiniGames() {
  // Kitchen Mini-Game Handlers
  document.getElementById('btn-open-fridge').addEventListener('click', () => {
    document.getElementById('food-options').classList.remove('hidden');
  });

  document.querySelectorAll('.food-choice').forEach(btn => {
    btn.addEventListener('click', (e) => {
      preparedFoodItem = e.target.dataset.food;
      document.getElementById('fridge-step').classList.add('hidden');
      document.getElementById('chop-step').classList.remove('hidden');
      document.getElementById('kitchen-step-text').textContent = 'Step 2: Rapidly chop food!';
    });
  });

  document.getElementById('chop-board').addEventListener('click', () => {
    chopCount++;
    document.getElementById('chop-progress').style.width = `${(chopCount / 5) * 100}%`;
    if (chopCount >= 5) {
      document.getElementById('chop-step').classList.add('hidden');
      document.getElementById('cook-step').classList.remove('hidden');
      document.getElementById('kitchen-step-text').textContent = 'Step 3: Cook and serve!';
    }
  });

  document.getElementById('btn-finish-cook').addEventListener('click', () => {
    processApplyPreparedFood();
    // Reset Kitchen
    chopCount = 0;
    document.getElementById('chop-progress').style.width = '0%';
    document.getElementById('cook-step').classList.add('hidden');
    document.getElementById('food-options').classList.add('hidden');
    document.getElementById('fridge-step').classList.remove('hidden');
    document.getElementById('kitchen-step-text').textContent = 'Step 1: Open fridge to pick food';
    switchView('main-view');
  });

  // Bedroom Star Lullaby
  document.querySelectorAll('.star-target').forEach(star => {
    star.addEventListener('click', () => {
      petState.energy = Math.min(100, petState.energy + 10);
      petState.happy = Math.min(100, petState.happy + 5);
      star.style.opacity = '0.3';
      setTimeout(() => { star.style.opacity = '1'; }, 1000);
      savePetState();
      renderPetDisplay();
    });
  });

  // Bathroom Steps
  document.getElementById('btn-bath-sweep').addEventListener('click', () => {
    petState.poopCount = 0;
    document.getElementById('bath-status-area').textContent = 'Status: Swept! Needs Soap Scrub.';
    document.getElementById('btn-bath-scrub').disabled = false;
    savePetState();
    renderPetDisplay();
  });

  document.getElementById('btn-bath-scrub').addEventListener('click', () => {
    document.getElementById('bath-status-area').textContent = 'Status: Soapy! Needs Shower Spray.';
    document.getElementById('btn-bath-shower').disabled = false;
  });

  document.getElementById('btn-bath-shower').addEventListener('click', () => {
    petState.cleanliness = 100;
    petState.happy = Math.min(100, petState.happy + 10);
    document.getElementById('bath-status-area').textContent = 'Status: Sparkling Clean! ✨';
    savePetState();
    renderPetDisplay();
  });
}

function displayInit() {
  const awayMessage = processElapsedAwayTime();
  if (awayMessage) {
    const banner = document.getElementById('welcome-banner');
    document.getElementById('welcome-text').textContent = awayMessage;
    banner.classList.remove('hidden');
  }

  document.getElementById('dismiss-banner-btn').addEventListener('click', () => {
    document.getElementById('welcome-banner').classList.add('hidden');
  });

  // Scene navigation listeners
  document.getElementById('btn-feed').addEventListener('click', () => switchView('kitchen-view'));
  document.getElementById('btn-play').addEventListener('click', () => switchView('playyard-view'));
  document.getElementById('btn-sleep').addEventListener('click', () => switchView('bedroom-view'));
  document.getElementById('btn-clean').addEventListener('click', () => switchView('bathroom-view'));

  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', (e) => switchView(e.target.dataset.target));
  });

  initMiniGames();
  renderPetDisplay();
  setInterval(updateStatsDecay, 10000);
}

document.addEventListener('DOMContentLoaded', displayInit);
