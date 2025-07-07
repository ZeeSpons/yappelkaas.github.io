let discordID = null;
let currentHighscore = 0;
let currentGame = null;

async function fetchDiscordAndScore() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  // Detect game via URL path (of vul zelf in)
  if (window.location.pathname.includes("kaasklikker")) {
    currentGame = "kaasklikker";
  } else if (window.location.pathname.includes("appelrun")) {
    currentGame = "appelrun";
  } else {
    currentGame = "kaasklikker"; // fallback
  }

  if (!code) return;

  const res = await fetch("https://script.google.com/macros/s/AKfycbwwqhuYA4DgWVftl9z18nIIreJKLDqyvPgRh-trEM2a0TsfjQFGukvo0kFNIxxz0sku/exec", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `code=${code}&game=${currentGame}`
  });

  const data = await res.json();
  if (data.success) {
    document.getElementById("login-status").textContent = `Ingelogd als ${data.username}`;
    discordID = data.id;
    currentHighscore = parseInt(data.highscore);

    if (currentGame === "kaasklikker") {
      document.getElementById("highscore").textContent = currentHighscore;
      window.kaasHighscore = currentHighscore;
    } else if (currentGame === "appelrun") {
      window.highscore = currentHighscore;  // past in jouw appelrun.js
    }
  } else {
    document.getElementById("login-status").textContent = "Inloggen mislukt";
  }
}

window.addEventListener("beforeunload", () => {
  // Score ophalen van globale variabelen in de pagina (zorg dat die er zijn!)
  let currentScore = 0;
  if (currentGame === "kaasklikker") {
    currentScore = window.score || 0;
  } else if (currentGame === "appelrun") {
    currentScore = window.score || 0;
  }

  if (discordID && currentScore > currentHighscore) {
    navigator.sendBeacon(
      "https://script.google.com/macros/s/AKfycbwwqhuYA4DgWVftl9z18nIIreJKLDqyvPgRh-trEM2a0TsfjQFGukvo0kFNIxxz0sku/exec",
      new URLSearchParams({
        code: new URLSearchParams(window.location.search).get("code"),
        game: currentGame,
        score: currentScore
      })
    );
  }
});

window.onload = fetchDiscordAndScore;
