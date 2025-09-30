/**
 * A static header component for the application.
 * Displays the main title and a descriptive subtitle.
 */
const Header = () => {
  return (
    <header className="text-center p-8 border-b-2 border-black">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-black font-serif">
        Prompt Injection Simulator
      </h1>
      <p className="mt-2 text-lg text-gray-700">
        Observe how malicious input can hijack an LLM's original instructions, even with access to live data.
      </p>
    </header>
  );
};

export default Header;
