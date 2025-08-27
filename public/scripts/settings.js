const Settings = (() => {
  const KEY = "fictplay.settings.v1";
  const listeners = new Set();

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
  }
  function save(next) {
    localStorage.setItem(KEY, JSON.stringify(next));
    applyTheme(next.theme || {});
    listeners.forEach(cb => cb(next));
  }
  function get() { return load(); }
  function update(partial) { const merged = { ...load(), ...partial }; save(merged); return merged; }

  function onChange(cb) { listeners.add(cb); return () => listeners.delete(cb); }

  function applyTheme(theme) {
    const mode = theme.mode || "dark";
    document.documentElement.setAttribute("data-theme", mode);
    const root = document.documentElement;
    if (theme.primary) root.style.setProperty("--primary", theme.primary);
    if (theme.secondary) root.style.setProperty("--secondary", theme.secondary);
  }

  // Apply on load
  document.addEventListener("DOMContentLoaded", () => applyTheme(get().theme || {}));

  return { get, update, onChange, applyTheme };
})();
