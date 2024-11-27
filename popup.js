document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['highlightedText'], function(result) {
        document.getElementById('highlightedText').textContent = result.highlightedText || 'No text saved.';
    });
    document.getElementById('generateQuestion').addEventListener('click', function() {
        chrome.storage.local.get(['highlightedText'], function(result) {
        if (result.highlightedText) {
            generateQuestion(result.highlightedText);
            }
        });
    });
    
});


// function generateQuestion(text) {
//     // Call to ChatGPT API here
//     fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer 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'
//     },
//     body: JSON.stringify({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "system", content: "Create a question based on the following text." }, { role: "user", content: text }]
//     })
//     })
//     .then(response => response.json())
//     .then(data => {
//         let question = data.choices[0].message.content;
//         document.getElementById('question').textContent = "Generated Question: " + question;
//     })
//     .catch(error => console.error('Error:', error));
// }
