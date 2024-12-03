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

    async function populateHighlights(highlights) {
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
        const geminiQuestion = document.createElement("div")
        geminiQuestion.textContent = "Loading question..."
        geminiQuestion.id = "geminiQuestion"
        document.getElementById('innerContainer').appendChild(geminiQuestion)


        // Generate a random question to pass to API
        const randomQuestion = highlights[Math.floor(Math.random() * highlights.length)]
        
        console.log(randomQuestion)
        
        const generatedQuestion  = await fetchQuestion(randomQuestion)
        parsedParagraphData = parseQuizParagraph(generatedQuestion.result)
        formatQuestion(parsedParagraphData)
    }

    async function fetchQuestion(prompt) {
        if (!prompt) return
        try{
            const encodedPrompt = encodeURIComponent(prompt)
            const queryParams = `?prompt=${encodedPrompt}`
            const res = await fetch(``, {
                method: "GET",
            })
            if (res.ok) {
                const data = await res.json()
                console.log("generated content:", data)
                return data
            } else {
                console.log("Oh no somethign when wrong in lambda function uh oh stinky")
                console.log(await res.json())
            }
        } catch (error) {
            console.log("this is the error: ", error)
        }
    }

    function parseQuizParagraph(paragraph) {
        // Split the paragraph into parts
        const questionMatch = paragraph.match(/\*\*Question:\*\*\s*(.*?)(?=\s*[a-gA-G]\))/s);
        console.log(questionMatch)
        const question = questionMatch ? questionMatch[1].trim() : "Question not found";
        
        const answersMatch = paragraph.match(/(?:[a-gA-G]\))\s*(.*?)(?=\s*[a-gA-G]\)|$)/g);
        const answers = answersMatch
        ? answersMatch.map((ans) => ans.replace(/[a-gA-G]\)\s*/, "").trim())
        : [];

        const correctAnswerMatch = paragraph.match(/\*\*Answer:\*\*\s*(.*)/);
        let correctAnswer = correctAnswerMatch ? correctAnswerMatch[1].trim() : "Answer not found";
        correctAnswer = correctAnswer.replace(/[a-gA-G]\)\s*/, "")
        
        console.log("parsing question result, ", question)
        console.log("parsing answers result", answers)
        console.log("parsing correct answers result", correctAnswer)
    
        // Extract the correct answer
    
        return { question, answers, correctAnswer };
    }

    function formatQuestion(parsedData) {
        console.log("this is the parsed data for the formating function: ",parsedData)
        const questionText = parsedData.question
        const answers = parsedData.answers
        const correctAnswer =parsedData.correctAnswer

        const container = document.createElement("div");
        container.className = "question-container";
        // Add the question text
        const questionDiv = document.getElementById("geminiQuestion");
        questionDiv.className = "question-text";
        questionDiv.textContent = `Question: ${questionText}`;
        container.appendChild(questionDiv);

        // Create a container for the answers
        const answersContainer = document.createElement("div");
        answersContainer.className = "answers-container";

        // Map letters (a, b, c, ...) to answers
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        console.log("this should be an array of answers: ", answers)
        answers.forEach((answer, index) => {
                const letter = alphabet[index];

                // Create a div for each answer
                const answerDiv = document.createElement("div");
                answerDiv.className = "answer-option";

                // Create a button for the answer
                const button = document.createElement("button");
                button.className = "answer-button";
                button.textContent = `${letter}) ${answer}`;

                // Add click event to the button
                button.addEventListener("click", () => {
                    if (answer === correctAnswer) {
                        alert("Correct!");
                    } else {
                        alert(`Try again! ${correctAnswer}`);
                    }
                });

                // Append the button to the answer div
                answerDiv.appendChild(button);
                answersContainer.appendChild(answerDiv);
            });

            // Append the answers container to the main container
            container.appendChild(answersContainer);
            document.getElementById("innerContainer").appendChild(container)

            // Return the complete formatted element
            return container;
        }
    


