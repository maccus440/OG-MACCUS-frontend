
  document.getElementById('logoutBtn').addEventListener('click', function() {
    // 🔥 Clear ALL session data
    sessionStorage.clear(); // ← most important!

    // ✅ Optional: Also clear localStorage (just in case)
    localStorage.clear();

    // 🚫 Prevent back navigation: 
    // - Clear page from history
    // - Reload login page fresh
    window.location.replace('/second-login/public/sign-up2.html');
  });
