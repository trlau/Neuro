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
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-800">
      <div className="flex gap-2 items-end">
        <div className="flex-1 bg-gray-700 rounded overflow-hidden flex items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleTextAreaChange}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Processing..." : "Ask a research question..."}
            disabled={isLoading}
            className="flex-1 p-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none resize-none min-h-[44px] max-h-[150px] w-full"
            rows={1}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`p-3 rounded-full ${
            isLoading || !input.trim() ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition-colors flex items-center justify-center`}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
      {/* Add a helpful message about API status if there are issues */}
      <div className="mt-1 text-xs text-gray-500 text-right">
        {isLoading && "Connecting to research database..."}
      </div>
    </form>
  );
};

export default MessageInput;