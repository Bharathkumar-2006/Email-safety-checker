document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    // Redirect to login if no token
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const emailInput = document.getElementById("email-input");
    const fetchEmailBtn = document.getElementById("fetch-email-btn");
    const checkEmailBtn = document.getElementById("check-email-btn");
    const resultDisplay = document.getElementById("result");

    // Fetch and display the latest sender email
    function fetchLatestEmail() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "getEmail" }, (response) => {
                if (response && response.email) {
                    chrome.storage.local.set({ email: response.email }, () => {
                        emailInput.value = response.email;
                    });
                } else {
                    emailInput.placeholder = "Enter email manually";
                }
            });
        });
    }

    // Load stored email if available
    chrome.storage.local.get("email", (data) => {
        if (data.email) {
            emailInput.value = data.email;
        } else {
            fetchLatestEmail(); 
        }
    });

    // Fetch email 
    fetchEmailBtn.addEventListener("click", fetchLatestEmail);

    // Send email to backend
    checkEmailBtn.addEventListener("click", () => {
        const email = emailInput.value.trim();
        if (!email) {
            resultDisplay.innerHTML = "<p style='color:red;'>Please enter an email.</p>";
            return;
        }

        fetch("http://localhost:5000/api/check-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(data => {
            resultDisplay.innerHTML = `
                <p><strong>Valid:</strong> ${data.valid}</p>
                <p><strong>Spam Score:</strong> ${data.fraud_score}</p>
                <p><strong>Deliverability:</strong> ${data.deliverability}</p>
                <p><strong>Disposable:</strong> ${data.disposable}</p>
                <p><strong>First Seen:</strong> ${data.first_seen.human}</p>
            `;
        })
        .catch(error => {
            console.error("Error:", error);
            resultDisplay.innerHTML = "<p style='color:red;'>Error checking email.</p>";
        });
    });

    // Logout
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("token");
        chrome.storage.local.remove("email");
        window.location.href = "login.html";
    });
});
