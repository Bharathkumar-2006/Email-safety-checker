document.addEventListener("DOMContentLoaded", async () => {
    const loginSection = document.getElementById("login-section");
    const emailChecker = document.getElementById("email-checker");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("login-btn");
    const checkEmailBtn = document.getElementById("check-email-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const errorMessage = document.getElementById("error-message");
    const emailDisplay = document.getElementById("email-display");
    const resultDisplay = document.getElementById("result");

    const storedToken = await chrome.storage.local.get("token");

    if (storedToken.token) {
        loginSection.style.display = "none";
        emailChecker.style.display = "block";

        chrome.storage.local.get("email", (data) => {
            if (data.email) {
                emailDisplay.textContent = data.email;
            }
        });
    }

    loginBtn.addEventListener("click", async () => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        try {
            const res = await fetch("https://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();
            if (res.ok) {
                await chrome.storage.local.set({ token: data.token });
                loginSection.style.display = "none";
                emailChecker.style.display = "block";
            } else {
                errorMessage.textContent = data.message;
            }
        } catch (error) {
            errorMessage.textContent = "Login failed!";
        }
    });

    checkEmailBtn.addEventListener("click", async () => {
        const { email } = await chrome.storage.local.get("email");
        if (!email) return (resultDisplay.textContent = "No email found.");

        const { token } = await chrome.storage.local.get("token");

        const res = await fetch("https://localhost/api/check-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ email })
        });

        const data = await res.json();
        resultDisplay.textContent = data.safe ? "Safe ✅" : "Spam ❌";
    });

    logoutBtn.addEventListener("click", async () => {
        await chrome.storage.local.remove(["token", "email"]);
        loginSection.style.display = "block";
        emailChecker.style.display = "none";
    });
});
