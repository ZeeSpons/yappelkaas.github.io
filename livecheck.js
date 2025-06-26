const userLogin = 'appelkaas';
const liveBanner = document.getElementById('live-banner');
const offlineBanner = document.getElementById('offline-banner');

async function checkLiveStatus() {
  try {
    const response = await fetch(`https://decapi.me/twitch/stream/${userLogin}`);

    if (!response.ok) throw new Error('API error');

    const text = await response.text();

    // DecAPI geeft "offline" als ze niet live is, anders streamtitel
    const isLive = text.toLowerCase() !== 'offline';

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
    console.error('Fout bij livecheck:', error);
    liveBanner.classList.add('hidden');
    offlineBanner.classList.remove('hidden');
    document.body.classList.remove('has-live-banner');
    document.body.classList.add('has-offline-banner');
  }
}

// Check meteen bij laden
checkLiveStatus();

// Check elke minuut opnieuw
setInterval(checkLiveStatus, 60000);
