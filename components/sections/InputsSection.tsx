// FIX: Add React import to resolve 'Cannot find namespace React' error.
import React from 'react';
import PromptInput from '../PromptInput';
import { MAX_ORIGINAL_PROMPT_LENGTH, MAX_USER_PROMPT_LENGTH } from '../../data/constants';

/**
 * Props for the InputsSection component.
 */
interface InputsSectionProps {
  originalPrompt: string;
  userPrompt: string;
  onOriginalPromptChange: (value: string) => void;
  onUserPromptChange: (value: string) => void;
  originalPromptTokens: number;
}

/**
 * A component that groups the "Original Prompt" and "User Prompt" input fields.
 */
const InputsSection: React.FC<InputsSectionProps> = ({
  originalPrompt,
  userPrompt,
  onOriginalPromptChange,
  onUserPromptChange,
  originalPromptTokens,
}) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-left font-serif border-b-2 border-black pb-2">Inputs</h2>
      <div className="flex flex-col md:flex-row gap-8 pt-4">
        <div className="w-full md:w-1/2">
          <PromptInput
            label="Original (System) Prompt"
            value={originalPrompt}
            onChange={(e) => onOriginalPromptChange(e.target.value.slice(0, MAX_ORIGINAL_PROMPT_LENGTH))}
            placeholder="Enter the base prompt here..."
            rows={8}
            tokenCount={originalPromptTokens}
            maxLength={MAX_ORIGINAL_PROMPT_LENGTH}
          />
        </div>
        <div className="w-full md:w-1/2">
          <PromptInput
            label="User (Attacker) Prompt"
            value={userPrompt}
            onChange={(e) => onUserPromptChange(e.target.value.slice(0, MAX_USER_PROMPT_LENGTH))}
            placeholder="Enter the injection prompt here..."
            rows={8}
            maxLength={MAX_USER_PROMPT_LENGTH}
          />
        </div>
      </div>
    </section>
  );
};

export default InputsSection;