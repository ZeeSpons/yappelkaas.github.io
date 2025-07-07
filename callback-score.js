// callback-score.js

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwwqhuYA4DgWVftl9z18nIIreJKLDqyvPgRh-trEM2a0TsfjQFGukvo0kFNIxxz0sku/exec';
const loginStatus = document.getElementById('login-status');

const discordId = sessionStorage.getItem('discord_id');
const discordUsername = sessionStorage.getItem('discord_username');

// Bepaal welk spel (kaasklikker of appelrun) op basis van huidige pagina
const game = window.location.pathname.includes('kaasklikker') ? 'kaasklikker' : 'appelrun';

// Key voor lokale opslag highscore per spel
const scoreKey = `${game}_highscore`;

let lastSynced = 0;

// Functie om score te syncen met server (Apps Script)
async function syncScore() {
  const score = parseInt(localStorage.getItem(scoreKey)) || 0;
  const now = Date.now();

  if (!discordId || !score || now - lastSynced < 5000) return;

  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: discordId, game, score })
    });
    const data = await res.json();
    if (data.updated) lastSynced = now;
    if (loginStatus) loginStatus.textContent = `Ingelogd als ${discordUsername}`;
  } catch (e) {
    console.error('Fout bij score sync:', e);
  }
}

// Start interval om elke 3 seconden score te syncen
setInterval(syncScore, 3000);

// Laat login status zien bij laden
if (discordUsername && loginStatus) {
  loginStatus.textContent = `Ingelogd als ${discordUsername}`;
}
