(() => {
  function getKeys() {
    const cfg = window.FICTPLAY_CONFIG || {};
    const overrides = (window.Settings?.get()?.apis) || {};
    return {
      SUPABASE_URL: overrides.supabaseUrl || cfg.SUPABASE_URL,
      SUPABASE_ANON_KEY: overrides.supabaseKey || cfg.SUPABASE_ANON_KEY,
    };
  }

  function init() {
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = getKeys();
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn("Supabase config missing. Provide keys in settings or config.js");
      window.supabaseClient = null;
      return;
    }
    window.supabaseClient = window.supabase?.createClient?.(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  init();
  window.reinitSupabaseClient = init;
})();
