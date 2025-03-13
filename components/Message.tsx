import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Message = ({ role, content }: { role: string; content: string }) => {
  const isUser = role === "user";
  const messageClass = isUser ? "text-right" : "text-left";
  const contentClass = isUser ? "text-blue-500" : "text-gray-300";

  return (
    <div className={`my-2 ${messageClass}`}>
      <div className={`inline-block ${contentClass}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Message;
