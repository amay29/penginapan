"use client";

import { useChat } from 'ai/react';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

export default function AiConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Halo! Saya asisten virtual Damar Retreats. Ada yang bisa saya bantu terkait informasi kabin, tenda, atau fasilitas kami?',
      }
    ]
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-obsidian-900 text-parchment-50 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-obsidian-800 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open AI Concierge"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden border border-parchment-300 bg-parchment-50 shadow-2xl transition-all duration-300 sm:bottom-8 sm:right-8 ${isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-10 opacity-0'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-obsidian-900 px-5 py-4 text-parchment-50">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold-400" />
            <div>
              <h3 className="font-serif text-lg tracking-wide">Damar AI</h3>
              <p className="text-[9px] uppercase tracking-widest text-obsidian-400">Virtual Concierge</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-obsidian-400 hover:text-parchment-50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] rounded-sm px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-obsidian-900 text-parchment-50' 
                    : 'bg-white border border-parchment-200 text-obsidian-900 shadow-sm'
                }`}
              >
                {/* Basic rendering of text. AI SDK streams plain text which is mostly markdown free here, 
                    or we could use react-markdown if we want full markdown support. Plain text is fine for a simple concierge. */}
                <span className="whitespace-pre-wrap">{m.content}</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-parchment-200 rounded-sm px-4 py-3 shadow-sm flex items-center gap-2">
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-obsidian-400 [animation-delay:-0.3s]"></div>
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-obsidian-400 [animation-delay:-0.15s]"></div>
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-obsidian-400"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="border-t border-parchment-300 bg-white p-4">
          <div className="relative flex items-center">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Tanyakan sesuatu..."
              className="w-full bg-parchment-50 border border-parchment-200 py-3 pl-4 pr-12 text-sm text-obsidian-900 placeholder:text-obsidian-400 focus:border-obsidian-400 focus:outline-none transition-colors"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="absolute right-2 flex h-8 w-8 items-center justify-center rounded bg-obsidian-900 text-parchment-50 disabled:opacity-50 transition-opacity"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[8px] uppercase tracking-widest text-obsidian-400">
            Powered by Google Gemini
          </p>
        </form>
      </div>
    </>
  );
}
