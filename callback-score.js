let discordID = null;
let kaasHighscore = 0;

async function fetchDiscordAndScore() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const game = 'kaasklikker';

  if (!code) return;

  const res = await fetch("https://script.google.com/macros/s/AKfycbwwqhuYA4DgWVftl9z18nIIreJKLDqyvPgRh-trEM2a0TsfjQFGukvo0kFNIxxz0sku/exec", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `code=${code}&game=${game}`
  });

  const data = await res.json();
  if (data.success) {
    document.getElementById("login-status").textContent = `Ingelogd als ${data.username}`;
    discordID = data.id;
    kaasHighscore = parseInt(data.highscore);
    document.getElementById("highscore").textContent = kaasHighscore;
  } else {
    document.getElementById("login-status").textContent = "Inloggen mislukt";
  }
}

// Bij verlaten van pagina: score doorgeven
window.addEventListener("beforeunload", () => {
  if (discordID && window.score > kaasHighscore) {
    navigator.sendBeacon(
      "https://script.google.com/macros/s/AKfycbwwqhuYA4DgWVftl9z18nIIreJKLDqyvPgRh-trEM2a0TsfjQFGukvo0kFNIxxz0sku/exec",
      new URLSearchParams({
        code: new URLSearchParams(window.location.search).get("code"),
        game: "kaasklikker",
        score: window.score
      })
    );
  }
});

window.onload = fetchDiscordAndScore;
