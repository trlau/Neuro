import { ModelType } from "../types";


// Source API - Gets search keywords
export const getSearchKeywords = async (model: string, content: string) => {
  const response = await fetch("http://localhost:5000/api/source", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      role: "user",
      model,
      content
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get search keywords: ${response.status}`);
  }
  return response.text();
};

// Paper Search API
export const searchPapers = async (keywords: string) => {
  const encodedQuery = encodeURIComponent(keywords.trim());
  const response = await fetch(`http://localhost:5000/api/paper/search?query=${encodedQuery}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Accept": "application/json"
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to search papers: ${response.status}`);
  }

  return response.json();
};

// Generate API - Streams AI response
export const generateResponse = async (model: string, enhancedInput: string) => {
  const response = await fetch("http://localhost:5000/api/generate", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Accept": "text/event-stream",
    },
    body: JSON.stringify({
      role: "user",
      model,
      content: enhancedInput
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate response: ${response.status} - ${errorText}`);
  }

  if (!response.body) {
    throw new Error("Readable stream not supported!");
  }

  return response.body;
};

// Format paper data into enhanced input
export const formatPaperData = (userMessage: string, paperData: any[]) => {
  let enhancedInput = userMessage + "\n\n";
  
  if (paperData && paperData.length > 0) {
    enhancedInput += "Here are some relevant research papers that might help answer the question:\n\n";
    
    // Add up to 3 papers to the prompt
    const paperLimit = Math.min(paperData.length, 3);
    for (let i = 0; i < paperLimit; i++) {
      const paper = paperData[i];
      enhancedInput += `Paper ${i+1}: \'${paper.title || 'Untitled'}\'\n`;
      if (paper.abstract) {
        enhancedInput += `Abstract: ${paper.abstract.substring(0, 200)}...\n`;
      }
      if (paper.url || paper.openAccessPDF?.url) {
        enhancedInput += `URL: ${paper.url || paper.openAccessPDF.url}\n`;
      }
      enhancedInput += "\n";
    }
  }

  return enhancedInput;
}; 