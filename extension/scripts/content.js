function getCurrentEmail() {
    let emailElement = document.querySelector("span[email], .gD, .go");
    if (emailElement) {
        return emailElement.getAttribute("email") || emailElement.textContent;
    }
    return null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getEmail") {
        let email = getCurrentEmail();
        if (email) {
            chrome.storage.local.set({ email: email }, () => {
                sendResponse({ email: email });
            });
        } else {
            sendResponse({ email: null });
        }
        return true; 
    }
});
