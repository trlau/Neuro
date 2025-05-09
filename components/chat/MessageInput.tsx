import React, { useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  input: string;
  setInput: (input: string) => void;
  sendMessage: () => void;
  isLoading?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  input, 
  setInput, 
  sendMessage, 
  isLoading = false 
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-focus the input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && input.trim()) {
      sendMessage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (but not with Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        sendMessage();
      }
    }
  };

  // Auto-adjust textarea height
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setInput(textarea.value);
    
    // Reset height to auto to correctly calculate the new height
    textarea.style.height = 'auto';
    
    // Set new height (with max-height constraint handled by CSS)
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800 bg-black backdrop-blur-md">
      <div className="flex gap-2 items-end">
        <div className={`flex-1 bg-zinc-800 rounded-lg overflow-hidden flex items-end border border-black shadow-sm transition-all focus-within:ring-2 focus-within:ring-white/40`}> 
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleTextAreaChange}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Processing..." : (input ? "" : "Ask a research question...")}
            disabled={isLoading}
            className={`flex-1 p-3 bg-zinc-800 text-white placeholder-gray-400 focus:outline-none resize-none min-h-[44px] max-h-[150px] w-full text-base transition-all ${input.split('\n').length > 1 ? 'overflow-y-auto' : 'overflow-y-hidden'}`}
            rows={1}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`p-3 rounded-full border border-black shadow-sm flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/40
            ${isLoading || !input.trim() 
              ? 'bg-zinc-800 text-white opacity-50 cursor-not-allowed' 
              : input.trim() 
                ? 'bg-white text-black hover:bg-zinc-200 active:bg-zinc-300' 
                : 'bg-black text-white hover:bg-zinc-900 active:bg-zinc-800'}
          `}
          aria-label="Send"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-400 text-right min-h-[18px]">
        {isLoading && "Connecting to research database..."}
      </div>
    </form>
  );
};

export default MessageInput;