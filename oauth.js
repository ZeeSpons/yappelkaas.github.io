// oauth.js – Plaats in je repo en verwijs in je HTML

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwwqhuYA4DgWVftl9z18nIIreJKLDqyvPgRh-trEM2a0TsfjQFGukvo0kFNIxxz0sku/exec';

// Detect welk spel (path of filename)
function getGame() {
  const path = window.location.pathname;
  if (path.includes('kaasklikker.html')) return 'kaasklikker';
  if (path.includes('appelrun.html')) return 'appelrun';
  return null;
}

function getQueryParam(param) {
  const p = new URLSearchParams(window.location.search).get(param);
  return p;
}

async function loginFlow() {
  const code = getQueryParam('code');
  const game = getGame();
  if (!game) return;

  const res = await fetch(`${APPS_SCRIPT_URL}?code=${code}&redirect_uri=${window.location.origin}/${game}.html`);
  const data = await res.json();
  if (data.username) {
    document.getElementById('login-status').textContent = `Ingelogd als ${data.username}`;
    window.discordUser = data;
    window.highscore = parseInt(data.highscore) || 0;
    document.querySelector('#highscore').textContent = window.highscore;
  }
  history.replaceState({}, '', `${game}.html`);
}

function autoSaveInterval() {
  const game = getGame();
  if (!window.discordUser || typeof window.score !== 'number') return;
  setInterval(async () => {
    if (window.score > window.highscore) {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: window.discordUser.id, game, score: window.score })
      });
      window.highscore = window.score;
      document.querySelector('#highscore').textContent = window.highscore;
    }
  }, 5000);
}

window.addEventListener('load', () => {
  loginFlow().then(autoSaveInterval);
});
