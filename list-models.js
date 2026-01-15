import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyA8REsWqKejSWdP9Y7ePpnaA7C1iDftpoM";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        // For listing models, we don't need to get a specific model first
        // But the SDK structure usually requires a model instance or uses a different manager.
        // Let's try to just use the fetch directly if SDK doesn't expose it easily,
        // or check if the error message gave a hint.
        // Actually, the error message said: "Call ListModels to see the list of available models".
        // In the JS SDK, this is usually done via the model manager or similar.
        // Let's try a simple fetch to the API endpoint since I don't have the full SDK docs handy.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        console.log("Available models:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
