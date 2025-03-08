function extractEmail() {
    const emailElement = document.querySelector(".gD"); // Gmail sender email selector
    if (emailElement) {
        const email = emailElement.getAttribute("email");
        chrome.storage.local.set({ email });
    }
}

setInterval(extractEmail, 5000); // Run every 5 seconds
