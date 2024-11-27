

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.message === "myMessage") {
        console.log("recieved message");
    }
});


chrome.action.onClicked.addListener((tab) => {
    let msg = { txt: "hello" };
    chrome.tabs.sendMessage(tab.id, msg,);  // Sends the message to the content script
});

console.log("after listener!")


function getTabId() {
    tabId = chrome.tabs.get()
    console.log(tabId)
    return tabId
}











//**  THIS STUFF IS FOR THE RIGHT CLICK MENU STUFFF*/

// Create a context menu when the user right-clicks
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "saveHighlight",
        title: "Save highlighted text for PopQuiz",
        contexts: ["selection"]
    });
});

// Listen for the context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log(info.menuItemId)
    console.log(tab)
    if (info.menuItemId === "saveHighlight" ) {
        // Save the highlighted text
        chrome.storage.local.get({ highlights: [] }, (data) => {
            const updatedHighlights = [...data.highlights, info.selectionText];
            chrome.storage.local.set({ highlights: updatedHighlights }, () => {
                console.log("Text saved:", info.selectionText);
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "images/popQuiz_128.png",
                    title: "PopQuiz",
                    message: "Highlighted text saved!",
                });
            });
        });
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: showFloatingUI,
            args: [info.selectionText]
        });
    }
});


function showFloatingUI(selectedText) {
    
    function undoLastHighlight(floatingDiv) {
        console.log("undo button pressed")
        data = chrome.storage.local.get("highlights", (data)=> {
            const highlights = data.highlights
            if (highlights.length > 0)  {
                highlights.pop();
                chrome.storage.local.set({ highlights }) 
            const floatingMessage = floatingDiv.querySelector('#floatingMessage');
                console.log(floatingMessage)
                if (floatingMessage) {
                    floatingMessage.textContent = `Prompt "${selectedText}" was removed`;
                } else {console.log("no message found")}
            }})
            setTimeout(() => {
                floatingDiv.remove();
            }, 2000);}
            
            

    // Create the container div
    const floatingDiv = document.createElement('div');
    floatingDiv.style.position = 'fixed';
    floatingDiv.style.top = '10px';
    floatingDiv.style.right = '10px';
    floatingDiv.style.width = 'auto';
    floatingDiv.style.height = 'auto';
    floatingDiv.style.zIndex = '9999';
    floatingDiv.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5)';

    // Fetch the external HTML
    fetch(chrome.runtime.getURL('floatingUI.html'))
        .then(response => response.text())
        .then(html => {
            // Inject the fetched HTML into the div
            floatingDiv.innerHTML = html;

            // Append the floating UI to the body
            document.body.appendChild(floatingDiv);

            // Add event listener for the close button
            const closeButton = floatingDiv.querySelector('#closeButton');
            closeButton.addEventListener('click', () => floatingDiv.remove());

            const undoButtonElement = floatingDiv.querySelector('#undoButton')
            undoButtonElement.addEventListener('click', ()=> undoLastHighlight(floatingDiv))

            // Automatically remove the floating UI after 5 seconds
            setTimeout(() => {
                floatingDiv.remove();
            }, 5000);
        })
        .catch(error => console.error('Error loading floating UI:', error));
}


