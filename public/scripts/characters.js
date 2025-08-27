document.addEventListener("DOMContentLoaded", async () => {
  await requireAuth();
  const form = document.getElementById("bot-form");
  const list = document.getElementById("bots-list");

  renderBots();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("bot-name").value.trim();
    const pfpFile = document.getElementById("bot-pfp").files?.[0];
    const description = document.getElementById("bot-description").value.trim();
    const personality = document.getElementById("bot-personality").value.trim();
    const extrasText = document.getElementById("bot-extras").value.trim();
    let extras = null;
    if (extrasText) {
      try { extras = JSON.parse(extrasText); } catch { alert("Extras must be valid JSON"); return; }
    }
    let pfpUrl = "";
    if (pfpFile) {
      const att = DataStore.saveAttachmentLocally(pfpFile);
      pfpUrl = att.url;
    }
    const bot = {
      id: crypto.randomUUID(),
      name, pfpUrl, description, personality, extras,
      createdAt: new Date().toISOString(),
    };
    DataStore.upsertBot(bot);
    form.reset();
    renderBots();
  });

  function renderBots() {
    const bots = DataStore.loadBots();
    list.innerHTML = bots.map(b => {
      const img = b.pfpUrl ? `<img src="${b.pfpUrl}" alt="${b.name}">` : `<div style="width:56px;height:56px;border-radius:10px;background:#182030"></div>`;
      return `
      <div class="bot-card">
        ${img}
        <div class="meta">
          <div class="name">${escapeHtml(b.name)}</div>
          <div class="desc">${escapeHtml(b.description || "")}</div>
        </div>
        <div>
          <a class="button secondary" href="/chat.html?bot=${encodeURIComponent(b.id)}">Chat</a>
          <button data-del="${b.id}" class="secondary">Delete</button>
        </div>
      </div>`;
    }).join("");

    list.querySelectorAll("button[data-del]").forEach(btn => {
      btn.addEventListener("click", () => {
        DataStore.deleteBot(btn.getAttribute("data-del"));
        renderBots();
      });
    });
  }
});

function escapeHtml(str) {
  return (str || "").replace(/[&<>"]+/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[s]));
}
