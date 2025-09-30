// FIX: Add React import to resolve 'Cannot find namespace React' error.
import React from 'react';
import { DisplayExample } from '../../data/examples';
import { RefreshIcon } from '../icons/RefreshIcon';

/**
 * Props for the ExampleSelector component.
 */
interface ExampleSelectorProps {
  /** An array of category names. */
  categories: string[];
  /** The currently selected category name. */
  selectedCategory: string;
  /** An array of example objects to display for the selected category. */
  displayedExamples: DisplayExample[];
  /** A flag indicating if the app is in a loading state. */
  isLoading: boolean;
  /** Callback function to handle category selection. */
  onSelectCategory: (category: string) => void;
  /** Callback function to load a selected example's prompts. */
  onLoadExample: (example: DisplayExample) => void;
  /** Callback function to refresh an example with a new variation. */
  onRefreshExample: (exampleName: string) => void;
}

/**
 * A component responsible for rendering the category filters and the grid of
 * example scenarios that users can load.
 */
const ExampleSelector: React.FC<ExampleSelectorProps> = ({
  categories,
  selectedCategory,
  displayedExamples,
  isLoading,
  onSelectCategory,
  onLoadExample,
  onRefreshExample,
}) => {
  return (
    <section className="border-2 border-black p-6">
      <h2 className="text-2xl font-bold mb-4 text-center font-serif">Example Scenarios</h2>
      <div className="flex flex-wrap justify-center gap-2 mb-4 border-b-2 border-black pb-4">
        {categories.map(category => (
            <button 
              key={category} 
              onClick={() => onSelectCategory(category)}
              disabled={isLoading}
              className={`text-xs font-bold py-1 px-3 border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50
                ${selectedCategory === category 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-black hover:bg-gray-200'
                }`}
            >
              {category}
            </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {displayedExamples.map((ex) => (
          <div key={ex.name} className="relative group">
            <button
              onClick={() => onLoadExample(ex)}
              title={ex.description}
              disabled={isLoading}
              className="w-full h-full text-left p-2 border border-black hover:bg-black hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <p className="font-bold text-sm font-serif">{ex.name}</p>
              <p className="text-xs text-gray-600 group-hover:text-gray-300 line-clamp-2">{ex.description}</p>
            </button>
            <button
              onClick={() => onRefreshExample(ex.name)}
              disabled={isLoading}
              className="absolute top-1 right-1 p-0.5 bg-white border border-black text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-200 focus:opacity-100 focus:ring-1 focus:ring-black disabled:hidden"
              aria-label={`Refresh ${ex.name} example`}
              title="Load a different variation of this example"
            >
              <RefreshIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExampleSelector;