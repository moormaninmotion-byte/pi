import { GoogleGenAI } from "@google/genai";
/**
 * Executes a query against the Google Gemini API.
 *
 * @param prompt The full text prompt to send to the model.
 * @param apiKey The user's Gemini API key.
 * @param useGoogleSearch A boolean flag to enable or disable the Google Search tool.
 * @returns A promise that resolves to the text content of the model's response.
 * @throws An error if the API key is missing or if the API call fails.
 */
export async function runQuery(prompt: string, apiKey: string, useGoogleSearch: boolean): Promise<string> {
    if (!apiKey) {
        throw new Error("API Key is missing. Please provide your Gemini API key in the input field.");
    }

    try {
        // This instantiation method expects an object with the apiKey.
        const ai = new GoogleGenAI({ apiKey });

        const finalPrompt = `Your response must be concise and complete, and strictly less than 1000 characters. Do not leave sentences unfinished.\n\n---\n\n${prompt}`;

        const config = {
            thinkingConfig: { thinkingBudget: 0 },
            temperature: 0.7,
            maxOutputTokens: 250,
            tools: useGoogleSearch ? [{ googleSearch: {} }] : undefined,
        };

        // This is the API call structure for an older version of the library.
        const result = await ai.models.generateContent({
            model: 'gemini-pro', // Using a stable model name
            // The content needs to be passed in the specific `contents` array format.
            contents: [{ parts: [{ text: finalPrompt }] }],
            // Other configuration options are passed at the top level.
            ...config
        });

        // --- THE FIX ---
        // The original error showed that `result.response` did not exist.
        // The correct path in many versions is to check the `candidates` array directly.
        if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts.length > 0) {
            return result.candidates[0].content.parts[0].text;
        } else {
            console.error("Invalid response structure from API:", result);
            throw new Error("The model returned an empty or invalid response.");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        throw new Error(`Failed to get a response from the model. Details: ${errorMessage}`);
    }
}

