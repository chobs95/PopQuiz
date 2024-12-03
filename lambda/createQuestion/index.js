// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html


import {SecretsManagerClient, GetSecretValueCommand} from "@aws-sdk/client-secrets-manager";
import { GoogleGenerativeAI } from "@google/generative-ai";

let geminiAPIkey= ''

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
        return response.SecretString
    } catch (error) {
        console.error("error fetching secret from secrets manager: ", error)
        throw new Error("Unable to retrieve Gemini API key");
    }
}

export const handler = async (events) => {
    try {
        if (!geminiAPIkey) getGeminiKey()
        const genAI = new GoogleGenerativeAI(`${geminiAPIkey}`);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const queryParams = events.queryStringParameters
        const prompt = "Generate me a quiz style question based on this prompt: " + queryParams.prompt 
        const result = await model.generateContent(prompt)
        return {
            statusCode: 200,
            body: JSON.stringify({ result }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: "We've hit a snag huston"})
        };
    }
};