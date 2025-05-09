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

// Helper to extract References section from a message
const extractReferencesSection = (content: string): string | null => {
  // Look for 'References' (case-insensitive) and grab all lines after it until next heading or end
  const refMatch = content.match(/References[\s\n]*([\s\S]*)/i);
  if (!refMatch) return null;
  let refs = refMatch[1];
  // Stop at next major heading (e.g., markdown heading, all-caps line, or line ending with colon)
  const stopMatch = refs.match(/(^|\n)(#+\s|[A-Z][A-Z\s]+:|[A-Z][^\n]{0,40}:|^Appendix$|^Supplement$)/m);
  if (stopMatch && stopMatch.index !== undefined) {
    refs = refs.slice(0, stopMatch.index).trim();
  }
  return refs.trim() ? refs.trim() : null;
};

export const generateCitations = async (messages: MessageType[]) => {
  try {
    // Extract all references sections from assistant messages
    const references: string[] = messages
      .filter(msg => msg.role === "assistant")
      .map(msg => extractReferencesSection(msg.content))
      .filter(Boolean) as string[];

    if (references.length === 0) {
      alert("No references found in the conversation.");
      return;
    }

    // Combine all references into one string
    const combined = references.join("\n\n");

    // Export as PDF (best format for citations)
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("References", 10, 20);
    const lines = doc.splitTextToSize(combined, 180);
    doc.text(lines, 10, 30);
    doc.save("citations.pdf");
  } catch (error) {
    console.error('Error generating citations:', error);
    alert('Failed to generate citations. Please try again.');
  }
};

// Add this helper function at the top
const cleanContent = (content: string): string => {
  return content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&lt;/g, '<')   // Replace HTML entities
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();
};

// Export session to different formats
export const exportSession = async (messages: MessageType[], format: "pdf" | "md" | "txt") => {
  try {
    // Format messages based on type, cleaning the content first
    const formattedMessages = messages.map(msg => {
      const prefix = msg.role === 'user' ? 'User: ' : 'Assistant: ';
      const cleanedContent = cleanContent(msg.content);
      return `${prefix}${cleanedContent}`;
    }).join('\n\n');

    if (format === 'pdf') {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const lineHeight = 7;
      let cursorY = margin;

      // Set title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Chat Export", margin, cursorY);
      cursorY += lineHeight * 2;

      // Set content
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      const lines = doc.splitTextToSize(formattedMessages, pageWidth - (margin * 2));
      
      lines.forEach((line: string) => {
        if (cursorY > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          cursorY = margin;
        }
        doc.text(line, margin, cursorY);
        cursorY += lineHeight;
      });

      doc.save('chat-export.pdf');
      return;
    }

    // Markdown or Text
    const content = format === 'md' 
      ? formattedMessages
          .split('\n\n')
          .map(msg => {
            if (msg.startsWith('User: ')) {
              return msg.replace('User: ', '### User\n');
            }
            if (msg.startsWith('Assistant: ')) {
              return msg.replace('Assistant: ', '### Assistant\n');
            }
            return msg;
          })
          .join('\n\n')
      : formattedMessages;

    const blob = new Blob([content], {
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