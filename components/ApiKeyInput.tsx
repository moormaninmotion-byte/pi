import React from 'react';

/**
 * An icon component representing a key.
 */
const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
);

/**
 * Props for the ApiKeyInput component.
 */
interface ApiKeyInputProps {
  /** The current value of the API key. */
  apiKey: string;
  /** The callback function to update the API key state. */
  setApiKey: (key: string) => void;
}

/**
 * A dedicated component for securely inputting the Gemini API key.
 * Includes an icon and a disclaimer about local storage.
 */
const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, setApiKey }) => {
  return (
    <section className="mt-4 p-6 border-2 border-black">
      <label htmlFor="api-key" className="block text-xl font-bold text-black mb-2 font-serif">
        Gemini API Key
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <KeyIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
        </div>
        <input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your API key..."
          className="w-full p-2 pl-10 bg-white border-2 border-black text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
          aria-label="Gemini API Key Input"
        />
      </div>
      <p className="text-xs text-gray-600 mt-2">
        Your key is stored in your browser's localStorage and is not sent to any server other than Google's API.
      </p>
    </section>
  );
};

export default ApiKeyInput;
