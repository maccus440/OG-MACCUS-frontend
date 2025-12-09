
  // 🔐 Strict auth guard — no fallback to localStorage
  if (!sessionStorage.getItem('isLoggedIn')) {
    // Force full reload if coming from bfcache (Back button)
    if (performance.navigation.type === 2) { // 2 = 'back_forward'
      location.reload(true); // true = bypass cache
    }
    // Redirect to login — with replace to avoid back-loop
    window.location.replace('/second-login/public/index2.html');
  }


  