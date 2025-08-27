async function requireAuth() {
  if (!window.supabaseClient) return;
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "/login.html";
  }
}
