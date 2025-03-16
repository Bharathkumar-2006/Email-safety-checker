document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    // If no token, redirect to login page
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const emailDisplay = document.getElementById("email-display");
    const checkEmailBtn = document.getElementById("check-email-btn");
    const resultDisplay = document.getElementById("result");

    // Fetch sender's email from content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getEmail" }, (response) => {
            if (response && response.email) {
                emailDisplay.textContent = response.email;
            } else {
                emailDisplay.textContent = "No email detected.";
            }
        });
    });

    // Send email to backend for verification
    checkEmailBtn.addEventListener("click", () => {
        const email = emailDisplay.textContent;
        if (!email || email === "No email detected.") {
            resultDisplay.textContent = "No email found.";
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
            resultDisplay.textContent = "Error checking email.";
        });
    });

    // Logout Button
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
});
