document.addEventListener("DOMContentLoaded", async () => {
  await requireAuth();
  const list = document.getElementById("group-bot-list");
  const titleInput = document.getElementById("group-title");
  const startBtn = document.getElementById("start-group-chat");
  const messagesEl = document.getElementById("group-messages");
  const composer = document.getElementById("group-composer");
  const input = document.getElementById("group-message-input");
  const attachment = document.getElementById("group-attachment");

  const bots = DataStore.loadBots();
  list.innerHTML = bots.map(b => `<label><input type="checkbox" value="${b.id}"><span>${escapeHtml(b.name)}</span></label>`).join("");

  const state = { selected: [], messages: [], participants: [] };

  list.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", () => {
      const ids = Array.from(list.querySelectorAll("input:checked")).map(i => i.value);
      state.selected = ids;
    });
  });

  startBtn.addEventListener("click", () => {
    state.participants = state.selected.map(id => DataStore.getBot(id)).filter(Boolean);
    if (state.participants.length < 2) return alert("Select at least two characters.");
    composer.classList.remove("hidden");
    messagesEl.innerHTML = "";
  });

  composer.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    const atts = Array.from(attachment.files || []).map(DataStore.saveAttachmentLocally);
    if (!text && atts.length === 0) return;
    pushMessage({ role: "user", content: text, attachments: atts });
    input.value = ""; attachment.value = "";

    // Round-robin: pick next bot to reply
    const nextBot = state.participants[state.messages.filter(m => m.role === "bot").length % state.participants.length];
    const system = AI.buildSystemPrompt(nextBot);
    const reply = await AI.callGPT(collectMessages(), system);
    pushMessage({ ...reply, botId: nextBot.id });
  });

  function pushMessage(msg) {
    const el = document.createElement("div");
    el.className = `message ${msg.role}`;
    const from = msg.role === "bot" ? (DataStore.getBot(msg.botId)?.name || "Bot") : "You";
    el.innerHTML = `
      <div><strong>${escapeHtml(from)}:</strong> ${escapeHtml(msg.content || "")}</div>
      ${renderAttachments(msg.attachments || [])}
    `;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    state.messages.push(msg);
  }

  function renderAttachments(atts) {
    return atts.map(att => {
      if (att.type.startsWith("image/")) return `<img class=\"attachment\" src=\"${att.url}\" alt=\"${att.name}\">`;
      if (att.type.startsWith("video/")) return `<video class=\"attachment\" src=\"${att.url}\" controls></video>`;
      return `<a class=\"attachment\" href=\"${att.url}\" target=\"_blank\" rel=\"noopener\">${escapeHtml(att.name)}</a>`;
    }).join("");
  }

  function collectMessages() { return state.messages.map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.content })); }
});

function escapeHtml(str) { return (str || "").replace(/[&<>"]+/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[s])); }
