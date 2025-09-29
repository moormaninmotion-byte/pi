import React from 'react';

interface OutputCardProps {
  title: string;
  subtitle: string;
  content: string;
  isLoading: boolean;
  icon: React.ReactNode;
  isPoisoned?: boolean;
  inputTokens?: number;
  outputTokens?: number;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse">
    <div className="h-4 bg-gray-200 w-3/4"></div>
    <div className="h-4 bg-gray-200 w-full"></div>
    <div className="h-4 bg-gray-200 w-5/6"></div>
  </div>
);

const OutputCard: React.FC<OutputCardProps> = ({ title, subtitle, content, isLoading, icon, isPoisoned = false, inputTokens, outputTokens }) => {
  return (
    <div className={`flex flex-col p-5 bg-white border-2 border-gray-900 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className={`text-xl font-bold text-gray-900`}>{title}</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-600">
            <span>{subtitle}</span>
            {(inputTokens !== undefined && outputTokens !== undefined && !isLoading && content) && (
                <span className="bg-white px-2 py-1 border border-gray-900">
                    IN: {inputTokens} | OUT: {outputTokens}
                </span>
            )}
        </div>
      </div>
      <div className="prose prose-sm max-w-none text-gray-900 min-h-[6rem] whitespace-pre-wrap">
        {isLoading ? <LoadingSkeleton /> : (content || <span className="text-gray-500">Output will appear here...</span>)}
      </div>
    </div>
  );
};

export default OutputCard;