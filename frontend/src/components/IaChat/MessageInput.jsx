const SendIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
  </svg>
);

export default function MessageInput({ input, setInput, handleSubmit, isLoading }) {
  return (
    <footer className="p-4 bg-white border-t flex-shrink-0">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
          type="text"
          className="flex-1 w-full p-3 text-gray-700 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex: frango, tomate, cebola..."
          disabled={isLoading}
          aria-label="Digite seus ingredientes"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-3 text-white font-bold rounded-full transition-transform transform hover:scale-110 disabled:bg-gray-400 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Gerar Receita"
        >
          <SendIcon />
        </button>
      </form>
    </footer>
  );
}