document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const signupBtn = document.getElementById("signup-btn");
  const statusEl = document.getElementById("auth-status");

  if (!window.supabaseClient) {
    statusEl.textContent = "Supabase is not configured.";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Signing in...";
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) {
      statusEl.textContent = error.message;
    } else {
      statusEl.textContent = "Signed in.";
      window.location.href = "/index.html";
    }
  });

  signupBtn.addEventListener("click", async () => {
    statusEl.textContent = "Creating account...";
    const { data, error } = await supabaseClient.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (error) statusEl.textContent = error.message; else statusEl.textContent = "Check your email to confirm.";
  });
});
