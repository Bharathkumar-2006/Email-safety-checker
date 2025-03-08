document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");

    const API_URL = "http://localhost:5000/api/auth"; // Backend API URL

    // 🔹 LOGIN
    if (loginBtn) {
        loginBtn.addEventListener("click", async () => {
            const username = document.getElementById("login-username").value;
            const password = document.getElementById("login-password").value;

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    chrome.storage.local.set({ token: data.token }, () => {
                        window.location.href = "popup.html"; // Redirect to main UI
                    });
                } else {
                    document.getElementById("error-message").innerText = data.message;
                }
            } catch (error) {
                console.error("Login error:", error);
            }
        });
    }

    // 🔹 REGISTER
    if (registerBtn) {
        registerBtn.addEventListener("click", async () => {
            const username = document.getElementById("register-username").value;
            const email = document.getElementById("register-email").value;
            const password = document.getElementById("register-password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            if (password !== confirmPassword) {
                document.getElementById("error-message").innerText = "Passwords do not match.";
                return;
            }

            try {
                const response = await fetch(`${API_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    chrome.storage.local.set({ token: data.token }, () => {
                        window.location.href = "popup.html"; // Redirect after registration
                    });
                } else {
                    document.getElementById("error-message").innerText = data.message;
                }
            } catch (error) {
                console.error("Registration error:", error);
            }
        });
    }
});
