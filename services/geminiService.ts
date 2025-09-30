import { GoogleGenerativeAI, GenerationConfig, Tool } from "@google/genai";

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
    // Correctly instantiate the main AI client
    const genAI = new GoogleGenerativeAI(apiKey);

    // Prepend an instruction to the prompt to make the model aware of the size constraint.
    // This helps prevent the model's output from being cut off abruptly.
    const finalPrompt = `Your response must be concise and complete, and strictly less than 1000 characters. Do not leave sentences unfinished.\n\n---\n\n${prompt}`;

    // Configuration for the generation request.
    const generationConfig: GenerationConfig = {
      // A temperature of 0.7 provides a balance between creativity and determinism.
      temperature: 0.7,
      // Limit the output to approximately 1000 characters (1 token ~ 4 chars).
      maxOutputTokens: 250,
    };

    // Conditionally add the Google Search tool if the user has enabled it.
    const tools: Tool[] | undefined = useGoogleSearch ? [{ googleSearch: {} }] : undefined;

    // --- FIX 1: Get the model instance first ---
    // Pass the model name and configuration here.
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro', // Using a standard, stable model name
      generationConfig,
      tools,
    });

    // --- FIX 2: Call generateContent on the model and pass only the prompt ---
    const result = await model.generateContent(finalPrompt);

    // --- FIX 3: Use the .text() helper function for clean and simple response extraction ---
    const response = result.response;
    const text = response.text();
    
    return text;

  } catch (error) {
    // Log the full error for debugging purposes.
    console.error("Error calling Gemini API:", error);
    // Re-throw the error so the component layer can catch it and display a user-friendly message.
    // Add more context to the error for better user feedback.
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    throw new Error(`Failed to get a response from the model. Details: ${errorMessage}`);
  }
}
