console.log("attempting get...", chrome.storage.local.get('highlights'))

document.addEventListener('DOMContentLoaded', async function() {
    try{
        const result = await chrome.storage.local.get(['highlights'])
        console.log("here's the result of the get...:", result)
        const highlights = result.highlights
        console.log(highlights)
        const container = document.getElementById('highlights')

        if (highlights.length > 0) {
            highlights.forEach((text, index) => {
                const entry = document.createElement('div')
                if (text.length > 20) {
                    const truncatedText = text.length > 20 ? text.slice(0, 20) + '...' : text;
                    entry.textContent = `${index + 1}: ${truncatedText}`
                    container.appendChild(entry)
                } else {
                    entry.textContent = `${index + 1}: ${text}`
                    entry.style.marginBottom = '5px'
                    container.appendChild(entry)
                }

            })
        } else {
            container.textContent = 'No prompts banked'
        }
        
        // document.getElementById('generateQuetion').addEventListener('click', async function () {
        //     const result = await chrome.storage.local.get(['highlightedText']);
        //     if (result.highlightedText) {
        //         generateQuestion(result.highlightedText);
        //     }
        // })
    } catch (error) {
        console.error('Error fetching Highlighted text: ', error)
    }
})
    


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