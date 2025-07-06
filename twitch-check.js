// Twitch Config
const clientId = "ngm5c8xsu9goghmx5okavd5r081mii";
const redirectUri = "https://yappelkaas.nl/twitch-callback.html";
const twitchUser = "appelkaas";

// 🔓 Start login flow
function loginWithTwitch() {
  const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=user:read:email`;
  window.location.href = authUrl;
}

// 🔍 Check of Appelkaas live is
async function checkLiveStatus(token = null) {
  try {
    const res = await fetch(`https://api.twitch.tv/helix/streams?user_login=${twitchUser}`, {
      headers: {
        "Client-ID": clientId,
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    });
    const data = await res.json();
    const isLive = data.data && data.data.length > 0;

    const liveButton = document.querySelector(".live-button");
    if (liveButton) {
      if (isLive) {
  liveButton.style.backgroundColor = "#ff4d4d";
  liveButton.textContent = "LIVE 🔴";
  liveButton.classList.add("live-active");
} else {
  liveButton.style.backgroundColor = "#888";
  liveButton.textContent = "OFFLINE ⚪";
  liveButton.classList.remove("live-active");
}
    }
  } catch (e) {
    console.error("Live status check failed:", e);
  }
}

// ⏳ Op index-pagina: check live status zonder login
if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
  checkLiveStatus();
}
