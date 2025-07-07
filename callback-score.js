// callback-score.js

// ---------- CONFIG ---------
// Pas hier je Apps Script URL aan (de URL van je deployed Web App)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwwqhuYA4DgWVftl9z18nIIreJKLDqyvPgRh-trEM2a0TsfjQFGukvo0kFNIxxz0sku/exec';

// Discord login button & status tekst
const loginBtn = document.getElementById('discord-login');
const loginStatus = document.getElementById('login-status');

// Parse URL params (o.a. ?code=...)
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Token & user info in sessionStorage bewaren
function saveToken(token) {
  sessionStorage.setItem('discord_token', token);
}
function getToken() {
  return sessionStorage.getItem('discord_token');
}
function saveUser(user) {
  sessionStorage.setItem('discord_user', JSON.stringify(user));
}
function getUser() {
  const u = sessionStorage.getItem('discord_user');
  return u ? JSON.parse(u) : null;
}

// Token ophalen via ?code= (OAuth2 callback)
async function fetchToken(code) {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=token&code=${code}`);
    const data = await res.json();
    if (data.access_token) {
      saveToken(data.access_token);
      return data.access_token;
    }
    throw new Error('Geen token ontvangen');
  } catch (e) {
    console.error('Fout bij token ophalen:', e);
    return null;
  }
}

// Discord user info ophalen via Apps Script
async function fetchUserInfo(token) {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=userinfo&token=${token}`);
    const data = await res.json();
    if (data.id) {
      saveUser(data);
      return data;
    }
    throw new Error('Geen user info ontvangen');
  } catch (e) {
    console.error('Fout bij user info ophalen:', e);
    return null;
  }
}

// Highscore ophalen van server
async function fetchHighscore(userId, game) {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getscore&user=${userId}&game=${game}`);
    const data = await res.json();
    if (data.highscore !== undefined) {
      return data.highscore;
    }
    return 0;
  } catch (e) {
    console.error('Fout bij highscore ophalen:', e);
    return 0;
  }
}

// Highscore opslaan naar server
async function saveHighscore(userId, game, score) {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=savescore&user=${userId}&game=${game}&score=${score}`);
    const data = await res.json();
    return data.success;
  } catch (e) {
    console.error('Fout bij highscore opslaan:', e);
    return false;
  }
}

// UI update bij ingelogde user
async function updateLoginUI(user, game) {
  loginStatus.textContent = `Ingelogd als ${user.username}#${user.discriminator}`;

  // Haal server-highscore op en update highscore in UI
  const serverHighscore = await fetchHighscore(user.id, game);

  // Update local highscore variabele en UI
  if (serverHighscore > window.highscore) {
    window.highscore = serverHighscore;
  }
  const highscoreDisplay = document.getElementById('highscore');
  if (highscoreDisplay) highscoreDisplay.textContent = window.highscore;

  // Start interval om score automatisch te syncen (elke 5 sec)
  setInterval(() => {
    if (window.score > window.highscore) {
      saveHighscore(user.id, game, window.score).then(success => {
        if (success) {
          window.highscore = window.score;
          if (highscoreDisplay) highscoreDisplay.textContent = window.highscore;
        }
      });
    }
  }, 5000);
}

// Init login flow & score sync
(async function init() {
  const code = getQueryParam('code');
  const game = 'appelrun'; // Of 'kaasklikker' voor het andere spel

  if (code) {
    // Code in URL, dus haal token en user info op
    const token = await fetchToken(code);
    if (token) {
      const user = await fetchUserInfo(token);
      if (user) {
        // Redirect zonder code in URL (mooi schoon)
        history.replaceState({}, document.title, window.location.pathname);
        updateLoginUI(user, game);
      }
    }
  } else {
    // Geen code, check sessionStorage of al ingelogd
    const user = getUser();
    if (user) {
      updateLoginUI(user, game);
    }
  }
})();
