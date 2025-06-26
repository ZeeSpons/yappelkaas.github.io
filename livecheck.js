const clientId = 'JE_CLIENT_ID_HIER';
const accessToken = 'JE_ACCESS_TOKEN_HIER';
const userLogin = 'appelkaas';

const liveBanner = document.getElementById('live-banner');
const offlineBanner = document.getElementById('offline-banner');

async function checkLiveStatus() {
  try {
    const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${userLogin}`, {
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const isLive = data.data && data.data.length > 0;

    if (isLive) {
      liveBanner.classList.remove('hidden');
      offlineBanner.classList.add('hidden');
      document.body.classList.add('has-live-banner');
      document.body.classList.remove('has-offline-banner');
    } else {
      liveBanner.classList.add('hidden');
      offlineBanner.classList.remove('hidden');
      document.body.classList.remove('has-live-banner');
      document.body.classList.add('has-offline-banner');
    }
  } catch (error) {
    console.error('Error checking Twitch live status:', error);
    // Bij error tonen we de offline banner veilig
    liveBanner.classList.add('hidden');
    offlineBanner.classList.remove('hidden');
    document.body.classList.remove('has-live-banner');
    document.body.classList.add('has-offline-banner');
  }
}

// Check direct bij laden
checkLiveStatus();

// Optioneel: periodiek updaten (bijv elke 60 sec)
setInterval(checkLiveStatus, 60000);
