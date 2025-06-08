import { useState } from 'react';
import { Bot } from 'lucide-react';
import ChatWindow from './ChatWindow';


export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-16 right-4 md:bottom-8 md:right-8 z-50">
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-indigo-500 rounded-full animate-pulse opacity-75"></div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-10 bg-indigo-700 text-white p-3 rounded-full shadow-lg hover:bg-indigo-800 transition"
            aria-label={isOpen ? "Fechar chat" : "Abrir chat"}
          >
            <Bot size={24} />
          </button>
        </div>
      </div>

      {isOpen && (
        <ChatWindow />
      )}
    </>
  );
}