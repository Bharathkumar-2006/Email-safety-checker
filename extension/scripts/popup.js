document.addEventListener("DOMContentLoaded", async function () {
    const logoutBtn = document.getElementById("logout-btn");
    const checkEmailBtn = document.getElementById("check-email-btn");

    const API_URL = "http://localhost:5000/api";
    let userApiKey = "";

    //Check if user is logged in
    chrome.storage.local.get("token", async (data) => {
        if (!data.token) {
            window.location.href = "login.html";
            return;
        }

        //Get User's API Key
        try {
            const response = await fetch(`${API_URL}/auth/get-api-key`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${data.token}` },
            });

            const result = await response.json();

            if (response.ok) {
                userApiKey = result.apiKey;
            } else {
                console.error("Failed to get API key:", result.message);
            }
        } catch (error) {
            console.error("Error fetching API key:", error);
        }
    });

    //Logout Button
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            chrome.storage.local.remove("token", () => {
                window.location.href = "login.html";
            });
        });
    }

    //Check Email API Call
    if (checkEmailBtn) {
        checkEmailBtn.addEventListener("click", async () => {
            const email = document.getElementById("email-display").innerText;

            if (!userApiKey) {
                document.getElementById("result").innerText = "API Key not found.";
                return;
            }

            try {
                const response = await fetch(`${API_URL}/email/check`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userApiKey}`
                    },
                    body: JSON.stringify({ email })
                });

                const result = await response.json();
                
                if (response.ok) {
                    document.getElementById("result").innerText = `Result: ${result.status}`;
                } else {
                    document.getElementById("result").innerText = "Error checking email.";
                }
            } catch (error) {
                console.error("Email check error:", error);
            }
        });
    }
});
