chrome.storage.local.get("highlights", (data) => {
    if (data.highlights) {console.log("Saved highlights:", data.highlights);}
});

console.log("Pop up content page is running")

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("received")
    if (message.txt) {
        console.log("Received message:", message.txt);
    }
    return true
});


