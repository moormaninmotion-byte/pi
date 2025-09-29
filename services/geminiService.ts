import { GoogleGenAI } from "@google/genai";

export async function runQuery(prompt: string, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error("API Key is missing. Please provide your Gemini API key in the input field.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // Disable thinking for faster, more direct responses suitable for this demo.
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.7,
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Re-throw the error so the component layer can handle it with specific messaging.
    throw error;
  }
}
