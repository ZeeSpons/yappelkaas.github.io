function handleDiscordLogin() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');  // bv 'kaasklikker' of 'appelrun'

  if (!code) return;

  fetch("https://script.google.com/macros/s/AKfycbwwqhuYA4DgWVftl9z18nIIreJKLDqyvPgRh-trEM2a0TsfjQFGukvo0kFNIxxz0sku/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `code=${code}`
  }).then(res => {
    if (res.ok) {
      document.getElementById("status").innerText = "Ingelogd met Discord! 🎉";

      // Na 1.5 sec doorsturen naar het juiste spel
      setTimeout(() => {
        if (state === 'kaasklikker' || state === 'appelrun') {
          // stuur terug naar de juiste pagina, maar zonder code in URL
          window.location.href = `${state}.html`;
        } else {
          window.location.href = 'index.html'; // fallback
        }
      }, 1500);

    } else {
      document.getElementById("status").innerText = "Foutje...";
    }
  });
}

window.onload = handleDiscordLogin;
