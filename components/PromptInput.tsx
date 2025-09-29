import React from 'react';

interface PromptInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
  tokenCount?: number;
  maxLength?: number;
}

const PromptInput: React.FC<PromptInputProps> = ({ label, value, onChange, placeholder, rows = 4, tokenCount, maxLength }) => {
  const isLimitReached = maxLength !== undefined && value.length >= maxLength;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-semibold text-gray-900">{label}</label>
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
        className="w-full p-3 bg-white border-2 border-gray-900 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors duration-200 resize-y"
      />
    </div>
  );
};

export default PromptInput;