// FIX: Add React import to resolve 'Cannot find namespace React' error.
import React from 'react';
import OutputCard from '../OutputCard';
import { ShieldCheckIcon, ShieldExclamationIcon } from '../icons/ShieldIcons';

/**
 * Props for the OutputsSection component.
 */
interface OutputsSectionProps {
  error: string | null;
  safeOutput: string;
  poisonedOutput: string;
  isLoading: boolean;
  tokenCounts: {
    originalPrompt: number;
    poisonedPrompt: number;
    safeOutput: number;
    poisonedOutput: number;
  };
}

/**
 * A component that groups the "Expected Output" and "Poisoned Output" cards,
 * and also displays any error messages that occur during simulation.
 */
const OutputsSection: React.FC<OutputsSectionProps> = ({
  error,
  safeOutput,
  poisonedOutput,
  isLoading,
  tokenCounts,
}) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-left font-serif border-b-2 border-black pb-2">Outputs</h2>
      {error && (
        <div className="bg-red-600 text-white p-4 border-2 border-red-900 my-4" role="alert">
          <strong className="font-bold font-serif">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8 pt-4">
        <div className="w-full md:w-1/2">
          <OutputCard
            title="Expected Output"
            subtitle="Result from the original prompt only"
            content={safeOutput}
            isLoading={isLoading}
            icon={<ShieldCheckIcon className="w-6 h-6" />}
            inputTokens={tokenCounts.originalPrompt}
            outputTokens={tokenCounts.safeOutput}
          />
        </div>
        <div className="w-full md:w-1/2">
          <OutputCard
            title="Poisoned Output"
            subtitle="Result after user prompt injection"
            content={poisonedOutput}
            isLoading={isLoading}
            icon={<ShieldExclamationIcon className="w-6 h-6" />}
            isPoisoned
            inputTokens={tokenCounts.poisonedPrompt}
            outputTokens={tokenCounts.poisonedOutput}
          />
        </div>
      </div>
    </section>
  );
};

export default OutputsSection;