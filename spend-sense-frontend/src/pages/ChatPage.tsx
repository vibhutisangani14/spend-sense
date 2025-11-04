import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Bot } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import axios from "axios";

interface ChatMessage {
  type: "user" | "ai";
  text: string;
}

interface ChatResponse {
  response: string;
  error?: string;
}

const suggestedQuestions: string[] = [
  "What's my biggest expense category?",
  "How much did I spend this month?",
  "Give me tips to save money",
  "Analyze my spending patterns",
  "What's my average daily spending?",
];

export default function ChatWithAI() {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleAsk = async (question: string) => {
    if (!question.trim()) return;

    if (showSuggestions) setShowSuggestions(false);

    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post<ChatResponse>(
        `${import.meta.env.VITE_API_URL}/chat`,
        { question },
        { withCredentials: true }
      );

      if (data.error) throw new Error(data.error);

      setMessages((prev) => [...prev, { type: "ai", text: data.response }]);
    } catch (err: any) {
      console.error("Axios error:", err.response?.data ?? err.message);
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="min-h-screen bg-white py-8 px-4 flex flex-col mx-12 justify-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-br from-primary to-purple-500 bg-clip-text text-transparent">
              AI Financial Assistant
            </h1>
            <p className="text-gray-500 text-sm">
              Ask me anything about your expenses
            </p>
          </div>
        </div>
      </motion.div>

      {/* Chat container */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
        {/* Scrollable messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-white space-y-4">
          {/* AI greeting */}
          <div className="flex justify-start items-start gap-2 mt-2">
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-purple-500">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 rounded-2xl max-w-[80%] text-sm break-words bg-white text-gray-800 border border-gray-200"
            >
              👋 Hi! I'm your AI financial assistant. I can help you understand
              your spending habits, provide savings tips, and answer questions
              about your expenses. What would you like to know?
            </motion.div>
          </div>

          {/* Suggested questions */}
          {showSuggestions && (
            <div>
              <p className="text-sm text-gray-500 font-medium py-2 mb-1">
                Try asking:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleAsk(q)}
                    className="border border-gray-200 hover:bg-blue-100 text-sm font-semibold bg-[#f9f9fa] text-black px-3 py-2 rounded-md transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.type === "ai" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-purple-500">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`px-4 py-2 max-w-[80%] text-sm break-words bg-white border border-gray-200 ${
                  msg.type === "user"
                    ? "text-white bg-gradient-to-br from-primary to-purple-500 py-3 rounded-2xl"
                    : "text-gray-800 rounded-2xl"
                }`}
              >
                {msg.type === "ai" ? (
                  <div className="text-sm text-gray-800 font-normal leading-snug [&_strong]:font-semibold [&_p]:mb-1 [&_ul]:mb-1 [&_li]:mb-0 [&_li]:ml-4 [&_ol]:mb-1">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                )}
              </motion.div>

              {msg.type === "user" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-purple-500">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* AI typing bubble */}
          {loading && (
            <div className="flex justify-start items-center gap-2">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-purple-500">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="bg-white text-gray-800 border border-gray-200 px-4 py-4 rounded-2xl max-w-[50%] flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
              </motion.div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Fixed input area */}
        <div className="border-t border-gray-200 bg-white p-4 flex gap-2">
          <div className="flex items-center bg-[#f9f9fa] gap-2 border border-gray-200 rounded-md px-3 py-2 w-full">
            <input
              type="text"
              placeholder="Ask about your expenses..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 outline-none text-sm text-gray-950 bg-transparent"
              onKeyDown={(e) => e.key === "Enter" && handleAsk(input)}
            />
          </div>
          <button
            onClick={() => handleAsk(input)}
            disabled={!input || loading}
            className={`px-4 rounded-md text-white transition ${
              loading
                ? "bg-gray-400"
                : "bg-gradient-to-br from-primary to-purple-500 hover:from-purple-800 hover:to-primary shadow-md shadow-purple-500/30"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
