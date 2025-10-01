import { GoogleGenAI } from "@google/genai";

/**
 * Executes a query against the Google Gemini API.
 * * @param prompt The full text prompt to send to the model.
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
    // Use the correct class name for your library version
    const genAI = new GoogleGenAI(apiKey);

    // Prepend an instruction to the prompt to make the model aware of the size constraint.
    const finalPrompt = `Your response must be concise and complete, and strictly less than 1000 characters. Do not leave sentences unfinished.\n\n---\n\n${prompt}`;
    
    // Get the generative model instance
    const model = genAI.getGenerativeModel({
      model: "gemini-pro", // A stable and capable model
      // Conditionally add the Google Search tool if the user has enabled it.
      tools: useGoogleSearch ? [{ googleSearch: {} }] : undefined,
    });

    // Configuration for the generation request.
    const generationConfig = {
        // A temperature of 0.7 provides a balance between creativity and determinism.
        temperature: 0.7,
        // Limit the output to approximately 1000 characters (1 token ~ 4 chars).
        maxOutputTokens: 250,
    };

    const result = await model.generateContent(
      finalPrompt,
      generationConfig,
    );
    
    // Use the recommended .text() helper method to extract the response.
    const response = result.response;
    const text = response.text();

    return text;

  } catch (error) {
    // Log the full error for debugging purposes.
    console.error("Error calling Gemini API:", error);
    // Re-throw a more user-friendly error.
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    throw new Error(`Failed to get a response from the model. Details: ${errorMessage}`);
  }
}

