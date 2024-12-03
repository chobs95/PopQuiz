import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBlw_gA4g7tDRiSk3r2wDi8qw4B6bARA8Y");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function testGenerateContent() {
    const prompt = "Generate a quiz question about space";
    try {
        const result = await model.generateContent(prompt);
        console.log("Result:", result.response.text());
    } catch (error) {
        console.error("Error in generateContent:", error);
    }
}

testGenerateContent();
