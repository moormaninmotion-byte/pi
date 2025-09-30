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

    // Configuration for the generation request.
    const config = {
        // Disable thinking for faster, more direct responses suitable for this demo.
        // This can sometimes reduce the quality of complex reasoning but is good for simple tasks.
        thinkingConfig: { thinkingBudget: 0 },
        // A temperature of 0.7 provides a balance between creativity and determinism.
        temperature: 0.7,
        // Limit the output to approximately 1000 characters (1 token ~ 4 chars).
        maxOutputTokens: 250,
        // Conditionally add the Google Search tool if the user has enabled it.
        tools: useGoogleSearch ? [{googleSearch: {}}] : undefined,
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: config
    });
    
    // Directly return the text response from the API.
    return response.text;
  } catch (error) {
    // Log the full error for debugging purposes.
    console.error("Error calling Gemini API:", error);
    // Re-throw the error so the component layer can catch it and display a user-friendly message.
    throw error;
  }
}