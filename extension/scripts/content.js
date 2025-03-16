function getEmailFromGmail() {
    let emailElement = document.querySelector("span[email]");
    return emailElement ? emailElement.getAttribute("email") : null;
}

// Listen for requests from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getEmail") {
        sendResponse({ email: getEmailFromGmail() });
    }
});
