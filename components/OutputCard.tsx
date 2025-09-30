import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Props for the OutputCard component.
 */
interface OutputCardProps {
  /** The main title of the card (e.g., "Expected Output"). */
  title: string;
  /** A subtitle providing context for the output. */
  subtitle: string;
  /** The main content string to be displayed, supports Markdown. */
  content: string;
  /** A boolean flag to indicate if the content is currently being loaded. */
  isLoading: boolean;
  /** An icon element to display next to the title. */
  icon: React.ReactNode;
  /** A flag to apply "poisoned" styling (e.g., red theme). */
  isPoisoned?: boolean;
  /** The estimated number of tokens in the input prompt. */
  inputTokens?: number;
  /** The estimated number of tokens in the generated output. */
  outputTokens?: number;
}

/**
 * A skeleton loader component with a shimmering effect to display while content is loading.
 */
const LoadingSkeleton: React.FC = () => {
  // Base classes for the skeleton bars. The background is a large gradient that will be moved by the 'shimmer' animation.
  const shimmerClass = 'bg-gray-300 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-shimmer';

  return (
    <div className="space-y-3">
      <div className={`h-4 rounded w-3/4 ${shimmerClass}`}></div>
      <div className={`h-4 rounded w-full ${shimmerClass}`}></div>
      <div className={`h-4 rounded w-5/6 ${shimmerClass}`}></div>
    </div>
  );
};

/**
 * A card component that displays the output from a Gemini API call.
 * It handles loading states, renders Markdown, and has distinct visual styles
 * for "safe" and "poisoned" outputs.
 */
const OutputCard: React.FC<OutputCardProps> = ({ title, subtitle, content, isLoading, icon, isPoisoned = false, inputTokens, outputTokens }) => {
  const cardClasses = isPoisoned 
    ? 'bg-red-50 border-red-500' 
    : 'bg-green-50 border-green-500';
  
  const iconAndTitleClasses = isPoisoned ? 'text-red-900' : 'text-green-900';

  return (
    <div className={`flex flex-col p-5 border-2 transition-all duration-300 h-full ${cardClasses}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
        <div className={`flex items-center gap-3 ${iconAndTitleClasses}`}>
          {icon}
          <h3 className="text-xl font-bold font-serif">{title}</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-600 justify-end">
            <span className="text-right whitespace-nowrap">{subtitle}</span>
            {(inputTokens !== undefined && outputTokens !== undefined && !isLoading && content) && (
                <span className="bg-white px-2 py-1 border border-black whitespace-nowrap">
                    IN: {inputTokens} | OUT: {outputTokens}
                </span>
            )}
        </div>
      </div>
      <div className="text-sm max-w-none text-black min-h-[10rem] font-sans flex-grow break-words">
        {isLoading ? <LoadingSkeleton /> : (
            content ? 
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              // Custom components to style the rendered markdown for better readability.
              components={{
                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 my-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1 my-2" {...props} />,
                li: ({node, ...props}) => <li className="pl-2" {...props} />,
                a: ({node, ...props}) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                // FIX: Add explicit type for 'code' component props to resolve TypeScript error on 'inline' property.
                code({node, inline, className, children, ...props}: React.ComponentPropsWithoutRef<'code'> & {inline?: boolean, node?: any}) {
                  return !inline ? (
                    <pre className="bg-gray-800 text-white p-3 rounded-md my-2 overflow-x-auto text-xs">
                      <code {...props}>{children}</code>
                    </pre>
                  ) : (
                    <code className="bg-gray-200 text-red-700 font-mono px-1 py-0.5 rounded-md" {...props}>
                      {children}
                    </code>
                  );
                },
                table: ({node, ...props}) => <table className="table-auto w-full my-2 border-collapse border border-gray-400" {...props} />,
                thead: ({node, ...props}) => <thead className="bg-gray-200" {...props} />,
                th: ({node, ...props}) => <th className="border border-gray-300 px-2 py-1 text-left" {...props} />,
                td: ({node, ...props}) => <td className="border border-gray-300 px-2 py-1" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown> 
            : <span className="text-gray-500">Output will appear here...</span>
        )}
      </div>
    </div>
  );
};

export default OutputCard;