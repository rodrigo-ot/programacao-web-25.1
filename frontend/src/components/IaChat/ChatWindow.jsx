import React, { useState, useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatHeader = () => (
  <header className="p-4 border-separate bg-white shadow-sm text-center flex-shrink-0">
    <h1 className="text-2xl font-bold text-gray-800">RF Bot</h1>
    <div className='flex justify-center'><Bot/></div>
    <p className="text-sm text-gray-500">Seu assistente de receitas pessoal </p>
  </header>
);

export default function ChatWindow() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 'init', 
      sender: 'ai', 
      text: 'Olá! Informe os ingredientes que você tem e a nossa IA recomendará uma receita!' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const apiResponse = await fetch('http://127.0.0.1:8001/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage.text }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Ocorreu um erro ao buscar a receita.');
      }

      const data = await apiResponse.json();
      
      const aiMessage = { id: Date.now() + 1, sender: 'ai', text: data.response };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      setError(err.message); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="
      fixed bottom-24 right-8 z-50
      w-full max-w-md bg-white rounded-sm shadow-2xl
      flex flex-col h-[70vh] max-h-[700px]
      transition-all duration-300 ease-in-out border border-indigo-500
    ">
      <ChatHeader />
      <MessageList 
        messages={messages}
        isLoading={isLoading}
        error={error}
        messagesEndRef={messagesEndRef}
      />
      <MessageInput
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}