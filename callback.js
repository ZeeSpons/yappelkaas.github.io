function handleDiscordLogin() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
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
    } else {
      document.getElementById("status").innerText = "Foutje...";
    }
  });
}
window.onload = handleDiscordLogin;
