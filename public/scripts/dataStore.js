const DataStore = (() => {
  const BOTS_KEY = "fictplay.bots.v1";
  const RECENT_BOTS_KEY = "fictplay.recentBots.v1";

  function loadBots() {
    try {
      const json = localStorage.getItem(BOTS_KEY);
      return json ? JSON.parse(json) : [];
    } catch (e) { return []; }
  }

  function saveBots(bots) {
    localStorage.setItem(BOTS_KEY, JSON.stringify(bots));
  }

  function upsertBot(bot) {
    const bots = loadBots();
    const index = bots.findIndex(b => b.id === bot.id);
    if (index >= 0) bots[index] = bot; else bots.unshift(bot);
    saveBots(bots);
    trackRecent(bot.id);
    return bot;
  }

  function deleteBot(botId) {
    const bots = loadBots().filter(b => b.id !== botId);
    saveBots(bots);
  }

  function getBot(botId) {
    return loadBots().find(b => b.id === botId) || null;
  }

  function trackRecent(botId) {
    try {
      const arr = JSON.parse(localStorage.getItem(RECENT_BOTS_KEY) || "[]");
      const next = [botId, ...arr.filter(id => id !== botId)].slice(0, 6);
      localStorage.setItem(RECENT_BOTS_KEY, JSON.stringify(next));
    } catch (e) {}
  }

  function getRecentBots() {
    try {
      const ids = JSON.parse(localStorage.getItem(RECENT_BOTS_KEY) || "[]");
      const map = new Map(loadBots().map(b => [b.id, b]));
      return ids.map(id => map.get(id)).filter(Boolean);
    } catch (e) { return []; }
  }

  function saveAttachmentLocally(file) {
    // For now, use Object URLs for preview. Replace with Supabase Storage upload.
    const url = URL.createObjectURL(file);
    return { type: file.type, name: file.name, url };
  }

  return { loadBots, saveBots, upsertBot, deleteBot, getBot, getRecentBots, saveAttachmentLocally };
})();
