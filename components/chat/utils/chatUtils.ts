import { MessageType } from "../types";
import { jsPDF } from "jspdf";

// Format user message with proper styling
export const formatUserMessage = (content: string): string => {
  return `<div class="user-message">${content}</div>`;
};

// Format assistant message with proper styling and markdown support
export const formatAssistantMessage = (content: string): string => {
  // Convert markdown to HTML
  const formattedContent = content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
    .replace(/`(.*?)`/g, "<code>$1</code>") // Code
    .replace(/\n/g, "<br>"); // Line breaks
    

  return `<div class="assistant-message">${formattedContent}</div>`;
};

// Generate citation for research papers
export const generateCitation = (paper: any): string => {
  const authors = paper.authors?.join(", ") || "Unknown authors";
  const year = paper.year || "n.d.";
  const title = paper.title || "Untitled";
  const journal = paper.journal || "Unknown journal";
  
  return `${authors} (${year}). ${title}. ${journal}.`;
};

// Format AI response with citations
export const formatAiResponse = (response: string, citations: any[] = []): string => {
  let formattedResponse = response;
  
  if (citations.length > 0) {
    formattedResponse += "\n\nReferences:\n";
    citations.forEach((citation, index) => {
      formattedResponse += `${index + 1}. ${generateCitation(citation)}\n`;
    });
  }
  
  return formattedResponse;
};

// Check if message contains code
export const containsCode = (message: string): boolean => {
  return message.includes("```") || message.includes("<code>");
};

// Extract code blocks from message
export const extractCodeBlocks = (message: string): string[] => {
  const codeBlocks: string[] = [];
  const regex = /```([\s\S]*?)```/g;
  let match;
  
  while ((match = regex.exec(message)) !== null) {
    codeBlocks.push(match[1]);
  }
  
  return codeBlocks;
};

// Sanitize user input
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

// Handle error messages
export const handleErrorMessage = (messages: MessageType[], error: any): MessageType[] => {
  const updated = [...messages];
  let errorMessage = "I'm sorry, I encountered an error while researching. Please try again.";
  
  if (error instanceof Error) {
    if (error.message.includes("NetworkError") || error.message.includes("Failed to fetch")) {
      errorMessage = "Connection error: Unable to reach the API server. Please make sure the backend is running.";
    } else if (error.message.includes("CORS")) {
      errorMessage = "CORS error: The API server is not accepting requests from this origin.";
    } else if (error.message.includes("429")) {
      errorMessage = "Rate limit reached: The semantic scholar API has temporarily limited requests. Please wait a moment and try again.";
    }
  }
  
  if (
    updated.length > 0 &&
    updated[updated.length - 1].role === "assistant" &&
    updated[updated.length - 1].content === "..."
  ) {
    updated[updated.length - 1].content = errorMessage;
  } else {
    updated.push({
      role: "assistant",
      content: errorMessage
    });
  }
  
  return updated;
};

// Generate citations from messages
export const generateCitations = async (messages: MessageType[]) => {
  try {
    // Extract citations from messages
    const citations = messages
      .filter(msg => msg.role === "assistant")
      .flatMap(msg => {
        const citationMatches = msg.content.match(/\[(\d+)\]/g) || [];
        return citationMatches.map(match => {
          const number = match.replace(/[\[\]]/g, '');
          return `Citation ${number}`;
        });
      });

    if (citations.length === 0) {
      alert("No citations found in the conversation.");
      return;
    }

    // Format citations
    const formattedCitations = citations.join('\n');
    
    // Create and download file
    const blob = new Blob([formattedCitations], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'citations.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating citations:', error);
    alert('Failed to generate citations. Please try again.');
  }
};

// Export session to different formats
export const exportSession = async (messages: MessageType[], format: "pdf" | "md" | "txt") => {
  try {
    // Format messages based on type
    const formattedMessages = messages.map(msg => {
      const prefix = msg.role === 'user' ? 'User: ' : 'Assistant: ';
      return `${prefix}${msg.content}`;
    }).join('\n\n');

    if (format === 'pdf') {
      // Use jsPDF to generate a real PDF
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(formattedMessages, 180);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(lines, 10, 20);
      doc.save('chat-export.pdf');
      return;
    }

    // Markdown or Text
    const blob = new Blob([
      format === 'md' ? formattedMessages.replace(/^(User|Assistant): /gm, '### $1\n') : formattedMessages
    ], {
      type: format === 'md' ? 'text/markdown' : 'text/plain'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting session:', error);
    alert(`Failed to export session as ${format.toUpperCase()}. Please try again.`);
  }
}; 