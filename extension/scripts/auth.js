async function getToken() {
    const data = await chrome.storage.local.get("token");
    return data.token || null;
}

async function setToken(token) {
    await chrome.storage.local.set({ token });
}

async function logout() {
    await chrome.storage.local.remove("token");
}
