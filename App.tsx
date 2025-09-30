// FIX: Add React import to resolve 'Cannot find namespace React' error, and merge with existing react import.
import React, { useState, useCallback, useEffect } from 'react';
import { runQuery } from './services/geminiService';
import { categorizedExamples, DisplayExample, ExampleDefinition } from './data/examples';
import { REQUEST_COOLDOWN_MS } from './data/constants';
import Header from './components/layout/Header';
import ExampleSelector from './components/sections/ExampleSelector';
import InputsSection from './components/sections/InputsSection';
import ActionToolbar from './components/sections/ActionToolbar';
import OutputsSection from './components/sections/OutputsSection';
import ApiKeyInput from './components/ApiKeyInput';

/**
 * A rough client-side estimation of token count.
 * A common rule of thumb is that one token is approximately 4 characters of text.
 * @param text The text to estimate the token count for.
 * @returns An estimated number of tokens.
 */
const estimateTokens = (text: string): number => {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
};

const App: React.FC = () => {
  // === State Management ===
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('gemini-api-key') || '');
  
  // Input prompts
  const [originalPrompt, setOriginalPrompt] = useState<string>('');
  const [userPrompt, setUserPrompt] = useState<string>('');

  // Simulation outputs
  const [safeOutput, setSafeOutput] = useState<string>('');
  const [poisonedOutput, setPoisonedOutput] = useState<string>('');

  // Application status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Example management
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [displayedExamples, setDisplayedExamples] = useState<DisplayExample[]>([]);

  // Configuration
  const [useGoogleSearch, setUseGoogleSearch] = useState<boolean>(false);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);

  // Token count estimations for UI
  const [tokenCounts, setTokenCounts] = useState({
    originalPrompt: 0,
    poisonedPrompt: 0,
    safeOutput: 0,
    poisonedOutput: 0,
  });

  // === Callbacks and Effects ===

  /**
   * Sets the current category and populates the example list with a random
   * variation from each example definition within that category.
   */
  const handleSelectCategory = useCallback((category: string) => {
    setSelectedCategory(category);
    const examplesForCategory = categorizedExamples[category];
    const initialDisplayedExamples = examplesForCategory.map((ex: ExampleDefinition) => {
        const randomVariation = ex.variations[Math.floor(Math.random() * ex.variations.length)];
        return {
            name: ex.name,
            description: ex.description,
            ...randomVariation
        };
    });
    setDisplayedExamples(initialDisplayedExamples);
  }, []);

  /**
   * On initial component mount, selects a random category to display.
   */
  useEffect(() => {
    const categories = Object.keys(categorizedExamples);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    if (randomCategory) {
      handleSelectCategory(randomCategory);
    }
  }, [handleSelectCategory]);

  /**
   * Persists the API key to localStorage whenever it changes.
   */
  useEffect(() => {
    localStorage.setItem('gemini-api-key', apiKey);
  }, [apiKey]);

  /**
   * Updates token count estimations whenever the input prompts change.
   */
  useEffect(() => {
    const poisonedPromptText = `${originalPrompt}\n\nUser input: '${userPrompt}'`;
    setTokenCounts(prev => ({
        ...prev,
        originalPrompt: estimateTokens(originalPrompt),
        poisonedPrompt: estimateTokens(poisonedPromptText),
    }));
  }, [originalPrompt, userPrompt]);


  /**
   * Loads the selected example's prompts into the input fields.
   */
  const handleLoadExample = (example: DisplayExample) => {
    setOriginalPrompt(example.originalPrompt);
    setUserPrompt(example.userPrompt);
    setError(null);
  };
  
  /**
   * Refreshes a single example card with a new, different variation if one exists.
   * @param exampleName The name of the example to refresh.
   */
  const handleRefreshExample = (exampleName: string) => {
    if (!selectedCategory) return;

    const masterExample = categorizedExamples[selectedCategory]?.find(ex => ex.name === exampleName);
    if (!masterExample || masterExample.variations.length <= 1) return;

    const currentExample = displayedExamples.find(ex => ex.name === exampleName);
    if (!currentExample) return;

    let newVariation;
    do {
      newVariation = masterExample.variations[Math.floor(Math.random() * masterExample.variations.length)];
    } while (
      masterExample.variations.length > 1 &&
      newVariation.originalPrompt === currentExample.originalPrompt &&
      newVariation.userPrompt === currentExample.userPrompt
    );

    const newDisplayedExamples = displayedExamples.map(ex => 
      ex.name === exampleName ? { ...ex, ...newVariation } : ex
    );
    setDisplayedExamples(newDisplayedExamples);
  };

  /**
   * Core simulation logic. Runs two parallel queries to the Gemini API.
   * One with the safe, original prompt, and one with the poisoned prompt.
   * @param currentOriginalPrompt The system prompt.
   * @param currentUserPrompt The user-provided (potentially malicious) prompt.
   * @param searchEnabled A flag to enable Google Search grounding.
   */
  const runSimulation = useCallback(async (currentOriginalPrompt: string, currentUserPrompt: string, searchEnabled: boolean) => {
    if (!apiKey.trim()) {
      setError('Please provide a Gemini API key to run a simulation.');
      return;
    }
    if (!currentOriginalPrompt.trim() || !currentUserPrompt.trim()) {
      setError('Please fill out both the Original and User prompt fields to run a simulation.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSafeOutput('');
    setPoisonedOutput('');
    setTokenCounts(prev => ({ ...prev, safeOutput: 0, poisonedOutput: 0 }));

    const poisonedPrompt = `${currentOriginalPrompt}\n\nUser input: '${currentUserPrompt}'`;
    
    try {
      const [safeResult, poisonedResult] = await Promise.all([
        runQuery(currentOriginalPrompt, apiKey, searchEnabled),
        runQuery(poisonedPrompt, apiKey, searchEnabled)
      ]);
      setSafeOutput(safeResult);
      setPoisonedOutput(poisonedResult);
      setTokenCounts(prev => ({
        ...prev,
        safeOutput: estimateTokens(safeResult),
        poisonedOutput: estimateTokens(poisonedResult),
      }));
    } catch (e) {
      let message = 'An unexpected error occurred. Please check your network connection and try again. More details may be available in the browser console.';
      if (e instanceof Error) {
        const errorMessage = e.message.toLowerCase();
        if (errorMessage.includes('api key not valid') || errorMessage.includes('403 forbidden') || errorMessage.includes('[400')) {
          message = "Invalid API Key. Please double-check that your key is correct and has been enabled for the Gemini API. You can get a new key from Google AI Studio.";
        } else if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
          message = "Rate Limit Exceeded. You've made too many requests to the Gemini API in a short period. Please wait a moment before trying again.";
        } else {
            message = e.message;
        }
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  /**
   * A wrapper function to enforce a client-side rate limit on API requests.
   * @param action The function to execute after the cooldown check passes.
   */
  const handleRequest = (action: () => void) => {
    const now = Date.now();
    if (now - lastRequestTime < REQUEST_COOLDOWN_MS) {
      setError("You're sending requests too quickly. Please wait a moment before trying again.");
      return;
    }
    setLastRequestTime(now);
    action();
  };

  const handleSimulate = () => {
    handleRequest(() => runSimulation(originalPrompt, userPrompt, useGoogleSearch));
  };
  
  const handleFeelingLucky = () => {
    handleRequest(async () => {
      const luckyCategory = categorizedExamples["Data Exfiltration"];
      const luckyExampleDef = luckyCategory.find(ex => ex.name === "Markdown Image Exfiltration");
      if (!luckyExampleDef || !luckyExampleDef.variations[0]) return;
      const luckyVariation = luckyExampleDef.variations[0];
  
      setOriginalPrompt(luckyVariation.originalPrompt);
      setUserPrompt(luckyVariation.userPrompt);
      // Directly call runSimulation to bypass the rate limit for this special case if needed
      await runSimulation(luckyVariation.originalPrompt, luckyVariation.userPrompt, false);
    });
  };

  // === Render Method ===
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white border-2 border-black">
        <Header />
        <main className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
          <ExampleSelector
            categories={Object.keys(categorizedExamples)}
            selectedCategory={selectedCategory}
            displayedExamples={displayedExamples}
            isLoading={isLoading}
            onSelectCategory={handleSelectCategory}
            onLoadExample={handleLoadExample}
            onRefreshExample={handleRefreshExample}
          />
          <div className="flex flex-col gap-8">
            <InputsSection
              originalPrompt={originalPrompt}
              userPrompt={userPrompt}
              onOriginalPromptChange={setOriginalPrompt}
              onUserPromptChange={setUserPrompt}
              originalPromptTokens={tokenCounts.originalPrompt}
            />
            <ActionToolbar
              useGoogleSearch={useGoogleSearch}
              onGoogleSearchChange={setUseGoogleSearch}
              isLoading={isLoading}
              onSimulate={handleSimulate}
              onFeelingLucky={handleFeelingLucky}
            />
            <OutputsSection
              error={error}
              safeOutput={safeOutput}
              poisonedOutput={poisonedOutput}
              isLoading={isLoading}
              tokenCounts={tokenCounts}
            />
          </div>
          <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />
        </main>
      </div>
    </div>
  );
};

export default App;