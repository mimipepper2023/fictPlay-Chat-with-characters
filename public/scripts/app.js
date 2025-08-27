document.addEventListener("DOMContentLoaded", () => {
  const recentEl = document.getElementById("recent-bots");
  if (recentEl) {
    const bots = DataStore.getRecentBots();
    recentEl.innerHTML = bots.map(renderBotCard).join("");
  }
});

function renderBotCard(bot) {
  const img = bot.pfpUrl ? `<img src="${bot.pfpUrl}" alt="${bot.name}">` : `<div style="width:56px;height:56px;border-radius:10px;background:#182030"></div>`;
  return `
  <div class="bot-card">
    ${img}
    <div class="meta">
      <div class="name">${escapeHtml(bot.name)}</div>
      <div class="desc">${escapeHtml(bot.description || "")}</div>
    </div>
    <a class="button secondary" href="/chat.html?bot=${encodeURIComponent(bot.id)}">Chat</a>
  </div>`;
}

function escapeHtml(str) {
  return (str || "").replace(/[&<>"]+/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[s]));
}
