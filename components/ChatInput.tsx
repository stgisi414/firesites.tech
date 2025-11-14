import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onNewChat: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, onNewChat }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about FIRE..."
        rows={1}
        className="w-full resize-none rounded-lg bg-secondary-dark text-yellow-100 placeholder:text-subtle-dark border-0 focus:ring-2 focus:ring-accent-orange pr-28 p-4"
        disabled={isLoading}
      />
      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        <button
          type="button"
          onClick={onNewChat}
          aria-label="New Chat"
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-ai-bubble-dark transition-colors"
        >
          <span className="material-symbols-outlined text-text-light">add</span>
        </button>
        <button
          type="submit"
          aria-label="Send Message"
          disabled={isLoading || !text.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-accent-orange to-accent-yellow hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-black">send</span>
        </button>
      </div>
    </form>
  );
};