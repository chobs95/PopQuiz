console.log("attempting get...", chrome.storage.local.get('highlights'))


document.addEventListener('DOMContentLoaded', async function() {
    try{
        const result = await chrome.storage.local.get(['highlights'])
        const highlights = result.highlights || []
        populateHighlights(highlights)
        handleGenerateQuestionButton(highlights)
        } catch (error) {
            console.error('Error fetching Highlighted text: ', error)
        }
    })

    function populateHighlights(highlights) {
        const placeholderText = document.getElementById('placeholderText')
        if (highlights.length > 0) { 
            placeholderText.remove()
            const container = document.getElementById('highlightContainer')
            highlights.forEach((text, index) => {
                const entry = document.createElement('div')
                const truncatedText = text.length > 30 ? text.slice(0 , 30) + '...' : text;
                entry.className = 'entry'
                entry.textContent = `${index + 1}: `+`${truncatedText}`

                removeButton = document.createElement('button')
                removeButton.textContent = 'X'
                removeButton.className = 'removeButton'
                entry.appendChild(removeButton)

                removeButton.addEventListener('click', ()=> handleRemoveHighlight(index, entry))
                container.appendChild(entry)
            })
            container.className = "scrollBox"
            } else {
                console.log("cool")
            }
    }

    function handleGenerateQuestionButton(highlights) {
        if (highlights.length > 0) {
            container = document.getElementById('questionContainer')
            const questionButton = document.createElement('button')
            questionButton.textContent = "Generate Question"
            questionButton.className = "questionButton"
            
            questionButton.addEventListener('click', ()=> handleGenerateQuestion(highlights))
            container.appendChild(questionButton)
        } else {
            console.log('noquestions')
        }
    }

    
    function handleRemoveHighlight(index, entry) {
        chrome.storage.local.get(['highlights'], (result) => {
            const updatedHighlights = result.highlights || []
            updatedHighlights.splice(index, 1)
            chrome.storage.local.set({ highlights: updatedHighlights})
            entry.remove()
    })}
    
    async function handleGenerateQuestion(highlights) {
        const promptContainer = document.getElementById('scrollBoxContainer')
        promptContainer.remove()
        const questionButton = document.getElementById('questionContainer')
        document.getElementById('titleMessage').textContent = "Do you remember the answer?"
        questionButton.remove()
        console.log("here are the highlights : ",highlights)

        // Generate a random question to pass to API
        const randomQuestion = highlights[Math.floor(Math.random() * highlights.length)]
        
        console.log(randomQuestion)
        
        // Function to await gemini's api 
        const question = await generateQuestionFromGemini(randomQuestion)

        const innerContainer = document.getElementById("innerContainer")
        // const question = document.createElement('div')
        question.textContent = `This is the info: ${randomQuestion} `
        innerContainer.appendChild(question)
    }

    async function generateQuestionFromGemini(randomQuestion) {
        
    }


