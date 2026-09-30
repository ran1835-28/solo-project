// DATA LAYER: Holds persistent state in local storage and manages primary data models.
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

// LOGIC LAYER: Contains calculation rules, stat decay math, action processors, and storage saving.
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

function processPetAction(action) {
  if (action === 'feed') {
    petState.hunger = Math.min(100, petState.hunger + 25);
    petState.happy = Math.min(100, petState.happy + 5);
  } else if (action === 'play') {
    if (petState.energy > 15) {
      petState.happy = Math.min(100, petState.happy + 25);
      petState.energy = Math.max(0, petState.energy - 15);
      petState.hunger = Math.max(0, petState.hunger - 10);
      petState.coins += 5;
    }
  } else if (action === 'sleep') {
    petState.isSleeping = !petState.isSleeping;
    if (petState.isSleeping) {
      petState.energy = Math.min(100, petState.energy + 30);
    }
  } else if (action === 'clean') {
    petState.poopCount = 0;
    petState.cleanliness = 100;
    petState.happy = Math.min(100, petState.happy + 10);
  }
  
  petState.lastCheck = Date.now();
  petState.previousLastCheck = petState.lastCheck;
  savePetState();
  renderPetDisplay();
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

// DISPLAY LAYER: Renders the user interface, DOM meters, avatar expressions, and attaches event listeners.
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

function initializeUI() {
  const awayMessage = processElapsedAwayTime();
  if (awayMessage) {
    const banner = document.getElementById('welcome-banner');
    document.getElementById('welcome-text').textContent = awayMessage;
    banner.classList.remove('hidden');
  }

  document.getElementById('dismiss-banner-btn').addEventListener('click', () => {
    document.getElementById('welcome-banner').classList.add('hidden');
  });

  document.getElementById('btn-feed').addEventListener('click', () => processPetAction('feed'));
  document.getElementById('btn-play').addEventListener('click', () => processPetAction('play'));
  document.getElementById('btn-sleep').addEventListener('click', () => processPetAction('sleep'));
  document.getElementById('btn-clean').addEventListener('click', () => processPetAction('clean'));

  renderPetDisplay();
  setInterval(updateStatsDecay, 10000);
}

document.addEventListener('DOMContentLoaded', initializeUI);
