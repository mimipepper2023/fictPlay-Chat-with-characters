document.addEventListener("DOMContentLoaded", async () => {
  await requireAuth();
  const botSelect = document.getElementById("chat-bot-select");
  const messagesEl = document.getElementById("messages");
  const composer = document.getElementById("composer");
  const input = document.getElementById("message-input");
  const attachment = document.getElementById("attachment");

  const bots = DataStore.loadBots();
  botSelect.innerHTML = bots.map(b => `<option value="${b.id}">${escapeHtml(b.name)}</option>`).join("");

  const params = new URLSearchParams(window.location.search);
  const preselect = params.get("bot");
  if (preselect) botSelect.value = preselect;

  composer.addEventListener("submit", async (e) => {
    e.preventDefault();
    const bot = DataStore.getBot(botSelect.value);
    if (!bot) return alert("Select a character");
    const text = input.value.trim();
    if (!text && attachment.files.length === 0) return;

    const atts = Array.from(attachment.files || []).map(DataStore.saveAttachmentLocally);
    pushMessage({ role: "user", content: text, attachments: atts });
    input.value = ""; attachment.value = "";

    const system = AI.buildSystemPrompt(bot);
    const reply = await AI.callGPT(collectMessages(), system);
    pushMessage(reply);
  });

  function pushMessage(msg) {
    const el = document.createElement("div");
    el.className = `message ${msg.role}`;
    el.innerHTML = `
      <div>${escapeHtml(msg.content || "")}</div>
      ${renderAttachments(msg.attachments || [])}
    `;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    state.messages.push(msg);
  }

  function renderAttachments(atts) {
    return atts.map(att => {
      if (att.type.startsWith("image/")) {
        return `<img class="attachment" src="${att.url}" alt="${att.name}">`;
      }
      if (att.type.startsWith("video/")) {
        return `<video class="attachment" src="${att.url}" controls></video>`;
      }
      return `<a class="attachment" href="${att.url}" target="_blank" rel="noopener">${escapeHtml(att.name)}</a>`;
    }).join("");
  }

  const state = { messages: [] };
  function collectMessages() { return state.messages.map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.content })); }
});

function escapeHtml(str) {
  return (str || "").replace(/[&<>"]+/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[s]));
}
