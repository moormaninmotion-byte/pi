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
    const ai = new GoogleGenAI({ apiKey });

    const finalPrompt = `Your response must be concise and complete, and strictly less than 1000 characters. Do not leave sentences unfinished.\n\n---\n\n${prompt}`;

    const config = {
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.7,
        maxOutputTokens: 250,
        tools: useGoogleSearch ? [{googleSearch: {}}] : undefined,
    };
    
const result = await ai.models.generateContent({
      model: 'gemini-1.0-pro',
      contents: [{ parts: [{ text: finalPrompt }] }], 
      ...config
    });
    
    // --- THE FIX for TypeScript Strictness ---
    // Use optional chaining (?.) to safely navigate the potentially undefined properties of the response object.
    // This prevents the "Object is possibly 'undefined'" errors at build time.
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Now, explicitly check if the extracted text is a valid string.
    // This ensures the function's return type matches `Promise<string>` and resolves the final error.
    if (typeof text === 'string') {
      return text;
    } else {
      // If text is undefined or not a string, we can confidently say the response is invalid.
      console.error("Invalid or empty response structure from API:", result);
      throw new Error("The model returned an empty or invalid response.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    throw new Error(`Failed to get a response from the model. Details: ${errorMessage}`);
  }
}


