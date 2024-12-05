import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Function to fetch Gemini API key from AWS Secrets Manager
const getGeminiKey = async () => {
    const secret_name = "Gemini_Key";
    const client = new SecretsManagerClient({
        region: "eu-west-2",
    });

    try {
        const response = await client.send(
            new GetSecretValueCommand({
                SecretId: secret_name,
                VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            })
        );

        // Return the secret string containing the API key
        const secretKey = JSON.parse(response.SecretString)
        return secretKey["GeminiAPI_Key"]

    } catch (error) {
        console.error("Error fetching secret from Secrets Manager:", error);
        throw new Error("Unable to retrieve Gemini API key");
    }
};

export const handler = async (event) => {
    try {
        // Fetch Gemini API key from Secrets Manager
        const geminiAPIkey = await getGeminiKey();
        const genAI = new GoogleGenerativeAI(geminiAPIkey);

        const schema = {
            description: "Quiz question with options and correct answer",
            type: SchemaType.OBJECT,
            properties: {
            question: {
                type: SchemaType.STRING,
                description: "The quiz question text",
                nullable: false,
            },
            options: {
                type: SchemaType.OBJECT,
                description: "Multiple-choice options for the question",
                properties: {
                a: {
                    type: SchemaType.STRING,
                    description: "Option A",
                    nullable: false,
                },
                b: {
                    type: SchemaType.STRING,
                    description: "Option B",
                    nullable: false,
                },
                c: {
                    type: SchemaType.STRING,
                    description: "Option C",
                    nullable: false,
                },
                d: {
                    type: SchemaType.STRING,
                    description: "Option D",
                    nullable: false,
                },
                },
                required: ["a", "b", "c", "d"],
            },
            answer: {
                type: SchemaType.STRING,
                description: "The correct answer (e.g., 'a', 'b', 'c', 'd')",
                nullable: false,
            },
            },
            required: ["question", "options", "answer"],
        };
        
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
            },
        });

        // Parse query parameters for the prompt
        const queryParams = event.queryStringParameters
        const prompt = "Generate me a quiz style question based on the following prompt: " + queryParams.prompt 
        console.log("node.js version:", process.version)
        console.log("using prompt:", prompt)

        console.log("attempting to generate question...")
        // Generate content using the Gemini API
        
        let result;
        try {
            result = await model.generateContent(prompt);
            console.log("Gemini API Response:", result.response.text());
            
        } catch (error) {
            console.log(error)
            console.error("Error calling Gemini API:", error);
            throw error 
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Failed to generate content from Gemini API" }),
            };
        }
        console.log("returned this result.response: ", result.response.text())

        // Return the result
        return {
            statusCode: 200,
            body: result.response.text()
        };
    } catch (error) {
        console.error("Error in Lambda function:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: "IDK man we got a problem somewhere." }),
        };
    }
};
