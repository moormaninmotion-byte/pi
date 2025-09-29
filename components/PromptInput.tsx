import React from 'react';

interface PromptInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
  tokenCount?: number;
}

const PromptInput: React.FC<PromptInputProps> = ({ label, value, onChange, placeholder, rows = 4, tokenCount }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-900">{label}</label>
        {tokenCount !== undefined && (
          <span className="text-xs text-gray-600">{tokenCount} tokens</span>
        )}
      </div>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full p-3 bg-white border-2 border-gray-900 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors duration-200 resize-y"
      />
    </div>
  );
};

export default PromptInput;