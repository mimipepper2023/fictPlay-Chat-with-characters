(() => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.FICTPLAY_CONFIG || {};
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("Supabase config missing. Copy config.example.js to config.js and fill keys.");
  }
  window.supabaseClient = window.supabase?.createClient?.(SUPABASE_URL, SUPABASE_ANON_KEY);
})();
