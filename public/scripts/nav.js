document.addEventListener("DOMContentLoaded", async () => {
  const loginLink = document.getElementById("login-link");
  const logoutBtn = document.getElementById("logout-btn");
  if (!window.supabaseClient) return;
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    if (loginLink) loginLink.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
  } else {
    if (loginLink) loginLink.classList.remove("hidden");
    if (logoutBtn) logoutBtn.classList.add("hidden");
  }
  logoutBtn?.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "/login.html";
  });
});
