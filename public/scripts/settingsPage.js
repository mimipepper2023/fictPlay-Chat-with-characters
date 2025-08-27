document.addEventListener("DOMContentLoaded", () => {
  const s = Settings.get();
  // Theme
  const themeMode = document.getElementById("theme-mode");
  const themePrimary = document.getElementById("theme-primary");
  const themeSecondary = document.getElementById("theme-secondary");
  themeMode.value = s?.theme?.mode || "dark";
  themePrimary.value = s?.theme?.primary || "#6ee7b7";
  themeSecondary.value = s?.theme?.secondary || "#60a5fa";
  document.getElementById("save-theme").addEventListener("click", () => {
    Settings.update({ theme: { mode: themeMode.value, primary: themePrimary.value, secondary: themeSecondary.value } });
    alert("Theme saved.");
  });

  // APIs
  const sbUrl = document.getElementById("sb-url");
  const sbKey = document.getElementById("sb-key");
  const openai = document.getElementById("openai-key");
  sbUrl.value = s?.apis?.supabaseUrl || "";
  sbKey.value = s?.apis?.supabaseKey || "";
  openai.value = s?.apis?.openaiKey || "";
  document.getElementById("save-apis").addEventListener("click", () => {
    Settings.update({ apis: { supabaseUrl: sbUrl.value.trim(), supabaseKey: sbKey.value.trim(), openaiKey: openai.value.trim() } });
    if (window.reinitSupabaseClient) window.reinitSupabaseClient();
    alert("APIs saved.");
  });

  // Instructions
  const instructions = document.getElementById("global-instructions");
  instructions.value = s?.instructions || "";
  document.getElementById("save-instructions").addEventListener("click", () => {
    Settings.update({ instructions: instructions.value });
    alert("Instructions saved.");
  });
});
