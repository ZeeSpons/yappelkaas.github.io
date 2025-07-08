const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwwqhuYA4DgWVftl9z18nIIreJKLDqyvPgRh-trEM2a0TsfjQFGukvo0kFNIxxz0sku/exec';
const loginStatus = document.getElementById('login-status');

const discordId = sessionStorage.getItem('discord_id');
const discordUsername = sessionStorage.getItem('discord_username');

const game = window.location.pathname.includes('kaasklikker') ? 'kaasklikker' : 'appelrun';
const scoreKey = `${game}_highscore`;

let lastSynced = 0;

async function syncScore() {
  if (!discordId) return;

  const score = parseInt(localStorage.getItem(scoreKey)) || 0;
  const now = Date.now();

  if (!score || now - lastSynced < 3000) return;

  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: discordId, game, score }),
    });
    const data = await res.json();
    if (data.updated) lastSynced = now;
    if (loginStatus) loginStatus.textContent = `Ingelogd als ${discordUsername}`;
  } catch (e) {
    console.error('Fout bij score sync:', e);
  }
}

setInterval(syncScore, 3000);

if (discordUsername && loginStatus) {
  loginStatus.textContent = `Ingelogd als ${discordUsername}`;
}
