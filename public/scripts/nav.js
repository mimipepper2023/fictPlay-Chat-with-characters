document.addEventListener("DOMContentLoaded", async () => {
  const loginLink = document.getElementById("login-link");
  const logoutBtn = document.getElementById("logout-btn");
  // Insert Settings link if not present on some pages
  const headerNav = document.querySelector(".site-header nav");
  if (headerNav && !headerNav.querySelector('a[href="/settings.html"]')) {
    const settingsLink = document.createElement("a");
    settingsLink.href = "/settings.html";
    settingsLink.textContent = "Settings";
    headerNav.insertBefore(settingsLink, document.getElementById("login-link"));
  }
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
