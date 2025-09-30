// FIX: Add React import to resolve 'Cannot find namespace React' error.
import React from 'react';
import { DiceIcon } from '../icons/DiceIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

/**
 * Props for the ActionToolbar component.
 */
interface ActionToolbarProps {
  useGoogleSearch: boolean;
  onGoogleSearchChange: (checked: boolean) => void;
  isLoading: boolean;
  onSimulate: () => void;
  onFeelingLucky: () => void;
}

/**
 * A toolbar component containing the primary user actions, such as enabling
 * Google Search and running the simulation.
 */
const ActionToolbar: React.FC<ActionToolbarProps> = ({
  useGoogleSearch,
  onGoogleSearchChange,
  isLoading,
  onSimulate,
  onFeelingLucky,
}) => {
  return (
    <section className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-y-2 border-black py-6">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="useGoogleSearch"
          checked={useGoogleSearch}
          onChange={(e) => onGoogleSearchChange(e.target.checked)}
          disabled={isLoading}
          className="h-4 w-4 text-black border-black focus:ring-black"
        />
        <label htmlFor="useGoogleSearch" className="font-semibold text-sm">
          Use Google Search <span className="text-gray-600 font-normal">(for real-time data)</span>
        </label>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
        <button
          onClick={onSimulate}
          disabled={isLoading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white font-bold py-3 px-6 border-2 border-black hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          title="Runs the current prompts through the Gemini API to compare the safe and poisoned outputs."
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Simulating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Simulate Attack
            </>
          )}
        </button>
        <button
          onClick={onFeelingLucky}
          disabled={isLoading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black border-2 border-black font-bold py-3 px-4 hover:bg-black hover:text-white disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          title="Loads a powerful data exfiltration example and runs it immediately."
        >
          <DiceIcon className="w-5 h-5" />
          I'm Feeling Lucky
        </button>
      </div>
    </section>
  );
};

export default ActionToolbar;