document.getElementById("loginform").addEventListener("submit", ((event) => {
    event.preventDefault();

    const username = document.getElementById("Username").value.trim();
    const password = document.getElementById("Password").value.trim();
    const message = document.getElementById("message");

    // Demo credentials
    const validUsername = "john440";
    const validPassword = "1234567";

    // Validation
    if (!username || username.length < 5) {
        message.style.color = 'red';
        message.textContent = 'Username must be at least 5 characters';
        return;
    }
    if (!password || password.length < 6) {
        message.style.color = 'red';
        message.textContent = 'Password must be at least 6 characters';
        return;
    }

    // Check credentials
    if (username === validUsername && password === validPassword) {
        message.style.color = 'green';
        message.textContent = 'Login Successful';
        
        // Show loading spinner
        document.getElementById("loadingSpinner").style.display = "flex";
        
        // Navigate after 1.5 seconds
        setTimeout(() => {
            localStorage.setItem("user", JSON.stringify({ username }));
            window.location.href = "/second-login/public/index2.html";
        }, 1500);
    } else {
        message.style.color = 'red';
        message.textContent = 'Invalid username or password';
    }
}));