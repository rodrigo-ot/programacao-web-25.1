import React from 'react';


const renderFormattedResponse = (text) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  return lines.map((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
      return <h3 key={index} className="text-lg font-semibold mt-3 mb-1">{trimmedLine.replaceAll('**', '')}</h3>;
    }
    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      return <li key={index} className="ml-5 list-disc">{trimmedLine.substring(2)}</li>;
    }
    return <p key={index} className="mb-2">{line}</p>;
  });
};

export default function MessageList({ messages, isLoading, error, messagesEndRef }) {
  return (
    <main className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xl p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
            {msg.sender === 'ai' ? (
              <div className="prose prose-sm max-w-none">{renderFormattedResponse(msg.text)}</div>
            ) : (
              <p>{msg.text}</p>
            )}
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="p-3 rounded-2xl bg-gray-100">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="flex justify-center">
          <div className="px-4 py-2 text-center bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </main>
  );
}

