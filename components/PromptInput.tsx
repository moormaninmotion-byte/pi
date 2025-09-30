import React from 'react';

/**
 * Props for the PromptInput component.
 */
interface PromptInputProps {
  /** The label displayed above the textarea. */
  label: string;
  /** The current value of the textarea. */
  value: string;
  /** The callback function to execute when the textarea value changes. */
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** The placeholder text for the textarea. */
  placeholder: string;
  /** The number of visible text lines for the textarea. */
  rows?: number;
  /** The estimated number of tokens for the current value. */
  tokenCount?: number;
  /** The maximum number of characters allowed in the textarea. */
  maxLength?: number;
}

/**
 * A reusable textarea component for entering prompts, with character and token count display.
 * Includes client-side validation for maxLength.
 */
const PromptInput: React.FC<PromptInputProps> = ({ label, value, onChange, placeholder, rows = 4, tokenCount, maxLength }) => {
  const isLimitReached = maxLength !== undefined && value.length >= maxLength;

  // Dynamically set border and focus ring colors based on whether the character limit is reached.
  const textareaClasses = `
    w-full p-3 bg-white border-2 text-black 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    transition-colors duration-200 resize-y
    ${isLimitReached ? 'border-red-600 focus:ring-red-500' : 'border-black focus:ring-black'}
  `;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <label className="text-lg font-bold text-black font-serif">{label}</label>
        <div className="flex items-center gap-3 text-xs">
          {maxLength !== undefined && (
            <span className={isLimitReached ? 'text-red-600 font-semibold' : 'text-gray-600'}>
              {value.length}/{maxLength}
            </span>
          )}
          {tokenCount !== undefined && (
            <span className="text-gray-600">{tokenCount} tokens</span>
          )}
        </div>
      </div>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={textareaClasses.trim()}
        aria-invalid={isLimitReached}
      />
    </div>
  );
};

export default PromptInput;