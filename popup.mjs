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
        console.log("this is gen question: ", generatedQuestion.question)
        // parsedParagraphData = parseQuizJSON(generatedQuestion)
        formatQuestion(generatedQuestion)
    }

    async function fetchQuestion(prompt) {
        if (!prompt) return null
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
                    console.log(await res)
                }
            } catch (error) {
                console.log("this is the error: ", error)
            }
        }
        

    // function parseQuizJSON(response) {
    //     try {
    //         // Ensure the response is properly parsed JSON
    //         const { question, options, answer } = response;
    //         console.log("Parsed Quiz json info:", question, options, answer)
    //         // Extract answers as an array from the options object
    //         return {
    //             question: question || "Question not found",
    //             answers: answers.length > 0 ? answers : "Answers not found",
    //             correctAnswer: answer || "Correct answer not found",
    //         };
    //     } catch (error) {
    //         console.error("Error parsing quiz JSON:", error);
    //         return {
    //             question: "Error parsing question",
    //             answers: [],
    //             correctAnswer: "Error parsing correct answer",
    //         };
    //     }
    // }

    function formatQuestion(parsedData) {
        console.log("this is the parsed data for the formating function: ",parsedData)
        const questionText = parsedData.question
        const options = parsedData.options
        const answer =parsedData.answer

        const container = document.createElement("div");
        container.className = "question-container";
        // Add the question text
        const questionDiv = document.getElementById("geminiQuestion");
        questionDiv.className = "question-text";
        questionDiv.textContent = `Question: ${questionText}`;
        container.appendChild(questionDiv);

        // Create a container for the answers
        const optionsContainer = document.createElement("div");
        optionsContainer.className = "answers-container";

        console.log("this should be an array of answers: ", options)
        Object.entries(options).forEach(([letter, option]) => {
            // Create a div for each answer
            const optionDiv = document.createElement("div");
            optionDiv.className = "answer-option";
        
            // Create a button for the answer
            const button = document.createElement("button");
            button.className = "answerButton";
            button.textContent = `${letter}) ${option}`;
        
            // Add click event to the button
            button.addEventListener("click", () => {
                if (letter === answer) {
                    alert("Correct!");
                } else {
                    alert(`Try again! The correct answer is: ${answer}`);
                }
            });
        
            // Append the button to the answer div
            optionDiv.appendChild(button);
            optionsContainer.appendChild(optionDiv);
        });

            // Append the answers container to the main container
            container.appendChild(optionsContainer);
            document.getElementById("innerContainer").appendChild(container)

            // Return the complete formatted element
            return container;
        }
    


