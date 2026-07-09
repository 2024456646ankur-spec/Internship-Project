import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { sendMessage, createConversation } from "../api/chat";
import { useAuth } from "../Auth/AuthContext";

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={`text-xs px-3 py-1 rounded-md border-none cursor-pointer transition-all duration-200 ${
        copied ? "bg-green-500 text-white" : "bg-gray-600 text-gray-200 hover:bg-gray-500"
      }`}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

export default function Chat() {
  const { token, loading: authLoading } = useAuth();  // ← renamed to avoid clash
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [sending, setSending] = useState(false);       // ← renamed to avoid clash
  const [conversationId, setConversationId] = useState(null);

  // ✅ Only create conversation once auth is ready and token exists
  useEffect(() => {
    if (!authLoading && token) {
      createNewConversation();
    }
  }, [authLoading, token]);

  async function createNewConversation() {
    try {
      const conversation = await createConversation("New Chat", token);
      setConversationId(conversation.id);
    } catch (error) {
      console.error("Failed to create conversation:", error.message);
    }
  }

  async function handleSend() {
    if (!prompt.trim()) return;
    console.log("TOKEN:", token);  
    console.log("CONV ID:", conversationId);
    setSending(true);
    try {
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        const conversation = await createConversation(prompt.slice(0, 40), token);
        currentConversationId = conversation.id;
        setConversationId(currentConversationId);
      }
      const result = await sendMessage(currentConversationId, prompt, token);
      setResponse(result);
    } catch (error) {
      console.error(error);
      setResponse("Something went wrong.");
    }
    setSending(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold">Gemini Clone</h1>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Gemini anything..."
          className="w-full border rounded-lg p-4 h-40"
        />

        <button
          onClick={handleSend}
          disabled={sending}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          {sending ? "Thinking..." : "Send"}
        </button>

        {response && (
          <div className="border rounded-lg p-6 max-w-none text-sm leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");
                  return !inline && match ? (
                    <div className="rounded-xl overflow-hidden my-4 border border-gray-700">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-400 text-xs">
                        <span className="font-mono">{match[1]}</span>
                        <CopyButton code={codeString} />
                      </div>
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, borderRadius: 0, fontSize: 13, padding: "16px" }}
                        {...props}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-gray-100 text-red-500 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
                h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-3 pb-2 border-b border-gray-200">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>,
                p:  ({ children }) => <p className="mb-3 leading-8">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="leading-7 pl-1">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-500 my-4 bg-blue-50 py-2 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4 rounded-lg border border-gray-200">
                    <table className="min-w-full text-sm">{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                th: ({ children }) => <th className="border-b border-gray-200 px-4 py-3 font-semibold text-left text-gray-700">{children}</th>,
                td: ({ children }) => <td className="border-b border-gray-100 px-4 py-3 text-gray-600">{children}</td>,
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noreferrer" className="text-blue-500 underline underline-offset-2 hover:text-blue-700">
                    {children}
                  </a>
                ),
                hr: () => <hr className="my-4 border-gray-200" />,
              }}
            >
              {response}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}