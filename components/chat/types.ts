export type ChatProps = {
  chatId: string | null;
};

export type ModelType = {
  name: string;
  description: string;
  apiId: string;
};

export type MessageType = {
  role: "user" | "assistant";
  content: string;
  references?: any[]
};

export type ApiStatus = "checking" | "connected" | "error"; 